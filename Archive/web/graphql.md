# GraphQL

## 1. Introduction

GraphQL은 **API용 쿼리 언어(A query language for API)**이자 기존 데이터로 이러한 쿼리를 수행하기 위한 런타임이다. GraphQL은 작성한 API의 데이터에 대한 완전하고 이해하기 쉬운 설명을 제공하고, 클라이언트가 필요한 것을 군더더기 없이 정확하게 요청할 수 있도록 해준다.

### Ask for what you need, get exactly that

API에 GraphQL 쿼리를 보내고 필요한 리소스에 대한 데이터를 정확히 얻을 수 있다. GraphQL 쿼리는 항상 예측 가능한 결과를 반환한다. GraphQL을 사용하는 앱은 서버를 통하지 않고 직접 가져오는 데이터를 제어하기 때문에 빠르고 안정적이다.

```json
{
  hero {
    name
    height
    mass
  }
}
```

```json
{
  "hero": {
      "name": "Luke Skywalker",
      "height": 1.72,
      "mass": 77
  }
}
```

### Get many resources in a single request

GraphQL 쿼리는 하나의 리소스의 속성에 액세스할 뿐만 아니라 리소스 간의 참조를 원활하게 따른다. 일반적인 REST API는 여러 URL에서 로드해야 하지만 GraphQL API는 앱에 필요한 모든 데이터를 단일 요청으로 가져온다. GraphQL을 사용하는 앱은 느린 모바일 네트워크 연결에서도 빠를 수 있다.

### Describe what's possible with a type system

GraphQL API는 엔드포인트가 아닌 유형과 필드로 구성된다. 단일 엔드포인트에서 데이터의 모든 기능에 액세스 하면된다. GraphQL은 유형을 사용하여 앱이 가능한 것만 요청하고 명확하고 유용한 오류를 제공하도록 한다. 앱은 수동 구문 분석 코드 작성을 피하기 위해 유형을 사용할 수 있다.

### Evolve your API without versions

기존 쿼리에 영향을 주지 않고 GraphQL API에 새 필드와 유형을 추가한다. 에이징 필드는 더 이상 사용되지 않으며 도구에서 숨길 수 있다. 발전하는 단일 버전을 사용하여 GraphQL API는 앱에 새로운 기능에 대한 지속적인 액세스를 제공하고 더 깨끗하고 유지 관리가 용이한 서버 코드를 권장한다.

### Bring your own data and code

GraphQL은 특정 스토리지 엔진에 의해 제한되지 않고 전체 애플리케이션에 걸쳐 균일한 API를 생성한다. 다양한 언어로 제공되는 GraphQL 엔진으로 기존 데이터와 코드를 활용하는 GraphQL API를 작성할 수 있다. 유형 시스템의 각 필드에 대한 함수를 제공하고 GraphQL은 최적의 동시성을 사용하여 호출한다.

---

## 2. Queries and Mutations: CRUD in GraphQL

