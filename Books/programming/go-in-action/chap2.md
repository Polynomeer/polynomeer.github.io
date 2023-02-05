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

### 2.3.2 feed.go

이 함수는 data.json 파일을 읽어 그 안의 데이터 피드를 슬라이스 타입으로 리턴한다. 이 피드 목록은 각각의 검색기를 통해 검색할 콘텐츠를 가져오기 위한 피드 목록이다.

```go
package search

import (
	"encoding/json"
	"os"
)

const dataFile = "data/data.json"

// Feed contains information we need to process a feed.
type Feed struct {
	Name string `json:"site"`
	URI  string `json:"link"`
	Type string `json:"type"`
}

// RetrieveFeeds reads and unmarshals the feed data file.
func RetrieveFeeds() ([]*Feed, error) {
	// Open the file.
	file, err := os.Open(dataFile)
	if err != nil {
		return nil, err
	}

	// Schedule the file to be closed once
	// the function returns.
	defer file.Close()

	// Decode the file into a slice of pointers
	// to Feed values.
	var feeds []*Feed
	err = json.NewDecoder(file).Decode(&feeds)

	// We don't need to check for errors, the caller can do this.
	return feeds, err
}
```

**패키지 및 임포트**

search 폴더에 있으므로 search 패키지 이름을 사용한다. 이어서 표준 라이브러리로부터 두 개의 패키지를 가져오는 코드가 작성되어있다. json 패키지는 JSON 데이터를 인코딩/디코딩하는 기능을 제공하며, os 패키지는 파일을 읽는 등의 운영체제 기능을 활용할 수 있는 패키지다.

json 패키지를 가져오려면 폴더 경로에 encoding 폴더의 경로를 포함해야 한다. 하지만 패키지를 지정하기 위한 경로와는 무관하게 패키지의 이름은 json으로 참조하면 된다. 이 규칙은 표준 라이브러리에 포함된 패키지에는 동일하게 적용된다.

**상수 선언**

08번 줄에서는 dataFile이라는 이름의 상수를 선언하고, 이 상수에 디스크상의 데이터 파일을 가리키는 상대 경로를 표현하는 문자열을 대입했다. Go 컴파일러는 대입 연산자 오른쪽의 값을 바탕으로 변수의 타입을 유추할 수 있기 때문에 상수를 선언할 때 타입을 명시할 필요가 없다. 또한 상수 이름이 소문자이므로 이 상수는 외부로 노출되지 않는 비공개 상수가 된다.

**JSON 문서를 디코딩할 구조체**

```json
[
  {
    "site": "npr",
    "link": "http://www.npr.org/rss/rss.php?id=1001",
    "type": "rss"
  },
  {
    "site": "npr",
    "link": "http://www.npr.org/rss/rss.php?id=1008",
    "type": "rss"
  },
  ...
]
```

data.json의 내용은 위와 같은데, 프로그램 내에서 사용하려면 디코딩을 통해 구조체의 슬라이스로 변환해야 한다. 

```go
// Feed contains information we need to process a feed.
type Feed struct {
	Name string `json:"site"`
	URI  string `json:"link"`
	Type string `json:"type"`
}
```

Feed 구조체는 패키지 외부로 노출되는 타입이다. 이 구조체는 데이터 파일의 JSON 문서에 정의된 필드들에 대응하는 세 개의 필드를 정의하고 있다. 필드의 선언부를 살펴보면 JSON 디코딩 함수가 Feed 타입 값들의 슬라이스를 생성할 때 참조할 메타데이터를 제공하는 태그를 함께 선언되어 있음을 볼 수 있다. 각 태그는 구조체 타입의 필드 이름과 JSON 문서 내의 필드 이름을 매핑하고 있다.

**RetrieveFeeds 함수**

```go
// RetrieveFeeds reads and unmarshals the feed data file.
func RetrieveFeeds() ([]*Feed, error) {
	// Open the file.
	file, err := os.Open(dataFile)
	if err != nil {
		return nil, err
	}

	// Schedule the file to be closed once
	// the function returns.
	defer file.Close()

	// Decode the file into a slice of pointers
	// to Feed values.
	var feeds []*Feed
	err = json.NewDecoder(file).Decode(&feeds)

	// We don't need to check for errors, the caller can do this.
	return feeds, err
}
```

