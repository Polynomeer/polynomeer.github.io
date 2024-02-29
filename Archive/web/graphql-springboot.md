# GraphQL

## 1. Introduction

GraphQL 은 웹 API용 REST의 대안으로 청구되는 Facebook의 비교적 새로운 개념입니다.

이 튜토리얼에서는 Spring Boot를 사용하여 GraphQL 서버를 설정하여 기존 애플리케이션에 추가하거나 새 애플리케이션에서 사용할 수 있도록 하는 방법을 배웁니다.

## 2. What is GraphQL

기존 REST API는 서버가 관리하는 리소스 개념으로 작동합니다. 다양한 HTTP 동사에 따라 몇 가지 표준 방식으로 이러한 리소스를 조작할 수 있습니다. 이것은 API가 리소스 개념에 맞는 한 매우 잘 작동하지만 이를 벗어나야 할 때 빠르게 무너집니다.

이는 클라이언트가 블로그 게시물 및 댓글 요청과 같이 동시에 여러 리소스의 데이터를 필요로 하는 경우에도 발생합니다. 일반적으로 이것은 클라이언트가 여러 요청을 하게 하거나 서버가 항상 필요하지 않을 수 있는 추가 데이터를 제공하도록 하여 해결되어 응답 크기가 더 커집니다.

GraphQL은 이 두 가지 문제에 대한 솔루션을 제공합니다 . 이를 통해 클라이언트는 단일 요청에서 하위 리소스 탐색을 포함하여 원하는 데이터를 정확하게 지정할 수 있으며 단일 요청에서 여러 쿼리를 허용할 수 있습니다.

또한 표준 필수 작업 집합 대신 명명된 쿼리 및 변형을 사용하여 훨씬 더 RPC 방식으로 작동합니다. 이것은 API 개발자가 가능한 것을 지정하고 API 소비자가 원하는 것을 지정하여 제어가 속한 위치에 배치합니다.

예를 들어 블로그에서 다음 쿼리를 허용할 수 있습니다.

```
query {
    recentPosts(count: 10, offset: 0) {
        id
        title
        category
        author {
            id
            name
            thumbnail
        }
    }
}
```

이 쿼리는 다음을 수행합니다.

- 가장 최근 게시물 10개 요청
- 각 게시물에 대해 ID, 제목, 카테고리 요청
- 각 게시물에 대해 작성자를 요청하고 ID, 이름 및 썸네일 반환

기존 REST API에서 이것은 11개의 요청이 필요합니다. 하나는 게시물에 대해, 10개는 작성자에 대해 요청하거나 게시물 세부 정보에 작성자 세부 정보를 포함해야 합니다.

### 2.1 GraphQL Schema

GraphQL 서버는 API를 설명하는 스키마를 노출합니다. 이 스키마는 유형 정의로 구성됩니다. 각 유형에는 하나 이상의 필드가 있으며, 각각은 0개 이상의 인수를 취하고 특정 유형을 반환합니다.

그래프는 이러한 필드가 서로 중첩되는 방식에서 파생됩니다. 그래프가 순환적일 필요는 없으며 주기는 완벽하게 허용되지만 방향이 있습니다. 클라이언트는 한 필드에서 하위 필드로 가져올 수 있지만 스키마가 이를 명시적으로 정의하지 않는 한 자동으로 상위 필드로 돌아갈 수 없습니다.

블로그에 대한 예제 GraphQL 스키마에는 게시물, 게시물 작성자 및 블로그에서 가장 최근 게시물을 가져오기 위한 루트 쿼리를 설명하는 다음 정의가 포함될 수 있습니다.

```
type Post {
    id: ID!
    title: String!
    text: String!
    category: String
    author: Author!
}

type Author {
    id: ID!
    name: String!
    thumbnail: String
    posts: [Post]!
}

# The Root Query for the application
type Query {
    recentPosts(count: Int, offset: Int): [Post]!
}

# The Root Mutation for the application
type Mutation {
    createPost(title: String!, text: String!, category: String, authorId: String!) : Post!
}
```

"!" 일부 이름의 끝에는 null을 허용하지 않는 유형임을 나타냅니다. 이것이 없는 모든 유형은 서버의 응답에서 null이 될 수 있습니다. GraphQL 서비스는 이를 올바르게 처리하므로 nullable 형식의 자식 필드를 안전하게 요청할 수 있습니다.

또한 GraphQL 서비스는 표준 필드 세트를 사용하여 스키마를 노출하므로 모든 클라이언트가 미리 스키마 정의를 쿼리할 수 있습니다.

이를 통해 클라이언트는 스키마가 변경될 때 자동으로 감지하고 클라이언트가 스키마 작동 방식에 동적으로 적응할 수 있습니다. 매우 유용한 한 가지 예는 GraphiQL 도구로, 이를 통해 모든 GraphQL API와 상호 작용할 수 있습니다.

3. GraphQL 스프링 부트 스타터 소개
Spring Boot GraphQL Starter 는 매우 짧은 시간에 GraphQL 서버를 실행할 수 있는 환상적인 방법을 제공합니다 . 자동 구성 및 주석 기반 프로그래밍 접근 방식을 사용하여 서비스에 필요한 코드만 작성하면 됩니다.

