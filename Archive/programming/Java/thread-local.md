# Thread Local

## What is ThreadLocal?

ThreadLocal은 JDK 1.2 부터 제공된 클래스이며, 이를 활용하면 스레드 단위로 로컬 변수를 사용할 수 있다. 즉, 일반적인 로컬 변수의 수명은 특정 코드 블록의 범위에 한정하여 유효하지만, **ThreadLocal은 특정 스레드가 실행하는 모든 코드에서 사용 가능하다.** ThreadLocal은 내부적으로 스레드 정보를 key로 하여 값을 저장해두는 Map 구조를 가지고 있다.

## ThreadLocal API

TheadLocal construct는 특정 스레드 에서만 액세스할 수 있는 데이터를 저장할 수 있도록 해준다. 특정 스레드에 묶여서 Integer 값을 사용하고 싶다고 가정해 보면, 다음과 같이 선언해볼 수 있다.

```java
ThreadLocal<Integer> threadLocalValue = new ThreadLocal<>();
```

다음으로 해당 스레드에서 이 값을 사용하려면 `get()` 또는 `set()` 메서드만 호출하면 된다. 다시 말해, ThreadLocal이 스레드를 키로 사용하여 맵 내부에 데이터를 저장 한다고 상상할 수 있다.

결과적으로 `threadLocalValue`에서 `get()` 메서드를 호출하면 요청 스레드에 대한 Integer 값을 얻게 된다.

```java
threadLocalValue.set(1);
Integer result = threadLocalValue.get();
```

`withInitial()` 정적 메서드를 사용하면서 Supplier를 전달하여 ThreadLocal의 인스턴스를 생성할 수 있다.

```java
ThreadLocal<Integer> threadLocal = ThreadLocal.withInitial(() -> 1);
```

ThreadLocal로부터 값을 제거하려면 `remove()` 메서드를 호출하면 된다.

```java
threadLocal.remove();
```

## Storing User Data in a Map

주어진 사용자 ID별로 사용자 별 컨텍스트 데이터를 저장해야 하는 프로그램을 고려해보자.

```java
public class Context {
    private String userName;

    public Context(String userName) {
        this.userName = userName;
    }
}
```

우리는 사용자 ID당 하나의 스레드를 원한다. 우선, Runnable 인터페이스를 구현하는 SharedMapWithUserContext 클래스를 생성한다. `run()` 메서드의 구현은 주어진 userId 에 대한 Context 객체를 반환하는 UserRepository 클래스를 통해 일부 데이터베이스를 호출한다.

다음으로 userId로 키가 지정된 ConcurentHashMap에 해당 컨텍스트를 저장한다.

```java
public class SharedMapWithUserContext implements Runnable {
 
    public static Map<Integer, Context> userContextPerUserId
      = new ConcurrentHashMap<>();
    private Integer userId;
    private UserRepository userRepository = new UserRepository();

    @Override
    public void run() {
        String userName = userRepository.getUserNameForUserId(userId);
        userContextPerUserId.put(userId, new Context(userName));
    }

    // standard constructor
}
```

두 개의 서로 다른 userId에 대해 두 개의 스레드를 생성 및 시작하고 userContextPerUserId 맵에 두 개의 항목이 있다고 assert하여 코드를 쉽게 테스트할 수 있다.

```java
SharedMapWithUserContext firstUser = new SharedMapWithUserContext(1);
SharedMapWithUserContext secondUser = new SharedMapWithUserContext(2);
new Thread(firstUser).start();
new Thread(secondUser).start();

assertEquals(SharedMapWithUserContext.userContextPerUserId.size(), 2);
```

## Storing User Data in ThreadLocal

ThreadLocal을 사용하여 사용자 컨텍스트 인스턴스를 저장하도록 예제를 다시 작성할 수 있다. 각 스레드에는 자체 ThreadLocal 인스턴스가 있다.

ThreadLocal을 사용할 때 모든 ThreadLocal 인스턴스가 특정 스레드와 연결되기 때문에 매우 주의해야 한다. 이 예제에서는 각 특정 userId에 대한 전용 스레드가 있으며 이 스레드는 우리가 생성하므로 전체 제어 권한이 있다.

