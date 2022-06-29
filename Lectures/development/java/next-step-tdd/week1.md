# Live Study - Week1

기능목록을 추출한다
TDD로 개발 가능한 부분을 선정한다.
메서드명이 중요한게 아니다. input과 output이 중요하다
클래스가 무엇인지, 메서드 이름이 무엇인지가 당장은 중요한게 아니다.
테스트의 대상이 되는 코드, 즉, 프로덕션 코드가 없으므로 처음에는 무조건 컴파일에러가 발생한다. 이떄 alt + enter를 눌러서 create class를 해서 main에 생성하면 된다. 그리고 메서스도 같은 방식으로 만든다.

String 을 클래스로 포장해보기

Q) 수업과 직접적인 관련이 있는지 모르겠는데, 웹 개발을 할때 레파지토리에서 값을 CRUD하는 등의 부분도 테스트를 작성하는게 맞나요? 1+1=2라는 수준의 부분까지 일일이 테스트를 작성하는게 의미가 있는지 잘 모르겠습니다.
A) 테스트도 비용을 투자하는 것 이므로 기본적인 CRUD를 테스트 하지말자. 핵심 비즈니스 로직에 집중하도록 한다. DB등등 환경설정 하는것도 번거로울 뿐이다. 만약에 쿼리가 복잡한 무언가를 테스트 하는거라면 그것은 TDD가 아니라 인수테스트의 영역이다.

else문을 없애려면 early return을 한다.

들여쓰기 줄이기 -> 1로 줄이기, 메서드를 분리하면 indent를 줄이는게 가능하다. 그리고 분리된 메서드가 한 가지 일만 하는지 확인해본다.

Q) 의미있는 작업 단위마다 커밋을 한다고 알고 있는데, TDD로 개발할때는 보통 어떤식으로 커밋을 하나요? 테스트 메서드 하나 작성 후 커밋 -> 관련 기능 개발 후 커밋을 반복하나요?

A) 기능목록 단위로 하는게 좋다. TDD에서는 테스트 코드와 프로덕션 코드를 같이 커밋하는게 좋다.

Q) 의미있는 작업 단위마다 커밋을 한다고 알고 있는데, TDD로 개발할때는 보통 어떤식으로 커밋을 하나요? 테스트 메서드 하나 작성 후 커밋 -> 관련 기능 개발 후 커밋을 반복하나요?

A) private 메서드는 기본적으로 테스트하지 않는다. 테스트 헤야한다면 설계를 달리해야할 힌트일 수 있다.

Is ~ else를 사용하면 로컬변수를 사용하게 되고 로컬변수의 사용하는 부분을 쭈욱 따라가야한다. 로컬변수가 길게 퍼져있게 되면 버그가 발생할 확률도 높아지고, 디버깅도 어려워진다. 이를 방지하려면 early return으로 else문을 줄일 수 있다.

리팩토링할떄는 테스트 전체를 돌리는게 좋다.

Q) toInts()와 sum()에서 for 문이 각각 한번씩 사용되는데, 주어진 문자열이 구분이 셀 수 없이 많아질 경우 for 문에 의한 성능 문제는 어떻게 해결하면 좋을까요?

A) 실제로 웹 애플리케이션에서는 페이지네이션 적용 등으로 인해 실제 메모리 상에서 다루는 데이터는 100개 안팎이다. 그래서 성능에 너무 집착할 필요는 없다. 만약에 성능이 정말 중요하고 민감한 부분에 있다면 우선은 DB 쿼리튜닝이나 인덱스에서 성능을 잡고, 그래도 안된다면 그 때 다시 리팩토링으로 돌려놓으면 된다.

추상화 레벨을 높이고(메서드 분리를 많이하고), public에서 작성된 코드는 최소한으로 되어야 한다. private 메서드가 많아지는 것에 대해서 거부감을 가지지마라. 이 다음의 단계로는 클래스 분리에 대한 거부감을 줄이도록 한다.

Q) private  메소드의 순서가 중요한가요?
A) 가능한한 메서드를 호출하는 메서드와 가까이에 위치하는게 좋다.

Q) toInt 메서드는 예외처리도 해주고, 숫자 변환도 이뤄지고 있는데 이러면 두 가지 역할이 이뤄지고 있다고 볼 수 없나요?
A) 이 부분에서는 클래스 분리를 고려해볼만 하다. 예를 들어, Positive 클래스를 만들어서 숫자를 감싸서 양수가 됨을 보장할 수 있다.

Q) if문이나 for문 내에 코드가 한줄만 들어가도 {}로 감싸주는 것이 더 좋을까요?
A) …

Q) private 메서드도 테스트코드로 작성해야하는거 아닌가요? 그러면 테스트코드 할 양이 엄청 많아지는데 제가 잘못 생각하고 있는걸까요?
A) 로또할때 ..

Q) 커스텀 구분자를 나누는 if 문까지 split() 에 포함시키는건 어떨까요? sum() 리턴을 두 번하는 것이 조금 마음에 걸려서요!
A) 자바의 다형성으로 해결해보기