GraphQL은 SQL이 작동하는 방식과 약간 다르게 작동하며 더 많은 유연성을 제공한다. GraphQL은 API 요청 유형을 [쿼리와 뮤테이션](https://graphql.org/learn/queries/)으로 나눈다 . 쿼리는 데이터의 상태를 변경하지 않고 단순히 결과를 반환한다. 반면에 뮤테이션은 서버 측 데이터를 수정한다. 따라서 CRUD 작업의 경우 쿼리를 사용하여 *읽고* *생성* , *업데이트* 또는 *삭제* 하는 변형을 사용한다.

| CRUD   | SQL    | GraphQL  |
| ------ | ------ | -------- |
| Create | INSERT | MUTATION |
| Read   | SELECT | QUERY    |
| Update | UPDATE | MUTATION |
| Delete | DELETE | MUTATION |

### Fields

GraphQL은 객체에 대한 특정 필드를 요청하는 것이 무척 간단하다. 다음은 아주 간단한 쿼리를 실행하여 결과를 얻는 예제이다.

Query

```sql
{
  hero {
    name
  }
}
```

Response

```json
{
  "data": {
    "hero": {
      "name": "R2-D2"
    }
  }
}
```

쿼리와 결과가 정확히 동일한 형태인 것을 볼 수 있다. 이것이 GraphQL의 핵심이다. 항상 기대 한 결과를 얻을 수 있다. 서버에서 클라이언트가 요청하는 필드를 정확히 알고있기 때문이다.

`name` 필드는 `String` 타입을 반환한다. 여기서는 스타워즈의 영웅이름인 `"R2-D2"` 를 반환했다.

앞의 예제에서는 `String` 타입인 영웅의 이름만 요청했지만 필드는 객체를 참조할 수도 있다. 이 경우 해당 객체에 대한 필드를 *하위 선택*할 수 있다. GraphQL 쿼리는 연관된 객체와 필드를 탐색 할 수 있으므로 클라이언트는 기존 REST 구조처럼 여러번 요청을 수행하는 대신 한번의 요청으로 많은 데이터를 가져올 수 있다.

### Arguments

객체와 필드를 탐색할 수 있는 것 외에도, 필드에 인자를 전달하는 기능을 추가하면 훨씬 다양한 일을 할 수 있다.

Query

```sql
{
  human(id: "1000") {
    name
    height
  }
}
```

Response

```json
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 1.72
    }
  }
}
```

REST와 같은 시스템에서는 요청에 쿼리 파라미터와 URL 세그먼트같은 단일 인자들만 전달할 수 있다. 하지만 GraphQL에서는 모든 필드와 중첩된 객체가 인자를 가질 수 있으므로 GraphQL은 여러번의 API fetch를 완벽하게 대체할 수 있다. 필드에 인자를 전달하면, 모든 클라이언트에서 개별적으로 처리하는 대신 서버에서 데이터 변환을 한 번만 구현할 수도 있다.

Query

```sql
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}
```

Response

```json

{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 5.6430448
    }
  }
}
```

인자는 다양한 타입이 될 수 있습니다. 위 예제에서는 열거형(`Enumeration`) 타입을 사용했다. 이 타입은 다양한 옵션들 (이 경우에는 길이 단위 `METER`, `FOOT`) 중 하나를 나타낸다. GraphQL은 기본 타입과 함께 제공되지만, GraphQL 서버는 데이터를 직렬화 할 수 있는 한 직접 커스텀 타입을 선언할 수도 있다.

### Aliases

결과 객체 필드가 쿼리의 필드 이름과 일치하지만 인자는 그렇지 않으므로, 다른 인자를 사용하여 같은 필드를 직접 쿼리할수는 없다. 그렇기 때문에 필드의 결과를 원하는 이름으로 바꿀 수 있다. 이 것이 *별칭* 이 필요한 이유이다.

Query

```sql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```

Response

```json
{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```

위 예제에서 두 `hero` 필드는 서로 충돌하지만, 서로 다른 이름의 별칭을 지정할 수 있으므로 한 요청에서 두 결과를 모두 얻을 수 있다.

### Fragments

앱에서 상대적으로 복잡한 페이지가 있다고 가정해 보자. 친구(`friends`)를 가진 두 영웅(`hero`)을 순서대로 요청한다. 그러면 쿼리가 복잡해질 수 있다. 이렇게 되면 필드를 최소 두 번 반복해야한다.

이것이 *프래그먼트* 라는 **재사용 가능한 단위**가 GraphQL에 포함된 이유이다. 프래그먼트를 사용하면 필드셋을 구성한 다음 필요한 쿼리에 포함시킬 수 있다. 다음은 프래그먼트을 사용하여 위 상황을 해결하는 방법의 예제이다.

Query

```sql
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```

Response

```json
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        }
      ]
    },
    "rightComparison": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

필드가 반복될 경우 위 쿼리가 꽤 반복될 것을 알 수 있다. 프래그먼트 개념은 복잡한 응용 프로그램의 데이터 요구사항을 작은 단위로 분할하는데 사용된다. 특히 청크가 다른 여러 UI 구성 요소를 하나의 초기 데이터 fetch로 통합해야하는 경우에 많이 사용된다.

Query

```sql
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```

Response

```sql
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "friendsConnection": {
        "totalCount": 4,
        "edges": [
          {
            "node": {
              "name": "Han Solo"
            }
          },
          {
            "node": {
              "name": "Leia Organa"
            }
          },
          {
            "node": {
              "name": "C-3PO"
            }
          }
        ]
      }
    },
    "rightComparison": {
      "name": "R2-D2",
      "friendsConnection": {
        "totalCount": 3,
        "edges": [
          {
            "node": {
              "name": "Luke Skywalker"
            }
          },
          {
            "node": {
              "name": "Han Solo"
            }
          },
          {
            "node": {
              "name": "Leia Organa"
            }
          }
        ]
      }
    }
  }
}
```

### Mutations

REST에서는 모든 요청이 데이터 수정을 위해 `GET` 요청을 사용하지 않는것처럼, GraphQL도 쿼리를 통해 데이터를 수정할 수도 있지만, 뮤테이션를 통해 수정을 요청하는 것이 바람직하다.

쿼리와 마찬가지로 뮤테이션 필드가 객체 타입을 반환하면 중첩 필드를 요청할 수 있다.

Query

```sql
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