`run()` 메서드는 사용자 컨텍스트를 가져오고 `set()` 메서드를 사용하여 ThreadLocal 변수에 저장한다.

```java
public class ThreadLocalWithUserContext implements Runnable {
 
    private static ThreadLocal<Context> userContext = new ThreadLocal<>();
    private Integer userId;
    private UserRepository userRepository = new UserRepository();

    @Override
    public void run() {
        String userName = userRepository.getUserNameForUserId(userId);
        userContext.set(new Context(userName));
        System.out.println("thread context for given userId: " 
          + userId + " is: " + userContext.get());
    }
    
    // standard constructor
}
```

주어진 userId에 대한 작업을 실행할 두 개의 스레드를 시작하여 테스트할 수 있다.

```java
ThreadLocalWithUserContext firstUser = new ThreadLocalWithUserContext(1);
ThreadLocalWithUserContext secondUser = new ThreadLocalWithUserContext(2);
new Thread(firstUser).start();
new Thread(secondUser).start();
```

이 코드를 실행한 후 표준 출력에서 ​​지정된 스레드별로 ThreadLocal이 설정되었음을 확인할 수 있다.

```
thread context for given userId: 2 is: Context{userNameSecret='ee2f47d9-63ad-4d4a-b35f-0b45ff88e8c6'}
thread context for given userId: 1 is: Context{userNameSecret='302e7ac0-1804-41ac-bf91-635c9c453ded'}
```

각 사용자가 고유한 Context를 가지고 있음을 알 수 있다 .

## ThreadLocals and Thread Pools

