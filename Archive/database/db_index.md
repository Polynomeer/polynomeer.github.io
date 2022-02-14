# Database Index

## Indexing Boolean Field

boolean 필드를 인덱싱하는 것이 성능상에 이점이 있을까? 대부분의 경우에는 boolean 필드에 인덱싱을 하는 것은 의미가 없다. 하지만 이는 테이블 내 데이터의 분포에 따라 다를 수 있다. 예를 들어, 4백만 개의 데이터가 true 이고 1천개의 데이터만 false인 경우, 어떤 DBMS에서는 인덱싱으로 9초 이상의 효율을 낼 수 있다고 한다. 반면에, 사이드 이팩트로 쓰기 속도가 부분적으로 느려질 수 있다.

references:
- https://dba.stackexchange.com/questions/281236/mysql-boolean-field-search-vs-indexed-varchar-performance
- https://www.z-car.com/blog/mysql/mysql-should-you-put-an-index-on-a-boolean-field-to-help-query-performance
- https://www.postgresql.org/message-id/1691.897924796@sss.pgh.pa.us
- https://stackoverflow.com/questions/1844991/indexing-boolean-fields
- https://stackoverflow.com/questions/10524651/is-there-any-performance-gain-in-indexing-a-boolean-field#:~:text=Not%20really.,index%20pages%20as%20normal%20pages.&text=As%20Michael%20Durrant%20mentioned%2C%20it%20also%20makes%20writes%20slower.
- https://www.quora.com/How-can-I-optimise-MySQL-Boolean-columns-using-indexing-especially-when-they-contain-90-true-10-false-values
