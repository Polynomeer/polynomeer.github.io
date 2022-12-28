# Preflight Request

## What is Preflight Request?

CORS preflight 요청은 CORS 요청의 일종으로, CORS 프로토콜이 이해되는지 여부와 서버가 특정 메서드나 헤더를 사용하여 인식하는지 확인하는 CORS 요청이다.

`OPTIONS` 요청은 HTTP 요청 헤더 3개를 사용하는 요청이다. 그 헤더는 `Access-Control-Request-Method`, `Access-Control-Request-Headers`, 그리고 `Origin`이다.

preflight 요청은 일반적인 케이스에서는 자동으로 브라우저에 의해 발행된다. 따라서 프론트엔드 개발자들은 이러한 요청을 직접 작성할 필요가 없다. 이는 요청이 `to be preflghted`로 한정되고 간단한 요청으로 생략되기도 한다.

예를 들어, 클라이언트가 서버에게 `DELETE` 요청을 보내기 전에, `DELETE` 요청이 허용되는지 물어보려면, 다음과 같은 preflight 요청을 통해서 가능하다.

```
OPTIONS /resource/foo
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: origin, x-requested-with
Origin: https://foo.bar.org
```

해당 서버가 허용하게 되면, 서버는 preflight 요청에 대한 응답으로 `Access-Control-Allow-Methods`를 응답 헤더에 포함하며, 거기엔 DELETE가 리스팅 되어있다.

```
HTTP/1.1 204 No Content
Connection: keep-alive
Access-Control-Allow-Origin: https://foo.bar.org
Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE
Access-Control-Max-Age: 86400
```

preflight 응답은 선택적으로 같은 URL에 대해 생성된 요청은 캐싱될 수 있으며, 이때는 위와같이 `Access-Control-Max-Age` 헤더를 명시해주어야 한다. preflight 응답을 캐싱하려면, 브라우저는 특정 캐시를 사용하는데, 그 캐시는 브라우저에서 관리하는 일반적인 HTTP 캐시와는 분리된다. 즉, preflight 응답은 절대 브라우저의 범용 HTTP 캐시 안에 캐싱되지 않는다.

## When the Preflight Requests Occurred?

CORS preflight `OPTIONS` 요청은 해당 요청에 `Content-Type` 헤더를 추가하는 것만으로 트리거될 수 있다. 단, 그 값은 `application/x-www-form-urlencoded`, `text/plain`, or `multipart/form-data`을 제외한 값일 때만 해당한다. 그리고 GET 요청 또한 마찬가지인데, GET의 경우 요청 본문이 없기 때문에 GET 요청에 헤더를 추가해서는 안 되므로 아무 소용이 없다.

## Preflight Configuration in Spring Boot

cross-origin 요청을 보낼 때마다 매번 preflight 요청을 보낼 필요는 없다. 앞서 말했듯 일정 기간동안 캐싱해서 사용할 수 있기 때문이다.

### @CrossOrigin으로 maxAge 설정

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    // maxAge=3600 설정을 통해 3600초 동안 preflight 결과를 캐시에 저장
    @CrossOrigin(origins="http://localhost:8080", maxAge=3600)
    @PostMapping("/")
    public String postSuccess() {
        return "success";
    }
}
```

### CorsRegistry로 maxAge 설정

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080")
                .maxAge(3600); // 3600초 동안 preflight 결과를 캐시에 저장
    }
}
```

## References

- https://developer.mozilla.org/en-US/docs/Glossary/CORS
- https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
- https://livebook.manning.com/book/cors-in-action/chapter-4/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
- https://stackoverflow.com/questions/41679725/preflight-request-is-sent-with-all-methods
- https://docs.sensedia.com/en/faqs/Latest/apis/preflight.html
- https://www.baeldung.com/cs/cors-preflight-requests
- https://kkyu-coder.tistory.com/184
- https://spring.io/guides/gs/rest-service-cors/
- https://stackoverflow.com/questions/36809528/spring-boot-cors-filter-cors-preflight-channel-did-not-succeed
- https://velog.io/@ojwman/spring-boot-cors-header-preflight
- https://velog.io/@seho100/CORS%EB%9E%80-Spring-boot%EC%97%90%EC%84%9C%EC%9D%98-CORS-Preflight%EC%97%90-%EA%B4%80%ED%95%9C-%EC%9D%B4%EC%8A%88
- https://hwanchang.tistory.com/3
- https://wonit.tistory.com/571