Variables

```json
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}
```

Response

```json
{
  "data": {
    "createReview": {
      "stars": 5,
      "commentary": "This is a great movie!"
    }
  }
}
```

`createReview` 필드가 새로 생성된 리뷰의 `stars` 와 `commentary` 필드를 반환한다. 이는 하나의 요청으로 필드의 새 값을 변경하고 쿼리할 수 있기 때문에 기존 데이터를 변경하는 경우(예: 필드를 증가시킬 때) 특히 유용합니다.

이 예제에서 전달한 `review` 변수는 스칼라값이 아니다. 인자로 전달될 수 있는 특별한 종류의 객체 타입인 *input object type* 이다.

#### 뮤테이션의 다중 필드

뮤테이션은 쿼리와 마찬가지로 여러 필드를 포함할 수 있다. 쿼리와 뮤테이션 사이에는 중요한 차이점이 있다.

**쿼리 필드는 병렬로 실행되지만 뮤테이션 필드는 하나씩 차례대로 실행된다.**

즉, 하나의 요청에서 두 개의 `incrementCredits` 뮤테이션를 보내면 첫 번째는 두 번째 요청 전에 완료되는 것이 보장된다.

---

## 3. GraphQL vs REST APIs

GraphQL과 REST API의 핵심 차이점은 GraphQL은 쿼리 언어인 사양이고 REST는 네트워크 기반 소프트웨어의 아키텍처 개념이라는 것입니다.

GraphQL은 REST API의 후속 제품으로 추진력을 얻고 있습니다. 그러나 항상 "대체"는 아니며 GraphQL을 선택하기로 결정할 때 몇 가지 고려 사항이 있다.

전통적으로 REST는 "즉시 사용"할 때 여러 네트워크 요청 및 데이터 오버페칭과 같은 제한이 있었습니다. 이를 극복하기 위해 Facebook은 API용 오픈 소스 데이터 쿼리 및 조작 언어로 GraphQL을 개발했다.

GraphQL은 데이터를 요청하기 위한 구문이며 필요한 것을 정확하게 지정할 수 있다.

사용 사례에 따라 GraphQL 또는 REST API 또는 둘의 조합 중에서 선택해야 한다. 정보에 입각한 결정을 내리기 위해 REST와 GraphQL을 살펴보고 GraphQL을 선택하는 몇 가지 이유를 이해해 보겠습니다.

### What is REST API?

REST(Representational State Transfer)는 웹 서비스를 개발할 때 일련의 제약 조건을 준수하는 아키텍처 스타일이다. REST API에서 지원한느 데이터 형식에는 JSON, XML 및 YAML이 있다. 클라이언트가 REST API를 호출하면 서버가 표준화된 표현으로 리소스를 전송한다. 요청된 리소스에 대한 정보를 반환하는 식으로 동작하며 해석 가능한 형식으로 번역된다.

