# Chapter 2. Go 간단히 살펴보기

> - Go 프로그램을 포괄적으로 살펴보기
> - 타입, 변수, 함수, 메서드 선언하기
> - 고루틴을 실행하고 동기화하기
> - 인터페이스를 이용한 범용 코드 작성하기
> - 오류를 일반적인 프로그램 로직처럼 처리하기
Go 언어는 저수준(low-level) 프로그래밍 구조에 대한 접근을 허용하면서도 생산성을 높일 수 있다. 이러한 균형의 달성은 최소화된 키워드 집합과 내장 함수, 그리고 간결한 문법 덕분에 가능했다. 또한 Go는 매우 광범위한 표준 라이브러리를 지원한다. 이는 실세계의 웹 및 네트워크 기반 프로그램을 구현하는 데 필요한 모든 핵심 패키지를 제공한다.

## 2.1 프로그램 아키텍처

프로그램은 각기 다른 고루틴에 의해 실행되는 여러 단계로 나누어진다. 이 코드는 우선 고루틴에서 시작해서 검색과 추적을 담당하는 고루틴의 코드를 살펴본 후 다시 주 고루틴의 코드로 돌아오는 순서로 진행된다.

```shell
.
└── sample
    ├── data
    │   └── data.json			-- 데이터 피드를 가지고 있는 파일
    ├── main.go						-- 프로그램의 진입점(entry point)
    ├── matchers
    │   └── rss.go				-- RSS 피드 검색기를 구현한 코드
    └── search
        ├── default.go		-- 데이터 검색을 위한 기본적인 검색기 코드
        ├── feed.go				-- JSON 데이터 파일을 읽기 위한 코드
        ├── match.go			-- 서로 다른 종류의 검색기를 지원하기 위한 인터페이스
        └── search.go			-- 검색을 수행하는 주요 로직이 구현된 파일
```

## 2.2 main 패키지

프로그램의 진입점은 main.go 코드 파일에 작성되어 있다.

```go
package main

import (
	"log"
	"os"

	_ "github.com/goinaction/code/chapter2/sample/matchers"
	"github.com/goinaction/code/chapter2/sample/search"
)

// init is called prior to main.
func init() {
	// Change the device for logging to stdout.
	log.SetOutput(os.Stdout)
}

// main is the entry point for the program.
func main() {
	// Perform the search for the specified term.
	search.Run("president")
}
```

**Go가 생성하는 실행 파일**

모든 Go 프로그램은 두 가지 독특한 기능을 가진 실행 파일을 만들어낸다. 그 중 첫 번째 기능은 `func main()`에서 확인할 수 있다. 이는 main 함수를 선언하며, 실행 파일을 생성하는 빌드 도구의 입장에서 main 함수는 반드시 선언되어 프로그램의 진입점 역할을 수행해야 한다.

두 번째 기능은 `package main`에서 확인할 수 있다. main 함수는 main 이라는 이름의 패키지에 구현되어 있다. 만일 main 함수가 main 패키지에 선언되어 있지 않으면 빌드 도구는 실행 파일을 만들어내지 못한다.

**Go의 패키지 및 import**

Go의 모든 코드 파일은 패키지에 종속되어야 하며 main.go 파일도 예외는 아니다. 패키지는 컴파일된 코드를 구별하기 위한 단위를 정의하고 여기에 이름을 부여하여 그 안에 정의된 식별자들을 구별하기 위한, 일종의 네임스페이스(namespace) 같은 것이다. 패키지 덕분에 우리가 가져오기(import)한 패키디들에 설령 같은 이름의 식별자가 존재하더라도 이들을 구분할 수 있다.

가져오기는 외부의 코드를 가져와서 그 코드에 정의된 타입, 함수, 상수 및 인터페이스 같은 식별자들에 접근할 수 있게 해주는 기능이다. 예제의 경우 main.go 코드 파일은 search 패키지의 Run 함수를 참조할 수 있으며, 표준 라이브러리로부터 log와 os 패키지의 코드를 가져온다.

같은 폴더에 저장된 모든 소스 파일은 같은 패키지 이름을 사용해야 하며, 폴더 이름과 동일한 패키지 이름을 사용하는 것이 관례다. 패키지는 컴파일된 코드 단위를 정의하며, 각각의 코드 단위는 패키지로 표현된다.

```go
	_ "github.com/goinaction/code/chapter2/sample/matchers"
```

