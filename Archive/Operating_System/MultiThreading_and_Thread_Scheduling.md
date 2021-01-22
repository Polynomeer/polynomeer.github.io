# MultiThreading and Thread Scheduling

> 멀티스레드는 프로세스 내 작업을 여러 개의 스레드로 분할함으로써 작업의 부담을 줄이는 프로세스 운영 기법이다.

- 멀티스레드 (by OS) : 운영체제가  소프트웨어적으로 프로세스를 작은 단위의 스레드로 분할하려 운영하는 기법
- CPU 멀티스레드 : 하드웨어적인 방법으로 하나의 CPU에서 여러 스레드를 동시에 처리하는 병렬 처리 기법



## Thread Scheduling in Java

이상적인 세계에서 모든 프로그램 스레드는 실행할 자체 프로세서를 갖습니다. 컴퓨터에 수천 또는 수백만 개의 프로세서가있을 때까지 스레드는 종종 하나 이상의 프로세서를 공유해야합니다. JVM 또는 기본 플랫폼의 운영 체제는 스레드간에 프로세서 리소스를 공유하는 방법을 해독합니다 .이를 *스레드 스케줄링이라고* 합니다. 스레드 스케줄링을 수행하는 JVM 또는 운영 체제의 해당 부분이 *스레드 스케줄러* 입니다.

