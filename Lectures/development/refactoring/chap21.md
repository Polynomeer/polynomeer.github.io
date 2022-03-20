# 냄새 21. 서로 다른 인터페이스의 대안 클래스들 Alternative Classes with Different Interfaces

- 비슷한 일을 여러 곳에서 서로 다른 규약을 사용해 지원하고 있는 코드 냄새.
- 대안 클래스로 사용하려면 동일한 인터페이스를 구현하고 있어야 한다.
- “함수 선언 변경하기 (Change Function Declaration)”와 “함수 옮기기 (Move Function)을 사용해서 서로 동일한 인터페이스를 구현하게끔 코드를 수정할 수 있다.
- 두 클래스에서 일부 코드가 중복되는 경우에는“슈퍼클래스 추출하기 (Extract Superclass)”를 사용해 중복된 코드를 슈퍼클래스로 옮기고 두 클래스를 새로운 슈퍼클래스의 서브클래스로 만들 수 있다.
