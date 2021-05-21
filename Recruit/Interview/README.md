# Interview

source: `{{ page.path }}`

## 면접질문

### 데이터베이스

- Primary Key와 Foreign Key에 관하여 설명하세요.
- 인덱스를 사용하는 목적은 무엇인가요?
- 조인의 종류는 무엇이 있나요?
- 외부조인과 내부조인의 차이점은 무엇인가요?

### 운영체제

- 프로세스와 스레드에 관하여 설명하세요.
- 멀티스레딩의 장단점에 대해 설명하세요.
- 공유자원에 접근제한하는 방법은 어떤 것이 있나요?
- 세마포어와 뮤텍스에 관하여 설명하세요.
- 동기화와 비동기화 프로그래밍을 해보셨나요? 그 차이점은 무엇인가요?
- Context Switching에 관하여 설명하세요.

### 네트워크

- OSI 7 Layer에 대하여 설명하세요.
- TCP/UDP의 차이점에 대하여 설명하세요.
- TCP/UDP의 사용 사례를 설명하세요.
- TCP 3-way hand shaking에 대하여 설명하세요.

### 웹

- `www.google.com` 에 접속하는 과정을 설명하세요.
- HTTP의 동작원리를 설명하세요.
- HTTP의 단덤은 무엇인가요?
- HTTPS의 장점은 무엇인가요?
- 웹 트래픽이 많아지면 속도가 느려질 수 있는데, 이를 해결하기 위한 방법으로는 어떤 것이 있나요?
- Session, Connection, Transaction에 대하여 설명하세요.
- REST API에 대해 설명하세요.
- 클라이언트 캐시와 서버 캐시의 차이점을 설명하세요.
- 도커를 사용해보았나요?
- Redis를 사용해보았나요? Redis는 언제 사용하나요?
- XSS와 SQL Injection에 대해서 간단히 설명하세요.

### 자료구조/알고리즘



---

### 자바

- 추상클래스와 인터페이스에 관하여 설명하세요.
- 인터페이스의 장단점에 대하여 설명하세요.
- `Overloading`과 `Overriding`에 관하여 설명하세요.
  - 오버로딩은 같은 이름을 가지는 메소드를 하나의 클래스 내부에 여러개 정의하는 것이고, 오버라이딩은 상속관계에서 상위 클래스로부터 상속받은 메서드의 내용을 하위 클래스에서 변경하는 것을 말합니다. 이때 이 메소드는 헤더가 완전히 동일해야 합니다. 
- `static`에 관하여 설명하세요.
  - 클래스 내부에 static으로 선언된 필드는 클래스 멤버 또는 클래스 필드라고 하며, JVM의 클래스 로더가 클래스를 로딩해서 메소드 영역에 적재할 때 클래스 별로 관리됩니다. 
  - 이처럼 로딩되는 시점이 스택 영역의 변수들(지역변수, 멤버변수 등) 보다 빠르기 때문에, 이 시점 이후에 생성되는 메소드나 변수에서 이를 참조할 수 없습니다. 예를 들어, 생성자를 통해 생성된 인스턴스의 참조변수를 통해서 static 필드에 접근할 수 없습니다. 접근하기 위해서는 반드시 static이어야만 합니다.
  - static은 GC의 관리 영역 밖에 존재하므로 프로그램 종료까지 메모리에 할당된 채로 유지됩니다. 따라서 static을 너무 남발하게 되면 성능에 좋지않은 영향을 줄 수 있습니다.  
- 접근제한자(접근한정자, 접근지시자)에 대해 설명하세요.
  - 자바에서 접근제한자는 `private`, `public`, `protected`, `default(package-private)`가 있습니다. private는 해당 클래스 내부에서만 접근이 가능하고, default는 패키지 내부에서만 접근이 가능하며, protected는 상속관계에서만 접근이 가능합니다. 그리고 public 모든 영역에서 접근이 가능합니다.
- `int`와 `Integer`의 차이점에 대해 설명하세요.
- 자바8에서 추가된 기능에 대해 설명하세요.
  - 함수형 인터페이스, 람다식, Stream, Optional, 날짜 관련 클래스, Type Annotations, StringJoiner
  - https://parkhyeokjin.github.io/java/2016/01/11/Java8-Features.html
  - https://medium.com/@inhyuck/java-8%EC%97%90-%EC%B6%94%EA%B0%80%EB%90%9C-%EA%B2%83%EB%93%A4-8c66023cbbae
- 직렬화와 역직렬화에 대해 설명하세요.
- 자바에서 `null`을 안전하게 다루는 방법에 대해 설명하세요.



### 스프링

- 스프링을 사용해보셨다면, 스프링의 장점은 무엇인가요?

---

## 참고링크

- https://velog.io/@minsgy/%EB%B0%B1%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EB%A9%B4%EC%A0%91%ED%95%99%EC%8A%B5%EB%82%B4%EC%9A%A9
- https://github.com/ksundong/backend-interview-question
- https://velog.io/@hygoogi/%EA%B8%B0%EC%88%A0%EB%A9%B4%EC%A0%91-%EC%A4%80%EB%B9%84%ED%95%98%EA%B8%B0
- https://mangkyu.tistory.com/88
- https://junjangsee.github.io/2019/05/15/interview/interview/
- https://smjeon.dev/etc/interview-question/