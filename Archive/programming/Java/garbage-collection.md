# Gabage Collection(GC)

가비지 콜렉션은 메모리 관리 기법 중의 하나로, 프로그램이 동적으로 할당했던 메모리 영역 중에서 필요없게 된 영역을 해제하는 기능이다. 그렇다면 `필요없게 된`이라는 기준은 어떻게 결정할까? 그리고 어떻게 탐지할까?

가비지 콜렉션은 자바 환경(JVM)의 가장 큰 특징 중에 하나인데, 비판하는 입장에서는 언어 주순에서 GC를 제어할 수 없다는 점을 지적한다. 하지만 현대에 와서는 메모리 관리는 프로그래머가 아닌 **컴파일러나 런타임의 영역**이라고 보는 시각이 지배적이다.

가비지 콜렉션의 기본 원리는 모든 객체의 수명을 정확히 몰라도 런타임이 대신 객체를 추적하여 쓸모없는 객체를 알아서 제거하는 것이다. 이렇게 자동 회수한 메모리는 깨끗이 비우고 재활용할 수 있다. 모든 GC 구현체는 다음 두 가지 원칙을 준수해야 한다.

- 알고리즘은 반드시 모든 가비지를 수집해야 한다.
- 살아있는 객체는 절대로 수집해선 안 된다.

두 번째 원칙이 가용성의 측면에서는 더 중요한데, 살아 있는(사용할 가능성이 있는) 객체를 수집했다간 세그먼테이션 폴트가 발생하거나 프로그램 데이터가 조용히 오염된다.

## 마크 앤 스위프





## References

- https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html
- https://ko.wikipedia.org/wiki/%EC%93%B0%EB%A0%88%EA%B8%B0_%EC%88%98%EC%A7%91_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)
- https://d2.naver.com/helloworld/1329
- https://d2.naver.com/helloworld/329631
- https://12bme.tistory.com/57
- https://yaboong.github.io/java/2018/06/09/java-garbage-collection/
- https://www.eginnovations.com/blog/what-is-garbage-collection-java/
- https://www.baeldung.com/jvm-garbage-collectors