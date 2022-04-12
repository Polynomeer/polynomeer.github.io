# 냄새16. 임시필드 Temporary Field

- 클래스에 있는 어떤 필드가 특정한 경우에만 값을 갖는 경우.
- 어떤 객체의 필드가 “특정한 경우에만” 값을 가진다는 것을 이해하는 것은 일반적으로 예상하지 못하기 때문에 이해하기 어렵다.
- 관련 리팩토링
    - “클래스 추출하기 (Extract Class)”를 사용해 해당 변수들을 옮길 수 있다.
    - “함수 옮기기 (Move Function)”을 사용해서 해당 변수를 사용하는 함수를 특정 클 래스로 옮길 수 있다.
    - “특이 케이스 추가하기 (Introduce Special Case)”를 적용해 “특정한 경우”에 해 당하는 클래스를 만들어 해당 조건을 제거할 수 있다.

## 리팩토링 36. 특이 케이스 추가하기 Introduce Special Case

- 어떤 필드의 특정한 값에 따라 동일하게 동작하는 코드가 반복적으로 나타난다면, 해당 필드를 감싸는 “특별한 케이스”를 만들어 해당 조건을 표현할 수 있다.
- 이러한 매커니즘을 “특이 케이스 패턴”이라고 부르고 “Null Object 패턴”을 이러 한 패턴의 특수한 형태라고 볼 수 있다.