RetrieveFeeds 함수는 데이터 파일을 읽어, 각각의 JSON 문서를 디코딩하여 Feed 타입 값의 슬라이스로 변환하는 역할을 수행한다. 이 함수는 매개변수를 정의하지 않으며 두 개의 값을 리턴한다. 첫 번째 리턴 값은 Feed 타입 값들의 슬라이스에 대한 포인터다. 두 번째 리턴 값은 함수 호출이 성공하지 못한 경우에 이를 보고하기 위한 error 값이다.

그리고 os 패키지를 이용해 데이터 파일을 열고 있다. Open 메서드를 호출할 때 데이터 파일의 상대 경로를 지정하면 두 개의 리턴 값을 전달받을 수 있다. 첫 번째 리턴 값은 File 타입 구조체에 대한 포인터이며, 두 번째 리턴 값은 Open 메서드 호출이 성공했는지를 판단하기 위한 에러 값이다. 그 다음 줄에서 바로 에러 값을 체크하여 파일을 올바르게 열었는지 확인한 후, 만일 그렇지 않다면 에러를 리턴한다.

파일을 성공적으로 열었다면 그 다음 코드가 이어서 실행되며, 여기서는 defer 키워드를 활용한다. defer 키워드는 함수가 리턴된 직후에 실행될 작업을 예약하기 위한 키워드다. **필요한 작업을 수행한 후 파일을 닫는 것은 전적으로 개발자의 몫이다.** 이 경우 defer 키워드를 이용하면 close 메서드 호출을 예약하여 이 메서드가 반드시 호출되도록 보장할 수 있다. 이렇게 예약된 작업은 심지어 함수가 패닉 상태에 빠져 예상치 못하게 종료되더라도 반드시 실행된다. defer 키워드를 이용하면 파일을 여는 코드 주변에 파일을 닫기 위한 코드를 작성할 수 있기 때문에 가독성이 향상되는 것은 물론, 개발자의 실수로 인한 버그도 줄일 수 있다.

그 다음 줄에서는 feeds라는 이름으로 빈 슬라이스 변수를 생성한다. 이 변수는 Feed 타입 값들에 대한 포인터 변수다. json 패키지의 NewDecoder 함수는 앞서 Open 메서드를 통해 열었던 파일의 핸들을 전달받아, 이 파일을 디코딩할 수 있는 Decoder 타입의 포인터 값을 리턴한다. 이 포인터 값을 통해 Decode 메서드를 호출하면서 슬라이스의 주소를 전달한다. 그러면 Decode 메서드는 데이터 파일을 디코딩하여 우리가 전달한 슬라이스에 Feed 타입 값들을 채운다.

마지막 줄에서는 슬라이스와 에러 값을 호출 함수에 리턴한다. 이 예제의 경우 함수 내에서 Decode 메서드를 호출한 후 에러 값을 체크할 필요가 없다. 이 함수가 실행되고 나면 이 함수를 호출한 함수가 에러 값을 체크하여 이후의 작업을 수행할지 판단하면 되기 때문이다.

> **Decode 메서드**
>
> ```go
> func (dec *Decoder) Decode(v interface{}) error
> ```
>
> Decode 메서드는 어떤 타입이든 받아들일 수 있도록 설계되어 있다. Decode 메서드의 매개변수는 interface{} 타입의 값을 전달받는다. 이 값은 Go에서는 특별하게 취급하는 타입이며, reflect 패키지를 이용한 리플렉션(reflection) 지원이 가능한 타입이다.

### 2.3.3 match.go/default.go

**match.go**

match.go 파일에는 search 패키지의 Run 함수가 사용할 여러 종류의 검색기를 생성하기 위한 코드가 작성되어 있다.

```go
package search

import (
	"log"
)

// Result contains the result of a search.
type Result struct {
	Field   string
	Content string
}

// Matcher defines the behavior required by types that want
// to implement a new search type.
type Matcher interface {
	Search(feed *Feed, searchTerm string) ([]*Result, error)
}

// Match is launched as a goroutine for each individual feed to run
// searches concurrently.
func Match(matcher Matcher, feed *Feed, searchTerm string, results chan<- *Result) {
	// Perform the search against the specified matcher.
	searchResults, err := matcher.Search(feed, searchTerm)
	if err != nil {
		log.Println(err)
		return
	}

	// Write the results to the channel.
	for _, result := range searchResults {
		results <- result
	}
}

// Display writes results to the console window as they
// are received by the individual goroutines.
func Display(results chan *Result) {
	// The channel blocks until a result is written to the channel.
	// Once the channel is closed the for loop terminates.
	for result := range results {
		log.Printf("%s:\n%s\n\n", result.Field, result.Content)
	}
}
```

**구조체 선언부**

