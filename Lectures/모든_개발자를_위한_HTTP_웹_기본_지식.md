# 모든 개발자를 위한 HTTP 웹 기본 지식

# 1. 인터넷 네트워크

## 인터넷 통신

바로 옆의 컴퓨터 끼리는 그냥 연결된 케이블을 통해서 요청/응답 메시지를 주고받으면 된다. 하지만 보통은 인터넷을 통해서 복잡한 과정을 거쳐서 이동한다. 과연 제각기 다른 인터페이스를 가진 망을 통해서 어떻게 원격지로 메시지가 전달되는 것일까?

## IP(인터넷 프로토콜)

최소한의 규칙이 있어야 원격지로 동일한 인터페이스를 통해 메시지를 보낼 수 있다. IP는 IP 주소라는 것을 기준으로 원격지를 찾아갈 수가 있다. 예를 들어, 100.100.100.1의 주소에서 200.200.200.2의 주소로 메시지를 보내고 싶다면, 계속 노드를 이동하면서 목적 IP를 계속 찾아나간다. 그리고 목적 IP를 찾는다면 최종적으로 메시지를 전송하게 된다.

### IP 프로토콜의 한계

- 비연결성 : 패킷을 받을 대상이 없거나 서비스 불능 상태여도 패킷을 전송한다. 즉, 단방향으로 그냥 전송한다.
- 비 신뢰성 : 중간에 패킷이 사라질 수 있고, 순서를 보장하지 않는다.
- 프로그램 구분 : 같은 IP를 사용하는 서버에서 통신하는 애플리케이션이 둘 이상이면 충돌이 날 수 있다.

## TCP

Application Layer

Tranport Layer

Internet Layer

Network Interface Layer

### 3 way handshaking

개념적이고 논리적인 연결이지 물리적으로 연결된 것은 아니다. 물리적인 수많은 노드들이 실제로 연결되었는지는 알 수 없다.

## UDP

IP와 거의 동일한데 PORT와 CheckSum이 추가된다. PORT는 컴퓨터 내부에서 애플리케이션을 서로 구분할 때 사용한다.

UDP는 거의 하얀 백지와 같다. 최근에는 오히려 UDP가 각광을 받고있다. 왜냐하면 TCP에서는 3way handshaking을 하는 최소한의 과정을 거치는데, HTTP3에서는 그것마저 줄여보자는 노력을 하고 있다. 즉, 오히려 UDP에 필요한 최소한의 데이터만 추가해서 전송을 함으로써 빠른 속도를 보장하겠다는 것이다.

이렇게 최적화를 위한 노력에 의해 UDP가 최근에 점유율이 높아지고 있는 추세이다. 물론 아직도 여전히 TCP가 90%이상을 점유하고 있다.

## PORT

IP를 통해서 목적지 서버를 찾는다. 그리고 서버내에서 애플리케이션을 구분하는 것은 PORT를 사용한다.

Well known port

## DNS

항상 접속하던 서버의 IP가 갑자기 바뀌면 접속을 못하게 된다. 그렇다면 아무리 IP가 변경되어도 도메인 네임이라는 것을 사용해서 동일한 이름으로 서버에 접근할 수 있다. 마치 전화번호부와 같은 역할을 한다.

# 2. URI와 웹 브라우저 요청 흐름

## URL

foo://example.com:8042/

## URN

urn:example:animal:ferret:nose

## URI

https://google.com:443/search?q=hello&hl=ko



## URL Scheme

- `scheme://[userinfo@]host:[:port][/path][?query][#fragment]`

- `https://www.google.com:443/search?q=hello&hl=ko`

## 웹 브라우저 요청 흐름

`https://www.google.com:443/search?q=hello&hl=ko`

HTTP 요청 메시지 : `GET /search?q=hello&hl=ko HTTP/1.1 Host:www.google.com`

# 3. HTTP 기본

## 모든 것이 HTTP

HTTP(HyperText Transfer Protocol)는 최초에 하이퍼텍스트 파일을 전송하기 위해서 만들어졌지만, 현재는 대부분의 데이터를 HTTP를 통해서 송수신한다. 특수한 상황(ex. 게임 등)을 제외하면 모든 곳에 HTTP를 사용한다.

