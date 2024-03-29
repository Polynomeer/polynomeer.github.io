# Exception

## 예외란

Exception, RuntimeExeption, ...

### 롤 플레잉 시나리오

엄마가 심부름을 시켰다. 두부가 없어서 두부의 대체품이 있는지 엄마에게 전화를 한다. 그런데 전화를 안 받는다. 이런 것들은 예상치 못한 상황이라 예외라고 볼 수 있다. 반면에, 가게에 문이 열리지 않거나, 두부가 없거나, 유통기한이 지난것과 같이 충분히 예상 가능한 상황은 예외로 보기 힘들다.

### 예외란

마찬가지로 일반 유저가 아이디와 패스워드를 틀리는 상황은 충분히 예상 가능하고 빈번한 시나리오라서 예외로 보기 힘들다. 하지만 토큰 기반의 인증을 하는 API에 대해서 무단으로 토큰을 주입해서 API를 날릴때는 문제가 있다면 예외라고 볼 수 있다. 즉, 유저가 프론트엔드에서 설계된 플로우를 정확히 타면서 그 플로우 안에서 핸들될 수 있는 에러를 범했을때는 충분히 예상되는 상황이지만, 억지로 값을 변조해서 서버에 값을 날리고 비정상적인 접근을 시도하는 등 프론트엔드에서 예상못한 시나리오는 대개 예외로 볼 수 있다. 이런 상황은 보안에 문제가 될 수 있기 때문에 예외 핸들링을 통해서 기록을 남기고 모니터링 하는것이 중요하다.

## 예외 설계

```java
public class MotherNotAnswerException extends RuntimeException {
    public MotherNotAnswerException() {
        super();
    }

    public MotherNotAnswerException(String message) {
        super(message);
    }

    public MotherNotAnswerException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
```

예외에 대한 정보만 압축해서 최대한 간결하게 설계하는 것이 좋다.

Throwable 파라미터를 넣어주어야 Root cause를 추적하는데에 유리하다.

## 예외 설계

![증류탑](../../../images/증류탑.png)

### Status Code 와의 매핑을 고려해보자

```java
```

### 마무리

- 로직상 설계된 "분기 처리"에 대해 예외를 사용하지 말자.
- 예외의 증류탑을 만든다.
    - 모든 예외에 대해 항상 1대1 대응되는 예외 핸들러가 있을 필요는 없다.
- 상태 코드와의 매핑을 고민하라.
- 적절한 수준의 정보 공개를 고민해라.
    - e.printStackTrace() 금지 -> 냉정하게 로직이 잘못된거지 런타임상에서 잘못되어서 실시간으로 고쳐야할 경우는 거의 없다.
    - 에러 메시지, 상태 코드(에러 코드)

Q) 예외에 따라 다른 페이지로 리다이렉트하고 싶다면 어떻게 하는가?
A) BaseException에 path같은 필드를 두고 BaseException을 상속하는 예외 객체를 둔다. 그리고 각각 다른 path를 가지도록 해서 getPath같은 메서드로 접근할 수 있도록 한다. 그리고 핸들러에서 해당 path에 따라 튕겨주면 된다.

Q) 같은 예외가 발생해도 상황에 따라 처리하는 방식이 다르다면 그 예외를 상속하는 두개의 예외로 나누는게 좋은지?
A) 그렇다. 핸들러에서의 차이가 발생한다면 계층을 다르게 나누는게 좋을 것 이다.

Q) SPA와 협업할때 status만 보내주고..
A) 그렇다. 실제로 리다이렉션 패스만 보내주기도 한다.

Q) JPA에서 제공하는 EntityNotFoundException을 사용해도 괜찮은가?
A) 애플리케이션 상의 예외라면 그냥 상태코드 404에 매핑되는 커스텀 예외를 만들어 사용하는게 낫다.

Q) Exception throw를 하지않고 if문을 남발하는것은 어떤가?
A) if문이 많다는것은 객체에게 충분한 역할을 위임하지 않았을수도 있다는 뜻이다. if문으로 플로우 처리를 하지말고 동작에 대한 추상화를 해서 개별적으로 객체들이 실제 구현된 동작을 다르게 가져가는게 좋다. 예를들어, Person이라는 클래스가 있고 직업에 따라 분기 처리를 하고 하는 일을 String으로 내리는 메서드가 있다고 하자. 그러면 if(Person == TEACHER) ... 이렇게 반복될텐데, 차라리 Person이 수행할 동작을 인터페이스에 정의한다음, Programmer, Teacher등이 구현하게 하여 getJob()이라는 메서드를 호출하는 것 만으로도 if문으로 분기하는 것을 대체할 수 있다. (다형성, 리팩터링)

Q) 에러코드가 너무 많아지는게 좋은것인지?
A) 에러코드가 충분히 세분화 되어있다면 그렇게 나쁜게 아니라, 오히려 친절한 애플리케이션이라고 생각한다.

Q) Person에 Programmer을 주입할지 Teacher을 주입할지..
A) 디자인 패턴인데, 스태틱 팩토리 메서드 패턴을 사용한다.

Q) DI, AOP, PSA가 이해가 잘 가지않는다.
A) DI는 식물이 될것인가 동물이 될것인가의 예시로 접근해보자. 식물은 광합성으로 에너지를 얻는다. 동물은 외부로부터 음식을 섭취해야 에너지를 얻는다. 입은 먹는다는 행위를 수행하고 어떤 것을 먹는지는 관여치 않는다. 구체적인 구현에 의존하지 않는다는게 핵심이다. 객체가 의존하고 소모할 대상을 객체가 스스로 결정하는게 아니라 객체 외부의 요인에 따라 결정된다는 개념이 DI와 IoC이다. 기본적으로는 스프링으로 각 컴포넌트를 코딩하지만, 궁극적으로 스프링을 걷어내도 충분히 동작하도록 설계하고 개발해야한다. 따라서 설계하는 서비스나 컴포넌트 등 스프링 빈으로 등록되는 것들이 가급적이면 POJO의 형태여야 한다. 예를 들어, 서비스 객체를 설계하면 @Service나 @Autowire를 모두 떼어내도 충분히 동작하도록 설계해야한다. 그러면 결국 그 객체가 수행해야할 책임은 인스턴스 변수를 관리하고, 그 인스턴스 변수를 사용 또는 의존해서 각 서비스가 갖고 있는 메서드를 활용해서 결과값을 도출할 수 있어야한다. 그것이 POJO의 역할의 끝이다. Something magical happen이 아니라는 것을 항상 기억하자.

Q) 의존성 역전과 제어권 역전이 어떻게 다른가?
A) DI는 SOLID원칙 중에 리스코브 치환 원칙에 위배되지 않는 것 같다?

## Reference

- https://www.youtube.com/watch?v=eGbqT-ozhzs&list=PLV6aucQrjizwA2E_32ypocOva3kBOZUBi&index=3&t=4446s