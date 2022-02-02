# Jekyll Config Error

`_config.yml`에

```
title: Polynomeer's Blog
lang: en
description: This is TIL blog

theme: jekyll-rtd-theme

...
```
theme 설정 부분을 null로 변경하니까 GitHub Action에서 빌드에러가 나던 부분이 해결되었다.
```
title: Polynomeer's Blog
lang: en
description: This is TIL blog

theme: jekyll-rtd-theme

...
```