해당 부분에 빈 식별자를 사용한 것을 볼 수 있다. 이는 패키지에 정의된 식별자를 직접 사용하지 않더라도 import 선언을 유지하기 위한 방법이다. 사실 Go 컴파일러는 코드의 가독성을 위해 패키지를 가져왔지만 실제로 그 패키지에 정의된 식별자를 사용하지 않으면 컴파일 오류가 발생한다. 빈 식별자를 사용하면 컴파일러는 패키지를 가져온 후 패키지 내의 다른 코드 파일에서 init 함수를 찾아 호출한다. 예제 코드의 경우, matchers 패키지의 rss.go 코드 파일이 RSS 검색기를 등록하기 위한 init 함수를 선언하고 있으므로 이 기법을 활용할 필요가 있다.

**Go의 init 함수**

프로그램을 구성하는 코드 파일에 정의된 모든 init 함수는 main 함수가 호출되기 전에 먼저 호출된다. 이 init 함수는 표준 라이브러리로부터 로그 출력기(logger)를 가져와 표준 출력(stdout) 장치로 로그를 출력하도록 설정한다. 기본적으로 로그 출력기는 표준 오류(stderr) 장치로 로그를 출력하도록 설정되어 있다.

**main 함수의 로직**

```go
// Perform the search for the specified term.
search.Run("president")
```

main 함수의 로직은 search 패키지에 선언된 Run 함수를 호출한다. 이 함수는 프로그램을 위한 핵심 비즈니스 로직이 작성되어 있으며 검색어를 저장할 문자열 매개변수를 필요로 한다. 그리고 일단 Run 함수가 리턴되면 프로그램이 종료된다.

## 2.3 Search 패키지

search 패키지는 프로그램을 위한 프레임워크와 비즈니스 로직을 구현한 패키지다. 이 패키지는 다시 개별적인 역할을 담당하는 네 개의 코드 파일로 구성된다. 사실 이 프로그램의 모든 로직은 검색기(matcher)를 중심으로 작성된다.

**검색기(matcher)**

검색기는 우리가 작성하는 프로그램 내에서 각기 다른 종류의 피드를 처리하는 방법을 알고있는 코드다. 현재 우리 프로그램은 두 개의 검색기를 구현하고 있다. 프레임워크가 구현하는 기본 검색기는 특정 종류의 ㅣ드에 대해서는 아무것도 고려하지 않은 채 검색을 위한 기본 작업을 수행하는 검색기이며, matchers 패키지에는 RSS 피드를 처리하기 위한 검색기가 구현되어 있다. 물론 향후에 이 프로그램을 확장하여 JSON 문서나 CSV 파일 등을 읽을 수 있는 검새기를 구현할 수도 있다.

### 2.3.1 search.go

```go
package search

import (
	"log"
	"sync"
)
```

각각의 코드 파일의 제일 첫 번째 줄에는 package라는 키워드와 함께 패키지 이름이 지정되어 있다. search 폴더에 저장된 각각의 코드 파일은 search라는 패키지 이름을 사용한다. import 구문은 표준 라이브러리로부터 log와 sync 패키지를 가져온다.

외부 라이브러리의 코드를 가져올 때와는 다르게 표준 라이브러리로부터 코드를 가져올 때는 패키지의 이름만 지정하면 된다. 그러면 컴파일러는 GOROOT 및 GOPATH 환경 변수에 정의된 위치를 기준으로 가져올 패키지를 탐색한다.

```go
// A map of registered matchers for searching.
var matchers = make(map[string]Matcher)
```

이 변수는 앞으로 구현할 함수들으 ㅣ외부에 선언된 변수이기 때문에 패키지 수준의 변수로 인식된다. 자바의 클래스 변수, 전역 변수와 비슷하다. 이 변수는 var 키워드를 이용해 선언했으며 string 타입의 키와 Matcher 타입의 값으로 구성된 map 타입으로 선언되었다. Matcher 타입은 match.go 코드 파일에 선언되어 있다. 주의할 점은 변수의 이름 matchers가 소문자로 시작한다는 점이다.

**Go의 변수 접근범위**

Go에서의 식별자들은 패키지 외부로 노출이 되는 것과 노출이 되지 않는 것으로 구분할 수 있다. 외부로 노출되는 식별자들은 다른 패키지가 해당 패키지를 가져오면 곧바로 접근이 가능한 식별자들이다. 이런 식별자들의 이름은 대문자로 시작한다. 반면, 노출되지 않는 식별자들의 이름은 소문자로 시작하며 이 경우 다른 패키지의 코드가 직접 접근할 수 없다. 하지만 노출되지 않는 식별자들도 다른 패키지의 코드가 간접적으로 접근할 수 있는 방법은 있다. 예를 들어, 노출되지 않는 타입의 값을 리턴하는 함수를 호출한 함수는 설령 다른 패키지에 정의되었다 하더라도 호출한 함수의 리턴 값에 의해 그 타입에 접근이 가능하다.

