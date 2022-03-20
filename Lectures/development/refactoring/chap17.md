# 냄새 17. 메시지 체인 Message Chains

- 레퍼런스를 따라 계속해서 메소드 호출이 이어지는 코드.
    - e.g. this.member.getCredit().getLevel().getDescription()
- 해당 코드의 클라이언트가 코드 체인을 모두 이해해야 한다.
- 체인 중 일부가 변경된다면 클라이언트의 코드도 변경해야 한다.
- 관련 리팩토링
    - “위임 숨기기 (Hide Delegate)”를 사용해 메시지 체인을 캡슐화를 할 수 있다.
    - “함수 추출하기 (Extract Function)”로 메시지 체인 일부를 함수로 추출한 뒤, “함 수 옮기기 (Move Function)”으로 해당 함수를 적절한 이동할 수 있다.

# 리팩토링 37. 위임 숨기기 Hide Delegate

- 캡슐화 (Encapsulation)란 어떤 모듈이 시스템의 다른 모듈을 최소한으로 알아야 한다는 것이다. 그래야 어떤 모듈을 변경할 때, 최소한의 모듈만 그 변경에 영향을 받을 것이고, 그래야 무언가를 변경하기 쉽다.
- 처음 객체 지향에서 캡슐화를 배울 때 필드를 메소드로 숨기는 것이라 배우지만, 메소드 호출도 숨길 수 있다.
    - person.department().manager(); -> person.getManager()
    - 이전의 코드는 Department를 통해 Manager에 접근할 수 있다는 정보를 알 아야 하지만, getManager()를 통해 위임을 숨긴다면 클라이언트는 person의 getManager()만 알아도 된다. 나중에 getManager() 내부 구현이 바뀌더라 도 getManager()를 사용한 코드는 그대로 유지할 수 있다.

캡슐화가 잘 되어있지 않으면 결국에는 산탄총과 같은 냄새의 코드가 발생한다.
