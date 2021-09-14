# Study Keyword

## 테스트 커버리지 관련
이 부분은 동료 백엔드 개발자 분들과 토론을 한 적이 있다. 이응준 님의 [테스트 커버리지 100%](https://www.youtube.com/watch?v=jdlBu2vFv58)는 커녕 50%도 쉽지 않았다. 테스트 커버리지를 얼마나 잡는가? `1 + 1 = 2` 라는 당연한 부분도 테스트 코드를 꼭 작성해야 하는가? 내 수준에서는 70%라도 목표로 잡고 진행해 보아야겠다.

## MSA
MSA와 외부 API를 연동하는 것의 차이가 무엇인가? MSA의 정확한 개념을 알아야 그 차이를 알 수 있을 것이다. 그렇다면 MSA로 구성할 경우 성능을 어떻게 개선할 수 있는가? 그리고 외부 API 연동할 때의 성능은 어떻게 개선할 수 있는가?

## 웹 캐싱
[개발바닥 영상](https://www.youtube.com/watch?v=VyQAWDlKy94) 하나를 보면서 줌 인터넷 뿐만 아니라 다음 검색 웹 서비스를 개발하면서 주로 API 붙이고, 캐싱을 하는 것을 계속 반복한다고 들었다. 그 캐싱을 하기위한 관리 시스템으로서 Redis나 Memcached 등이 있다. 그렇다면 Redis나 Memcached 또는 EHCache를 어떻데 사용하여 컨텐츠를 서빙하는 성능을 높일 수 있는가?

## DB 쿼리 튜닝과 인덱싱
인덱싱을 어떻게 걸고, 쿼리를 어떻게 튜닝해야 성능을 높일까?

## JPA에 대한 이해
JPA 영속성 컨텍스트의 동작원리, 흐름을 정확히 알고 그림으로 그려보기

## 테스트 코드와 Mockito
테스트코드 작성을 위해 모키토를 사용하는 방법
테스트코드 작성을 위해 모키토 대신에 인터페이스를 상속하는 간이 클래스를 사용하는 방법

## REST API의 구조
API를 한방에 다 보내는 것이 좋은지? 아니면 페이지별로 요청을 오도록 하는게 나은지

## 웹 서비스에서의 성능의 계층적 구조
성능의 우선순위? 클라이언트 > API 서버 통신 > DB접근(I/O)

## 새로운 엔티티 여러 개 동시에 생성 시
새로운 엔티티를 생성할때 프론트에서 구분이 안가서 경고가 뜨면 0.1234 처럼 소수로 보내고 Long으로 받아서 0L로 자르는 테크닉? 바람직한지

## DB I/O를 자체적으로 캐싱
findAll대신에 map에 캐싱하여 한번만 I/O 하기.
스프링은 싱글톤이라는 점에 유념해야함.

## Ktor
Ktor를 사용하여 외부 통신

## RestTemplate
외부통신 엔티티를 만드는 메서드를 유틸 클래스에 두는게 스레드 세이프 한지

## DB 문서화 및 형상관리
DB문서화, DB형상관리

## API문서화
Swagger를 붙이거나, Postman으로 문서배포

## VPC
VPC설정해서 IP로 열어줄 필요가 없도록

## Elastic Search
엘라스틱서치를 통해 로그를 받아보기

## CDN
CDN서버에 이미지를 저장하는 것

## Pagenation
페이지네이션을 구현하는 원리

## 로컬에서는 되는데 서버에서 안되는 경우
로컬에서는 된다 -> 배포 후 서버에서 안된다 -> CORS나 주소 설정 등은 다 맞추어져 있다 -> 서버에 직접 접속해서 curl을 날려본다 -> 서버의 IP가 해외라서 외부업체 API로부터 차단당함

## 이상없이 동작하고 빌드에러도 없는데, 일시적으로 프론트까지 다 터졌을 경우
배포를 했는데 갑자기 프론트에서 라이브러리를 하나도 못 끌어온다. -> 로드밸런서가 제대로 동작하지 않아 갈아끼우기 전의 인스턴스에 해당하는 주소를 참조하여 발생

## 결제시스템
PG사 결제모듈 붙이기

## 핸들러와 헬퍼 클래스의 역할

## 스프링 계층구조와 OSIV

## 애노테이션의 동작원리와 리플렉션

## 커머스 도메인에 대한 이해

## 배송관련 도메인에 대한 이해

## 벨리데이션이 필요한 경우

## 플러터로 네이티브 수준의 앱 빌드가 가능한지, 로스플랫폼 간의 호환이 잘 되는지

## Node.js 외부통신(외부 API 연동)

## Java의 Date 타입들