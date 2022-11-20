# Microservices Architecture

## The History of Software

소프트웨어의 역사를 보면 하드웨어에 의존적인 구조에서 점점 변화에 유연하고 하드웨어로부터 독립적인 방향으로 발전해왔다. 소프트웨어 아키텍처의 역사는 추상화에 **추상화를 거듭하면서 점점 더 고도의 관심사를 추구하는 방향으로 변화했다**고 볼 수 있다.

- 1960 ~ 1980s: **Fragile**, Cowboys
    - Mainframe, Hardware
    - 하드웨어의 아키텍처에 의존하며 메인프레임을 기준으로 작성되는 소프트웨어 구조
- 1990 ~ 2000s: **Robust**, Distributed
    - Changes
    - 견고한 소프트웨어 구조로 변화에 민감하게 대응하지는 못함. 주로 폭포수 모델의 프로세스로 개발
- 2010s ~ : **Resilient/Anti-Fragile**, Cloud Native
  - Flow of value의 지속적인 개선
  - 일단 만들고 고객의 피드백에 의해 자주 변경하는 형태로, 주로 애자일 프로세스로 개발
- https://www.capterra.com/history-of-software/

## From Fragile to Antifragile Software

소프트웨어는 진화를 거듭해왔으며 앞으로의 방향은 Anti-Fragile 시스템이다. Anti-Fragile이란 Fragile의 반대 개념으로, 와인 잔 패키지와 같은 Fragile 물건은 떨어뜨리면 쉽게 깨지겠지만, Anti-Fragile 물건은 그러면 스트레스(변형력)에 대한 이점이 있다. 참고로 [Anti-Fragile](https://terms.naver.com/entry.naver?docId=2067682&cid=42107&categoryId=42107)은 Resilient(탄력적인)나 Robust(견고한)와는 다르며 충격을 받으면 오히려 단단해진다는 의미를 담고있다. 아래의 그림은 다양한 종류의 소프트웨어 시스템 특성을 시각화하고 요약한 그래프이다.

<img src="../../images/fragile-vs-antifragile.png" alt="fragile-vs-antifragile" style="zoom:70%;" />

_출처: https://developers.redhat.com/blog/2016/07/20/from-fragile-to-antifragile-software_

- **A fragile system**: 수정하기 어렵고 변화하는 환경에 대처할 수 없다. 안정적이고 변화하지 않는 환경에서 사용될 때는 어느정도 가치를 있지만, 변경사항을 맞닥뜨리면 빠르게 부채로 쌓이게 된다. 많은 조직에서 다루는 애플리케이션은 (메인프레임 같은) 사실상 변경이 불가능하고 유지 관리 비용이 매우 높지만, 비즈니스에 매우 중요하기 때문에 여전히 높은 비용을 감수하고서라도 돌아가고 있다. 예를 들어, Java나 Spring같은 기반이 되는 언어 또는 프레임워크의 문법이 호환성을 무시하고 크게 변경되면 그것을 사용하는 수많은 프로젝트가 영향을 받을 것 이다.
- **A robust system**: 변경 및 스트레스(변형력, 힘을 어떻게/얼마나 느끼는가에 대한 물리량)를 처리하기 위해 **특정 버퍼**로 구현되는 시스템이다. 따라서 스트레스 수준이 높아지더라도 기능을 잃지 않고 최대 수준까지 견딜 수 있으며, 여전히 좋은 수준의 품질을 제공한다. 그러나 Robust 시스템은 적응(adapt)하지는 못하며, 스트레스와 변화 수준이 계속 높아지면 그러한 시스템도 결국 이윤에서 손실로 떨어질 수 있다.
- **A resilient system**: 스트레스를 염두에 두고 적응 기능을 갖추고 설계 및 구현되므로, 더 많은 스트레스와 변화를 처리할 수 있다. 스트레스로 인한 이득이 없더라도 다양한 종류의 스트레스와 변화를 견뎌내고 더 큰 가치를 제공할 수 있다.
- **An antifragile system**: 변화를 염두에 두고 만들어지며 스트레스와 변화에 대한 염려가 없다. 그런 시스템(소프트웨어 시스템이 아니라 사회-기술 시스템)을 만드는 것이 훨씬 더 어렵지만, 일단 자리를 잡으면 변화를 기반으로 비즈니스를 이끌어가고, 심지어 변화를 만들어낸다.

그래프와 설명에서 나오듯이 다른 시스템은 변경사항과 스트레스에 대해서 그나마 완화하는 정도인데 반해, Anfi-Fragile 시스템은 오히려 좋은 방향으로 나아가는 것을 확인할 수 있다.

### Antifragile

소프트웨어 시스템이 Anti-Fragile이 되는것은 쉽지않지만, 몇 가지 방법이 제시된다. Anti-Fragile 특성을 가진 소프트웨어를 만드는 데 도움이 되는 몇 가지 도구, 플랫폼, 아키텍처 스타일, 방법론이 있다.

**Auto Scaling**: 이 기능을 통해 애플리케이션은 더 많은 애플리케이션 인스턴스를 생성하여 증가하는 로드를 처리할 수 있다. 이를 달성하기 위해 소프트웨어 시스템은 변화와 스트레스를 측정하고 이에 대응할 수 있어야 한다. 몇 가지 좋은 예는 인프라 수준에서 EC2 인스턴스의 [AWS autoscaling](https://aws.amazon.com/autoscaling/)과 애플리케이션 수준에서 애플리케이션 컨테이너의 [OpenShift autoscaling](http://kubernetes.io/docs/user-guide/horizontal-pod-autoscaling/)이다. 이는 소프트웨어 시스템이 스트레스에 대응하기 위해 시스템의 한 부분에서 다른 부분으로 리소스를 이동하기 때문에, 애플리케이션을 Resiliency(탄력성)에서 Anti-Fragile로 전환하는 기능이다.

**Microservices**: 스트레스를 받을 때 큰 것은 부서지기 마련이다. 이러한 현상은 포유류, 기업, 행정부 등에서 이미 관찰되었다. 소프트웨어 및 대규모 프로젝트에서 이러한 양상은 훨씬 더 자주 나타났다. 소프트웨어 프로젝트가 클수록 변경하고 스트레스에 대응하기가 더 어려워진다. 마이크로서비스는 변경을 허용하는 기능인 잘 정의된 API를 사용하여 자율적인 서비스를 제공함으로써 더 쉽게 변경할 수 있는 아키텍처 스타일이다. [Russ Miles](https://twitter.com/russmiles)는 [Antifragile Software through Microservices](https://leanpub.com/antifragilesoftware)의 강력한 신봉자이다. ([관련 영상](https://skillsmatter.com/skillscasts/5212-an-introduction-to-designing-and-buliding-antifragile-microservices-with-java))

**Chaos engineering** 카오스에서 살아남기 위해 시스템을 진화시켜 Anti-Fragile을 만드는 기술이다. 가능한 최악의 시간에 문제가 해결되기를 기다리는 것과는 다르게, 카오스 엔지니어링의 아이디어는 재난이 닥쳤을 때 대비하기 위해 사전에 오류(failures)를 주입하는 것이다. [Netflix의 Simian Army](http://techblog.netflix.com/2011/07/netflix-simian-army.html)는 오류를 생성하고 시스템의 약점을 격리하는 데 도움이 되도록 설계된 이 기술을 매우 훌륭하게 구현한 것이다.

**Continuous deployments**: 지속적인 부분 시스템 오류를 생성하고 조직이 중복, 롤링 업그레이드, 롤백 및 단일 실패 지점 방지를 통해 오류에 더 잘 대응하도록 한다. 카나리아 릴리스, 청록색 배포와 같은 다른 기술은 프로덕션 환경에 새 소프트웨어를 도입하는 위험을 줄이는 데 사용된다. A/B 테스트와 같은 일부 다른 방법은 변경을 통해 이익을 얻기 위해 변경을 실험하고 그 효과를 측정할 수도 있다.

## Cloud Native

**클라우드 네이티브는 클라우드 컴퓨팅 환경에서 현대적 애플리케이션을 구축, 배포 및 관리할 때의 소프트웨어 접근 방식이다.** 이는 단순한 유행어 이상의 의미를 가지며, 설계, 기술 선택, 아키텍처 및 운영에 대한 완전한 방법론이다. 최근 기업들은 고객의 요구를 충족하기 위해 신속하게 업데이트할 수 있는 확장성, 유연성 및 복원력이 뛰어난 애플리케이션을 구축하고자 한다. 이를 위해 클라우드 인프라에서 애플리케이션 개발을 기본적으로 지원하는 현대적인 도구와 기술을 사용한다. 이러한 클라우드 네이티브 기술은 서비스 제공에 미치는 영향 없이 애플리케이션을 빠르게 자주 변경할 수 있도록 지원하여 혁신 역량과 경쟁력을 제공한다.

> [Cloud Native Computing Foundation(CNCF)](https://www.cncf.io/)은 조직들이 [클라우드 네이티브 도입](https://aws.amazon.com/blogs/apn/journey-to-being-cloud-native-how-and-where-should-you-start/)을 시작하는 데 도움이 되는 오픈 소스 기반이다. 2015년에 설립된 CNCF는 Kubernetes를 비롯한 주요 클라우드 네이티브 구성 요소를 개발하는 오픈 소스 커뮤니티를 지원한다.

### Cloud Native Architecture

클라우드 네이티브 아키텍처는 클라우드 컴퓨팅 모델을 완전히 활용하도록 특별히 설계된 소프트웨어 개발 접근 방식이다. 이는 클라우드 서비스의 방법론, DevOps 사례 및 소프트웨어 개발 원칙의 조합이다. 네트워킹, 서버, 데이터 센터, 운영 체제 및 방화벽에서 모든 IT 계층을 추상화한다. 이를 통해 조직은 마이크로서비스 아키텍처를 사용하여 느슨하게 결합된 서비스로 애플리케이션을 구축하고 동적으로 조정된 플랫폼에서 실행할 수 있다. 클라우드 네이티브 애플리케이션 아키텍처에 구축된 애플리케이션은 안정적이고 규모와 성능을 제공하며 출시 시간을 단축한다. 

클라우드 네이티브 아키텍처는 개발 팀이 확장 가능한 클라우드 네이티브 애플리케이션을 구축하고 실행하는 데 사용하는 다양한 소프트웨어 구성 요소를 결합한다. CNCF는 변경 불가능한 인프라, 마이크로서비스, 선언형 API, 컨테이너 및 서비스 메시를 클라우드 네이티브 아키텍처의 기술 블록으로 나열한다. 

<img src="../../images/cloud-native-diagram.webp" alt="cloud-native-diagram" style="zoom:70%;" />

_출처: https://www.instana.com/blog/cloud-native-seeing-through-hype/_

- **DevOps**: 소프트웨어 제공 및 인프라 변경 프로세스 자동화를 목표로 소프트웨어 개발자와 IT 운영 간의 협업이다.
- **Continuous Delivery**: 사용하면 위험을 줄이면서 애플리케이션을 빠르고 안정적으로 자주 릴리스할 수 있다.
- **Microservices**: 자체적으로 실행되고 HTTP API를 통해 통신하는 작은 독립 서비스 모음으로 애플리케이션을 구축하는 아키텍처 접근 방식이다.
- **Containers**: 단일 서버를 하나 이상의 격리된 컨테이너로 동적으로 분할하여 가벼운 가상화를 제공한다. 컨테이너는 표준 가상 머신(VM)에 비해 효율성과 속도를 모두 제공한다. 컨테이너는 애플리케이션과 함께 애플리케이션 종속성을 관리하고 마이그레이션하는 기능을 제공한다. 많은 경우 OS와 기본 클라우드 플랫폼을 추상화한다.

### Cloud Native Application

**클라우드 네이티브 애플리케이션**은 마이크로서비스로 구성된 (여러 개의 상호 의존적인 소규모 서비스로 구성된) 소프트웨어 프로그램이다. 기존에는 개발자가 필요한 모든 기능을 포함하는 단일 블록 구조로 모놀리스 애플리케이션을 구축했지만, 클라우드 네이티브 접근 방식을 사용하면 기능을 더 작은 마이크로서비스 단위로 나누게 된다. 이러한 마이크로서비스는 최소한의 컴퓨팅 리소스만 사용하여 독립적으로 동작하고 실행되므로 클라우드 네이티브 애플리케이션의 민첩성이 향상된다.

**기존 엔터프라이즈 애플리케이션 vs 클라우드 네이티브 애플리케이션**

기존의 엔터프라이즈 애플리케이션은 유연성이 떨어지는 소프트웨어 개발 방식을 사용하여 구축되었다. 개발자는 일반적으로 대량의 소프트웨어 기능을 작업한 후에야 테스트를 위해 릴리스했다. (폭포수 모델의 개발 프로세스) 따라서 기존 엔터프라이즈 애플리케이션은 배포하는 데 시간이 오래 걸리고 확장이 불가능했다. 

반면 클라우드 네이티브 애플리케이션은 협업 접근 방식을 사용하며 다양한 플랫폼에서 확장성이 뛰어나다. 개발자는 소프트웨어 도구를 사용하여 클라우드 네이티브 애플리케이션의 프로시저를 구축, 테스트 및 배포하는 작업을 대폭 자동화한다. 마이크로서비스를 단시간에 설정, 배포 또는 복제할 수 있는데, 이는 기존 애플리케이션에서는 불가능하다. 

## References

### Antifragile Software

- https://developers.redhat.com/blog/2016/07/20/from-fragile-to-antifragile-software
- https://www.oreilly.com/library/view/hands-on-software-architecture/9781788622592/bdde195b-2a5e-4ca6-a297-9aa85e0fbc81.xhtml\
- https://entrepreneurshandbook.co/antifragility-how-to-turn-your-business-into-an-immortal-hydra-77b1054c6b48

### Cloud Native

- https://www.cncf.io/
- https://github.com/cncf/foundation/blob/main/charter.md
- https://en.wikipedia.org/wiki/Cloud_native_computing
- https://www.oracle.com/cloud/cloud-native/what-is-cloud-native/
- https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/definition
- https://aws.amazon.com/what-is/cloud-native/
- https://medium.com/velotio-perspectives/cloud-native-applications-the-why-the-what-the-how-9b2d31897496
- https://www.instana.com/blog/cloud-native-seeing-through-hype/
- https://tanzu.vmware.com/cloud-native

### Cloud Native Architecture

- https://www.clickittech.com/devops/cloud-native-architecture/
- https://hazelcast.com/glossary/cloud-native-architecture/
- https://cloud.google.com/blog/products/application-development/5-principles-for-cloud-native-architecture-what-it-is-and-how-to-master-it
- https://www.appdynamics.com/topics/what-is-cloud-native-architecture
- https://medium.com/walmartglobaltech/cloud-native-application-architecture-a84ddf378f82
- https://www.aquasec.com/cloud-native-academy/cloud-native-applications/cloud-native-architecture/
- https://www.tigera.io/learn/guides/cloud-native-security/cloud-native-architecture/
- https://www.samsungsds.com/kr/insights/101917_rd_cloudnative.html

### Microservices Architecture

- https://inf.run/RwpY

### Stress Testing

- http://www.ktword.co.kr/test/view/view.php?no=4223
- https://www.scienceall.com/%EB%B3%80%ED%98%95%EB%A0%A5stress/
- https://www.guru99.com/stress-testing-tutorial.html
- https://www.javatpoint.com/stress-testing
- https://www.geeksforgeeks.org/stress-testing-software-testing/

### English Words

- https://en.dict.naver.com/#/entry/enko/ece8f24b3b1f4c43a459bb1579cb9ad0
- https://en.dict.naver.com/#/entry/enko/a80173d96a3a41c680b281f9e8b7365c

