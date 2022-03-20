# Synchronous, Asynchronous, Bloking, Non-Blocking

자바는 기본적으로 Sync/Block이고, 자바스크립트는 Async/NonBlock이다. 

제어권의 반환과 결과값의 전달의 관점으로 실행흐름을 따라 Block과 Non-Block을 설명할 수 있다. 

```javascript
function caller(){
		functionA();
		functionB();
		functionC();
}
```

```javascript
function functionA(){
			// do something
			return something;
}
```

이 두가지 함수의 통신에서 제어권 결과값의 이동에 대해서 유심히 보면 4가지 케이스를 구분할 수 있을 것이다.



동기화는 시간을 맞춰주는 것이다. 함수간의 통신에서 동기화란, 함수들의 제어권 반환, 결과값 전달의 시간을 맞춰주는 것이다. 



Block / Non-Block - 제어권, 제어할 수 없는 대상을 어떻게 처리하는가? 제어권을 어떻게 누가 가지고 언제 반환하는가? 그 제어권을 어떻게 하느냐에 따라서 제어할 수 없는 대상을 어떻게 하느냐에 관한 개념

Synchronous / Asynchronous - 시간, 대상들의 시간을 일치시키는가? 제어권을 반환하는 시간, 결과값을 전달하는 시간, 혹은 어떤 함수가 끝나고 다음함수가 시작되는 시간에 그 값들이 일치가 되었는가에 관한 개념

https://www.youtube.com/watch?v=IdpkfygWIMk