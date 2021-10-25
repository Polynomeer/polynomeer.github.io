// 카페24 서비스 유효성 검사
var result = [];
function validation1(a) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].name == "카페24") {
            if (validation2(a[i].url)) {
                result[i] = {
                    "name": a[i].name,
                    "url": a[i].url
                }
            }
        } else if (a[i].name == "카페24 쇼핑몰센터") {
            if (validation2(a[i].url)) {
                result[i] = {
                    "name": a[i].name,
                    "url": a[i].url
                }
            }
        } else if (a[i].name == "카페24 개발자센터") {
            if (validation2(a[i].url)) {
                result[i] = {
                    "name": a[i].name,
                    "url": a[i].url
                }
            }
        } else if (a[i].name == "카페24호스팅센터") {
            if (validation2(a[i].url)) {
                result[i] = {
                    "name": a[i].name,
                    "url": a[i].url
                }
            }
        }
    }
    return result;
}

// 도메인 유효성 검사
function validation2(b) {
    if (/^.+$/.test(b)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 샘플 데이터 및 실행
 */
(function () {
    // 샘플 데이터
    var validationData = [
        { name: 'GitHub', url: 'https://github.com' },
        { name: '카페24', url: 'https://www.cafe24.com' },
        { name: '카페24 쇼핑몰센터', url: 'https://ec.cafe24.com' },
        { name: '카페24 개발자센터', url: 'https://developers.cafe24.com' },
        { name: '카페24호스팅센터', url: 'https://hosting.cafe24.com' },
        { name: '카페24테스트', url: 'https://test.cafe24' },
        { name: 'TEST', url: 'https://github' }
    ];

    // 유효성 검사 요청
    var result = validation1(validationData);

    // 유효성 검사 결과 출력
    console.log(result)
})();