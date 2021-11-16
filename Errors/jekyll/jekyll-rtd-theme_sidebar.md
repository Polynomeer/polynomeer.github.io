# jekyll-rtd-theme side bar error

jekyll-rtd-theme을 활용한 블로그에서 사이드 바에 나오는 메뉴버튼을 클릭하면 해당 목차가 사라져버리는 오류가 있었다. 여러가지 테스트를 해보면서 알아낸 결과, file name.md에서 file name에 공백이 있으면 사이드 바에 목록이 사라져버렸다. file_name.md와 같이 파일 이름에서 공백을 제거하면 사이드바에 잘 출력이 되었다.