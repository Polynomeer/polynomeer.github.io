# Item 40. Consistently use the Override annotation

자바 라이브러리는 몇가지 애너테이션 타입을 가진다. 전형적인 프로그래머에게 가장 중요한 것들중 하나는 `@Override`이다. 이 애너테이션은 메서드 선언에만 사용할 수 있고, 수퍼타입에서 선언된 것을 오버라이딩하는 메서드 선언을 표시할 때 사용한다. 만약 당신이 이 애너테이션을 일관되게 사용한다면, 거대한 클래스에서 극악의 버그로부터 보호할 수 있을 것이다.

## Override를 의도했지만 Overload되는 경우

다음 프로그램을 고려해보자. Bigram 클래스는 bigram(글자의 순서쌍)을 나타낸다.

```java
// Can you spot the bug? (Page 188)
public class Bigram {
    private final char first;
    private final char second;

    public Bigram(char first, char second) {
        this.first  = first;
        this.second = second;
    }

    public boolean equals(Bigram b) { // overloaded, not overrided
        return b.first == first && b.second == second;
    }

    public int hashCode() {
        return 31 * first + second;
    }

    public static void main(String[] args) {
        Set<Bigram> s = new HashSet<>();
        for (int i = 0; i < 10; i++)
            for (char ch = 'a'; ch <= 'z'; ch++)
                s.add(new Bigram(ch, ch));
        System.out.println(s.size());
    }
}
```

메인 메서드는 반복적으로 26개의 biagram을 set에 더하며, 각 요소는 두 개의 동일한 소문자로 구성된다. 그리고 set의 크기를 출력한다. 아마 26이 출력되기를 기대할 것이다, set은 중복값을 포함할 수 없기 때문이다. 하지만 프로그램을 실행해보면 26이 아니라 260이 출력된다. 무엇이 문제일까?

명백히, Bigram 클래스의 제작자는 equals를 오버라이딩하고 hashCode 까지도 나란히 오버라이딩하는 것까지 기억하고 작성했다. 불행하게도, 제작자는 equals를 오버라이딩하는데 실패했다, 대신에 **오버로딩** 하게 된 것이다. Object.equals를 오버라이딩 하기위해서는 반드시 equals의 타입이 Object여야만 한다. 하지만 Bigram의 equals 메서드 파라미터가 Object가 아니므로, Bigram은 Object의 equals 메서드를 상속하게 된다. 이 equals 메서드는 객체의 동일성을 테스트한다. 마치 == 연산자와 같다. 각 bigram에 대한 10개의 카피는 다른 9개와 서로 구분되어서, Object.equals에 의해 서로 다른 것으로 간주된다.

## @Override로 컴파일러 에러처리

운좋게도, 컴파일러가 이러한 에러를 찾는데 도움을 줄 수 있다. 단, Object.equals를 오버라이딩할 의도일 경우에만 한정해서이다. 이걸 하려면 Bigram.equals에 @Override 애너테이션을 붙이면 된다. 하지만 단순히 붙이면 오버라이딩 할 수 없다는 컴파일러 에러가 발생할 것이다. 기존에는 버그였던 것이 컴파일러 에러로 잡아지는 것이다.

![override-error](/Users/ham/Desktop/Blog/polynomeer.github.io/images/effective-java-item40-2.png)

반면에, 기존의 코드에서는 오버라이딩이 안되고 오버라이딩한 별개의 메서드이므로, IDE에서는 사용되지 않는 메서드라고 인식한다.

![not-overrided](/Users/ham/Desktop/Blog/polynomeer.github.io/images/effective-java-item40-1.png)

## 적절한 @Override 사용

결론은 수퍼 클래스에 정의된 메서드를 오버라이딩 하기를 바란다면 상속하는 클래스의 해당 메서드에 반드시 `@Override`를 붙여주어야 한다.

```java
@Override
public boolean equals(Object o) {
    if (!(o instanceof Bigram2))
      	return false;
    Bigram2 b = (Bigram2) o;
    return b.first == first && b.second == second;
}
```

## 버그와 에러, 예외

- https://stackoverflow.com/questions/4416573/whats-the-difference-between-a-bug-and-an-exception

테스트코드는 버그를 잡을떄 유용하다.