**Go에서 맵의 타입**

또한, 이 변수의 선언문을 통해 대입 연산자와 특수한 내장 함수인 make 함수를 이용해 변수를 초기화하는 방법도 알 수 있다. 맵(map)은 make 함수를 이용해 Go 런타임에 생성을 요청해야 하는 참조 타입(reference type)이다. 맵을 먼저 생성한 후 변수에 대입하지 않으면 맵 변수에 접근할 대입하지 않으면 맵 변수에 접근할 때 오류가 발생한다. 그 이유는 맵 변수의 제로 값(zero value)이 nil이기 때문이다.

Go에서는 모든 변수가 제로 값으로 초기화된다. 숫자 타입의 경우는 0으로 초기화되고, 문자열은 빈 문자열로 초기화되며, 불리언(boolean)은 false로 초기화된다. 그리고 포인터의 경우는 제로 값으로 nil이 사용된다. 반면, 참조 타입의 경우는 각 기반 타입의 제로 값으로 초기화된 데이터 구조가 사용된다. 그러나 참조 타입으로 선언된 변수 자체의 제로 값은 nil이다.

```go
// Run performs the search logic.
func Run(searchTerm string) {
	// Retrieve the list of feeds to search through.
	feeds, err := RetrieveFeeds()
	if err != nil {
		log.Fatal(err)
	}

	// Create an unbuffered channel to receive match results to display.
	results := make(chan *Result)

	// Setup a wait group so we can process all the feeds.
	var waitGroup sync.WaitGroup

	// Set the number of goroutines we need to wait for while
	// they process the individual feeds.
	waitGroup.Add(len(feeds))
  
	// Launch a goroutine for each feed to find the results.
	for _, feed := range feeds {
		// Retrieve a matcher for the search.
		matcher, exists := matchers[feed.Type]
		if !exists {
			matcher = matchers["default"]
		}

		// Launch the goroutine to perform the search.
		go func(matcher Matcher, feed *Feed) {
			Match(matcher, feed, searchTerm, results)
			waitGroup.Done()
		}(matcher, feed)
	}  

	// Launch a goroutine to monitor when all the work is done.
	go func() {
		// Wait for everything to be processed.
		waitGroup.Wait()

		// Close the channel to signal to the Display
		// function that we can exit the program.
		close(results)
	}()

	// Start displaying results as they are available and
	// return after the final result is displayed.
	Display(results)
}
```

Run 함수는 프로그램의 주요 제어 로직을 구현한 함수다. 이 예제는 고루틴들을 동시에 실행하고 동기화하기 위해 Go 프로그램을 어떻게 구성해야 하는지를 잘 보여주고 있다.

**Go에서 함수의 선언**

```go
// Run performs the search logic.
func Run(searchTerm string) {
```

Go에서는 함수를 선언할 때, func 키워드를 사용한 후 함수의 이름과 함수의 매개변수, 그리고 리턴 값을 차례대로 지정하면 된다. Run 함수의 경우 searchTerm이라는 string 타입의 매개변수 하나만을 정의하고 있다. 프로그램이 피드 내에서 검색할 단어는 Run 함수의 매개변수를 통해 전달되며, main 함수에서 살펴봤듯이 이 값은 변경될 수도 있다.

**여러개의 값을 리턴**

```go
	// Retrieve the list of feeds to search through.
	feeds, err := RetrieveFeeds()
	if err != nil {
		log.Fatal(err)
	}
```

RetriveFeeds 함수를 호출하는 코드가 작성되어 있는데, 이 함수는 search 패키지에 선언되어 있으며 두 개의 값을 리턴한다. 첫 번째 리턴 값은 Feed 타입 값의 슬라이스다.

> 슬라이스(slice)는 동적 배열을 구현한 참조 타입이며, Go에서 데이터의 목록을 처리할 때 사용한다.

두 번째 리턴 값은 오류(error)다. 오류 리턴 값이 오류로 평가되어 오류가 발생했던 것이 확인되면 log 패키지의 Fatal 함수를 호출한다. Fatal 함수는 오류 값을 전달받아 프로그램이 종료되기 전에 오류 내용을 터미널 창에 출력한다.

