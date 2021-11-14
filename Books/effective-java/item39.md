# Item 39. Prefer annotations to naming patterns

## 명명 패턴(Naming Pattern)

전통적으로, 명명 패턴을 사용하여 도구나 프레임워크가 특별하게 다루어야 할 부분을 가리키곤 했다. 이 책에서 말하는 명명 패턴이란 `특정 패턴을 가진 이름의 메서드를 특정 방식으로 처리하겠다`는 것이다. 예를 들어, Getters와 Setters는 필드의 이름 앞에 get/set을 붙여서 카멜 케이스의 형태로 하는 메서드를 기본으로 인식한다. 그리고 JUnit3 까지는 test로 시작하는 메서드를 테스트 메서드로 인식하였다. 그런데 이 방식에는 단점이 3가지 있다.

### 명명 패턴의 단점

1. 오타가 나면 안된다. 

`tsetSafety`와 같이 오타를 내면 테스트 메서드로 인식하지 못 한다.

2. 올바른 프로그램 요소에서만 사용되리라는 보장이 없다.

메서드가 아니라 클래스 이름에 `TestSafetyMechanisms`라고 지어서 JUnit3에게 전달하면, JUnit3은 클래스 이름으로 인식하는게 아니라 메서드 이름을 인식하므로 테스트가 실행되지 않는다.

3. 프로그램 요소를 매개변수로 전달할 마땅한 방법이 없다.

특정 예외를 던져야한 성공하는 테스트가 있다고 하면, 기대하는 예외 타입을 테스트에 매개변수로 전달해야 한다. 예외의 이름을 테스트 메서드 이름에 덧붙이는 방법도 있다고 하지만, 문자열만으로 판단해야 한다는 점 자체로도 충분히 나쁘다. 컴파일 에러로 잡아낼 수 없는 영역이기 때문이다.

## 애너테이션

![annotation](/Users/ham/Desktop/Blog/polynomeer.github.io/images/JavaAnnotations.jpg)

_이미지 출처: https://www.geeksforgeeks.org/annotations-in-java_

명명 패턴의 한계점을 해결하기 위해 '마킹'을 해서 해당 메서드의 역할을 분명히 해서 컴파일 수준의 에러로 걷어낼 수 있도록 하는 방법이 있다. 그것이 바로 자바8에서 도입된 애너테이션이다. 애너테이션은 프로그램에 대한 메타데이터이다. 그 역할 중 가장 강력한 부분은 컴파일러를 위한 정보를 제공해줌으로써 컴파일 수준에서 에러를 잡아낼 수 있다는 것이다.

JUnit4에서도 JUnit3과 달리 `@Test`라는 애너테이션을 통해서 테스트 메서드가 맞는지 명확히 표시할 수 있다.

---

## Marker Annotation

```java
import java.lang.annotation.*;

/**
 * Indicates that the annotated method is a test method.
 * Use only on parameterless static methods.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Test {
}
```
### @Retention` 과 `@Target

`@Retention`과 `@Target`은 에너테이션에 대한 기본정보이며, 메타 에너테이션이라 한다. `@Retention`은 애너테이션의 유지정책에 관한 정보를 포함하며, 적용 코드가 유지되는 기간(생명주기 같은)을 지정한다. `@Target`은 애너테이션의 적용대상을 명시하는 용도로 사용된다. 영향을 끼치는 범위 라는 점에서 스코프와 비슷한 개념이다.

### 마커 애너테이션

위의 애너테이션을 `매개변수 없는 정적 메서드 전용이다`라고 강제하면서 컴파일러가 검증할 수 있도록 하려면 별도의 애너테이셔 처리기를 구현해야 한다. 그냥 저렇게 선언만 해서는 '컴파일러가 인식을 하는 주석' 정도에 지나지 않는다. 이를 "아무 매개변수 없이 단순히 대상에 마킹한다"는 뜻에서 `마커 애너테이션`이라 한다. 이것으로도  `@Test`에 오타를 내거나 메서드 선언 외의 프로그램 요소에 달면 컴파일 오류로 검증이 되는 효과는 있다.

```java
public class Sample {
    @Test
    public static void m1() { } // 성공
    public static void m2() { }	// 무시
    @Test public static void m3() { // 실패
        throw new RuntimeException("Boom");
    }
    public static void m4() { } // 무시
    @Test public void m5() { } // INVALID USE: nonstatic method
    public static void m6() { }
    @Test public static void m7() { // 실패
        throw new RuntimeException("Crash");
    }
    public static void m8() { } // 무시
}
```

