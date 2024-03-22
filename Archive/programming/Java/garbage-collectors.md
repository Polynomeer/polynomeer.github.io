# Garbage Collectors

자바 애플리케이션은 메모리를 할당하고 해제하는데 있어서 가비지 콜렉션(GC)의 알고리즘에 상당히 의존하고 있다. 올바른 GC 알고리즘의 선택은 명백하게 애플리케이션의 성능에 영향을 준다. 따라서 GC의 종류인 G1GC와 ZGC도 상황이나 환경에 따라서 서로 다른 성능향상을 보일 수 있으며 트레이드 오프가 있다.

## TRADE-OFF's

가비지 콜렉션에 대해 이야기할 때 일반적으로 세 가지 사항을 고려해야한다.

### 1. Memory(Heap Memory)

프로그램에 할당된 메모리 양이며 이를 **Heap 메모리**라고 합니다. [footprint](https://spring.io/blog/2019/03/11/memory-footprint-of-the-jvm/) (GC 알고리즘을 실행하는 데 필요한 메모리 양)과 혼동하지 말아야 한다는 점에 주의해야 한다.

### 2. Throughput(처리량)

두 번째로 이해해야 할 것은 처리량입니다. 처리량은 가비지 수집이 실행된 시간과 비교하여 코드가 실행된 시간이다. 예를 들어, 처리량이 99%라면 코드가 실행된 시간의 99%와 가비지 수집이 실행된 시간의 1%를 의미한다. 대용량 애플리케이션의 경우 실행하는 모든 로드 테스트에서 최대한 높은 처리량을 원한다.

### 3. Latency(지연시간)

우리가 이해해야 할 세 번째 측면은 Latency이다. Latency는 가비지 수집이 실행될 때마다 가비지 수집이 제대로 실행되기 위해 프로그램이 중지되는 시간이다. 이 모든 것은 밀리초 단위로 측정되지만 로드 테스트를 위해 선택한 메모리 크기와 가비지 수집 알고리즘에 따라 최대 몇 초까지 걸릴 수 있습니다. 이상적으로는 Latency가 최대한 낮거나 예측 가능하길 원합니다.

## Garbage Collection의 세대적 가설

이 가설은 생성된 물체의 대부분이 어려서 죽는다는 것을 의미합니다. 객체가 더 이상 액세스할 수 없으면 객체가 가비지 수집 대상으로 표시됩니다. 이는 객체가 범위를 벗어날 때 발생할 수 있습니다. 또한 개체의 참조 변수에 명시적 **null 값이** 할당되거나  다시 초기화되는 경우에도 발생할 수 있습니다. 개체에 액세스할 수 없다면 이는 라이브 스레드가 프로그램에서 사용되는 참조 변수를 통해 해당 개체에 액세스할 수 없음을 의미합니다.

가비지 수집 알고리즘은 힙 메모리 크기를 YOUNG 세대와 OLD 세대로 나눕니다. 객체를 처음 생성할 때마다 해당 객체는 YOUNG 세대에 보관되고 대부분은 어릴 때 죽거나 매우 빨리 가비지 수집 대상이 됩니다. 이것이 바로 이 Young 세대에서 실행되는 가비지 수집이 많이 있는 이유이며 이 컬렉션은 다음과 같습니다. 마이너 GC라고 합니다.

인스턴스 수준 변수라고도 하는 클래스 수준 변수와 같은 개체가 평생 동안 남아 훨씬 더 오래 유지되고 개체가 여전히 가비지 수집에 적합하지 않은 많은 마이너 GC 수집 후에도 이 OLD로 승격됩니다. 세대. OLD 세대에 객체가 많을 때마다 OLD 세대에서 차지하는 메모리 공간의 양이 임계값(예: 60% 또는 70%)을 초과하면 Major GC가 트리거된다고 가정해 보겠습니다.

## GC 알고리즘 단계

모든 가비지 수집 알고리즘에는 세 가지 기본 단계가 있습니다.

### **표시**

이는 GC가 여러 개체에 대한 모든 참조의 루트 노드에서 시작하여 메모리의 개체 그래프를 살펴보고 연결 가능한 개체를 라이브로 표시하는 첫 번째 단계입니다. 마킹 단계가 완료되면 모든 활성 개체가 표시됩니다. 이 표시 단계의 지속 시간은 살아있는 객체의 수에 따라 달라지며 힙 메모리를 직접적으로 늘려도 표시 단계의 지속 시간에는 영향을 미치지 않습니다.

### 스위프

접근 가능한 객체 중 건드리지 않고 사용하지 않는 객체는 삭제되고 메모리를 회수합니다.

### 압축

압축은 모든 것을 순서대로 배열하는 과정입니다. 할당된 메모리 영역 사이의 빈 공간을 제거하기 위해 메모리를 압축하여 메모리 조각화를 제거하는 단계입니다.

## **MARK 및 COPY 알고리즘**

일반적으로 YOUNG 세대 내에서는 공간이 **EDEN** 공간과 두 개의 서바이버 공간인 **SURVIVOR SPACE 1** 과 **SURVIVOR SPACE 2 로 구분된다.**

메모리에 생성된 모든 새로운 객체는 먼저 EDEN 공간에 할당됩니다. Minor GC가 실행될 때마다 이 EDEN 공간의 라이브 객체만 표시되고 SURVIVOR 공간에 복사되며 이는 아래 단계와 관련됩니다.

1. 먼저 모든 개체를 활성 상태로 표시합니다. 이는 아직 사용 중이거나 참조 중이며 가비지 수집에 적합하지 않음을 의미합니다.
2. 모든 라이브 개체를 S1 또는 S2의 SURVIVOR 공간에 복사합니다.

모든 활성 개체를 복사하면 이제 이 EDEN 공간은 이미 복사된 개체와 가비지 수집에 적합한 개체로 구성되며 전체 EDEN 공간이 지워집니다.

## **MARK SWEEP 및 COMPACT 알고리즘**

이것은 일반적으로 OLD 세대에서 실행됩니다. 할당된 객체가 많이 있고 그 중 일부는 라이브이고 일부는 가비지 수집 대상이라고 가정해 보겠습니다. 처음에는 라이브 객체만 표시하겠습니다. 두 번째는 가비지 수집에 적합한 모든 개체를 청소하고 제거한 다음 공백을 제거하고 기술적으로 공백으로 만드는 것입니다. 공백을 제거하지 않으면 데이터 구조 자체가 공백이 비어 있다고 업데이트됩니다. 세 번째 측면은 압축입니다. 아직 사용 중인 모든 활성 개체를 왼쪽으로 이동하고 모두 함께 클러스터링합니다. 이 접근 방식의 단점은 모든 개체를 새 위치에 복사하고 해당 개체에 대한 모든 참조를 업데이트해야 하기 때문에 GC 일시 중지 기간이 길어진다는 것입니다.

압축의 장점은 새 개체를 할당할 때 왼쪽에 있는 모든 항목이 활용되고 오른쪽에 있는 모든 항목이 비어 있음을 나타내는 포인터와 참조를 유지하기만 하면 된다는 것입니다.

### 직렬 가비지 수집기(-XX:+UseSerialGC)

직렬 수집기는 수집기 중 가장 작은 공간을 차지합니다. 이 가비지 수집기를 실행하는 데 필요한 데이터 구조의 공간은 매우 적습니다. 이 수집기는 사소한 수집과 주요 수집 모두에 단일 스레드를 사용합니다. 압축을 위한 범프 포인터 기술은 직렬 수집기에서 사용되므로 할당이 훨씬 빠릅니다. 이 수집기는 일반적으로 매우 적은 양의 메모리를 사용하는 공유 CPU에서 실행되는 애플리케이션에 가장 적합합니다.

QUAD CORE CPU가 있고 그 위에서 4개의 애플리케이션이 실행되고 있다고 가정해 보겠습니다. 가비지 수집기가 단일 스레드가 아니고 다중 스레드이고 어느 시점에 가비지 수집기가 CPU의 4개 코어에서 4개의 스레드를 모두 시작하고 해당 전체 CPU를 자체 가비지 수집에 활용하는 경우 CPU에서 실행되는 다른 응용 프로그램에는 문제가 발생합니다. 단일 CPU에서 여러 애플리케이션이 실행되고 있고 가비지 수집기가 다른 코어나 애플리케이션에 영향을 주지 않도록 해야 하는 경우 직렬 가비지 수집기를 사용할 수 있습니다.

### 병렬/처리량 수집기(-XX:+UseParallelGC , -XX:+UseParallelOldGC)

다음으로 이해해야 할 수집기는 병렬 수집기라고 합니다. 병렬 컬렉터와 병렬 올드 컬렉터가 있습니다. 우리는 일반적으로 Minor GC와 Major GC 모두에 대해 여러 스레드를 사용하는 Parallel Old Collector 정도만 사용합니다. 이 수집기는 애플리케이션과 동시에 실행되지 않습니다. 가비지 수집 자체의 여러 스레드가 있고 모든 스레드가 병렬로 실행되기 때문에 병렬이라는 이름이 붙었습니다. 그러나 가비지 수집기가 실행 중일 때 모든 스레드가 중지되고 응용 프로그램이 다중 코어 또는 다중 프로세서 시스템에 배포된 경우 이 수집기는 우리에게 제공합니다 최고의 처리량

최단 시간 내에 최대한 많은 양의 쓰레기를 수거할 수 있습니다. 전체 애플리케이션을 중지하고 일정 기간 동안 중지할 수 있으며 배치 애플리케이션에만 가장 적합한 수집기입니다. 배치 애플리케이션에서는 프런트엔드와 배치 애플리케이션에 사용자가 없고 뒤에서 실행되기 때문에 사용자, 응답 시간에 신경 쓰지 않습니다. 배치 애플리케이션의 경우 병렬 수집기를 사용하는 것이 가장 좋습니다.

### 동시 표시 및 스윕 수집기(-XX:+UseConcMarkSweepGC, -XX:+UseParNewGC)

이를 동시 마크 앤 스위프(Concurrent Mark and Sweep)라고 합니다. 이 수집기는 애플리케이션과 동시에 실행되어 모든 라이브 개체를 표시합니다. 애플리케이션이 중지되어야 하는 시간이 짧으므로 애플리케이션의 대기 시간도 줄어듭니다. 실제 컬렉션에는 여전히 STW 일시 중지가 있습니다. STW는 Stop the World 일시 중지라고도 하며, 이는 실제 가비지 수집을 수행하기 위해 아주 짧은 시간 동안 애플리케이션을 중지한다는 의미입니다. 이 CMS 수집기는 병렬 수집기보다 더 많은 공간을 필요로 하며 처리해야 할 데이터 구조가 더 많습니다. 병렬 수집기보다 처리량이 적지만 병렬 수집기보다 일시 중지 시간이 적다는 장점이 있습니다. 이 컬렉터는 모든 일반 Java 애플리케이션에 가장 많이 사용되는 컬렉터입니다.

### G1 수집기(-XX:+UseG1GC)(가비지 우선)

CMS 컬렉터에 대한 개선 사항을 G1 컬렉터라고 합니다. 힙에 대해 특정 젊은 세대와 이전 세대를 갖는 대신 이 수집기는 전체 힙을 사용하여 여러 영역으로 나눕니다. 더 많은 공간을 차지하며 이 수집기의 장점은 대기 시간이 가장 예측 가능하다는 점이며 이것이 이 수집기의 가장 큰 특징입니다. 애플리케이션을 시작할 때 애플리케이션이 견딜 수 있는 최대 일시 중지 시간(maxTargetPauseTime)을 예를 들어 10ms로 이 변수에 전달할 수 있습니다. G1 수집기는 가비지 수집이 10ms 동안만 수행되도록 시도하며 일부 가비지가 남아 있더라도 다음 주기에서 처리합니다. 예측 가능한 대기 시간과 일시 중지 시간을 원한다면 G1 수집기가 사용하기에 가장 좋은 수집기가 될 것입니다. 이는 모든 성능 테스트 요구 사항에 가장 일반적으로 사용되는 수집기입니다.

### **셰넌도어 수집기(-XX:+UseShenandoahGC)**

Shenandoah Collector라는 수집가가 하나 더 있습니다. 이 수집기는 G1 수집기보다 약간 더 높은 공간이 필요하므로 더 많은 데이터 구조가 필요하지만 G1 수집기보다 대기 시간이 훨씬 더 짧은 G1 수집기의 개선된 것입니다. 

Shenandoah는 실행 중인 Java 프로그램과 동시에 더 많은 가비지 수집 작업을 수행하여 GC 일시 중지 시간을 줄이는 매우 낮은 일시 중지 시간 가비지 수집기입니다. CMS와 G1은 모두 실시간 객체의 동시 표시를 수행합니다. Shenandoah는 동시 압축을 추가합니다.

### Epsilon Collector(-XX:+UseEpsilonGC) - JDK의 아무것도 하지 않는 수집기

JDK 11에 실험적 수집기로 도입된 Epsilon 가비지 수집기는 메모리만 할당합니다. **할당된 메모리를 해제할 수 없으므로 OutOfMemoryError** 로 인해 애플리케이션이 충돌할 가능성이 매우 높습니다 . Epsilon 컬렉터의 GC는 GC 주기를 수행하지 않으므로 객체 그래프, 객체 표시, 객체 복사 등에 신경 쓰지 않습니다. Java 힙이 모두 소모되면 할당이 불가능하고 메모리 회수가 불가능하므로 테스트가 실패합니다. 

가장 중요한 장점은 GC 오버헤드가 없고 JVM이 메모리 해제를 시도하지도 않기 때문에 메모리를 지우기 위해 일시 중지하지 않는다는 것입니다. Epsilon GC는 애플리케이션의 성능, 메모리 사용량, 대기 시간 및 처리량 향상을 테스트하기 위한 벤치마크로 추가되었습니다. Epsilon Collector는 JVM(Java Virtual Machine)이 메모리를 모두 소진하고 종료하는 데 걸리는 시간을 계산하는 데 도움이 됩니다. Epsilon GC는 GC의 간섭 없이 코드에 포함된 GC 장벽 없이 원시 애플리케이션 성능을 테스트하는 데 도움이 됩니다. Epsilon GC 기능은 JDK 11에서 기본적으로 비활성화되어 있으며 이 수집기를 사용하려면 활성화해야 합니다.

대기 시간에 매우 민감한 애플리케이션의 경우 메모리 할당, 메모리 사용 공간을 완전히 파악하고 프로그램 성능이 가비지 수집의 영향을 받는 정도를 파악하려면 Epsilon 수집기를 사용하는 것이 가장 좋습니다.

### **(ZGC) Z 가비지 콜렉터(** -XX:+UseZGC)

**Z 가비지 수집기** ( **ZGC** )는 지연 시간이 짧고 확장 가능합니다. 처음부터 새로 작성된 완전히 새로운 GC입니다. 메모리 표시, 복사 및 재배치를 동시에 수행할 수 있으며 KB에서 대용량 TB 메모리에 이르는 힙 메모리와 함께 작동할 수 있습니다. 동시 가비지 수집기인 ZGC는 더 큰 힙 크기의 경우에도 애플리케이션 대기 시간을 10밀리초 초과하지 않도록 보장합니다. ZGC는 처음에 Java 11(Linux)에서 실험적인 GC로 출시되었으며 시간이 지남에 따라 JDK 11, 13 및 14에서 더 많은 변경이 예상됩니다.

세계 정지 일시 중지는 ZGC의 루트 검색으로 제한됩니다. 스레드가 실행 중일 때 동시 작업을 수행하기 위해 컬러 포인터가 있는 로드 장벽을 사용하고 힙 사용량을 추적하는 데 사용됩니다. 컬러 포인터는 ZGC의 핵심 개념 중 하나이며 이를 통해 ZGC는 객체를 찾고, 표시하고, 찾고, 다시 매핑할 수 있습니다. G1에 비해 ZGC는 메모리 회수 및 재할당 측면에서 성능이 매우 뛰어난 매우 큰 개체 할당을 처리하는 더 나은 방법을 제공하며 단일 세대 GC입니다.

**ZGC는 메모리를 ZPages** 라고도 하는 영역으로 나눕니다 . 이러한 ZPage는 동적으로 생성 및 삭제될 수 있으며 동적으로 크기를 조정할 수도 있습니다. 다른 GC와 달리 ZGC의 물리적 힙 영역은 메모리 조각화 문제를 방지할 수 있는 더 큰 힙 주소 공간(가상 메모리를 포함할 수 있음)에 매핑될 수 있습니다.

## 결론

일반적으로 직렬 수집기는 소형 장치에 사용되거나 GC가 다른 응용 프로그램이나 CPU에 영향을 주지 않도록 하려는 경우 병렬 수집기는 배치 응용 프로그램에 가장 적합하며 CMS 수집기는 일반 응용 프로그램에 사용되며 G1 수집기는 예측 가능한 대기 시간과 Shenandoah 수집기는 G1보다 개선된 기능으로 몇 가지 Java 버전(Java 12부터)에서 기본 수집기로 사용할 수 있습니다. Epsilon 및 ZGC 수집기는 JDK 11에서 도입된 새로운 실험적 수집기이며 여전히 릴리스마다 많은 변경을 겪고 있습니다.

## References

### JVM Architecture

- https://betterprogramming.pub/understanding-the-jvm-memory-model-heap-vs-non-heap-c14aa6fa703e
- https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html
- https://www.geeksforgeeks.org/jvm-works-jvm-architecture/
- https://www.javatpoint.com/jvm-java-virtual-machine
- https://dzone.com/articles/jvm-architecture-explained
- https://inpa.tistory.com/entry/JAVA-%E2%98%95-JVM-%EB%82%B4%EB%B6%80-%EA%B5%AC%EC%A1%B0-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%AD-%EC%8B%AC%ED%99%94%ED%8E%B8
- https://dzone.com/articles/java-memory-architecture-model-garbage-collection

### Garbage Collection

- https://mangkyu.tistory.com/118
- https://www.baeldung.com/jvm-garbage-collectors