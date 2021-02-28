# 스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술

스프링을 이용하여 간단한 프로젝트를 만들어 봄으로써 어떤 기술이 어떻게 사용되는지 전반적으로 감을 잡는 것이 목표이다. 틀을 머리속에 자리잡도록 하고 어떤 부분을 깊이있게 학습해야 하는지 알 수 있다.

스프링 입문 강의를 통해서 전반적인 그림을 코드로써 깨닫는다. 그리고 매우 깊은 스프링의 핵심원리만 학습한다. 그리고 스프링은 주로 웹기반에서 동작하는데 웹 MVC를 학습한다. 스프링을 가지고 DB에 접근하는 다양한 기술들을 학습하고 best practice를 학습한다. 스프링 부트는 매우 거대해서 실무에서 주로 사용하는 내용만 핵심적으로 학습한다.

# 프로젝트 환경설정

## 프로젝트 생성

- https://start.spring.io/ : 스프링 기반으로 프로젝트를 만들어주는 사이트

![image-20210228225727398](/Users/ham/Library/Application Support/typora-user-images/image-20210228225727398.png)

![image-20210228225740997](/Users/ham/Library/Application Support/typora-user-images/image-20210228225740997.png)

![image-20210228225839771](/Users/ham/Library/Application Support/typora-user-images/image-20210228225839771.png)

IntelliJ에서 open 한 다음, build.gradle을 열어보면 다음과 같은 형식의 코드를 확인할 수 있다.

```java
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

이 부분은 내가 선택한 dependencies들을 gradle을 통해 다운받도록 설정해주는 부분이다.

이제 main>java> hello.hellospring의 HelloSpringApplication을 열어보면

```java
package hello.hellospring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HelloSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(HelloSpringApplication.class, args);
	}

}
```

이러한 코드가 미리 작성되어있다. 이 코드를 실행해보면 다음과 같은 화면이 콘솔에 출력된다.

![image-20210228225937113](/Users/ham/Library/Application Support/typora-user-images/image-20210228225937113.png)

Tomcat서버를 이용하여 localhost에서 8080포트로 실행되고 있다는 내용이 있다. 따라서 웹 브라우저로 해당 주소에 접속해보면 다음과 같은 화면이 뜬다.

![image-20210228230200501](/Users/ham/Library/Application Support/typora-user-images/image-20210228230200501.png)

## 라이브러리 살펴보기

인텔리제이에서 왼쪽의 프로젝트 익스플로러를 보면 External Libraries가 있다. 이 부분은 명시한 의존에 비해서 상당히 많은 것을 볼 수 있다.

```java
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

분명히 세 개의 의존만 당겨오도록 설정하였는데, 무수히 많이 당겨온 이유는 바로 그 의존들이 의존하는 다른 의존들까지 모두 당겨오기 때문이다. 

![image-20210228230328952](/Users/ham/Library/Application Support/typora-user-images/image-20210228230328952.png)

이렇게 의존하고 의존하는 사슬관계를 보려면 우측의 Gradle을 클릭하면 된다.

![image-20210228231011017](/Users/ham/Library/Application Support/typora-user-images/image-20210228231011017.png)

기존에는 웹 개발을 하기위해서 웹서버를 구동하기 위해서 Tomcat을 별도로 설치하고, 각 필요한 도구를 별도로 설치해야했다. 하지만 현재는 **의존을 당겨오는것 (by Gradle)**로 코드 몇줄로 바로 실행가능해졌다.

![image-20210228231521141](/Users/ham/Library/Application Support/typora-user-images/image-20210228231521141.png)

logging에서는 저 두 가지 조합을 많이 사용한다. 많이 사용하는 만큼 스프링 부트에서 기본적으로 당겨오는 라이브러리 중 하나이다.

![image-20210228231823319](/Users/ham/Library/Application Support/typora-user-images/image-20210228231823319.png)



## View 환경설정

먼저, static에 index.html파일을 생성한다.

```html
<!DOCTYPE HTML>
<html>
<head>
    <title>Hello</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>
Hello
<a href="/hello">hello</a>
</body>
</html>
```

웹 애플리케이션의 첫번째 진입점이 바로 컨트롤러이다. hello.hellospring에서 controller라는 패키지를 만들고, HelloController라는 자바 클래스 파일을 생성한다음, 아래의 내용을 작성한다.

```java
package hello.hellospring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HelloController {

    @GetMapping("hello")
    public String hello(Model model) {
        model.addAttribute("data", "hello!!");
        return "hello";
    }
}
```

