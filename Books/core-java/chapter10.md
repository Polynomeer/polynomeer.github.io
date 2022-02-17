# 10장 병행 프로그래밍

자바는 병행 프로그래밍을 자체적으로 지원하는 초창기 프로그래밍 언어였다. 초기에 자바 프로그래머는 백그라운드 스레드에서 이미지를 로드하거나 여러 요청을 동시에 처리하는 웹 서버를 구현하는데 열정을 쏟았다. 당시에는 일부 태스크가 네트워크에서 대기하는 동안 프로세서가 바쁘게 작동하도록 만드는데 초점을 맞추었다. 요즘에는 대부분의 컴퓨터가 멀티 프로세서 또는 코어를 갖추고 있어 프로그래머는 모든 프로세서를 바쁘게 작동하도록 만드는데 신경을 쓴다. (멀티스레딩)

## 10.1 병행 태스크

병행(동시 실행) 프로그램을 설계할 때는 같이 실행할 수 있는 태스크들을 생각해야한다.

### 10.1.1 태스크 실행

자바에서 Runnable 인터페이스는 다른 태스크와 동시에 실행하려는 태스크 단위를 나타낸다. 모든 메서드가 그렇듯이 run 메서드는 스레드 안에서 실행된다. 스레드는 일련의 명령어를 실행하는 메커니즘으로, 일반적으로 운영체제가 제공한다. 별도의 프로세서 또는 같은 프로세서의 서로 다은 타임 슬라이스를 이용해 여러 스레드를 동시에 실행한다.

별도의 스레드에서 Runnable을 실행하려면 해당 Runnable을 실행한 스레드를 만들면 된다. 하지만 실무에서 태스크와 스레드를 일대일로 만드는 것은 바람직하지 않다. 예를 들어, 짧은 시간 실행되는 태스크일 때는 스레드를 시작하는 데 드는 시간을 낭비하지 말고, 같은 스레드에서 다수를 실행하는 것이 좋다. 그리고 강도 높은 계산을 수행하는 태스크일 때는 태스크별로 스레드를 사용하는 대신, 프로세서별로 스레드를 하나씩 사용해 스레드 사이에서 전환하는 오버헤드를 피하면 좋다. 태스크를 설계할 때는 그냥 태스크와 태스크 스케줄링을 분리하는 것이 좋다.

ExecutorService 는 태스크를 스케줄링하고 해당 태스크를 수행할 스레드를 선택해 실행한다.
Executors 클래스에는 스케줄링 정책이 서로 다른 실행자 서비스를 만드는 팩토리 메서드가 있다.
Executors::newCachedThreadPool - 수명이 짧거나 대부분의 시간을 대기하며 보내는 태스크를 다수 포함하는 프로그램에 최적화된 실행자 서비스를 돌려준다.
Executors::newFixedThreadPool - 고정 개수 스레드풀을 돌려준다. 태스크를 제출하면 해당 태스크는 스레드를 이용할 수 있을 때까지 큐에 머문다.
고정 개수 스레드 풀은 계산 집약적인 태스크에 사용하거나 서비스의 리소스 소비를 제한하는 데 적합하다.

```java
public class RunnableDemo {
    public static void main(String[] args) {
        Runnable hellos = () -> {
            for (int i = 1; i <= 1000; i++) 
                System.out.println("Hello " + i);
        };
        Runnable goodbyes = () -> {
            for (int i = 1; i <= 1000; i++) 
                System.out.println("Goodbye " + i);
        };
        
        ExecutorService executor = Executors.newCachedThreadPool();
        executor.execute(hellos);        
        executor.execute(goodbyes);
        executor.shutdown();
    }
}
```
출력이 어떤식으로 섞이는지 확인해보면 매번 다름을 확인할 수 있다.

```note
마지막 출력 후에 아주 잠깐 대기하는데, 이는 스레드 풀에 속한 스레드가 잠시 유휴 상태에 있어 ExecutorService가 이를 종료할 때 종료되기 때문이다.
```

```warning
병행 태스크들이 공유값을 읽거나 수정하면 그 결과를 예측할 수 없다. 즉, 동시성 문제가 발생하기 때문에 별도의 제어가 필요하다.
```

### 10.1.2 Future

Runnable은 태스크를 수행하지만 값은 내지 않는다. 결과를 계산하는 태스크가 있다면 `Callable<V>` 인터페이스를 사용하자.
`Callable<V>`의 call 메서드는 Runnable의 run 메서드와 달리 V 타입 값을 반환한다.

```java
public interface Callable<V> {
    V call() throws Exception;
}
```

call 메서드는 결과를 얻는 코드에 넘길 수 있는 임의의 예외를 던질 수 있다. Callable을 실행하려면 ExecutorService에 전달하면 된다.

```java
ExecutorService executor = Executors.newFixedThreadPool();
Callable<V> task = ...;
Future<V> result = executor.submit(task);
```

태스크를 제출하면 Future를 얻는다. 

- Future : 미래의 어느 시점에 결과가 나오는지 계산을 표현하는 객체
    - V get() throws InterruptedExeption, ExecutionExeption
    - V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutExeption
    - boolean cancel(boolean mayInterruptIfRunning)
    - boolean isCancelled()
    - boolean isDone()

get 메서드는 결과가 나오거나 타임아웃에 이를 때까지 블록한다. 즉, get 메서드를 호출한 스레드는 메서드가 정상적으로 반환하거나 예외를 던질 때까지 일을 진행하지 않는다. call 메서드에서 값을 돌려주면 get 메서드는 해당 값을 반환한다. call 메서드에서 예외를 던지면 get 메서드는 해당 예외를 감싼 ExecutionException을 던진다. 타임아웃에 이르면 get 메서드는 ExecutionException을 던진다.

cancel 메서드는 태스크 취소를 시도한다. 태스크가 이미 실행 중인 상태가 아니면 해당 태스크는 스케줄링 되지 않는다. 태스크가 이미 실행 중이고 mayInterruptIfRunning이 true면 해당 태스크를 실행하는 스레드가 인터럽드된다.

```note
태스크를 인터럽트할 수 있게 하려면 해당 태스크에서 인터럽션 요청을 주기적으로 확인해야 한다. 서브태스크 일부가 성공했을 때 취소할 태스크라면 이렇게 해야 한다.
```

태스크가 여러 서브태스크의 결과를 기다려야 할 수도 있다. 각 서브태스크를 별도로 제출하지 말고, Callable 인스턴스의 Collection을 인수로 전달해 invokeAll 메서드를 호출하면 된다.

---

## 10.2 비동기 계산

병행 계산을 다룰 때 태스크를 나누고 모두 완료될 때까지 대기하는 방법이 항상 좋은 방법은 아니다. 때로는 대기 없는 계산, 즉 비동기 계산을 구현하는 것이 필요하다.

### 10.2.1 Completable Future

Future 객체에서 값을 얻으려면 get 메서드를 호출하고 값이 나올 때까지 블록된 채로 있어야 한다. Future 인터페이스를 구현한 CompletableFuture 클래스는 결과를 얻는 두 번째 메커니즘을 제공한다. 이 메커니즘을 이용하려면 결과가 나왔을 때 (어떤 스레드에서) 해당 결과와 함께 호출될 콜백을 등록해야 한다.

```java
CompletableFuture<String> f = ...;
f.thenAccept((String s) -> 결과 s를 처리한다);
```

이 방법으로 블로킹 없이 결과가 나오는 즉시 처리할 수 있다.

#### CompletableFuture 객체를 반환하는 API
- HttpClient 클래스는 웹 페이지를 비동기로 가져올 수 있다.
