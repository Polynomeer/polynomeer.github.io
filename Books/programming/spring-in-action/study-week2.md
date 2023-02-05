# Study Week2

## Chapter 04. Spring Security

Q) 로컬에서 내장된 LDAP 서버를 띄우려고 하면 에러가 발생한다.
A)  

- https://stackoverflow.com/questions/49446048/spring-embedded-ldap-server-unable-to-perform-the-search
- https://www.baeldung.com/spring-ldap

Q) 책의 예제에서는 스프링 시큐리티로 로그인까지 처리하는데, 실제 CMS에서는 어떻게 다른가?
A) CMS에서는 스프링 시큐리티의 필터 역할만 사용하고 있다. 예를 들어, 특정 페이지에 접속하려면 인증을 해야한다거나, 또 다른 페이지에 접근할 때는 인증이 필요없다면 허용하는 방식으로 사용하고 있다. 한 마디로 문지기 역할이다.

Q) CMS에서는 JwtAuthenticationFilter를 직접 구현해서 스프링 시큐리티의 설정에서 어떻게 사용하고 있는지?
A) JwtAuthenticationFilter를 구현하는데 

```java
.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
```

Q) @Autowired가 생성자에 붙으면 어떻게 동작하는가?
A) @Autowired는 필드, setter, 생성자에 붙일 수 있는데, 이는 스프링 컨테이너(빈 팩토리 + a)는 빈을 하나씩 만들어가는데, 가장 먼저 생성되어야 하는 순서대로 하나씩 생성하고 조립한다.

- https://doflamingo.tistory.com/15
- https://reflectoring.io/constructor-injection/