REST 요청은 endpoint, HTTP method, Header 및 Body로 이루어지며, endpoint에는 리소스를 식별하도록 해주는 URI(Uniform Resource Identifier)가 포함되어 있다.

데이터로 작업할 때 RESTful API는 HTTP 메서드를 사용하여 CRUD 작업을 수행한다. 헤더는 캐싱, AB 테스팅, 인증 등과 같은 목적을 위해 클라이언트와 서버에 정보를 제공한다. 본문에는 요청의 페이로드와 같이 클라이언트가 서버에 보내려는 정보가 포함되어 있다.

<img src="../../images/rest-api.png" alt="REST API" style="zoom:30%;" />

### What is GraphQL?

<img src="../../images/graphql-api.png" alt="GraphQL API" style="zoom:30%;" />

[Data Fetching](https://hygraph.com/blog/graphql-vs-rest-apis#data-fetching)

즉시 사용 가능한 REST의 가장 일반적인 제한 사항 중 하나는 오버페칭 및 언더페칭이다. 클라이언트가 데이터를 다운로드하는 유일한 방법은 고정된 데이터셋을 반환하는 엔드포인트를 hit하기때문에 발생합니다. 클라이언트에게 정확한 데이터 요구 사항을 제공할 수 있는 방식으로 API를 설계하는 것은 매우 어렵다.

오버페칭은 필요한 것보다 더 많은 정보를 얻는 것을 의미합니다. 예를 들어 엔드포인트가 레스토랑에서 구입할 수 있는 햄버거에 대한 데이터를 보유하고 있는 경우 엔드포인트에 도달하고 관심 있는 `/burgers`항목만 얻는 대신 , , 등 `names`을 포함하여 엔드포인트가 제공해야 하는 모든 것을 얻을 수 있습니다. GraphQL을 사용하면 쿼리에서 원하는 것을 지정하기만 하면 됩니다.`price``ingredients``calories`

응답에는 엔드포인트가 제공할 수 있는 다른 정보가 포함되지 않으므로 요청한 내용을 기반으로 작업할 예측 가능한 데이터 세트가 제공됩니다.

[Schema and Type Safety](https://hygraph.com/blog/graphql-vs-rest-apis#schema-and-type-safety)

GraphQL은 강력한 형식의 시스템을 사용하여 API의 기능을 정의합니다. API에 노출되는 모든 유형은 GraphQL SDL(스키마 정의 언어) 및/또는 코드 우선을 사용하여 스키마에 기록됩니다.

프론트엔드 팀은 이제 API 설계에 대한 백엔드 팀에서 변경 사항이 발생하는 경우 프론트엔드에서 쿼리할 때 즉각적인 피드백을 받게 된다는 사실을 알고 형식화된 GraphQL API로 작업할 수 있습니다.

GraphQL 코드 생성기와 같은 인기 있는 도구는 코드베이스 GraphQL 쿼리 파일에서 직접 쿼리 및 변형에 대한 모든 코드를 자동으로 빌드할 수 있습니다. 이는 개발 속도를 높이고 생산 오류를 방지합니다.

[Rapid Product Development](https://hygraph.com/blog/graphql-vs-rest-apis#rapid-product-development)

`/menu`REST API의 일반적인 패턴은 앱 내부에 있는 보기(예: , `/prices`, / `images`등) 에 따라 끝점을 구조화하는 것 입니다. 이것은 클라이언트가 단순히 해당 엔드포인트에 액세스하여 특정 보기에 필요한 모든 정보를 얻을 수 있도록 하므로 편리합니다.

이 접근 방식의 단점은 빠른 반복을 허용하지 않는다는 것입니다. UI가 변경될 때마다 이전보다 더 많은(또는 더 적은) 데이터가 필요할 위험이 있습니다.

결과적으로 새로운 데이터 요구 사항을 고려하여 백엔드도 조정해야 하므로 비생산적이며 제품 개발 프로세스가 느려집니다.

GraphQL의 유연한 특성으로 인해 서버에서 추가 작업 없이 클라이언트 측에서 변경할 수 있습니다. 클라이언트는 정확한 데이터 요구 사항을 지정할 수 있으므로 프런트엔드에서 디자인과 데이터가 변경되어야 할 때 백엔드를 조정할 필요가 없습니다.

[Schema Stitching](https://hygraph.com/blog/graphql-vs-rest-apis#schema-stitching)

주요 차이점은 스키마 스티칭 기능입니다. GraphQL은 클라이언트가 액세스할 수 있도록 여러 스키마를 단일 스키마로 결합할 수 있습니다. 예를 들어, 특정 메뉴의 세부 정보와 항목의 영양 성분을 다른 소스에서 단일 스키마로 가져와서 Burgers API와 Nutrition API의 스키마를 병합합니다.

```sql
{
  burgers(where: { name: "cheeseburger"})
  # from Menu endpoint
  name 
  description 
  price 
  # from Nutrition endpoint
  calories 
  carbohydrates  
  # from Restaurant endpoint
  inStock 
}
```

### GraphQL vs REST

GraphQL과 REST API의 핵심적인 차이점은 GraphQL은 쿼리 언어이고, REST는 네트워크 기반 소프트웨어의 아키텍처 개념이라는 것이다.

GraphQL은 스키마 유형 및 설명을 기반으로 강력한 유형 및 자동 문서화에 적합하며, 개발 시간을 줄이기 위해 코드 생성기 도구와 통합도 가능하다.

쿼리에 대한 예상 응답의 차이를 매우 간단한 용어로 생각할 때 햄버거를 주문하는 과정을 생각할 수 있다. 당신이 버거 레스토랑에 들어가 치즈 버거를 주문한다고 상상해보라. 몇 번을 주문하든(RESTful API 호출하면), 매번 더블 치즈버거의 모든 재료를 얻을 수 있다. **"항상 동일한"** 모양과 크기가 반환된다. (RESTful API 응답을 통해서)

`https://api.com/cheeseburger/`

GraphQL을 사용하면 원하는 치즈버거를 정확히 설명하여 **"원하는 대로"** 할 수 있다. 이제 치즈버거(반응)를 빵 위에 올리고 패티, 피클, 양파, 치즈(채식주의자가 아닌 경우)를 바닥 빵 없이 먹을 수 있다.

```sql
query getCheeseburger ($vegan: Boolean) {
  cheeseburger {
    bun
    patty
    pickle
    onion
    cheese @skip(if: $vegan)
  }
}
```

GraphQL 응답은 정확히 설명하는 방식에 맞게 모양과 크기가 지정된다.

<img src="../../images/graphql-vs-rest.png" alt="GraphQL vs REST" style="zoom:30%;" />

REST API는 네트워크 기반 소프트웨어에 대한 ["아키텍처 개념"](https://www.rubrik.com/blog/graphql-vs-rest-apis/)이다. 반면에 GraphQL은 단일 엔드포인트에서 작동하는 쿼리 언어이자 도구 세트이다. 또한 지난 몇 년 동안 REST는 새로운 API를 만드는 데 사용되었으며 GraphQL은 성능과 유연성을 최적화하는 데 중점을 두었다.

REST를 사용할 때 완전한 "데이터 세트"에 대한 응답을 받을 수 있다. 객체에서 정보를 요청 하려면 REST API 요청 `x`을 수행해야 합니다. `x`메뉴 웹사이트에 대한 제품 정보를 요청하는 경우 요청은 다음과 같이 구성될 수 있다.

- 한 번의 요청 `menu`으로 버거 이름, 설명, 재료 등 요청
- 다른 요청 `prices`에서 해당 메뉴와 관련된 가격 요청
- `images`다른 데이터세트의 메뉴샷 요청
- ... 등등

반대로 특정 엔드포인트에서 일부 정보를 수집하려는 경우 [REST API가 반환하는 필드를 제한할 수 없다](https://www.rubrik.com/blog/graphql-vs-rest-apis/) . 구성을 추가하지 않고 즉시 REST API를 사용할 때 항상 완전한 데이터 세트를 얻거나 오버페칭을 할 수 있다.

GraphQL은 쿼리 언어를 사용하여 여러 개체에서 각 엔터티 내의 특정 필드에 이르기까지 필요한 항목에 정확하게 요청을 맞춤화합니다. GraphQL은 `x`끝점을 사용하고 해당 정보로 많은 작업을 수행할 수 있지만 먼저 원하는 것을 알려야 한다.

동일한 예를 사용하면 요청은 동일한 끝점에서 하나의 요청 내에서 `menuItem`, `menuIngredients`, `menuImage`, 을(를) 가져오는 것뿐입니다. `menuPrice`데이터베이스 내의 다른 모든 콘텐츠는 반환되지 않으므로 초과 가져오기 문제는 문제가 되지 않는다.

이전에 강조한 버거 비유와 매우 유사하다. REST는 레스토랑의 메뉴에 있는 치즈 버거를 제공하지만 GraphQL을 사용하면 해당 버거를 수정하여 원하는 양을 정확히 얻을 수 있다.

REST 또는 GraphQL을 선택하는 것은 상황에 따라 다르다. GraphQL을 REST의 절대적인 대체재로 생각하지 않는 것이 중요하다.

| GraphQL                                                      | REST                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| API 통합 시 일반적인 문제를 해결하기 위한 쿼리 언어          | API 설계를 위한 표준으로 주로 사용되는 아키텍처 스타일       |
| 노출된 서비스의 전체 기능을 제공하는 단일 엔드포인트를 사용하여 HTTP를 통해 배포 | 각각이 단일 리소스를 노출하는 URL 집합을 통해 배포됨         |
| 클라이언트 중심 아키텍처 사용                                | 서버 중심 아키텍처 사용                                      |
| 내장된 캐싱 메커니즘이 부족                                  | 자동으로 캐싱 사용                                           |
| API 버전 관리가 필요하지 않음                                | 여러 API 버전 지원                                           |
| JSON의 응답 출력                                             | 일반적으로 XML, JSON 및 YAML로 된 응답 출력                  |
| 유형 안전 및 자동 생성 문서 제공                             | 유형 안전 또는 자동 생성 문서를 제공하지 않음                |
| 스키마 스티칭 및 원격 데이터 가져오기 허용                   | 여러 엔드포인트로 작업을 단순화하려면 값비싼 맞춤형 미들웨어가 필요 |

---

## Summary

GraphQL은 유연한 API를 만들 수 있고, 성능에서의 유리함이 있다. 그리고 REST와 비교했을때 상대적으로 생산성이 높다. REST를 사용하여 다양한 쿼리와 변형을 모두 구현하려면 많은 시간이 걸린다. 예를 들어, cheese burger에서 cheese를 뺀 API와 포함시킨 API를 모두 제공해야할 때 동적으로 응답하기 어렵다. 반면에, GraphQL을 이용하면 클라이언트에서 동적으로 cheese를 빼거나 추가해서 응답받을 수 있다. 이처럼 GraphQL을 사용하면 데이터에 대한 CRUD 작업을 매우 유연한 방식으로 노출할 수 있다.

웹 서비스 API에 관한 한 REST는 여전히 지배적인 접근 방식이다. 그러나 GraphQL은 새로운 접근법으로 REST와 다른 형태로 작성이 가능함을 보여준다. 그리고 충분히 CRUD에 대한 기능을 제공해준다. 절대적인 정답은 없지만 상황에 따라서 GraphQL을 선택해볼 수도 있을 것 같다.

## References

- https://graphql.org/
- https://graphql.org/learn/
- https://graphql.org/learn/thinking-in-graphs/
- https://codebots.com/crud/how-do-you-implement-crud-using-graphql
- https://github.com/graphql-java/graphql-java
- https://hygraph.com/blog/graphql-vs-rest-apis
- https://tech.kakao.com/2019/08/01/graphql-basic/
- https://docs.github.com/en/graphql

