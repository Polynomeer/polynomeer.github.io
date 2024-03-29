# 냄새 7. 뒤엉킨 변경

좋은 소프트웨어는 응집도를 높이고 결합도를 낮춰야한다. 이렇게 되어있지 않으면 두 가지 문제가 발생한다. 첫 번째는 여러가지 문제를 해결하기 위해서 동일한 클래스를 계속 고치게 된다. 두 번째는 하나의 문제를 해결하는데 여러가지 클래스나 모듈을 왔다갔다하면서 고쳐야한다. 소프트웨어는 변경에 유연하게 대처해야하는데 모듈화가 잘 되어있지 않으면 유연한 대처가 어렵다. 한 가지 문제에 대해서는 한 가지 클래스나 모듈에 대해서만 수정하도록 구성되어 있어야한다. (Single Responsibility Principle)

- 소프트웨어는 변경에 유연하게 대처할 수 있어야 한다.
- 어떤 한 모듈이 여러가지 이유로 다양하게 변경되어야 하는 상황
    - e.g. 새로운 결제 방식을 도입하거나, DB를 변경할 때 동일한 클래스에 여러 메서드를 수정해야 하는 경우
- 서로 다른 문제는 서로 다른 모듈에서 해결해야 한다.
    - 모듈의 책임이 분리되어 있을수록 해당 문맥을 더 잘 이해할 수 있으며 다른 문제는 신경쓰지 않아도 된다.
- 관련 리팩토링 기술
    - "단계 쪼개기"를 사용해 서로 다른 문맥의 코드를 분리할 수 있다.
    - "함수 옮기기"를 사용해 적절한 모듈로 함수를 옮길 수 있다.
    - 여러가지 일이 하나의 함수에 모여 있다면 "함수 추출하기"를 사용할 수 있다.
    - 모듈이 클래스 단위라면 "클래스 추출하기"를 사용해 별도의 클래스로 분리할 수 있다.


## 리팩토링 24. 단계 쪼개기

- 서로 다른 일을 하는 코드를 각기 다른 모듈로 분리한다.
    - 그래야 어떤 것을 변경해야 할 때, 그것과 관련있는 것만 신경쓸 수 있다.
- 여러 일을 하는 함수의 처리 과정을 각기 다른 단계로 구분할 수 있다.
    - e.g. 전처리 -> 주요작업 -> 후처리
    - e.g. 컴파일러: 텍스트 읽어오기 -> 실행 가능한 형태로 변경
- 서로 다른 데이터를 사용한다면 단계를 나누는데 있어 중요한 단서가 될 수 있다.
- 중간 데이터를 만들어 단계를 구분하고 매개변수를 줄이는 데 활용할 수 있다.

## 리팩토링 25. 함수 옮기기

- 모듈화가 잘 된 소프트웨어는 최소한의 지식만으로 프로그램을 변경할 수 있다. -> DB 변경을 할때 최소한의 부분만 변경하면 된다.
- 관련있는 함수나 필드가 모여있어야 더 쉽게 찾고 이해할 수 있다.
- 하지만 관련있는 함수나 필드가 항상 고정적인 것은 아니기 때문에 때에 따라 옮겨야 할 필요가 있다.
- 함수를 옮겨야 하는 경우
    - 해당 함수가 다른 문맥(클래스)에 이쓴 데이터(필드)를 더 많이 참조하는 경우
    - 해당 함수를 다른 클라이언트(클래스)에서도 필요로 하는 경우
- 함수를 옮겨갈 새로운 문맥(클래스)이 필요한 경우에는 "여러 함수를 클래스로 묶기" 또는 "클래스 추출하기"를 사용한다.
- 함수를 옮길 적당한 위치를 찾기가 어렵다면, 그대로 두어도 괜찮다. 언제든 나중에 옮길 수 있다.

## 리팩토링 26. 클래스 추출하기

- 클래스가 다루는 책임이 많아직수록 클래스가 점차 커진다.
- 클래스를 쪼개는 기준
    - 데이터나 메서드 중 일부가 매우 밀접한 관련이 있는 경우
    - 일부 데이터가 대부분 같이 바뀌는 경우
    - 데이터 또는 메서드 중 일부를 삭제한다면 어떻게 될 것인가?
- 하위 클래스를 만들어 책임을 분산 시킬 수도 있다.