[ [또한 InfoWorld : JDK 16 : Java 16의 새로운 기능](https://www.infoworld.com/article/3569150/jdk-16-the-new-features-in-java-16.html) ]

**참고 :** 스레드 스케줄링 논의를 단순화하기 위해 단일 프로세서 컨텍스트에서 스레드 스케줄링에 중점을 둡니다. 이 논의를 여러 프로세서로 추정 할 수 있습니다. 나는 그 일을 당신에게 맡깁니다.

스레드 스케줄링에 대한 두 가지 중요한 사항을 기억하십시오.

1. Java는 VM이 특정 방식으로 스레드를 스케줄하거나 스레드 스케줄러를 포함하도록 강제하지 않습니다. 이는 플랫폼에 따른 스레드 스케줄링을 의미합니다. 따라서 스레드가 예약되는 방식에 따라 동작이 달라지고 여러 플랫폼에서 일관되게 작동해야하는 Java 프로그램을 작성할 때주의를 기울여야합니다.
2. 다행히도 Java 프로그램을 작성할 때 프로그램의 스레드 중 하나 이상이 프로세서를 오랫동안 많이 사용하고 해당 스레드 실행의 중간 결과가 중요 할 때만 Java가 스레드를 예약하는 방법에 대해 생각해야합니다. 예를 들어, 애플릿에는 이미지를 동적으로 생성하는 스레드가 포함되어 있습니다. 주기적으로 페인팅 스레드가 해당 이미지의 현재 내용을 그려서 사용자가 이미지가 어떻게 진행되는지 볼 수 있도록합니다. 계산 스레드가 프로세서를 독점하지 않도록하려면 스레드 스케줄링을 고려하십시오.

두 개의 프로세서 집약적 스레드를 생성하는 프로그램을 살펴보십시오.

```java
// SchedDemo.java
class SchedDemo {
    public static void main(String[] args) {
        new CalcThread("CalcThread A").start();
        new CalcThread("CalcThread B").start();
    }
}

class CalcThread extends Thread {
    CalcThread(String name) {
        // Pass name to Thread layer.
        super(name);
    }

    double calcPI() {
        boolean negative = true;
        double pi = 0.0;
        for (int i = 3; i < 100000; i += 2) {
            if (negative)
                pi -= (1.0 / i);
            else
                pi += (1.0 / i);
            negative = !negative;
        }
        pi += 1.0;
        pi *= 4.0;
        return pi;
    }

    public void run() {
        for (int i = 0; i < 5; i++)
            System.out.println(getName() + ": " + calcPI());
    }
}
```



```java
CalcThread A: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread B: 3.1415726535897894
```

위의 출력에 따르면 스레드 스케줄러는 두 스레드간에 프로세서를 공유합니다. 그러나 다음과 유사한 출력을 볼 수 있습니다.

```java
CalcThread A: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread A: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread B: 3.1415726535897894
CalcThread B: 3.1415726535897894
```

위의 출력은 한 스레드를 다른 스레드보다 선호하는 스레드 스케줄러를 보여줍니다. 위의 두 출력은 스레드 스케줄러의 두 가지 일반 범주 인 녹색 및 기본을 보여줍니다. 다음 섹션에서 그들의 행동 차이를 살펴볼 것입니다. 각 범주를 설명하는 동안 *스레드 상태를 언급하며* 그중 네 가지가 있습니다.

1. **초기 상태 :** 프로그램이 스레드의 스레드 개체를 만들었지 만 스레드 개체의 `start()`메서드가 아직 호출되지 않았기 때문에 스레드가 아직 존재하지 않습니다 .
2. **실행 가능 상태 :** 스레드의 기본 상태입니다. 에 대한 호출이 `start()`완료되면 스레드가 실행 중인지 여부, 즉 프로세서를 사용하여 스레드가 실행 가능해집니다. 많은 스레드를 실행할 수 있지만 현재 하나만 실행됩니다. 스레드 스케줄러는 프로세서에 할당 할 실행 가능한 스레드를 결정합니다.
3. **차단 상태 :** 스레드가 실행되면 `sleep()`, `wait()`또는 `join()`스레드의 시도가 네트워크에서 아직 제공되지 않은 데이터를 판독 할 때, 방법, 및 스레드가 대기 로크를 획득하는 경우, 그 스레드가 차단 상태가된다 : 그것은 둘 실행되지 않으며 실행할 위치에 있습니다. (스레드가 어떤 일이 일어나기를 기다리는 다른 시간을 생각할 수 있습니다.) 차단 된 스레드가 차단 해제되면 해당 스레드는 실행 가능 상태로 이동합니다.
4. **종료 상태 :** 실행이 스레드의 `run()`메서드를 벗어나면 해당 스레드는 종료 상태에 있습니다. 즉, 스레드가 더 이상 존재하지 않습니다.

스레드 스케줄러는 실행할 실행 가능한 스레드를 어떻게 선택합니까? 나는 녹색 스레드 스케줄링을 논의하면서 그 질문에 대답하기 시작합니다. 네이티브 스레드 스케줄링을 논의하면서 답변을 마칩니다.



### References

- Multithreading
  - https://en.wikipedia.org/wiki/Multithreading_(computer_architecture)#:~:text=In%20computer%20architecture%2C%20multithreading%20is,This%20approach%20differs%20from%20multiprocessing.
  - https://www.iitk.ac.in/esc101/05Aug/tutorial/essential/threads/priority.html
  - https://www.tutorialspoint.com/operating_system/os_multi_threading.htm
  - https://m.blog.naver.com/PostView.nhn?blogId=qbxlvnf11&logNo=220837131449&proxyReferer=https:%2F%2Fwww.google.com%2F
  - https://www.perforce.com/blog/qac/multithreading-parallel-programming-c-cpp
  - https://runebook.dev/ko/docs/node/child_process#child_process_child_process_execfilesync_file_args_options
  - https://ko.wikipedia.org/wiki/%EC%8A%A4%EB%A0%88%EB%93%9C_(%EC%BB%B4%ED%93%A8%ED%8C%85)
  - https://3dmpengines.tistory.com/2003
  - https://byeongmoo.tistory.com/2
- Thead Scheduling in Java
  - https://www.iitk.ac.in/esc101/05Aug/tutorial/essential/threads/priority.html#:~:text=Execution%20of%20multiple%20threads%20on,algorithm%20called%20fixed%2Dpriority%20scheduling.&text=If%20two%20threads%20of%20the,one%20of%20them%20to%20run
  - http://www.qnx.com/developers/docs/qnxcar2/index.jsp?topic=%2Fcom.qnx.doc.neutrino.sys_arch%2Ftopic%2Fkernel_SCHEDULING.html
  - https://www.geeksforgeeks.org/thread-scheduling/
  - https://www.infoworld.com/article/2071214/java-101--understanding-java-threads--part-3--thread-scheduling-and-wait-notify.html
  - https://www.javatpoint.com/thread-scheduler-in-java
