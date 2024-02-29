# Shell Script

## 쉘 스크립트

리눅스나 유닉스에서 커맨드라인 인터프리터에 의해 실행되는 프로그램이다.

쉘 스크립트의 첫 줄에는 샤뱅(`#!`)을 적고, 사용하고자하는 쉘을 적어준다. 예를 들어, 본쉘을 사용하는 경우 다음과 같이 적는다. `#!/bin/bash`

## 변수

변수 선언은 "=" 사용, 공백은 없어야한다.

```sh
name="hero"
age=30

echo ${hero}
echo $age
```

### 특별한 변수

- $0 -> 배시 스크립트의 이름
- $1 ~ $9 -> 9개의 스크립트 인자값
- $# -> 몇 개의 인자가 전달되었는지
- $@ -> 모든 인자값
- $? -> 실행 결과가 정상인지
- $$ -> 현재 스크립트의 PID

- $USER -> 스크립트를 실행하는 사용자명
- $HOSTNAME -> 스크립트를 실행하는 호스트명
- $RANDOM -> 랜덤 숫자를 리턴

### 값이나 문자를 읽기

```sh
read var1 # var1으로 값을 읽음
read -n3 var1 # 문자 3개만 입력받아서 var1에 저장
read -p "input data: " var1 # 문자열 출력하면서 var1값을 읽음
```

## if 조건문

```sh
if [<some test>]
then
    <commands>
fi
```

```sh
```

## References

- https://www.youtube.com/watch?v=RIKJVIcYNqE&list=PLYRfEO8DA8gikpkXw8wF8kJZDod2lFrML
- https://mug896.github.io/bash-shell/index.html
- https://blog.gaerae.com/2015/01/bash-hello-world.html
- https://wiki.kldp.org/HOWTO/html/Adv-Bash-Scr-HOWTO/index.html
- https://tldp.org/LDP/Bash-Beginners-Guide/html/
- http://man.he.net/man1/HEAD
- https://stackoverflow.com/questions/21789148/difference-between-cron-and-crontab
- https://jhnyang.tistory.com/68
- https://www.lesstif.com/lpt/bash-shell-script-programming-26083916.html
- https://stackoverflow.com/questions/10929453/read-a-file-line-by-line-assigning-the-value-to-a-variable
- https://mug896.github.io/bash-shell/readline.html#
- https://jdm.kr/blog/2