Go의 함수는 여러 개의 리턴 값을 가질 수 있다. 그래서 Go에서는 RetriveFeeds 함수처럼 어떤 값과 오류 값을 함께 리턴하도록 함수를 작성하는 것이 일반적이다. 만일 오류가 발생하면 함수가 리턴한 다른 값들은 절대 믿어서는 안 된다. 오류가 발생했다면 반드시 그 함수의 리턴 값들은 무시해야 한다. 그렇지 않으면 갖가지 오류와 혼란을 맞닥뜨릴 위험이 있다.

**변수 선언 연산자(:=)**

위 코드에서 단축 버전의 변수 선언 연산자(:=)를 사용하고 있다. 이 연산자는 변수의 선언과 초기화를 동시에 수행한다. 각각의 변수 타입은 컴파일러가 함수의 리턴 값들을 확인한 후에 결정된다. 단출 변수 선언 연산자는 코드의 가독성을 향상시키기 위해 제공되는 연산자다. 이 연산자를 통해 선언된 변수는 var 키워드를 통해 선언된 변수와 아무런 차이가 없다.

```go
	// Create an unbuffered channel to receive match results to display.
	results := make(chan *Result)
```

**채널(Channel)**

make 내장 함수를 이용해 버퍼가 없는(unbuffered) 채널을 생성하고 있다. 이때 앞에서와 마찬가지로, 단축 변수 선언 연산자를 통해 make 함수를 호출한 결과를 바탕으로 변수를 선언과 동시에 초기화하고 있다. 변수를 선언할 때 적용되는 규칙은 다음과 같다. 제로값으로 초기화될 변수를 선언할 때는 var 키워드를 이용하고, 함수 호출이나 다른 초기화 로직을 통해 변수를 초기화하는 경우에는 단축 변수 선언 연산자를 사용한다.

> Go의 채널(channel)은 맵이나 슬라이스와 마찬가지로 참조 타입이지만 다른 타입들과 달리 채널은 고루틴 사이의 데이터 통신에 사용될 특정 타입의 값들을 위한 큐(queue)를 구현하고 있다. 또한 안전한 통신을 위해 기본적으로 동기화 알고리즘을 내장하고 있다.

**sync의 WaitGroup**

```go
	// Setup a wait group so we can process all the feeds.
	var waitGroup sync.WaitGroup

	// Set the number of goroutines we need to wait for while
	// they process the individual feeds.
	waitGroup.Add(len(feeds))
```

위 코드는 검색어 처리를 완료한 후 프로그램이 곧바로 종료되는 것을 막기 위한 목적으로 사용된다.

Go에서는 main 함수가 리턴되면 프로그램 자체가 종료된다. 이때 Go 런타임은 이미 실행되어 아직 동작중인 고루틴들 역시 함께 종료해버린다. 동시성 프로그램을 작성할 때는 main 함수가 리턴되기 전에, 앞서 실행 중인 고루틴들을 모두 깔끔하게 종료하는 것이 최선이다. 이렇게 매끄럽게 시작하고 종료하는 프로그램을 작성하면 버그도 줄어들고 리소스의 잘못된 사용을 방지할 수 있다.

이 프로그램은 sync 패키지의 WaitGroup을 이용하여 앞으로 실행하게 될 모든 고루틴들을 추적한다.

> WaitGrouop은 특정 고루틴이 작업을 완료했는지를 추적할 수 있는 편리한 기능을 제공한다. WaitGroup은 카운팅 세마포어(counting semaphore)여서 고루틴의 실행이 종료될 때마다 전체 개수를 하나씩 줄여나간다.

위 코드에서는 sync 패키지의 타입 변수를 선언하고, WaitGroup 타입 변수가 앞으로 실행할 고루틴의 개수만큼의 값을 가질 수있도록 설정한다. 각각의 피드는 별도의 고루틴을 통해 동시에 처리되며, 각 고루틴의 실행이 종료될 때마다 WaitGroup 변수의 값을 하나식 감소시킬 것이므로 결국 이 값이 0이 되는 시점이 모든 작업이 완료되는 시점이라는 것을 알 수 있다.

**익명 함수**

```go
	// Launch a goroutine for each feed to find the results.
	for _, feed := range feeds {
		// Retrieve a matcher for the search.
		matcher, exists := matchers[feed.Type]
		if !exists {
			matcher = matchers["default"]
		}

		// Launch the goroutine to perform the search.
		go func(matcher Matcher, feed *Feed) {
			Match(matcher, feed, searchTerm, results)
			waitGroup.Done()
		}(matcher, feed)
	}
```

