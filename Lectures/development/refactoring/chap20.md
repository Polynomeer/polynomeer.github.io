# 냄새 20. 거대한 클래스 Large Class

- 어떤 클래스가 너무 많은 일을 하다보면 필드도 많아지고 중복 코드도 보이기 시작 한다.
- 클라이언트가 해당 클래스가 제공하는 기능 중에 일부만 사용한다면 각각의 세부 기능을 별도의 클래스로 분리할 수 있다.
    - “클래스 추출하기 (Extract Class)”를 사용해 관련있는 필드를 한 곳으로 모을 수 있다.
    - 상속 구조를 만들 수 있다면 “슈퍼클래스 추출하기 (Extract Superclass)”또는 “타입 코드를 서브클래스로 교체하기”를 적용할 수 있다.
- 클래스 내부에 산재하는 중복 코드는 메소드를 추출하여 제거할 수 있다.

하나의 클래스에 필드가 모이면 별도로 분리하기가 점점 어려워진다. 왜냐하면 그 안에서 점점 더 얽히고 설키면서 뜯어내기가 어려워지기 때문이다. 그렇다 하더라도 언젠가는 반드시 뜯어내야한다.

## 리팩토링 41. 슈퍼클래스 추출하기 Extract Superclass

- 두개의 클래스에서 비슷한 것들이 보인다면 상속을 적용하고, 슈퍼클래스로 “필드 올리기 (Pull Up Field)”와 “메소드 올리기 (Pull Up Method)”를 사용한다.
- 대안으로는 “클래스 추출하기 (Extract Class)”를 적용해 위임을 사용할 수 있다.
- 우선은 간단히 상속을 적용한 이후, 나중에 필요하다면 “슈퍼클래스를 위임으로 교체하기”를 적용한다.
