# Choosing the Best Garbage Collector: G1GC vs ZGC

## Garbage Collector

Garbage Collector는 애플리케이션의 메모리 관리를 자동으로 관리한다. 여기서 일어나는 일은 애플리케이션의 힙 사용량을 분석하여 모든 활성 개체와 모든 죽은 개체를 찾는 것이다. 삭제 후보가 발견되면 실제 삭제가 수행되고 힙이 압축된다. 일반적으로 스캔은 여러 세대에 걸쳐 수행됩니다. 크게 2세대로 **Young**과 **Old**가 있다.

![img](https://miro.medium.com/v2/resize:fit:1400/1*6A91gmDjDfbo42elVyCtAQ.png)

**Young Generation**은 모든 새로운 객체가 탄생하는 공간이다. Young Generation의 공간이 가득 차면 **Minor GC** 가 호출된다. 마이너 GC에서는 Young Generation의 모든 죽은 객체가 수집되고 지정된 수의 마이너 GC 실행 후 일부 객체(라이브 객체의 각 마이너 GC 기간이 1씩 증가함)는 결국 Old Generation으로 이동 된다.

천천히 그리고 점차적으로 이전 세대 공간이 가득 차고 그 순간 **Full GC** 가 호출됩니다. Full GC는 살아 있는 객체와 죽은 객체를 많이 처리해야 하기 때문에 속도가 느립니다.

Minor 또는 Full GC가 실행 중이면 애플리케이션 스레드가 일시 중지된다. 이러한 애플리케이션 스레드 일시 중단을 GC 일시 중지(Stop The World)라고 합니다. 따라서 매우 빠른 속도가 필요한 애플리케이션에서는 GC 일시 중지 시간을 최소화하는 것이 좋습니다. 긴 GC 일시 중지를 허용할 수 있는 애플리케이션을 구축하는 경우 처리량을 위해 GC를 최적화하는 데 더 관심이 있을 수 있습니다.

**"Stop The World Event"**라고도 하는 GC 일시 중지는 GC에서 안전 지점 역할을 하므로 중요하다. 단순히 말하면, **스택**은 실행 중인 현재 메서드에 관한 정보를 가지고 있으며 **힙**에 있는 라이브 개체에 대한 참조도 가지고 있다. 따라서 *마킹이* 시작되면 일관된 상태를 확인해야 하므로 GC 일시 중지가 필요하다. **GC 일시 중지를 줄이기 위해** 다양한 GC 구현이 개발되었다.

## Serial GC

Serial Collector는 단일 스레드를 사용하여 모든 가비지 콜렉션 작업을 수행하는데, 이는 스레드 간 통신 오버헤드가 없기 때문에 상대적으로 효율적이다. Serial GC는 일시 중지 시간(pause time) 요구 사항이 낮지 않고 **클라이언트 스타일 시스템**에서 실행되는 대부분의 애플리케이션에 선택되는 GC이다.

작은 데이터 세트(최대 약 100MB)가 있는 응용 프로그램의 경우 다중 프로세서에 유용할 수 있지만 다중 프로세서 하드웨어를 활용할 수 없기 때문에 **단일 프로세서 시스템**에 가장 적합하다.

Serial GC의 또 다른 널리 사용되는 용도는 동일한 시스템에서 많은 수의 JVM이 실행되는 환경이다. 이러한 환경에서는 JVM이 가비지 수집을 수행할 때 가비지 콜렉션이 더 오래 지속되더라도 하나의 프로세서만 사용하여 나머지 JVM에 대한 간섭을 최소화하는 것이 좋다. 그리고 Serial GC는 이러한 절충안을 잘 충족시킨다.

Serial GC는 Java SE 5 및 6의 클라이언트 스타일 시스템에 대한 기본값이거나 **-XX:+UseSerialGC** 옵션을 사용하여 명시적으로 활성화할 수 있다 .

## Parallel GC

Parallel GC는 *throughput collector* 라고도 하며 Serial GC와 비슷한 세대의 콜렉터이다. Serial GC와 Parallel GC의 주요 차이점은 Parallel GC에는 가비지 수집 속도를 높이는 데 사용되는 **여러 스레드**가 있다는 것입니다.

Parallel GC는 멀티 프로세서 또는 멀티 스레드 하드웨어에서 실행되는 중대형 데이터 세트가 있는 애플리케이션을 위한 것이다. **- XX:+UseParallelGC** 옵션을 사용하여 활성화할 수 있다 . 이 GC는 많은 작업을 수행해야 하고 긴 일시 중지가 허용될 때 사용해야 한다. 예를 들어, 보고서나 청구서 인쇄 또는 대량의 데이터베이스 쿼리 수행과 같은 **배치 처리**가 있다.

병렬 압축은 병렬 수집기가 주요 수집을 병렬로 수행할 수 있도록 하는 기능입니다. 병렬 압축이 없으면 주요 수집이 단일 스레드를 사용하여 수행되므로 확장성이 크게 제한될 수 있습니다. **-XX:+UseParallelGC** 옵션이 지정된 경우 병렬 압축이 기본적으로 활성화됩니다. **-XX:-UseParallelOldGC** 옵션을 사용하여 비활성화할 수 있습니다 .

## CMS GC (deprecated in JDK 14)

CMS(Concurrent Mark Sweep) GC (the concurrent low pause collector)는 종신 세대를 수집한다. 대부분의 가비지 수집 작업을 애플리케이션 스레드와 동시에 수행하여 가비지 수집으로 인한 **일시 중지를 최소화하려고 시도**합니다. 일반적으로 동시 짧은 일시 중지 수집기는 활성 개체를 복사하거나 압축하지 않습니다. GC는 실제 객체를 이동하지 않고 수행됩니다. 조각화가 문제가 되면 더 큰 힙을 할당해야한다.

다시 말해, 이러한 유형의 GC를 사용하는 애플리케이션은 평균적으로 느리게 응답하지만 가비지 콜렉션을 수행하기 위해 응답을 멈추지 않는다.

**CMS는 Java 9에서 더 이상 사용되지 않으며 Java 14에서 제거되었다.**

## G1GC (Garbage First)

Java 9에서는 G1이 기본 GC가 되었으며 Java 7부터 사용할 수 있게 되었다.

G1은 대부분 **동시 수집기(Concurrent Collector)**이다. 대부분의 동시 수집기는 애플리케이션과 동시에 비용이 많이 드는 작업을 수행한다. 이 수집기는 소형 시스템에서 대량의 메모리를 갖춘 대형 멀티프로세서 시스템으로 확장하도록 설계되었습니다. 높은 처리량을 달성하면서 높은 확률로 일시정지 시간 목표를 충족할 수 있는 기능을 제공합니다.

G1은 대부분의 하드웨어 및 운영 체제 구성에서 기본적으로 선택되거나 **-XX:+UseG1GC**를 사용하여 명시적으로 활성화할 수 있다.

다른 수집기와 달리 G1GC는 힙을 **동일한 크기의 힙 영역 집합**으로 분할하며 각 힙 영역은 연속적인 가상 메모리 범위를 갖다. GC를 수행할 때 G1은 힙 전체에서 개체의 활성 상태를 확인하기 위해 동시 전역 표시 단계(즉, *표시라고 알려진 1단계) 를 표시합니다.*

표시 단계가 완료된 후 *G1은* 어떤 영역이 대부분 비어 있는지 알게 됩니다. 먼저 이러한 영역에 수집하여 일반적으로 상당한 양의 여유 공간을 생성한다(즉, 스위핑(Sweeping)이라고 알려진 2단계). 이것이 Garbage-First라고 부르는 이유이다.

*Java 8u20에는* 동일한 문자열의 인스턴스를 너무 많이 생성하여 불필요한 메모리 사용을 줄이기 위해 *JVM* 매개 변수가 하나 더 도입되었습니다. 이는 전역 단일 *char[] 배열에 대한 중복* *문자열* 값을 제거하여 힙 메모리를 최적화한다.

***-XX:+UseStringDeduplication\*** *JVM* 매개변수 로 추가하여 이 매개변수를 활성화할 수 있다 .

- https://backstage.forgerock.com/knowledge/kb/article/a75965340

## ZGC

ZGC는 매우 큰(멀티 테라바이트) 힙에서 잘 작동하는 지연 시간이 짧은 GC이다. 이는 Java 11에서 Oracle에 의해 개발되었습니다. G1과 마찬가지로 ZGC는 애플리케이션과 동시에 작동합니다. ZGC는 동시 단일 세대 지역 기반 NUMA 인식 압축 기능을 제공합니다. 10ms 이상 애플리케이션 스레드의 실행을 중지하지 않습니다.

이 수집기는 **매우 짧은 일시 중지 시간**이 필요한 **대용량 메모리**가 있는 애플리케이션에 적합하다. ZGC에서는 실험적 기능을 옵션으로 사용 가능하며 **-XX:+UnlockExperimentalVMOptions -XX:+UseZGC** 옵션을 통해 활성화된다 . ZGC는 8MB에서 16TB까지의 힙 크기를 지원한다.

수집기의 동작은 할당 속도 차이와 라이브 데이터 세트의 양에 따라 달라지기 때문에 **ZGC를 사용할 때 최대 힙 크기를 설정하는 것이 매우 중요하다.** ZGC는 힙이 클수록 더 잘 작동하지만 불필요한 메모리를 낭비하는 것도 비효율적이므로 메모리 사용량과 가비지 수집에 사용할 수 있는 리소스 간의 균형을 조정해야 한다.

- https://d2.naver.com/helloworld/0128759
- https://www.blog-dreamus.com/post/zgc%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C

## Choosing the best GC

그렇다면 실제로 어떤 GC를 사용하는 것이 가장 유리할까? 이는 환경 구성에 따라서 애플리케이션의 사용목적에 따라서 다를 수 있다. 

1. 애플리케이션에 작은 데이터 세트(최대 약 100MB)가 있거나 애플리케이션이 단일 프로세서에서 실행되고 일시 중지 시간 요구 사항이 없는 경우 - **XX:+UseSerialGC** 옵션을 사용하여 Serial GC를 선택한다.
2. 최대 애플리케이션 **성능이 최우선 순위**이고, 일시 중지 시간 요구 사항이 없거나 1초 이상의 일시 중지가 허용되는 경우라면, **-XX:+UseParallelGC**옵션으로 Parallel GC를 선택하도록 한다.
3. *전체 처리량( 일괄 처리와 같은* 총 트랜잭션 수)보다 응답 시간( *트랜잭션 하나를* 실행하는 데 걸리는 시간)이 더 중요 하고 가비지 수집 일시 중지를 더 짧게 유지해야 하는 경우 **-XX:+UseG1GC**를 사용하여 대부분 G1GC를 선택한다.
4. 응답 시간의 우선순위가 높은 경우 **-XX:UseZGC** 또는 **-XX:+UseShenandoahGC** 를 사용하여 완전 동시 수집기를 선택한다. (tip: ** ZGC는 대형 기계에서 잘 작동하지만 Shenandoah는 소형 기계에서도 잘 작동한다.)

## G1GC vs ZGC

G1GC는 JDK 7 이후로 지원되며 예측가능한 pause time을 유지하는 동안 throughput을 제공하기 위해서 설계되었다. 그리고 현재는 JDK 17의 기본 GC이다. 반면에, ZGC는 JDK 11에서 처음 소개된 알고리즘이며, 매우 큰 힙 사이즈에서 낮은 pause time을 제공하는데 집중한다. 높은 메모리 요구사항을 기반으로 한 애플리케이션에 적합하도록 만들어진 것이다.

일반적으로, G1GC와 ZGC 모두 전반적으로 가비지 콜렉션 중에 애플리케이션의 pause time을 최소화 하는 방향으로 구동된다. 하지만 실제 pause, 동시성, 그리고 총 시간은 다양한 요인에 의존한다. 예를 들면, 힙 사이즈, 객체의 할당 비율, live set의 크기 등이다.

ZGC는 엑셀 생성 등 대량의 작업이 연속적으로 이어진다면 메모리 사용량이 너무 많아진다는 단점이 있다. 하지만 가용성을 최대로 하여 일지 중지 시간(pause time)을 최소화 하고 싶은 애플리케이션의 API 서버 같은 경우에는 ZGC가 유리할 수 있다. 반면에, G1GC는 대량 작업이나 특별하게 가용성을 극대화하고 싶은 애플리케이션이 아니라면 무난하게 메모리 사용량의 추이를 보여주므로 범용적으로 사용하기에 용이하다.

1. **G1 Garbage Collector:**
   - **특징:** G1 GC는 대량의 데이터와 높은 throughput을 조합하여 사용할 수 있는 GC로, 장기 실행되는 애플리케이션에도 적합.
   - **적합한 시나리오:** 대량의 데이터를 한 번에 처리하는 단발성 배치 작업에서도 G1GC를 사용할 수 있다. 2GB 미만이면 적용되지 않음. 최소 4GB 이상의 일반적인 서버나 배치 서버에서 적합.
2. **Z Garbage Collector (ZGC):**
   - **특징:** ZGC는 낮은 일시 정지 시간을 제공하면서 대량의 데이터를 처리할 수 있다.
   - **적합한 시나리오:** 낮은 pause time이 필요하면서 대량의 데이터를 처리하는 경우에 적합. 최소 8GB이상의 실시간 성을 보장하는데 초점을 맞추는 API 서버에 적합.

## Conclusion

![image-20240123142922225](/Users/august/Library/Application Support/typora-user-images/image-20240123142922225.png)

오늘날 클라우드 네이티브 애플리케이션 시대에는 최소한의 리소스로 애플리케이션을 최대한 활용하는 것이 새로운 비기능적 요구 사항이 되었다. JVM 애플리케이션을 구축하는 경우 힙 크기를 올바르게 조정하여 최대한 활용할 수 있다. 힙에서 일어나는 일이 애플리케이션에 영향을 미칠 수 있으며, **최대 처리량**에 도달하거나 **대기 시간을 최소화**하려는 경우 GC(가비지 수집기) 구현을 선택하는 것이 도움이 될 수 있다.

성능은 힙 크기, 애플리케이션에서 유지 관리하는 실시간 데이터의 양, 사용 가능한 프로세서의 수와 속도에 따라 달라지므로 이러한 지침은 수집기 선택을 위한 시작점만 제공한다.

자바 버전이 올라감에 따라 성능이 훨씬 더 향상되면서 새로운 JVM이 지속적으로 출시되고 있다. 하지만 오늘날에도 **JVM 튜닝** 및 **GC의 선택**이 여전히 유효한 영향을 줄 수 있다. 비록 성능이 크게 향상되었음에도 불구하고 JVM은 기본 동작이 특정 성능 요구 사항과 반드시 일치하지 않는 복잡한 시스템으로 남아 있다. 애플리케이션 성능, 효율성 및 안정성 목표를 처리하기 위해 JVM에 의존함으로써 상당한 개선 가능성이 있다고 보아야 한다.

애플리케이션의 성격에 따라 환경에 따라 성능은 달라질 수 있으므로 Trade-off를 잘 살펴보고 최선의 선택을 하는것이 최적의 성능향상 결과를 얻을 수 있다.

## References

### G1GC vs ZGC

- https://www.linkedin.com/pulse/jdk-17-g1gc-vs-zgc-usage-core-exchange-application-performance-raza
- https://openjdk.org/jeps/439
- https://www.youtube.com/watch?v=bLJJ3CY1aE8
- https://www.jfokus.se/jfokus22-preso/The-Diabolical-Developers-Guide-to-JVM-Ergonomics-in-Containers.pdf
- https://blog.devgenius.io/every-jvm-garbage-collector-you-should-know-2b4b3b96282b
- https://medium.com/@AlexanderObregon/java-17s-garbage-collectors-a-beginner-s-guide-421b8caed3f9
- https://www.akamas.io/resources/right-app-gc-maximum-performance/

### G1GC

- https://backstage.forgerock.com/knowledge/kb/article/a75965340

### ZGC

- https://cr.openjdk.org/~pliden/slides/ZGC-OracleDevLive-2020.pdf
- https://www.blog-dreamus.com/post/zgc%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C
- https://hg.openjdk.org/zgc/zgc/file/59c07aef65ac/src/hotspot/os_cpu/linux_x86/zGlobals_linux_x86.hpp#l39
- https://d2.naver.com/helloworld/0128759
- https://dl.acm.org/doi/10.1145/3538532#d1e1202
- https://hub.packtpub.com/getting-started-with-z-garbage-collectorzgc-in-java-11-tutorial/
- https://inside.java/2023/06/20/optimizing-memory-utilization-zgc/
- https://blog.gceasy.io/2023/07/04/java-zgc-algorithm-tuning/
- https://malloc.se/blog/zgc-jdk17

### Choosing GC

- https://www.linkedin.com/pulse/choosing-best-garbage-collection-algorithm-better-java-prasad
- https://www.akamas.io/resources/right-app-gc-maximum-performance/
- https://backstage.forgerock.com/knowledge/kb/article/a75965340
- https://blogs.oracle.com/javamagazine/post/understanding-the-jdks-new-superfast-garbage-collectors
- https://anmolsehgal.medium.com/java-garbage-collectors-610689a5b125
- https://developers.redhat.com/articles/2021/11/02/how-choose-best-java-garbage-collector
- https://www.site24x7.com/learn/java/choosing-garbage-collector.html
- https://dzone.com/articles/choosing-the-best-garbage-collection-algorithm-for
- https://ionutbalosin.com/2019/12/jvm-garbage-collectors-benchmarks-report-19-12/

### Java 21

- https://timefold.ai/blog/2023/java-21-performance
- https://tschatzl.github.io/2023/08/04/jdk21-g1-parallel-gc-changes.html
- https://medium.com/@asdf123456789/a-new-modern-garbage-collector-in-jdk-21-4087e7ea9a5c
- https://vived.io/jdk-21-strikes-again-stable-virtual-threads-and-generational-zgc-jvm-weekly-vol-128/
- https://www.youtube.com/watch?v=U2Sx5lU0KM8

### Generational ZGC

- https://openjdk.org/jeps/439
- https://inside.java/2023/11/28/gen-zgc-explainer/
- https://belief-driven-design.com/looking-at-java-21-generational-zgc-e5c1c/

### GC Analyzer

- https://docs.azul.com/prime/diagnosing-java-performance-problems-with-gc-log-analyzer
