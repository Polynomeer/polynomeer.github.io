# 냄새 5. 전역 데이터

상수의 경우에는 값이 변경되는 부분이 없기 때문에(참조만 되기 때문에) 문제가 되지 않는다. 반면에 전역적으로 읽기 및 쓰기가 가능한 데이터는 어디에서든 변경될 수 있다는 문제가 있다. 이를 해결하기 위해서 변수를 캡슐화하는 등의 방법으로 접근제어를 할 수 있다. 가급적이면 전역변수의 사용을 피하는 것이 바람직하다.

## 리팩토링 17. 변수 캡슐화하기

변수를 직접 사용하는 부분이 있다면 메소드로 감싸주면 구조변경에 훨씬 유리하다. 불변 데이터(Immutable Data)는 변수 캡슐화하기 같은 내용을 고민할 필요는 없다.
