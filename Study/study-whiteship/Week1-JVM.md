# [Week1] JVM은 무엇이며 자바 코드는 어떻게 실행하는 것인가. 

## JVM이란 무엇인가

자바 프로그래밍 환경은 자바 언어 및 지원 런타임으로 구성된다. 이를 JVM(Java Virtual Machine)이라고도 한다. 즉, JVM은 _자바 프로그램을 실행시키기 위해서 필요한 런타임 환경을 제공해주는 프로그램_이다. 자바 프로그램은 하드웨어 및 OS 플랫폼에서 JVM을 지원해야만 실행 가능하다.

다행히도, JVM은 무수히 많은 환경에서 실행되기 위해서 이미 다 포팅되어 있다. 예를 들면, 셋톱박스, 블루레이 플레이어나 매우 거대한 메인 프레임 까지도 아마도 JVM이 사용가능할 것이다. 그러므로, 우리는 플랫폼은 신경쓰지 않고 **오직 자바 코드만 신경쓰면 되는 것**이다. 바로 JVM이 자바를 **플랫폼에 독립적인 언어**로 만들어 주는 것이다. JVM은 자바로 작성된 프로그램으로 하여금 _Write Once, Run Anywhere_을 가능케 해주는 **구현체**이다.

> **왜 JVM을 알아야 하는가?**
>
> - 같은 기능을 하는 프로그램이더라도 **메모리** 관리에 따라 성능이 좌우될 수 있다.
> - **메모리**가 관리 되지 않은 경우 성능저하 혹은 프로그램이 뻗어버리는 현상 등이 일어날 수 있다.
> - 한정된 **메모리**를 효율적으로 사용하여 최고의 성능을 내기 위함이다.

- JDK 다운로드 링크 : https://www.oracle.com/java/technologies/javase-downloads.html 

## 컴파일 하는 방법

`javac <program name>` 명령으로 .java 확장자를 파일을 컴파일할 수가 있다. 이때 어떤 경로에서든 `javac` 명령을 실행하기 위해서는 각 운영체제에 맞게 환경변수에 추가해주어야 한다.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("This is the Java program");
    }
}
```

위와 같이 간단한 코드를 작성하고 `Hello.java`라는 이름으로 파일을 저장한다. 모든 자바 애플리케이션은 적어도 하나의 클래스가 정의되어 있어야 한다. (`class` 키워드로 정의) 한 가지 중요한 사실은 하나의 자바 파일은 여러 개의 클래스를 가질 수 있지만, **단 하나의 public 클래스만을 가질 수 있으며, 그 클래스 이름과 파일명은 동일해야 한다.**

```sh
$ javac Hello.java
$ ll
-rw-r--r--  1 ham  staff   403B Mar  2 00:16 Hello.class
-rw-r--r--  1 ham  staff   116B Mar  2 00:16 Hello.java
```

자바 컴파일러를 통해 `Hello.java`파일을 컴파일하면 `Hello.class`라는 클래스파일이 만들어진다.

## 실행하는 방법

`java <arguments> <program name>` 로 자바로 작성된 프로그램을 실행할 수 있다. 이때 `java`명령어로 바로 실행할 수 있는 파일은 `.class`파일이다. 위에서 작성한 프로그램을 실행해보면, 정상적으로 프로그램이 실행되는 것을 확인할 수 있다.

```sh
$ java Hello
This is the Java program
```

JVM이 실행하는 파일은 바로  `.class` 파일이라는 점에 유의해야 한다. 그렇다면 하나의 `.java` 파일에 여러개의 클래스가 포함되어 있다면 어떻게 `.class`파일이 생성될까?

### 2개 이상의 클래스를 포함하는 경우

```java
class SampleOne {}

class SampleTwo {}

public class MultipleClasses {
    public static void main(String[] arge) {
        System.out.println("Multiple classes test.");
    }
}
```

```shell
-rw-r--r--  1 ham  staff   446B Mar  2 00:48 MultipleClasses.class
-rw-r--r--  1 ham  staff   180B Mar  2 00:48 MultipleClasses.java
-rw-r--r--  1 ham  staff   198B Mar  2 00:48 SampleOne.class
-rw-r--r--  1 ham  staff   198B Mar  2 00:48 SampleTwo.class
```

### 서브 클래스를 포함하는 경우

```java
public class SubClasses {
    class SubClassOne {}

    class SubClassTwo {}
    
    public static void main(String[] args) {
        System.out.println("Subclasses test.");
    }
}
```

```shell
-rw-r--r--  1 ham  staff   351B Mar  2 00:52 SubClasses$SubClassOne.class
-rw-r--r--  1 ham  staff   351B Mar  2 00:52 SubClasses$SubClassTwo.class
-rw-r--r--  1 ham  staff   579B Mar  2 00:52 SubClasses.class
-rw-r--r--  1 ham  staff   193B Mar  2 00:52 SubClasses.java
```

이외에도 여러가지 경우에 따라서 형태는 다르지만 클래스 키워드 하나 당 하나의 `.class`파일이 생성되는 것은 같다.

## 바이트코드란 무엇인가





## JIT 컴파일러란 무엇이며 어떻게 동작하는지

## JVM 구성 요소

## JDK와 JRE의 차이





## References

- https://www.geeksforgeeks.org/java-class-file/
- 