HTTP/1.1 1997년: 가장 많이 사용

### HTTP 특징

## 클라이언트 서버 구조

- Request / Response 구조
- 클라이언트는 서버에 요청을 보내고, 응답 대기
- 서버가 요청에 대한 결과를 만들어서 응답

장점 : 클라이언트는 UI를 어떻게 그릴지, 어떻게 렌더링할지에 집중한다. 그리고 서버는 비즈니스 로직을 어떻게 처리할지만 집중한다. 서버 트래픽이 증가할 때 클라이언트는 그대로 유지한 채로 독립적인 진화를 할 수가 있다.

## 무상태 프로토콜(Stateless)

### Stateful, Stateless 차이

상태유지, Stateful - 서버가 클라이언트의 이전 상태를 보존한다,

상태없음, Stateless - 서버가 클라이언트의 이전 상태를 보존하지 않는다,

무상태는 응답 서버를 쉽게 바꿀 수 있다. -> 무한한 서버 증설 가능 (스케일 아웃, 수평확장 유리)



## 연결을 유지하지 않는 모델

요청을 받을 때만 연결, 서버는 연결 유지 x, 최소한의 자원 사용

### 비 연결성

실제로 서버에 초단위로 쪼개어보면 순간적으로 동시접속자가 수십만명인 경우는 거의 없다.

- HTTP는 기본적으로 연결을 유지하지 않는 보델
- 일반적으로 초 단위 이하의 빠른 속도로 응답

### HTTP 초기 - 연결, 종료 낭비

연결 - 요청/HTML 응답 - 종료

연결 - 자바스크립트 응답 - 종료

연결 - 이미지 응답 - 종료

### HTTP 지속 연결(Persistent Connections)

연결 - 요청/HTML 응답  - 자바스크립트 응답 - 이미지 응답 - 종료

## HTTP 메시지

# 4. HTTP 메서드

## API URI 설계

- 회원 목록 조회 /read-member-list
- 회원 조회 /read-member-by-id
- 회원 등록 /create-member
- 회원 수정 /update-member
- 회원 삭제 /delete-member

과연 좋은 설계일까? 가장 좋은 설계는 리소스

회원이라는 개념 자체가 바로 리소스다.

리소스를 어떻게 식별하는게 좋을까?

회원을 등록하고 수정하고 조회하는것을 모두 배제

- 회원 목록 조회 /members
- 회원 조회 /members/{id}
- 회원 등록 /members/{id}
- 회원 수정 /members/{id}
- 회원 삭제 /members/{id}

URI는 리소스만 식별한다. 따라서 리소스와 해당 시소스를 대상으로 하는 행위를 분리해야한다.

- 리소스 : 회원
- 행위 : 조회, 등록, 삭제, 변경

행위(메서드)는 어떻게 구분하는가? -> GET, POST

## HTTP 메서드 - GET, POST

### GET

### POST

메시지 바디를 통해 서버로 요청 데이터 전달

주로 전달된 데이터로 신규등록

### PUT

**리소스를 완전히 대체**한다. overwrite

클라이언트가 리소스를 식별

PUT /members/100 과 같이 직접 리소스를 지정한다.

기존 리소스를 수정하는 용도가 아니다. 모두 갈아치우는 메서드

### PATCH

리소스 부분 변경, 이것을 지원하지 않는 경우에는 그냥 POST를 사용하면 된다. POST는 무적이다. (모두 지원한다)

### DELETE

리소스 삭제



## HTTP 메서드의 속성

GET은 body에 보통 내용을 넣지않는다.

### 안전

호출해도 리소스 변경이 일어나지 않는다.

### 멱등

한 번 호출하든 두 번 호출하든 100번 호출하든 결과가 똑같다.

POST는 멱등이 아니다!!!

왜 중요한가? 자동 복구 매커니즘에서 중요하다.

멱등은 외부 요인으로 중간에 리소스가 변경되는것까지는 고려하지 않는다!

### 캐시가능

응답 결과 리소스를 캐시해서 사용해도 되는가? GET과 HEAD만 보통 캐시에 사용. 특히 실무에서는 거의 GET을 사용.



# 6. HTTP 메서드 활용