마지막으로, templates에 hello.html을 생성하고 아래의 내용을 작성한다.

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Hello</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>
<p th:text="'안녕하세요. ' + ${data}">안녕하세요. 손님</p>
</body>
</html>
```



## 빌드하고 실행하기

![image-20210228233836886](/Users/ham/Library/Application Support/typora-user-images/image-20210228233836886.png)

![image-20210228234019368](/Users/ham/Library/Application Support/typora-user-images/image-20210228234019368.png)

서버에 배포할 때는 이 파일만 넣고 실행시키면 되므로, 매우 간편해졌다.

![image-20210228234221149](/Users/ham/Library/Application Support/typora-user-images/image-20210228234221149.png)

![image-20210228234322924](/Users/ham/Library/Application Support/typora-user-images/image-20210228234322924.png)

혹시 잘 실행이 안된다면, `./gradlew clean build` 로 실행시키면 된다. 이 명령을 통해 깔끔하게 정리를 하고 다시 실행하므로 정상적으로 실행이 된다.

# 스프링 웹 개발 기초

## 정적 컨텐츠

static에 hello-static.html을 생성한 후, 아래의 내용을 작성한다.

```html
<!DOCTYPE HTML>
<html>
<head>
    <title>static content</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>
정적 컨텐츠 입니다.
</body>
</html>
```

![image-20210301000858514](/Users/ham/Library/Application Support/typora-user-images/image-20210301000858514.png)

## MVC와 템플릿 엔진

이전에 JSP의 뷰 파일 하나 안에 DB접근 등 모든 로직이 하나로 통합되어있어서 유지보수가 매우 어려웠던 기억이 있다. 하지만 요즘에는 그 역할과 책임을 분리하여 MVC구조로 작성하는 것이 일반적이다.

먼저, 아래의 내용을 HelloController에 추가한다.

```java
@GetMapping("hello-mvc")
public String helloMvc(@RequestParam("name") String name, Model model) {
  model.addAttribute("name", name);
  return "hello-template";
}
```

templates에는 hello-tamplate.html을 추가하여 아래의 내용을 작성한다.

```html
<html xmlns:th="http://www.thymeleaf.org">
<body>
<p th:text="'hello ' + ${name}">hello! empty</p>
</body>
</html>
```

![image-20210301001708500](/Users/ham/Library/Application Support/typora-user-images/image-20210301001708500.png)

다시 접속해보면 에러가 뜨는데, 확인해보면 `2021-03-01 00:16:59.530  WARN 20378 --- [nio-8080-exec-3] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.bind.MissingServletRequestParameterException: Required String parameter 'name' is not present]` 라는 내용이 로그로 출력된다. 내용을 보면 name에 대한 파라미터가 없다고 한다. 코드의 본문에서 @RequestParam 어노테이션에서 command + p를 눌러보면 아래와 같이 required가 기본값으로 true라는 것을 확인할 수 있다.

![image-20210301002247569](/Users/ham/Library/Application Support/typora-user-images/image-20210301002247569.png)

따라서 url에 name의 파라미터를 포함하여 입력해주면 아래와 같이 정상적으로 페이지가 로드된다.

![image-20210301001937482](/Users/ham/Library/Application Support/typora-user-images/image-20210301001937482.png)

정적 컨텐츠를 그대로 사용할 때는 html의 내용을 따로 변환을 해주지 않았지만, 템플릿 엔진을 사용하면 소스보기를 했을때 아래와 같이 변환해서 렌더링 해주었다는 것을 확인할 수 있다.

```html
<html>
<body>
<p>hello spring!!!</p>
</body>
</html>
```

## API

```java
@GetMapping("Hello-string")
@ResponseBody
public String helloString(@RequestParam("name") String name) {
    return "hello " + name;
}
```

`@ResponseBody`는 응답부에 이 바디를 직접적으로 넣어주겠다는 어노테이션이다.

이것을 실행해보면 실행화면은 차이가 없다. 하지만 View Page Source를 해보면 html태그가 없고 그냥 문자열이 그대로 전송되는 것을 확인할 수 있다.

![image-20210301003417520](/Users/ham/Library/Application Support/typora-user-images/image-20210301003417520.png)

```html
hello spring!!!!!
```

하지만 이것을 사용하는 경우는 거의 없다. 아래의 간단한 코드를 추가하고 hello-api를 통한 url로 접속해보면 조금 다른 출력결과를 볼 수 있다.

```java
@GetMapping("hello-api")
    @ResponseBody
    public Hello HelloApi(@RequestParam("name") String name) {
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }

    static class Hello {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
```

아래의 출력포맷은 JSON 포맷이다. 현재는 XML보다는 간단한 JSON을 많이 사용하는 추세이다.

![image-20210301003842406](/Users/ham/Library/Application Support/typora-user-images/image-20210301003842406.png)