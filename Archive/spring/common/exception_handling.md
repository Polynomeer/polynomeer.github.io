# Exception Handling

## Exception Classes

Exception은 수많은 자식 클래스가 있다. 그 중 RuntimeExeption은 Unchecked Exception이며, 그 외 Exception은 Checked Exception으로 볼 수 있다.

| |Checked Exception|Unchecked Exception|
|-----|-----|-----|
|처리여부|반드시 예외처리 필요|명시적 처리 강제하지 않음|
|확인시점|컴파일 단계|런타임 단계|
|종류|IOException</br>SQLException|NullPointerException</br>IllegalArgumentException</br>IndexOutOfBoundException</br>SystemException|

## Exception Handling in Spring

### @ControllerAdvice, @RestControllerAdvice

@ControllerAdvice는 Spring에서 제공하는 애너테이션으로 @Controller나 @RestController에서 발생하는 예외를 한 곳에서 관리하고 처리할 수 있게 하는 애너테이션이다. 설정을 통해 범위 지정이 가능하며, default 값으로 모든 컨트롤러에 대해 예외 처리를 관리한다. 예외 발생 시 json의 형태롤 결과를 반환하기 위해서는 @RestControllerAdvice를 사용하면 된다.

### @ExceptionHandler

예외 처리 상황이 발생하면 해당 핸들러로 처리하겠다고 명시하는 애너테이션이다. 애너테이션 뒤에 괄호를 붙여서 어떤 Exception Class를 처리할지 설정할 수 있다. @ExceptionHandler(MyException.class) Exception.class는 최상위 크래스로 하위 세부 예외 처리 클래스로 설정한 핸들러가 존재하면, 그 핸들러가 우선 처리하게 되며, 처리되지 못하는 예외처리에 대해 Exception class에서 핸들링한다. @ControllerAdvice로 설정된