위 코드는 앞서 조회한 모든 데이터 피드의 목록을 대상으로 루프를 실행하면서 각각의 피드를 처리할 고루틴을 하나씩 실행한다. 피드의 슬라이스를 탐색할 때는 예제에서처럼 range 키워드를 사용하면 된다. 이 키워드는 배열, 문자열, 슬라이스, 맵 및 채널과 함께 사용할 수 있다. for range 구문을 이용해 슬라이스를 탐색하면 슬라이스 내의 각 요소마다 두 개의 값을 돌려받는다. 첫 번째 값은 현재 탐색 중인 요소의 인덱스이며, 두 번째 값은 탐색 중인 요소의 복사본이다.

for range 구문을 자세히 보면 여기서도 빈 식별자(_)를 사용하고 있음을 알 수 있다. 첫 번째는 main.go 파일에서 matchers 패키지를 가져올 때 사용했었고, 이번에는 range 키워드를 호출할 때 인덱스 값이 대입될 변수를 대체하기 위한 용도로 빈 식별자를 사용하고 있다. 여러 개의 리턴 값을 가지는 함수를 호출할 때 그 중 필요하지 않은 리턴 값이 있으면 빈 식별자를 이용해 특정 리턴 값을 무시할 수 있다. 예제의 경우는 인덱스 값을 사용하지 않을 것이므로 인덱스 값을 무시하기 위한 용도로 빈 식별자를 사용했다.

이 루프에서 가장 먼저 하는 일은 특정 피드 타입을 처리할 Matcher 타입의 값이 맵에 존재하는지 확인하는 일이다. 우선 맵에서 피드 타입에 일치하는 키가 존재하는지 확인한다. 맵에서 키를 조회할 때는 리턴 값을 대입할 변수를 하나만 선언해도 되고 두 개를 선언해도 된다. 이 경우 첫 번째 리턴 값은 검색된 키에 해당하는 값이며, 두 번째 리턴 값은 키가 존재하는지를 표현하는 불리언 값이다. 첫 번째 리턴 값은 키가 존재하지 않는 경우에는 키의 타입에 해당하는 제로 값을 리턴한다. 당연히 키가 존재한다면 해당 키의 **값에 대한 복사본**을 리턴한다.

코드를 보면, 맵에 키가 존재하는지 확인한 후 키가 존재하지 않으면 기본 검색기를 대입하는 것을 알 수 있다. 이렇게 해서 프로그램이 지원하지 않는 형식의 피드를 처리할 때도 문제가 발생하지 않도록 할 수 있다. 이후에는 검색을 수행할 고루틴을 실행한다.

> 고루틴(goroutine)은 프로그램 내의 다른 함수와는 독립적으로 실행되는 함수이다. 고루틴을 실행하고 동시적 실행을 위한 스케줄링을 시도할 때는 go 키워드를 사용한다.

`go func(matcher Matcher, feed *Feed)` 부분을 보면 go 키워드를 이용해 **익명 함수(anonymous function)**를 고루틴으로서 실행하고 있다. 현재 이 코드가 실행 중인 루프 내에서는 각각의 피드를 익명 함수를 이용해 처리하고 있다. 이렇게 함으로써 각각의 피드를 동시에 독립적으로 처리할 수 있다.

> 익명 함수(anonymous function)란 이름 없이 선언된 함수를 의미한다. 따라서 재사용하거나 외부에서 참조하는 것을 불가능하다.

이 예제에서 익명 함수를 사용하는 방법을 통해 알 수 있듯이, 익명 함수 역시 매개변수를 가질 수 있다. 위에서 선언된 익명 함수는 검색을 처리할 검색기를 전달받은 Matcher 타입의 매개변수와 처리할 피드를 가리키는 Feed 타입의 값에 대한 주소를 전달받을 매개변수를 정의하고 있다. 즉, 두 번째 매개변수는 포인터 변수라는 뜻이다. 포인터 변수를 이용하면 함수 간에 변수를 쉽게 공유할 수 있다. 이는 여러 함수들이 다른 함수나 다른 고루틴에 선언된 변수의 상태에 접근하거나 변경하는 것이 가능하다는 뜻이다.

