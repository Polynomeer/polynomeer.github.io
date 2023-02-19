# Exception Handling

## Exception Handling in Java

### Exception Hierarchy

확인된 예외
이는 메서드의 throws 절에서 선언해야 하는 예외입니다. 그것들은 예외를 확장하고 "직접 보는" 유형의 예외가 되도록 의도되었습니다. Java는 어떻게든 프로그램 외부의 외부 요인에 의존하기 때문에 이를 처리하기를 원합니다. 확인된 예외는 정상적인 시스템 작동 중에 발생할 수 있는 예상된 문제를 나타냅니다. 대부분 이러한 예외는 네트워크를 통해 또는 파일 시스템에서 외부 시스템을 사용하려고 할 때 발생합니다. 대부분의 경우 확인된 예외에 대한 올바른 응답은 나중에 다시 시도하거나 사용자에게 입력을 수정하라는 메시지를 표시하는 것입니다.

확인되지 않은 예외
throws 절에서 선언할 필요가 없는 예외입니다. 프로그래밍 오류로 인해 대부분 런타임에 생성되므로 JVM은 이를 처리하도록 강제하지 않습니다. 그들은 RuntimeException 을 확장합니다 . 가장 흔한 예는 NullPointerException[무섭다.. 그렇지?]. 확인되지 않은 예외는 재시도해서는 안 되며 올바른 조치는 일반적으로 아무 작업도 수행하지 않고 메서드에서 실행 스택을 통해 나오도록 하는 것입니다. 높은 수준의 실행에서는 이러한 유형의 예외를 기록해야 합니다.

오류
거의 확실하게 복구할 수 없는 심각한 런타임 환경 문제입니다. 몇 가지 예는 OutOfMemoryError, LinkageError 및 StackOverflowError입니다. 그들은 일반적으로 프로그램이나 프로그램의 일부를 충돌시킵니다. 올바른 로깅 방법만이 오류의 정확한 원인을 파악하는 데 도움이 됩니다.

### Exception Handling in Java Best Practices

Be careful what you log. -> 인증정보 등을 로그에 남기지 말자.

Don’t bury thrown exceptions. -> 로그만 찍고 catch해서 예외를 없애버리는 것은 최대한 지양해야한다. 일부 비즈니스의 요구사항(서비스의 가용성을 위한)에 의해 예외를 무시하더라도 반드시 에러로그를 남김으로써 인지할 수 있어야한다.

Use a global Exception handler. -> 스프링에서는 Global Exception Handler가 제공되므로 이를 이용하면 된다.

Don’t close resources manually. -> try-with-resources 문법을 사용하여 자원을 열고 닫아야한다.

Throw early and handle exceptions late. -> 스프링 기반의 웹 애플리케이션에서는 try-catch 블록을 되도록 만들지말고, 컨트롤러 단 까지 throw해서 가져가는게 좋다. 그렇게 하면 전역으로 처리하기 편하고, 예상 못 하는 버그가 코드상에서 발생할 확률이 줄어든다.

Don’t log and rethrow Java exceptions. -> 로그만 남기고 그대로 throw 하면 에러 트래킹이 어려워진다. 그냥 무조건 컨트롤러로 넘기는게 낫다.

Check for suppressed exceptions. -> @SuppressWarning을 사용한다면 주의한다.

Explicitly define exception in the throws clause. -> 명시적인 예외를 throws 하도록 작성한다. Exception or RuntimeException을 throws 하면 그냥 컴파일 에러를 막기위해서 대충 떼우는 수준이다. 인텔리제이에서 컴파일 에러 발생 시 자동으로 수정하는 기능을 사용하면 그냥 가장 구체적인 예외로 throws가 작성된다.

Catch the most explicit exception first. -> 예를 들면, IllegalArgumentException을 먼저 파악하고, RuntimeException을 마지막에 파악해야한다. 이는 JVM이 잘 지켜서 구현하고 있다.

Use modern exception handling semantics. -> 최신 문법을 사용하라는 말이다.

Document the Exceptions You Specify. -> 커스텀 예외를 작성하면 주석을 통해 반드시 설명을 추가한다.

Throw Exceptions With Descriptive Messages. -> 예외를 던질 때 반드시 설명이 충분히 포함된 로그 메시지를 남기는게 에러 트래킹이나 모니터링 측면에서 좋다.