먼저, Matcher라는 이름의 인터페이스 타입을 선언하고 있다. 이는 구조체 타입과는 다르며, 구조체나 다른 명명된 타입들이 어떤 조건을 만족하기 위해 구현해야 하는 **동작**을 정의하는 타입이다. 인터페이스의 동작은 타입 내부에 선언된 메서드에 의해 정의된다.

Matcher 인터페이스의 경우는 Search라는 하나의 메서드만을 선언하고 있다. 이 메서드는  Feed 타입에 대한 포인터와 string 타입으로 표현된 검색어를 매개변수로 전달받는다. 또한 이 메서드는 Result 타입의 포인터에 대한 슬라이스와 에러 값 등 두 개의 값을 리턴한다.

> 인터페이스를 정의할 때는 Go의 네이밍 규칙을 준수하는 것이 좋다. 인터페이스가 하나의 메서드만을 선언하고 있다면 인터페이스의 이름은 er 접미사로 끝나야 한다. 예를 들어, Matcher는 Search라는 하나의 메서드를 선언하므로 er로 끝난다.

**Match 함수**

이 함수는 Matcher 인터페이스를 구현하는 값이나 포인터에 의해 실제 검색을 수행하는 함수다. Matcher 타입의 값을 첫 번째 매개변수를 통해 전달받는다. 따라서 이 매개변수에는 Matcher 인터페이스를 구현한 타입의 값이나 포인터만 전달할 수 있다. defaultMatcher 타입은 이제 값 수신기로 선언된 인터페이스를 구현하고 있기 때문에 defaultMatcher 타입의 값이나 포인터 역시 이 함수에 전달할 수 있다.

함수의 첫 번째 줄을 보면, 함수에 전달된 Matcher 타입의 값에 대해 Search 메서드를 호출한다. 이 시점에서 Matcher 매개변수에 대입된 타입에서 구현한 Search 메서드가 실행된다. 일단 Search 메서드가 리턴되면, 그 다음 줄에서 에러 값을 검사하여 에러가 발생했는지 확인한다. 에러가 발생했으면 에러 내용을 로그에 기록한 후 리턴한다. 그렇지 않다면 검색 결과가 존재할 것이므로 이 검색 결과를 채널에 기록해서 이 채널을 리스닝하는 main 함수에 검색 결과를 전달한다.

마지막 줄에서는 for range 루프를 돌면서 검색 결과를 기록한다. 그러면 Display 함수에서 채널을 닫은 후 모든 검색 결과를 콘솔 창에 출력한다.

**Display 함수**

이 함수는 검색 고루틴들이 전달한 검색 결과들을 기록하기 전까지 프로그램이 종료되지 않도록 한다. 이는 채널을 이용한 덕분에 리턴되기 전에 모든 검색 결과를 처리할 수 있다. 그 과정은 채널이 닫히는 시점에 채널과 range 함수의 동작에 달려있다.

**default.go**

```go
package search

// defaultMatcher implements the default matcher.
type defaultMatcher struct{}

// init registers the default matcher with the program.
func init() {
	var matcher defaultMatcher
	Register("default", matcher)
}

// Search implements the behavior for the default matcher.
func (m defaultMatcher) Search(feed *Feed, searchTerm string) ([]*Result, error) {
	return nil, nil
}
```

default.go 파일에는 init이라는 특별한 함수가 선언되어 있다. 이 함수는 main.go 파일에서와 마찬가지로 프로그램 내에 선언된 모든 init 함수는 main 함수가 실행되기 이전에 호출된다. 컴파일러는 init 함수를 발견하면 main 함수를 호출하기 전에 이 함수를 호출하도록 예약한다. 그리고 default.go 파일의 함수는 필요한 동작을 수행한다. 그 동작이란, defaultManager 타입의 값을 생성하고 그 값을 search.go 파일에 선언된  Register 함수에 전달하여 검색기를 등록하는 것이다.

## 2.4 RSS 검색기

RSS 검색기의 구조는 기본 검색기의 구조와 거의 동일하다. 단 한 가지 다른 점은 인터페이스의 메서드인 Search 메서드를 구현하는 과정이며, 바로 이 부분을 통해 각 검색기가 고유한 동작을 수행하게 된다.

**package 선언부**

```go
package matchers

import (
	"encoding/xml"
	"errors"
	"fmt"
	"log"
	"net/http"
	"regexp"

	"github.com/goinaction/code/chapter2/sample/search"
)
```

