# 11장 애너테이션

애너테이션은 몇몇 도구에서 처리할 수 있게 소스코드에 삽입하는 태그다. 이런 도구는 애너테이션을 소스 수준에서 처리하거나 컴파일러가 애너테이션을 집어넣은 클래스 파일을 처리할 수 있다.

애너테이션은 단순한 주석과는 다르다. 자바에서는 애너테이션을 **기준으로** 판단하고, 설정하고, 처리한다. 따라서 애너테이션은 그렇게 하기위해서 필요한 정보들을 최소한으로 제공해주는 추상적인 마킹이다. 이것을 보고 구현체들이 여러가지 동작을 수행할 수 있게된다.


- 컴파일러에게 코드 문법 에러를 체크하도록 **정보를 제공**
- 소프트웨어 개발 툴이 빌드나 배치 시 코드를 자동으로 생성할 수 있도록 **정보를 제공**
- 실행 시(런타임) 특정 기능을 실행하도록 **정보를 제공**

애너테이션은 프로그램이 컴파일되는 방식을 바꾸지 않는다. 자바 컴파일러는 애너테이션이 있든 없든 같은 가상 머신 명령어를 만들어 낸다.

애너테이션을 이용하려면 먼저 처리 도구(processing tool)를 선택하고, 해당 도구에서 이해하는 애너테이션을 사용해야 한다. 그래야 도구를 코드에 적용할 수 있다.

애너테이션은 광범위하게 사용된다. 예를 들어 JUnit은 애너테이션으로 테스트를 실행할 메서드를 표시하고, 테스트를 수행할 방법을 지정한다. JPA는 애너테이션을 클래스와 데이터베이스 테이블 사이의 매핑을 정의해 프로그래머가 SQL 쿼리를 작성하지 않아도 객체가 자동으로 영속화하게 한다.

```warning
애너테이션 요소는 절대로 null값을 가질 수 없다.
따라서 명시하지 않으면 기본값이 세팅된다. 
```

### 메타 애너테이션
- `@Target`: 애너테이션 적용 대상(애너테이션을 적용할 수 있는 위치)
- `@Retention`: 애너테이션 유지 정책(접근할 수 있는 위치)

```tip
실제로 웹 애플리케이션 개발 시 직접 애너테이션을 정의하는 경우는 거의 없다. 하지만 이미 정의된 애너테이션을 적용하고 처리하는 일이 많으므로 잘 이해하고 사용하는 것이 중요하다.
```