3.1. 서비스 설정
이것이 작동하는 데 필요한 것은 올바른 종속성뿐입니다.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-graphql</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
GraphQL은 전송에 구애받지 않기 때문에 구성에 웹 스타터를 포함했습니다. 이는 기본  /graphql 엔드포인트에서 Spring MVC를 사용하여 HTTP를 통해 GraphQL API를 노출합니다. Spring Webflux와 같은 다른 기본 구현에 다른 스타터를 사용할 수 있습니다.

필요한 경우 application.properties 파일 에서 이 끝점을 사용자 지정할 수도 있습니다 .

3.2. 스키마 작성
GraphQL 부트 스타터는 올바른 구조를 구축하기 위해 GraphQL 스키마 파일을 처리한 다음 특수 빈을 이 구조에 연결하는 방식으로 작동합니다. Spring Boot GraphQL 스타터는 이러한 스키마 파일을 자동으로 찾습니다 .

이러한 " .graphqls " 또는 " .gqls " 스키마 파일을 src/main/resources/graphql/** 위치에 저장해야 하며 Spring Boot가 자동으로 선택합니다. 평소와 같이 spring.graphql.schema.locations 로 위치를 사용자 정의하고 spring.graphql.schema.file-extensions 구성 속성 으로 파일 확장자를 사용자 정의할 수 있습니다.

한 가지 요구 사항은 정확히 하나의 루트 쿼리와 최대 하나의 루트 변형이 있어야 한다는 것입니다. 나머지 스키마와 달리 이것을 파일 간에 분할할 수 없습니다. 이는 Java 구현이 아니라 GraphQL 스키마 정의의 제한 사항입니다.

3.3. 루트 쿼리 리졸버
루트 쿼리에는 이 루트 쿼리의 다양한 필드를 처리하기 위해 특별히 주석이 달린 메서드가 있어야 합니다 . 스키마 정의와 달리 루트 쿼리 필드에 대한 단일 Spring bean만 있다는 제한이 없습니다.

핸들러 메서드에 @QueryMapping 주석 을 추가하고 이를 애플리케이션의 표준 @Controller 구성 요소 에 배치해야 합니다. 이렇게 하면 주석이 달린 클래스가 GraphQL 애플리케이션의 데이터 가져오기 구성 요소로 등록됩니다.

위는 앞서 정의한 스키마의 최근 게시 필드에 대한 모든 GraphQL 쿼리를 처리하는 데 사용할 최근 게시 메서드를 정의합니다. 또한 메서드  에는 스키마의 해당 매개 변수에 해당하는 @Argument 주석이 달린 매개 변수가 있어야 합니다.

기본 컨텍스트 및 환경에 액세스하기 위해 선택적으로  GraphQLContext,  DataFetchingEnvironment 등과 같은 다른 GraphQL 관련 매개 변수를 사용할 수도 있습니다.

```java
@Controller
public class PostController {

    private PostDao postDao;

    @QueryMapping
    public List<Post> recentPosts(@Argument int count, @Argument int offset) {
        return postDao.getRecentPosts(count, offset);
    }
}
```

이 메서드는 곧 보게 될 GraphQL 체계의 유형에 대한 올바른 반환 유형도 반환해야 합니다. String, Int, List 등 의 단순 유형을 동등한 Java 유형과 함께 사용할 수 있으며 시스템은 이를 자동으로 매핑합니다.

3.4. Bean을 사용하여 유형 표시
GraphQL 서버의 모든 복합 유형은 루트 쿼리에서 로드하든 구조의 다른 위치에서 로드하든 관계없이 Java bean으로 표시됩니다. 동일한 Java 클래스는 항상 동일한 GraphQL 유형을 나타내야 하지만 클래스 이름은 필요하지 않습니다.

Java bean 내부의 필드는 필드 이름을 기반으로 GraphQL 응답의 필드에 직접 매핑됩니다.

```java
public class Post {
    private String id;
    private String title;
    private String category;
    private String authorId;
}
```

GraphQL 스키마에 매핑되지 않는 Java bean의 모든 필드 또는 메서드는 무시되지만 문제를 일으키지는 않습니다. 이는 필드 리졸버가 작동하는 데 중요합니다.

예를 들어 여기에서 authorId 필드 는 이전에 정의한 스키마의 어떤 항목에도 해당하지 않지만 다음 단계에서 사용할 수 있습니다.

3.5. 복소수 값에 대한 필드 해석기
경우에 따라 필드 값이 로드하기 쉽지 않을 수 있습니다. 여기에는 데이터베이스 조회, 복잡한 계산 등이 포함될 수 있습니다. @SchemaMapping 주석은 핸들러 메서드를 스키마에서 이름이 같은 필드에 매핑하고 해당 필드의 DataFetcher로 사용합니다.

```java
@SchemaMapping
public Author author(Post post) {
    return authorDao.getAuthor(post.getAuthorId());
}
```

중요한 것은 클라이언트가 필드를 요청하지 않으면 GraphQL 서버가 필드를 검색하는 작업을 수행하지 않는다는 것 입니다. 즉, 클라이언트가 게시물 을 검색하고 작성자 필드 를 요청하지 않으면 위의 a uthor() 메서드가 실행되지 않고 DAO 호출이 수행되지 않습니다.

또는 주석에 상위 유형 이름과 필드 이름을 지정할 수도 있습니다.

```java
@SchemaMapping(typeName="Post", field="author")
public Author getAuthor(Post post) {
    return authorDao.getAuthor(post.getAuthorId());
}
```

여기에서 주석 속성은 이를 스키마의 작성자 필드에 대한 핸들러로 선언하는 데 사용됩니다 .

3.6. Null 허용 값
GraphQL 스키마에는 일부 유형은 null을 허용하고 다른 유형은 그렇지 않다는 개념이 있습니다.

null 값을 직접 사용하여 Java 코드에서 이를 처리합니다. 반대로 nullable 유형에 대해 Java 8의 새로운 Optional 유형을 직접 사용할 수 있으며 시스템은 값으로 올바른 작업을 수행합니다.

이는 Java 코드가 메서드 정의의 GraphQL 스키마와 더 명확하게 동일하다는 것을 의미하므로 매우 유용합니다.

3.7. 돌연변이
지금까지 우리가 한 모든 일은 서버에서 데이터를 검색하는 것이었습니다. GraphQL은 변형을 통해 서버에 저장된 데이터를 업데이트하는 기능도 있습니다.

코드의 관점에서 쿼리가 서버의 데이터를 변경할 수 없는 이유가 없습니다. 인수를 수락하고 새 데이터를 저장하고 해당 변경 사항을 반환하는 쿼리 확인자를 쉽게 작성할 수 있습니다. 이렇게 하면 API 클라이언트에 놀라운 부작용이 발생하며 나쁜 습관으로 간주됩니다.

대신, Mutations를 사용하여 저장 중인 데이터가 변경될 것임을 클라이언트에 알려야 합니다 .

Query와 유사하게 @MutationMapping 으로 처리기 메서드에 주석을 달아 컨트롤러에서 돌연변이를 정의합니다 . 그런 다음 Mutation 필드의 반환 값은 Query 필드에서와 정확히 동일하게 처리되어 중첩된 값도 검색할 수 있습니다.

4. 그래피큐엘
GraphQL에는 GraphiQL 이라는 동반 도구도 있습니다 . 이 UI 도구는 모든 GraphQL 서버와 통신할 수 있으며 GraphQL API를 사용하고 개발하는 데 도움이 됩니다. 다운로드 가능한 버전은 Electron 앱으로 존재하며 여기 에서 검색할 수 있습니다 .

Spring GraphQL은 /graphiql 엔드포인트 에 노출되는 기본 GraphQL 페이지와 함께 제공 됩니다. 엔드포인트는 기본적으로 비활성화되어 있지만 spring.graphql.graphiql.enabled 속성을 활성화하여 켤 수 있습니다. 이는 특히 개발 및 테스트 중에 쿼리를 작성하고 테스트하는 매우 유용한 브라우저 내 도구를 제공합니다.

5. 요약
GraphQL은 우리가 웹 API를 개발하는 방법을 잠재적으로 혁신할 수 있는 매우 흥미로운 신기술입니다.

Spring Boot GraphQL Starter를 사용하면 이 기술을 신규 또는 기존 Spring Boot 애플리케이션에 매우 쉽게 추가할 수 있습니다.

항상 그렇듯이 코드 스니펫은 GitHub 에서 찾을 수 있습니다.

```java
@MutationMapping
public Post createPost(@Argument String title, @Argument String text,
  @Argument String category, @Argument String authorId) {

    Post post = new Post();
    post.setId(UUID.randomUUID().toString());
    post.setTitle(title);
    post.setText(text);
    post.setCategory(category);
    post.setAuthorId(authorId);

    postDao.savePost(post);

    return post;
}
```

## References

- https://spring.io/projects/spring-graphql#overview
- https://www.baeldung.com/spring-graphql
- https://www.baeldung.com/graphql-postman
- https://github.com/eugenp/tutorials/tree/master/spring-boot-modules/spring-boot-graphql
- https://github.com/graphql-java/graphql-java
- https://github.com/graphql-java/graphql-java-spring
- https://github.com/spring-projects/spring-graphql
- https://github.com/graphql-java-kickstart/graphql-spring-boot
- https://github.com/spring-projects/spring-graphql/tree/main/samples/webmvc-http/src/main/java/io/spring/sample/graphql
- https://github.com/graphql-java/tutorials/blob/master/src/main/java/com/graphqljava/tutorial/bookDetails/BookDetailsApplication.java
- https://www.graphql-java.com/tutorials/getting-started-with-spring-boot/
- https://dzone.com/articles/a-beginners-guide-to-graphql-with-spring-boot
- https://www.danvega.dev/blog/2022/05/17/spring-for-graphql/
- https://medium.com/geekculture/spring-boot-graphql-tutorial-77300048909b
- https://www.bezkoder.com/spring-boot-graphql-mysql-jpa/
- https://www.baeldung.com/spring-graphql