Don’t Log and Throw. -> 로그만 남기고 다시 그대로 throw 하는 것은 좋지않다. 로그를 보면 같은 에러 스택 트레이스가 중복으로 찍힐 것이다. 로그를 보면 추가적인 메시지를 남기는게 별 도움이 되지 않는다. 차라리 추가적인 정보를 제공하고 싶다면, 커스텀 예외를 throw 하는것이 로그를 보는데 도움이 된다.

Always correctly wrap the exceptions in custom exceptions so that stack trace is not lost.

```java
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " + e.getMessage());  //Incorrect way
}
```

이것은 원래 예외의 스택 추적을 파괴하며 항상 잘못된 것입니다. 이를 수행하는 올바른 방법은 다음과 같습니다.

```java
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " , e);  //Correct way
}
```

Don’t Catch Throwable -> Throwable은 모든 예외 및 오류의 상위 클래스입니다. catch 절에서 사용할 수 있지만 절대 사용해서는 안 됩니다!

catch 절에서 Throwable을 사용하면 모든 예외를 catch할 뿐만 아니라; 또한 모든 오류를 포착합니다. 응용 프로그램에서 처리할 수 없는 심각한 문제를 나타내기 위해 JVM에서 오류가 발생합니다. 이에 대한 일반적인 예는 OutOfMemoryError 또는 StackOverflowError 입니다 . 둘 다 응용 프로그램의 제어 범위를 벗어나 처리할 수 없는 상황으로 인해 발생합니다.

따라서 오류를 처리할 수 있거나 처리해야 하는 예외적인 상황에 있다고 절대적으로 확신하지 않는 한 Throwable을 catch하지 않는 것이 좋습니다.

- https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Java-Exception-handling-best-practices
- https://www.javacodegeeks.com/10-best-practices-to-handle-java-exceptions.html
- https://stackify.com/best-practices-exceptions-java/
- https://blog.devgenius.io/5-best-practices-to-handle-exceptions-in-java-5e1534f83772
- https://howtodoinjava.com/best-practices/java-exception-handling-best-practices/
- https://www.linkedin.com/pulse/java-exceptions-handling-best-practices-abid-anjum/
- https://dzone.com/articles/9-best-practices-to-handle-exceptions-in-java
- https://www.javaguides.net/2018/06/guide-to-java-exception-handling-best-practices.html
- https://javarevisited.blogspot.com/2013/03/0-exception-handling-best-practices-in-Java-Programming.html#axzz7te0U5ta6
- https://www.youtube.com/watch?v=KjqL5QxKAxc
- https://www.youtube.com/watch?v=ujYW4Q9ZG-4
- https://www.youtube.com/watch?v=XqSNm3rNV5k

### Exception Handling Methods

표준예외는 이미 스프링 등 라이브러리가 사용하고 있다. 따라서 이를 구분해서 사용하기 위해서 커스텀 예외를 작성해서 그것을 통해서만 예외처리를 작성하는 것이 에러 트래킹에 유리하다.

## Exception Handling in Spring Boot

- https://medium.com/globant/best-practice-for-exception-handling-in-springboot-540484db8a1a
- https://climbtheladder.com/10-spring-boot-exception-handling-best-practices/
- https://www.toptal.com/java/spring-boot-rest-api-error-handling
- https://stackoverflow.com/questions/66762006/spring-boot-exception-handling-best-practice

## Custom Exception vs Standard Exception

### Standard Exception

#### 1. 예외 메시지로도 충분히 의미를 전달할 수 있다/

자바에서 정의해놓은 IllegalArgumentException 등을 이용해도 그 의도가 충분히 전해질 수 있다.

#### 2. 표준 예외를 사용하면 가독성이 높아진다.

이미 익숙한 예외를 사용하므로 그 예외가 무엇에 대한 예외인지 파악하는 시간이 줄어든다. 단, 표준 예외의 그 쓰임에 맞게 적절하게 잘 사용되어야 한다는 전제가 있어야 한다.

#### 3. 일일이 예외 클래스를 만들면 너무 많아질 수 있다.

커스텀 예외를 각 케이스에 대해서 일일이 만들게 되면 너무 많은 예외클래스가 있어서 보기 힘들 수 있다.

- https://docs.oracle.com/javase/8/docs/api/?java/lang/RuntimeException.html