```java

import java.lang.reflect.*;

public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Class.forName(args[0]);
        for (Method m : testClass.getDeclaredMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                tests++;
                try {
                    m.invoke(null);
                    passed++;
                } catch (InvocationTargetException wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    System.out.println(m + " failed: " + exc);
                } catch (Exception exc) {
                    System.out.println("Invalid @Test: " + m);
                }
            }
        }
        System.out.printf("Passed: %d, Failed: %d%n",
                passed, tests - passed);
    }
}
```

RunTest를 보면 `if (m.isAnnotationPresent(Test.class)`를 통해서 `@Test` 가 붙어있는 메서드만 가져와서 원하는 기능을 실행할 수 있다. 말 그대로 분류기준, 마커의 역할을 하는 것이다.

테스트 메서드가 예외를 던지면 리플렉션 매커니즘이 InvoationTargetException으로 감싸서 다시 던진다. 따라서 이 예외가 아니라면 `@Test` 자체를 잘못 적용한 것이다.

---

## Annotaion With Parameter

다음은 특정 예외를 던져야만 성공하는 테스트를 지원하는 애너테이션이다.

```java
import java.lang.annotation.*;
/**
 * Indicates that the annotated method is a test method that
 * must throw the designated exception to succeed.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
    Class<? extends Throwable> value();
}
```

`Class<? extends Throwable>`은 'Throwable을 확장한 클래스의 Class 객체'를 으미하므로 모든 예외 타입을 가리킨다.

```java
public class Sample2 {
    @ExceptionTest(ArithmeticException.class)
    public static void m1() {  // Test should pass
        int i = 0;
        i = i / i;
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m2() {  // Should fail (wrong exception)
        int[] a = new int[0];
        int i = a[1];
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m3() { }  // Should fail (no exception)
}
```

```java
import effectivejava.chapter6.item39.markerannotation.Test;
import java.lang.reflect.*;

public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Class.forName(args[0]);
        for (Method m : testClass.getDeclaredMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                tests++;
                try {
                    m.invoke(null);
                    passed++;
                } catch (InvocationTargetException wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    System.out.println(m + " failed: " + exc);
                } catch (Exception exc) {
                    System.out.println("Invalid @Test: " + m);
                }
            }

            if (m.isAnnotationPresent(ExceptionTest.class)) {
                tests++;
                try {
                    m.invoke(null);
                    System.out.printf("Test %s failed: no exception%n", m);
                } catch (InvocationTargetException wrappedEx) {
                    Throwable exc = wrappedEx.getCause();
                    Class<? extends Throwable> excType =
                            m.getAnnotation(ExceptionTest.class).value();
                    if (excType.isInstance(exc)) {
                        passed++;
                    } else {
                        System.out.printf(
                                "Test %s failed: expected %s, got %s%n",
                                m, excType.getName(), exc);
                    }
                } catch (Exception exc) {
                    System.out.println("Invalid @ExceptionTest: " + m);
                }
            }
        }

        System.out.printf("Passed: %d, Failed: %d%n",
                passed, tests - passed);
    }
}
```

이 코드는 애너테이션 매개변수의 값을 추출하여 테스트 메서드가 올바른 예외를 던지는지 확인하는 데 사용한다.

---

## Annotation With Array Parameter

예외를 **여러 개** 명시하고 그 중 하나가 발생하면 성공하게 만들기 위해서는 어떻게 애너테이션을 작성하면 될까? 애너테이션의 매개변수로 배열을 넣을 수도 있다.

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
    Class<? extends Exception>[] value();
}
```

```java
import java.util.*;