패키지 이름은 matchers라는 폴더에 저장할 것이므로 동일하게 matchers로 정의한다. 다음으로 표준 라이브러리로부터 6개의 패키지를 가져온다. 그 외에 search 패키지도 가져온다. 앞서 언급했듯 xml이나 http 같은 일부 표준 라이브러리는 표준 라이브러리의 서브폴더에서 가져와야 한다.

**구조체 정의**

```go
type (
	// item defines the fields associated with the item tag
	// in the rss document.
	item struct {
		XMLName     xml.Name `xml:"item"`
		PubDate     string   `xml:"pubDate"`
		Title       string   `xml:"title"`
		Description string   `xml:"description"`
		Link        string   `xml:"link"`
		GUID        string   `xml:"guid"`
		GeoRssPoint string   `xml:"georss:point"`
	}

	// image defines the fields associated with the image tag
	// in the rss document.
	image struct {
		XMLName xml.Name `xml:"image"`
		URL     string   `xml:"url"`
		Title   string   `xml:"title"`
		Link    string   `xml:"link"`
	}

	// channel defines the fields associated with the channel tag
	// in the rss document.
	channel struct {
		XMLName        xml.Name `xml:"channel"`
		Title          string   `xml:"title"`
		Description    string   `xml:"description"`
		Link           string   `xml:"link"`
		PubDate        string   `xml:"pubDate"`
		LastBuildDate  string   `xml:"lastBuildDate"`
		TTL            string   `xml:"ttl"`
		Language       string   `xml:"language"`
		ManagingEditor string   `xml:"managingEditor"`
		WebMaster      string   `xml:"webMaster"`
		Image          image    `xml:"image"`
		Item           []item   `xml:"item"`
	}

	// rssDocument defines the fields associated with the rss document.
	rssDocument struct {
		XMLName xml.Name `xml:"rss"`
		Channel channel  `xml:"channel"`
	}
)
```

RSS 문서를 디코딩하여 프로그램 내에서 문서 데이터를 처리하려면 위와 같이 네 개의 구조체 타입을 정의해야 한다. 이 구조체들을 이용하면 이 구조와 일치하는 모든 RSS 문서들을 처리할 수 있다. XML을 디코딩하는 방법은 feed.go 파일에서 JSON 문서를 디코딩하는 방법과 완전히 동일하다.

**rssMatcher 타입 선언**

```go
// rssMatcher implements the Matcher interface.
type rssMatcher struct{}
```

이 코드는 defaultMatcher 타입을 선언했을 때와 동일하다. Matcher 인터페이스를 구현할 뿐 관리해야 할 상태가 없기 때문에 빈 구조체를 사용해도 무방하다.

**init 함수를 통한 검색기 등록**

```go
// init registers the matcher with the program.
func init() {
	var matcher rssMatcher
	search.Register("rss", matcher)
}
```

기본 검색기를 등록하던 방법과 마찬가지로, init 함수를 통해 rssMatcher 타입을 프로그램에 등록하면 된다.

**retrieve 메서드**

```go
// retrieve performs a HTTP Get request for the rss feed and decodes the results.
func (m rssMatcher) retrieve(feed *search.Feed) (*rssDocument, error) {
	if feed.URI == "" {
		return nil, errors.New("No rss feed uri provided")
	}

	// Retrieve the rss feed document from the web.
	resp, err := http.Get(feed.URI)
	if err != nil {
		return nil, err
	}

	// Close the response once we return from the function.
	defer resp.Body.Close()

	// Check the status code for a 200 so we know we have received a
	// proper response.
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("HTTP Response Error %d\n", resp.StatusCode)
	}

	// Decode the rss feed document into our struct type.
	// We don't need to check for errors, the caller can do this.
	var document rssDocument
	err = xml.NewDecoder(resp.Body).Decode(&document)
	return &document, err
}
```

비공개 메서드인 retrieve 메서드는 각각의 피드 링크를 이용해 RSS 문서를 웹에서 다운로드한다. http 패키지의 Get 메서드를 호출하고, Get 메서드가 리턴되면 Response 타입에 대한 포인터가 리턴된다.

에러를 검사한 후 올바른 응답을 얻었다면 defer 키워드를 통해 Close 메서드의 호출을 예약한다.

그 다음 줄에서는 Response 값의 StatusCode 필드를 확인해서 200이라는 값을 전달받았는지를 확인한다. 200이 아닌 다른 값이 전달되었다면 그 응답은 오류로 처리해야 한다. 따라서 200이 아닌 경우에는  fmt 패키지의 Errorf 함수를 이용해 사용자정의 에러를 리턴한다.

