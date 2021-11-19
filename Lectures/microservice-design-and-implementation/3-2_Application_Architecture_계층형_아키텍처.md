# 3-2 Application Architecture : 계층형 아키텍처(Layered Architecture)

이번 차시에서는 Application Architecturing을 위해 가장 많이 활용되고 있는 대표적인 Architecture 패턴인 Layered Architecture에 대해 살펴보도록 하겠습니다.
Layered Architecture를 살펴보기 전에 보통 Tier와 Layer를 많이 혼동하게 됩니다. 쉽게 말하면 Tier는 물리층을 의미하며, Layer는 논리층을 의미합니다.
여기 Tier의 전형적인 도식을 볼 수 있는데요. 클라이언트층과 중간층, EIS층으로 나눴습니다.
클라이언트층은 PC, 스마트폰이 될 수 있고, 중간층은 어플리케이션 서버가 될 수 있으며,
EIS층은 어플리케이션 서버에 데이터를 제공하는 데이터베이스 서버나 레거시 시스템 서버가 될 수 있습니다.
지금 말씀드린 것처럼 Tier는 물리적인 장비, 서버 컴퓨터가 될 수 있습니다. Layer는 이러한 Tier 내부의 논리적인 분할을 의미합니다.
1:1이 될 수도 있지만 Tier의 내부를 제공하는 기능 성격에 따라 논리적 구분을 할 수 있습니다.
여기 어플리케이션 서버라는 중간층은 세 가지 Layer로 구별될 수 있는데요. 가장 일반적인 어플리케이션 Layer인 Presentation, Business Logic, Data Access층으로 나눠질 수 있습니다.
Layered Architecture는 설계자들이 복잡한 시스템을 분리할 때 흔히 사용하는 패턴 중 하나로 상위는 하위를 호출하여,
상위는 하위의 여러 Layer를 알 필요 없이 바로 밑에 근접한 Layer를 활용하여 다양한 서비스를 이용할 수 있습니다.
이러한 Architecture는 각 Layer를 표준화, 모듈화 함으로써 위에 Layer가 아래 Layer의 변경에 영향을 받지 않도록 하여 어플리케이션이 쉽게 변경되거나 확장할 수 있게 해줍니다.
따라서 이때 하위 계층은 상위를 알지 못하게 구성해야 합니다.
그림과 같이 Layer는 Tier로 묶일 수 있으며, Tier 단위로 하나의 장비로 구성할 수 있습니다.
다음 표를 보면 가장 일반적인 어플리케이션 Layer 구분 방법인 3 계층에서 출발하여 역할에 따라 더 세분화된 계층들을 보여줍니다.
각 Layer의 이름은 마틴 파울러의 엔터프라이즈 Architecture 패턴에서 정의한 용어인 Presentation Layer, Business Logic Layer, Data Access Layer가 가장 많이 쓰이고 있지만,
계층의 역할을 더 구체적으로 표현하여 불리기도 합니다.
여기서는 Java Script 진영에서 일반적으로 쓰이는 용어로 Layer를 설명해보도록 하겠습니다.
제일 위에 Presentation Layer층이 있습니다. Presentation Layer층은 컨트롤러라는 구성요소를 가지고 있으며, 화면 표현에 대한 처리를 합니다.
예를 들면 화면전환 버튼을 선택했을 때의 이벤트 처리, 세션 관리 등의 기능을 제공합니다.
다음 Business Logic층은 서비스와 도메인으로 구분되는데, 서비스는 Presentation의 컨트롤러에서호출되며, 비즈니스도메인 로직을 호출하여 특정 업무의 처리 흐름을 제어합니다.
도메인은 Business Logic을 실행하는 데 있어서 주요 개념 및 로직을 담고 있으며, Spring의 POJO 객체로 보통 구성됩니다.
Data Access Layer는 DAO라고 하는 구성요소를 가지고 있으며, DAO는 Data Access Object의 약어이며, 서비스가 처리한 결과를 받아서 데이터로 저장하는 역할을 수행합니다.
다음은 각 Layer 간의 호출 원칙입니다. 각 Layer는 내부의 응집력은 높이고 Layer 간의 낮은 결합도를 갖도록 설계되어야 합니다.
따라서 당연히 Layer 사이의 흐름은 클래스에서 클래스를 직접 호출하지 않고 인터페이스를 통해 호출하는 것이 바람직합니다.
인터페이스를 하나 만드는 것이 번거롭다고 그냥 클래스를 이용해서는 안 됩니다.
또한 인터페이스를 사용한다는 것은 Layer의 경계를 넘어서 들어오는 요청을 명확히 정의하겠다는 것을 의미합니다.
이렇게 구현 클래스에 직접 의존하지 않음으로써 Object 사이에 약한 결합을 유지할 수 있습니다.
이러한 구조는 개발 효율성을 높일 뿐만 아니라 운영 시에도 쉽게 변경/확장 가능하게 해줍니다.
이번 차시에서는 Application Architecture의 대표 패턴인 Layered Architecture에 대해 살펴보았습니다. 감사합니다.