public class Sample3 {
    // This variant can process annotations whose parameter is a single element
    @ExceptionTest(ArithmeticException.class)
    public static void m1() {  // Test should pass
        int i = 0;
        i = i / i;
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m2() {  // Should fail (wrong exception)
        int[] a = new int[0];
        int i = a[1];
    }
    @ExceptionTest(ArithmeticException.class)
    public static void m3() { }  // Should fail (no exception)

    // Code containing an annotation with an array parameter
    @ExceptionTest({ IndexOutOfBoundsException.class,
                     NullPointerException.class })
    public static void doublyBad() {   // Should pass
        List<String> list = new ArrayList<>();

        // The spec permits this method to throw either
        // IndexOutOfBoundsException or NullPointerException
        list.addAll(5, null);
    }
}
```

`    @ExceptionTest({ IndexOutOfBoundsException.class, NullPointerException.class })` 이렇게 중괄호로 감싸고 쉼표로 구분하여 여러개의 매개변수를 넣을 수 있다.

```java
import effectivejava.chapter6.item39.markerannotation.Test;

import java.lang.reflect.*;

// Program to process marker annotations and annotations with array parameter
public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Class.forName(args[0]);
        for (Method m : testClass.getDeclaredMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                tests++;
                try {
                    m.invoke(null);
                    passed++;
                } catch (InvocationTargetException wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    System.out.println(m + " failed: " + exc);
                } catch (Exception exc) {
                    System.out.println("Invalid @Test: " + m);
                }
            }

            // Code to process annotations with array parameter
            if (m.isAnnotationPresent(ExceptionTest.class)) {
                tests++;
                try {
                    m.invoke(null);
                    System.out.printf("Test %s failed: no exception%n", m);
                } catch (Throwable wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    int oldPassed = passed;
                    Class<? extends Throwable>[] excTypes =
                            m.getAnnotation(ExceptionTest.class).value();
                    for (Class<? extends Throwable> excType : excTypes) {
                        if (excType.isInstance(exc)) {
                            passed++;
                            break;
                        }
                    }
                    if (passed == oldPassed)
                        System.out.printf("Test %s failed: %s %n", m, exc);
                }
            }
        }
        System.out.printf("Passed: %d, Failed: %d%n",
                passed, tests - passed);
    }
}
```

---

## Repeatable Annotation

```java
import java.lang.annotation.*;

// Repeatable annotation type
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Repeatable(ExceptionTestContainer.class)
public @interface ExceptionTest {
    Class<? extends Throwable> value();
}
```

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Container annotation for the repeatable ExceptionTest annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTestContainer {
    ExceptionTest[] value();
}
```

`getAnnotationByType` 메서드는 이 둘을 구분하지 않아서 반복 가능 애너테이션과 그 컨테이너 애너테이션을 모두 가져오지만, `isAnnotationPresent` 메서드는 둘을 명확히 구분한다.

- `getAnnotationsByType` -> Repeatable을 구분하지 않음
- `isAnnotationPresent` -> Repeatable을 구분함

```java
import java.util.ArrayList;
import java.util.List;

// Program containing repeatable annotations (Page 186)
public class Sample4 {
    @ExceptionTest(ArithmeticException.class)
    public static void m1() {  // Test should pass
        int i = 0;
        i = i / i;
    }

    @ExceptionTest(ArithmeticException.class)
    public static void m2() {  // Should fail (wrong exception)
        int[] a = new int[0];
        int i = a[1];
    }

    @ExceptionTest(ArithmeticException.class)
    public static void m3() { }  // Should fail (no exception)

    // Code containing a repeated annotation (Page 186)
    @ExceptionTest(IndexOutOfBoundsException.class)
    @ExceptionTest(NullPointerException.class)
    public static void doublyBad() {
        List<String> list = new ArrayList<>();

        // The spec permits this staticfactory to throw either
        // IndexOutOfBoundsException or NullPointerException
        list.addAll(5, null);
    }
}
```

## 질문

- 매개변수가 있는 정적 메서드에 애너테이션을 달면 왜 IllegalArgumentException이 발생할까?
  - JUnit의 `@Test`는 `@ParameterizedTest`, `@ValueSource(string = {"", "12"})`로 지원
  - 예시 코드에서는 리플렉션의 invoke에서 해당 예외가 발생함

## 결론

애너테이션을 사용할 수 있는 부분에서 명명 패턴을 사용하지는 말자.

## 출처

- https://github.com/jbloch/effective-java-3e-source-code
- https://docs.oracle.com/javase/tutorial/java/annotations/index.html
- https://www.geeksforgeeks.org/annotations-in-java/
- https://www.baeldung.com/java-custom-annotation
- https://www.baeldung.com/java-reflection-change-annotation-params
- https://www.nextree.co.kr/p5864/
- https://www.oracle.com/technical-resources/articles/java/javareflection.html
