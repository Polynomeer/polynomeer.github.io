# Study Week1

## Chapter 1

Q) Gradle 작성 언어가 무엇인가?  
A) Groovy

Q) 외부 연동 부분이 테스트에 섞여있을 때는 어떻게 하는가?   
A) 백기선님의 리팩터링 강의에서도 언급되는 부분인데, 테스트의 독립성이 보장되도록 mocking하는 것이 필요하다. 예를 들어, GitHub에 요청을 보내서 응답을 받은 다음 진행하는 테스트가 있다고 하면 우선 해당 요청을 보내고 받는 부분은 별도의 메서드로 분리하는게 바람직할 것이다. 그리고 그 부분을 mocking하여 논리적으로 적절한 응답을 미리 작성해두고 테스트한다. 더 나아가 성공, 실패 모든 경우에 대해 작성해둘 수 있을 것이다.

Q) 애너테이션의 작동원리   
A) 애너테이션은 일종의 마킹인데, 여기에는 지속기간, 범위와 같은 메타정보가 포함되어있다. 이를 기준으로 해당 애너테이션이 붙은 대상(클래스, 매서드, 또는 클래스 필드)에 대해서 어떻게 처리할지 컨슈밍하는 코드를 별도로 작성해야한다.

Q) `@Valid`같은 애너테이션은 어느 수준까지 캐치되는가?
A) TODO

Q) Validation을 프론트에서 이미 하는데 백엔드에서도 굳이 해야하는가?
A) 해야한다고 생각한다. 프론트에서 입력 폼에 대한 검증을 다 해서 alert창을 띄운다던지 리다이렉션을 한다던지 처리하는 로직이 존재하겠지만, 만약에 프론트를 통해서가 아닌 비정상적인 루트로 API를 호출했을때 비정상적인 데이터를 수용하여 DB에 저장이 된다면 장애로 이어질 수 있기 때문이다. 심지어 금융권에서는 계층별로 중복되는 검증을 일일이 한다는 말을 들었던 기억이 있다.


bannner.txt에 이미지 파일도 가능

스프링 클라우드
MSA 구조 -> 오픈 플랫폼에 할지도? 건의사항
CMS 도...