마지막 세 줄의 코드는 JSON 데이터 파일을 디코드할 때의 코드와 거의 유사하다. 이번에는  xml 패키지에 정의된 NewDecoder라는 동일한 이름의 함수를 호출하면 Decoder 타입에 대한 포인터를 리턴받는다. 이 포인터를 이용해서 Decode 메서드를 호출하면서 rssDocument 타입의 지역 변수인 document 변수의 주소를 전달한다. 그러면 rssDocument 타입 값의 주소와 에러가 리턴된다.

**Search 메서드**

```go
// Search looks at the document for the specified search term.
func (m rssMatcher) Search(feed *search.Feed, searchTerm string) ([]*search.Result, error) {
	var results []*search.Result

	log.Printf("Search Feed Type[%s] Site[%s] For URI[%s]\n", feed.Type, feed.Name, feed.URI)

	// Retrieve the data to search.
	document, err := m.retrieve(feed)
	if err != nil {
		return nil, err
	}

	for _, channelItem := range document.Channel.Item {
		// Check the title for the search term.
		matched, err := regexp.MatchString(searchTerm, channelItem.Title)
		if err != nil {
			return nil, err
		}

		// If we found a match save the result.
		if matched {
			results = append(results, &search.Result{
				Field:   "Title",
				Content: channelItem.Title,
			})
		}

		// Check the description for the search term.
		matched, err = regexp.MatchString(searchTerm, channelItem.Description)
		if err != nil {
			return nil, err
		}

		// If we found a match save the result.
		if matched {
			results = append(results, &search.Result{
				Field:   "Description",
				Content: channelItem.Description,
			})
		}
	}

	return results, nil
}
```

먼저, var 키워드를 이용하여 nil로 초기화된 Result 타입 값의 슬라이스 변수를 선언한다. 그리고 retrieve 메서드를 호출해서 웹 요청을 생성한다. retriee 메서드를 호출하면 rssDocument 타입에 대한 포인터와 에러 값이 리턴된다. 그 후 지금까지 살펴본 코드와 마찬가지로, 에러 값을 검사하여 이 값이 존재하면 에러를 리턴한다. 에러 값이 존재하지 않는다면, 결과를 대상으로 루프를 실행하면서 RSS 문서의 title과 description 필드에 검색어가 포함되어 있는지 확인한다.

document.Channel.Item 값은 item 타입 값의 슬라이스이므로 for range 구문을 이용하여 모든 아이템들을 반복해서 조회할 수 있다. 그 다음 줄에서는  regexp 패키지의 MatchString 함수를 이요하여 channelItem 변수의 Title 필드의 값에 검색어가 존재하는지 확인한다. 그리고 이러를 검사하여 에러가 존재하지 않으면 결과를 확인한다.

만일 MatchString 메서드를 호출한 결과인 matched 변수의 값이 true이면 내장함수인 append 함수를 호출하여 results 슬라이스에 검색 결과를 추가한다. append 내장 함수는 필요에 따라 슬라이스의 크기와 길이를 증가시키는 함수이다. append 메서드의 첫 번째 매개변수는 값을 덧붙일 슬라이스 값이며, 두 번째 매개변수는 슬라이스에 추가하고자 하는 값이다. 예제는 Result 타입의 값을 선언하고 초기화하기 위해 구조체 표현식(struct literal)을 사용했으므로 앰퍼샌드 연산자(&)를 이용하여 슬라이스가 저장된 메모리의 주소를 가져왔다.

제목 부분에 대한 검색을 마친 후에는 동일한 검색 로직을 상세 설명 필드에 대해 한 번 더 수행한다. 마지막으로 최종 검색 결과를 호출 함수에 리턴한다.

## 2.5 요약

- 모든 코드 파일은 패키지에 속해야 하며, 패키지 이름은 코드 파일이 존재하는 폴더의 이름과 동일해야 한다.
- Go는 변수를 선언하고 초기화하기 위한 여러 방법을 제공한다. 변수의 값이 명시적으로 초기화되지 않은 경우에는 컴파일러가 해당 변수를 제로 값으로 초기화한다.
- 포인터는 함수와 고루틴 간에 데이터를 공유하기 위한 방법을 제공한다.
- 채널을 이용하여 고루틴을 실행함으로써 동시성과 동기화를 처리할 수 있다.
- Go는 Go의 내장 데이터 구조체를 지원하기 위한 내장 함수를 제공한다.
- 표준 라이브러리는 강력한 기능을 수행하는 여러 패키지를 제공한다.
- Go의 인터페이스를 이용하면 범용 코드와 프레임워크를 작성할 수 있다.