### Custom Exception

@Valid 애너테이션은 예외 상황에서 MethodArgumentNotValidException을 발생시킨다. 해당 예외는 스프링에서 만든 사용자 정의 예외이다.

#### 1. 이름으로도 정보 전달이 가능하다.

NoSuchElementException은 이름만으로는 어떤 요소가 없는지 알 수 없지만, ProgramNotFoundException이 발생했다면, Program을 찾는 요청을 받았지만 해당 자원이 없다는 것을 직관적으로 알 수 있다. 하지만 이는 메시지로도 충분히 전달이 가능한 부분이므로 설득력이 다소 부족하다.

#### 2. 상세한 예외 정보를 제공할 수 있다.

예외에 대해서 직접 로직을 포함할 수 있으므로, 단순하게 메시지만 다르게 하는 것이 아니라 다양한 정보를 포함시킬 수 있다.

#### 3. 예외에 대한 응집도가 향상된다.

전달하는 정보의 양이 많아질수록 예외 발생 코드가 더러워진다. 거기에 같은 예외를 발생하는 부분이 많아진다면 코드는 훨씬 지저분해진다. 이를 별도의 메서드로 분리하더라도 서로 다른 클래스에서 같은 예외가 발생한다면 책임 소재가 불분명해진다. -> SRP 위반의 가능성이 있다.

이를 위해 유틸 클래스를 만들고 정적 메서드로 처리할 수 있지만, 이는 커스텀 예외를 작성하는 것에 대한 공수가 차이가 없다.

#### 4. 예외 발생 후처리가 용이하다.

스프링에서는 ControllerAdvice를 통해서 전역적인 예외처리가 가능하다. 예외는 상속 관계에 있기 때문에, Exception이나 RuntimeException을 잡아두면 프로그램 내에서 발생하는 모든 예외에 대해 처리가 가능하다. 하지만 이는 프로그래머가 의도치 않은 예외까지 잡아내어 혼란을 야기할 수 있다.

재사용성이 높은 것은 표준 예외들의 장점이다. 하지만 그 장점 때문에 발생 위치를 정확하게 파악하기 힘들다는 단점도 생긴다.

#### 5. 예외 생성 비용을 절감한다.

자바에서 예외를 생성하는 행위는 생각보다 많은 비용이 소모된다. 바로 stack trace 때문이다.

#### 6. 예외의 계층구조를 설계하여 체계적인 관리가 가능하다.

이는 커스텀 예외를 일일이 만들면 너무 많아진다는 의견에 대해서 반박할 수 있는 근거가 되는 내용이다. 커스텀 예외라도 애플리케이션의 특성에 따라 주로 몇 가지 유형으로 예외가 분류된다. 예를 들면, NotFoundException, UnauthorizedException, InvalidException 등 HttpStatus 코드와도 거의 대응되는 예외로 분류할 수 있다. 따라서 큰 분류로 예외를 나눈 후에 필요 시 해당 예외를 상속하는 구조로 관리한다면 일괄적인 예외 처리가 가능하고, 별도의 처리 로직이 필요 없을 시 메시지만 달리 하도록 하여 일일이 커스텀 예외를 생성할 필요가 없어진다.

- https://keepgoing0328.tistory.com/entry/Java-%EC%98%88%EC%99%B8-%EC%B2%98%EB%A6%AC-custom-exception#:~:text=%ED%91%9C%EC%A4%80%EC%98%88%EC%99%B8%EB%8A%94%20%EA%B0%80%EB%8F%85%EC%84%B1%EC%9D%B4,%ED%95%98%EB%8A%94%20%EB%8B%A4%EC%96%91%ED%95%9C%20%EC%9D%B4%EC%9C%A0%EA%B0%80%20%EC%9E%88%EB%8B%A4.&text=%EC%9D%B4%EB%A6%84%EC%9C%BC%EB%A1%9C%20%EC%96%B4%EB%96%A4%20%EC%98%88%EC%99%B8%EA%B0%80,%EC%9E%88%EB%8F%84%EB%A1%9D%20%EB%AA%85%EB%AA%85%ED%95%A0%20%EC%88%98%20%EC%9E%88%EB%8B%A4.
- https://tecoble.techcourse.co.kr/post/2020-08-17-custom-exception/