ThreadLocal은 사용하기 쉬운 API를 제공하여 일부 값을 각 스레드에 제한한다. 이것은 Java에서 [thread-safety](https://www.baeldung.com/java-thread-safety)를 달성하는 합리적인 방법이다. 그러나 ThreadLocal 과 Thread Pool을 함께 사용할 때는 각별히 주의해야 한다.

이 위험성을 잘 이해하기 위해 다음 시나리오를 고려해보자.

    1. 먼저, 애플리케이션이 풀에서부터 스레드를 빌린다.
    2. 그런 다음, 일부 스레드에 한정된 값을 현재 스레드의 ThreadLocal에 저장 한다.
    3. 일단 실행이 완료되면 애플리케이션은 빌린 스레드를 풀에 반환한다.
    4. 잠시 후, 애플리케이션은 다른 요청을 처리하기 위해 동일한 스레드를 빌린다.
    5. 애플리케이션이 마지막에 필수적인 정리를 수행하지 않았기 때문에, 새 요청에 대해 동일한 ThreadLocal 데이터를 재사용할 수 있게 된다.

이는 동시성이 높은 애플리케이션에서 정말로 예상못한 결과를 초래할 수 있다.

이 문제를 해결하는 한 가지 방법은 사용이 끝나면 각 ThreadLocal을 수동으로 제거하는 것이다. 하지만 이 접근 방식은 엄격한 코드 검토가 필요하기 때문에 오류가 발생하기 쉽다.

### Extending the ThreadPoolExecutor

결론부터 말하자면, ThreadPoolExecutor 클래스를 확장하고 `beforeExecute()` 및 `afterExecute()` 메서드에 대한 사용자 정의 후크 구현을 제공하는 것이 가능하다. 스레드 풀은 빌린 스레드를 사용하여 무엇이든 실행하기 전에 `beforeExecute()` 메서드를 호출한다. 반면에, 로직을 실행한 후에는 `afterExecute()` 메서드를 호출한다.

따라서 ThreadPoolExecutor 클래스를 확장하고 `afterExecute()` 메서드에서 ThreadLocal 데이터를 제거할 수 있다.

```java
public class ThreadLocalAwareThreadPool extends ThreadPoolExecutor {

    @Override
    protected void afterExecute(Runnable r, Throwable t) {
        // Call remove on each ThreadLocal
    }
}
```

이 ExecutorService 구현에 요청을 제출하면 ThreadLocal 및 스레드 풀을 사용해도 애플리케이션에 안전성의 위험이 발생하지 않는다는 것을 확신할 수 있다.

## Conclusion

위 내용을 통해 ThreadLocal 간단한 동작원리에 대해 알아보았다. 특정 userId와 연결된 컨텍스트를 저장하기 위해 스레드 간에 공유된 ConcurrentHashMap을 사용하는 로직을 구현했다. 그리고 ThreadLocal을 활용하여 특정 사용자 ID 및 특정 스레드와 관련된 데이터를 저장하도록 예제를 다시 작성 해보았다.

웹 환경에서는 ThreadLocal을 활용하면 자연스럽게 처리할 수 있는 부분이 많다. ThreadLocal은 한 스레드에서 실행되는 코드가 동일한 객체를 사용할 수 있도록 지원해주기 때문에 주로 thread-safety가 중요한 부분에서 파라미터를 사용하지 않고 객체를 전파하기 위한 용도로 사용된다. 주의할 점은 톰캣에서는 기본적으로 ThreadLocal을 자동으로 정리해주지 않기 때문에 수동으로 정리하는 코드를 넣어야한다.

- Spring Security에서 ThreadLocal을 활용하여 사용자 인증 정보를 전파할 때 사용헌다. (SpringContextHolder를 구성하는 전략 중 하나)
- 트랜잭션 매니저는 트랜잭션 컨텍스트를 전파하는 데 ThreadLocal을 사용한다.
- thread-safety가 중요한 데이터를 각 스레드 별로 보관할 때 사용한다.

앞서 말했듯이, 스레드 풀 환경에서 ThreadLocal을 (스프링이 지원하는 클래스를 통하지 않고) 직접 사용하는 경우 ThreadLocal 변수에 저장된 데이터의 사용이 끝나면 반드시 `remove()`를 통해 수동으로 제거하거나, `afterExecute()`를 통해서 제거해 주어야 한다. 그렇지 않을 경우, 해당 스레드가 재사용될 때 남아있던 값에 의해 올바르지 않은 결과를 초래할 수 있다.

## References

### ThreadLocal

- https://docs.oracle.com/javase/7/docs/api/java/lang/ThreadLocal.html
- https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html
- https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-concurrency-advanced/src/main/java/com/baeldung/threadlocal
- https://www.baeldung.com/java-threadlocal
- https://www.baeldung.com/thread-pool-java-and-guava
- https://www.digitalocean.com/community/tutorials/java-threadlocal-example

### ThreadLocal in Spring

- https://docs.spring.io/spring-framework/docs/3.2.4.RELEASE_to_4.0.0.M3/Spring%20Framework%203.2.4.RELEASE/org/springframework/web/context/request/RequestContextHolder.html
- https://hwannny.tistory.com/95
- https://velog.io/@dbsrud11/SpringBoot-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EC%93%B0%EB%A0%88%EB%93%9C-%EB%A1%9C%EC%BB%AC-ThreadLocal-2
- https://javacan.tistory.com/entry/ThreadLocalUsage
- https://madplay.github.io/post/java-threadlocal
- http://www.enmalvi.com/2021/06/24/springsecurity-inheritablethreadlocal/
- https://dzone.com/articles/an-alternative-approach-to-threadlocal-using-sprin-1
- https://medium.com/@avocadi/what-is-threadlocal-and-test-with-spring-f3d04b7c3844
- https://honeyinfo7.tistory.com/323
- https://stackoverflow.com/questions/57917370/thread-local-behaviour-in-spring-boot
- https://narusas.github.io/2019/07/17/Spring-Transaction-Note.html

### ThreadLocal and Spring Security

- https://stackoverflow.com/questions/45725888/why-does-spring-security-store-securitycontext-in-thread-local-variable
- https://docs.spring.io/spring-security/site/docs/3.0.x/reference/technical-overview.html
- https://aaronryu.github.io/2021/03/14/thread-and-security-context-holder-mode/
- https://binux.tistory.com/152
- https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/context/ThreadLocalSecurityContextHolderStrategy.java
- https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/context/SecurityContextHolder.java