마지막 부분에서는 matcher 매개변수와 feed 매개변수의 값을 익명 함수에 전달한다. Go의 모든 변수들은 값에 의해 전달된다. 포인터 변수 역시 메모리상의 주소를 가리키는 값을 가지고 있으므로 함수 간에 포인터 변수를 전달하는 것 역시 값에 의한 전달로 처리된다.

```go
			Match(matcher, feed, searchTerm, results)
			waitGroup.Done()
```

해당 코드에서는 고루틴의 동작을 구현하고 있다. 이 고루틴이 수행하는 첫 번째 작업은 match.go 파일에서 선언한 Match 함수를 호출하는 것이다. Match 함수는 Matcher 타입의 값과 Feed 타입의 포인터 값, 검색어, 그리고 결과를 출력할 채널 등 네 개의 매개변수를 필요로 한다. 이 함수는 간단히 말하면 지정된 피드를 대상으로 검색을 수행하고 일치하는 검색어를 통해 리턴한다.

Match 함수 호출이 완료되면 `waitGroup.Done()`이 실행되어 WaitGroup 내의 카운터 값을 감소시킨다. 모든 고루틴이 Match 함수를 호출한 후 Done 메서드를 호출하면 우리 프로그램은 각각의 피드가 처리되고 있음을 알 수 있다.

**클로저(closure)**

Done 메서드와 관련된 한 가지 재미있는 사실은 WaitGroup 값이 실제로는 익명 함수에 매개변수로 전달된 적이 없음에도 불구하고 익명 함수 내에서 사용되고 있다는 점이다. 이는 Go가 클로저(closure)를 지원하기 때문에 가능한 일이다. 사실 searchTerm과 results 변수에 대해서도 마찬가지로 익명 함수가 클로저를 통해 접근할 수 있다. 클로저 덕분에 이들은 굳이 매개변수로 전달하지 않고서도 접근이 가능하다. 익명함수에는 이들 변수의 복사본이 전달되지 않고, 외부 함수의 범위에 선언된 변수들에 직접 접근하게 된다. 그렇기 때문에 matcher와 feed 변수는 매개변수로써 함수에 전달했다.

```go
	// Launch a goroutine for each feed to find the results.
	for _, feed := range feeds {
		// Retrieve a matcher for the search.
		matcher, exists := matchers[feed.Type]
```

feed와 matcher 매개변수의 값은 루프가 실행될 때마다 변경된다. 이 두 변수에 클로저를 통해 접근하면 외부 함수에서 이 변수들의 값을 바꿔버리기 때문에 익명 함수가 실행되면서 바뀌어버린 검색기와 피드를 그대로 사용하게 된다. 즉, 모든 고루틴이 익명 함수가 실행되면서 바꿔버린 변수들을 공유하게 된다는 뜻이다. 따라서 이 두 변수를 익명 함수의 매개변수로 전달하지 않으면 대부분의 고루틴이 같은 피드(즉, 피드 목록 슬라이스의 가장 마지막에 저장된 피드)를 대상으로 같은 검색기를 이용해 로직을 수행하게 된다.

검색을 위한 고루틴들이 모두 실행되어 그 결과들이 채널을 통해 전달되고 waitGroup 변수의 카운터가 줄어들면, 이 결과들을 화면에 표시해야 한다. 물론 결과를 출력하는 동안 main 함수가 종료되지 않도록 하는 처리도 필요하다.

```go
	// Launch a goroutine to monitor when all the work is done.
	go func() {
		// Wait for everything to be processed.
		waitGroup.Wait()

		// Close the channel to signal to the Display
		// function that we can exit the program.
		close(results)
	}()

	// Start displaying results as they are available and
	// return after the final result is displayed.
	Display(results)
```

위 코드는 또 하나의 익명 함수를 고루틴으로서 실행한다. 이 익명 함수는 매개변수를 전혀 사용하지 않으며, 클로저를 호출하여 WaitGroup과 results 변수에 접근한다. 이 고루틴은 WaitGroup 값의 Wait 메서드를 호출하여 WaitGroup 내의 카운터 값이 0이 될 때까지 고루틴의 실행을 중단한다. 카운터 값이 0이 되면, 이 고루틴의 채널 내장 함수인 close 함수를 호출하고 그러면 프로그램이 종료될 것이다.

Run 함수의 마지막 완성은 Display 함수를 호출하는 것이다. 이 함수는 match.go 코드 파일에 선언되어 있다. 이 함수는 채널 내의 모든 검색 결과를 화면에 출력하며, 이 함수가 리턴되어야 프로그램이 종료된다.
