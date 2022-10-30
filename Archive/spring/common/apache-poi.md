# Apache POI SXSSF vs XSSF vs HSSF

## Apache POI

Apache POI는 아파치 소프트웨어 재단에서 만든 라이브러리로 MS Office 파일 포맷을 순수 자바 언어로서 읽고 쓰는 기능을 제공한다. 주로 워드, 엑셀, 파워포인트와 같은 파일을 지원하며 최근의 오피스 포맷인 Office Open XML File Formats (OOXML, xml 기반의 *.docx, *xlsx, *.pptx 등) 이나 아웃룩, 비지오, 퍼블리셔 등으로 지원 파일을 늘려가고 있다.

POI라는 이름은 "Poor Obfuscation Implementation"의 줄임말로서 기존의 MS Office 파일 포맷(OLE 2 Compund Document Format: OLE2)이 일부러 해독하기 힘들게 만들어 놓은 것 같음에도 불구하고 실제로 리버스 엔지니어링되어 사용할 수 있게 되었음을 의미한다.

## Apache POI의 목적

Apache POI API의 주요 용도는 웹 스파이더, 인덱스 빌더 및 콘텐츠 관리 시스템과 같은 [텍스트 추출](https://poi.apache.org/text-extraction.html) 애플리케이션이다.

Java(XLS)를 사용하여 Excel 파일을 읽거나 써야 하는 경우 HSSF를 사용한다. Java(XLSX)를 사용하여 OOXML Excel 파일을 읽거나 써야 하는 경우 XSSF를 사용한다. 결합된 SS 인터페이스를 사용하면 Java를 사용하여 모든 종류의 Excel 파일(XLS 및 XLSX)을 쉽게 읽고 쓸 수 있다. **또한 메모리에 최적화된 방식으로 대용량 Excel(XLSX) 파일을 작성할 수 있는 특수 SXSSF 구현이 있다.**

## Component Map

|                          Component                           |    Application type     |                       Maven artifactId                       |                            Notes                             |
| :----------------------------------------------------------: | :---------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| [POIFS](https://poi.apache.org/components/poifs/index.html)  |     OLE2 Filesystem     |                            *poi*                             |        Required to work with OLE2 / POIFS based files        |
|  [HPSF](https://poi.apache.org/components/hpsf/index.html)   |   OLE2 Property Sets    |                            *poi*                             |                                                              |
|    [HSSF](https://poi.apache.org/components/spreadsheet/)    |        Excel XLS        |                            *poi*                             |       For HSSF only, if common SS is needed see below        |
|     [HSLF](https://poi.apache.org/components/slideshow/)     |     PowerPoint PPT      |                       *poi-scratchpad*                       |                                                              |
|     [HWPF](https://poi.apache.org/components/document/)      |        Word DOC         |                       *poi-scratchpad*                       |                                                              |
| [HDGF](https://poi.apache.org/components/diagram/index.html) |        Visio VSD        |                       *poi-scratchpad*                       |                                                              |
|  [HPBF](https://poi.apache.org/components/hpbf/index.html)   |      Publisher PUB      |                       *poi-scratchpad*                       |                                                              |
|  [HSMF](https://poi.apache.org/components/hsmf/index.html)   |       Outlook MSG       |                       *poi-scratchpad*                       |                                                              |
|                             DDF                              | Escher common drawings  |                            *poi*                             |                                                              |
|                             HWMF                             |      WMF drawings       |                       *poi-scratchpad*                       |                                                              |
| [OpenXML4J](https://poi.apache.org/components/oxml4j/index.html) |          OOXML          | *poi-ooxml* plus either *poi-ooxml-lite* or *poi-ooxml-full* |    See notes below for differences between these options     |
|    [XSSF](https://poi.apache.org/components/spreadsheet/)    |       Excel XLSX        |                         *poi-ooxml*                          |                                                              |
|     [XSLF](https://poi.apache.org/components/slideshow/)     |     PowerPoint PPTX     |                         *poi-ooxml*                          |                                                              |
|     [XWPF](https://poi.apache.org/components/document/)      |        Word DOCX        |                         *poi-ooxml*                          |                                                              |
| [XDGF](https://poi.apache.org/components/diagram/index.html) |       Visio VSDX        |                         *poi-ooxml*                          |                                                              |
| [Common SL](https://poi.apache.org/components/slideshow/index.html) | PowerPoint PPT and PPTX |               *poi-scratchpad* and *poi-ooxml*               | SL code is in the core POI jar, but implementations are in poi-scratchpad and poi-ooxml. |
| [Common SS](https://poi.apache.org/components/spreadsheet/)  |   Excel XLS and XLSX    |                         *poi-ooxml*                          | WorkbookFactory and friends all require poi-ooxml, not just core poi |

## HSSF and XSSF

HSSF는 Excel '97(-2007) 파일 형식의 POI 프로젝트 순수 Java 구현입니다. XSSF는 Excel 2007 OOXML(.xlsx) 파일 형식의 POI 프로젝트 순수 Java 구현이다.

HSSF 및 XSSF는 스프레드시트를 읽고 XLS 스프레드시트를 작성, 수정, 읽고 쓰는 방법을 제공한다.

- 특별한 도움이 필요한 사람들을 위한 낮은 수준의 구조
- 효율적인 읽기 전용 액세스를 위한 eventmodel API
- XLS 파일 생성, 읽기 및 수정을 위한 전체 usermodel API

_HSSF 및 XSSF 지원을 위해 공통 SS 사용자 모델을 사용하려는 순수한 HSSF 사용자 모델에서 변환하려면 [ss 사용자 모델 변환 가이드](https://poi.apache.org/components/spreadsheet/converting.html) 를 참조 (호환 가능)_

스프레드시트 데이터만 읽는다면 파일 형식에 따라 org.apache.poi.hssf.eventusermodel 패키지 또는 org.apache.poi.xssf.eventusermodel 패키지의 eventmodel api를 사용하면 된다.

스프레드시트 데이터를 수정하는 경우 usermodel API를 사용하면된다. 이 방법으로 스프레드시트를 생성할 수도 있다.

usermodel 시스템은 낮은 수준의 eventusermodel보다 메모리 공간이 더 높지만 작업하기가 훨씬 더 간단하다는 주요 이점이 있다. 또한 새로운 XSSF 지원 Excel 2007 OOXML(.xlsx) 파일은 XML 기반이므로 처리를 위한 메모리 공간이 이전 HSSF 지원(.xls) 바이너리 파일보다 높다는 점에 유의해야 한다.

65,535개의 행만 지원하므로 대용량의 엑셀파일에서 사용할 수 없다.

```
java.lang.IllegalArgumentException: Invalid row number (65536) outside allowable range (0..65535)
	at org.apache.poi.hssf.usermodel.HSSFRow.setRowNum(HSSFRow.java:246)
	at org.apache.poi.hssf.usermodel.HSSFRow.<init>(HSSFRow.java:96)
	at org.apache.poi.hssf.usermodel.HSSFRow.<init>(HSSFRow.java:80)
	at org.apache.poi.hssf.usermodel.HSSFSheet.createRow(HSSFSheet.java:263)
	at org.apache.poi.hssf.usermodel.HSSFSheet.createRow(HSSFSheet.java:96)
	at com.example.exceldemo.test.getRow(test.java:33)
	at com.example.exceldemo.test.getCell(test.java:38)
	at com.example.exceldemo.test.setCellValue(test.java:46)
	at com.example.exceldemo.test.writeWorkbook(test.java:56)
	at com.example.exceldemo.test.main(test.java:83)
Invalid row number (65536) outside allowable range (0..65535)
```

## SXSSF

3.8-beta3부터 POI는 XSSF를 기반으로 구축된 낮은 메모리 공간 SXSSF API를 제공한다.

SXSSF는 매우 큰 스프레드시트를 생성해야 하고 힙 공간이 제한적일 때 사용되는 XSSF의 API 호환 스트리밍 확장이다. SXSSF는 슬라이딩 창 내에 있는 행에 대한 액세스를 제한하여 낮은 메모리 공간을 달성하는 반면 XSSF는 문서의 모든 행에 대한 액세스를 제공한다. 더 이상 창에 없는 이전 행은 디스크에 기록되기 때문에 액세스할 수 없게 된다.

자동 플러시 모드에서는 메모리에 특정 행 수를 유지하기 위해 액세스 창의 크기를 지정할 수 있다. 해당 값에 도달하면 추가 행을 생성하면 인덱스가 가장 낮은 행이 액세스 창에서 제거되고 디스크에 기록된다. 또는 창 크기가 동적으로 커지도록 설정할 수 있다. 필요에 따라 flushRows(int keepRows)를 명시적으로 호출하여 주기적으로 트리밍할 수 있다.

구현의 스트리밍 특성으로 인해 XSSF와 비교할 때 다음과 같은 제한 사항이 있다.

- 특정 시점에 제한된 수의 행만 액세스할 수 있다.
- Sheet.clone()은 지원되지 않는다.
- 수식 평가가 지원되지 않는다.

![스프레드시트 API 기능 요약](https://poi.apache.org/components/spreadsheet/images/ss-features.png)

SXSSF(패키지: org.apache.poi.xssf.streaming)는 매우 큰 스프레드시트를 생성해야 하고 힙 공간이 제한적일 때 사용되는 XSSF의 API 호환 스트리밍 확장이다. SXSSF는 슬라이딩 창 내에 있는 행에 대한 액세스를 제한하여 낮은 메모리 공간을 달성하는 반면 XSSF는 문서의 모든 행에 대한 액세스를 제공한다. 더 이상 창에 없는 이전 행은 디스크에 기록되기 때문에 액세스할 수 없게 된다.

*새 SXSSFWorkbook(int windowSize)* 을 통해 통합 문서 생성 시 창 크기를 지정 하거나 *SXSSFSheet#setRandomAccessWindowSize(int windowSize)* 를 통해 시트별로 설정할 수 있다 .

createRow()를 통해 새 행이 생성되고 플러시되지 않은 레코드의 총 수가 지정된 창 크기를 초과하면 인덱스 값이 가장 낮은 행이 플러시되고 더 이상 getRow()를 통해 액세스할 수 없다. 따라서 엑셀의 행을 getRow()를 통해 참조하여 조작할 필요가 있다면 SXSSF를 사용하기는 어렵다.

기본 창 크기는 *100* 이며 SXSSFWorkbook.DEFAULT_WINDOW_SIZE에 의해 정의된다.

windowSize -1은 무제한 액세스를 나타낸다. 이 경우 flushRows() 호출에 의해 플러시되지 않은 모든 레코드를 임의 액세스에 사용할 수 있다.

SXSSF는 임시 파일을 할당하는데, 이는 dispose 메서드를 호출함으로써 **반드시 명시적으로 지워주어야 한다.**

SXSSFWorkbook은 기본적으로 공유 문자열 테이블 대신 인라인 문자열을 사용한다. 문서 내용을 메모리에 보관할 필요가 없지만 일부 클라이언트와 호환되지 않는 문서를 생성하는 것으로 알려져 있기 때문에 이는 매우 효율적이다. 공유 문자열이 활성화되면 문서의 모든 고유 문자열을 메모리에 보관해야 한다. 문서 내용에 따라 공유 문자열이 비활성화된 경우보다 훨씬 더 많은 리소스를 사용할 수 있다.

사용 중인 기능(예: 병합된 영역, 하이퍼링크, 주석 등)에 따라 여전히 많은 양의 메모리를 소비할 수 있는 것들이 여전히 메모리에만 저장되므로 다음과 같은 경우 많은 메모리가 필요할 수 있습니다. 광범위하게 사용되다.

공유 문자열을 활성화할지 여부를 결정하기 전에 메모리 예산과 호환성 요구 사항을 주의 깊게 검토해야한다.

아래 예는 100행의 창이 있는 시트를 작성한다. 행 수가 101에 도달하면 rownum=0인 행이 디스크로 플러시되고 메모리에서 제거되고, rownum이 102에 도달하면 rownum=1인 행이 플러시되는 식이다.

```java
package com.example.exceldemo;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.junit.Assert;
import org.springframework.util.StopWatch;

import java.io.FileOutputStream;

public class SXSSFTest {

    public static void main(String[] args) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        SXSSFWorkbook wb = new SXSSFWorkbook(100); // keep 100 rows in memory, exceeding rows will be flushed to disk
        Sheet sh = wb.createSheet();
        for (int rownum = 0; rownum < 1000; rownum++) {
            Row row = sh.createRow(rownum);
            for (int cellnum = 0; cellnum < 10; cellnum++) {
                Cell cell = row.createCell(cellnum);
                String address = new CellReference(cell).formatAsString();
                cell.setCellValue(address);
            }
        }
        // Rows with rownum < 900 are flushed and not accessible
        for (int rownum = 0; rownum < 900; rownum++) {
            Assert.assertNull(sh.getRow(rownum));
        }
        // ther last 100 rows are still in memory
        for (int rownum = 900; rownum < 1000; rownum++) {
            Assert.assertNotNull(sh.getRow(rownum));
        }
        FileOutputStream out = new FileOutputStream("sxssf1.xlsx");
        wb.write(out);
        out.close();
        // dispose of temporary files backing this workbook on disk
        wb.dispose();

        stopWatch.stop();
        System.out.println("SXSSF with window size 100 : " + stopWatch.getTotalTimeMillis());
    }

}

```

다음 예제는 자동 플러시(windowSize=-1)를 끄고 코드에서 데이터 부분이 디스크에 기록되는 방식을 수동으로 제어한다.

```java
package com.example.exceldemo;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.util.StopWatch;

import java.io.FileOutputStream;

public class SXSSFTest2 {

    public static void main(String[] args) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        SXSSFWorkbook wb = new SXSSFWorkbook(-1); // turn off auto-flushing and accumulate all rows in memory
        Sheet sh = wb.createSheet();
        for (int rownum = 0; rownum < 1000; rownum++) {
            Row row = sh.createRow(rownum);
            for (int cellnum = 0; cellnum < 10; cellnum++) {
                Cell cell = row.createCell(cellnum);
                String address = new CellReference(cell).formatAsString();
                cell.setCellValue(address);
            }
            // manually control how rows are flushed to disk
            if (rownum % 100 == 0) {
                ((SXSSFSheet) sh).flushRows(100); // retain 100 last rows and flush all others
                // ((SXSSFSheet)sh).flushRows() is a shortcut for ((SXSSFSheet)sh).flushRows(0),
                // this method flushes all rows
            }
        }
        FileOutputStream out = new FileOutputStream("sxssf2.xlsx");
        wb.write(out);
        out.close();
        // dispose of temporary files backing this workbook on disk
        wb.dispose();

        stopWatch.stop();
        System.out.println("SXSSF with window size 100 : " + stopWatch.getTotalTimeMillis() + "ms");
    }
}

```

### 임시파일 용량 압축

SXSSF는 임시 파일(시트당 임시 파일)의 시트 데이터를 플러시하며 이러한 임시 파일의 크기는 매우 커질 수 있습니다. 예를 들어, 20MB csv 데이터의 경우 temp xml의 크기는 기가바이트 이상이 된다. 임시 파일의 크기가 문제인 경우 SXSSF에 gzip 압축을 사용하도록 지시할 수 있다.

```java
SXSSFWorkbook wb = new SXSSFWorkbook();
wb.setCompressTempFiles(true); // 임시 파일은 gzip으로 압축됩니다.
```

## 결론

- Row를 일일이 get해서 조작할 필요가 있다면 XSSF 사용
- Row를 조작할 일이 없다면 SXSSF 사용
- select 쿼리로 처리하는 부분이 있다면 id기준으로 정렬 후 cursor를 두어 chunk단위로 가져와서 처리

## References

- https://ko.wikipedia.org/wiki/%EC%95%84%ED%8C%8C%EC%B9%98_POI
- https://poi.apache.org/components/spreadsheet/
- https://poi.apache.org/components/spreadsheet/how-to.html#user_api
- https://poi.apache.org/apidocs/dev/org/apache/poi/xssf/streaming/SXSSFWorkbook.html
- https://www.tutorialspoint.com/apache_poi/apache_poi_quick_guide.htm
- https://stackoverflow.com/questions/45936257/apache-poi-hssf-vs-poi-xssf
- https://erictus.tistory.com/entry/POI-HSSF-XSSF-SXSSF-%EC%84%B1%EB%8A%A5-%EB%B6%84%EC%84%9D
- https://stackoverflow.com/questions/33047512/hssfworkbook-vs-xssfworkbook-vs-sxssfworkbook-apache-poi
- https://www.adoclib.com/blog/hssfworkbook-vs-xssfworkbook-vs-sxssfworkbook-apache-poi.html
- https://j-dev.tistory.com/entry/SpringPOI-%EB%8C%80%EC%9A%A9%EB%9F%89-%EC%97%91%EC%85%80-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C
- https://topic.alibabacloud.com/a/the-difference-between-hssfxssf-and-sxssf_8_8_31570522.html
- https://okky.kr/articles/408564
- http://www.java2s.com/example/java-api/org/apache/poi/xssf/streaming/sxssfworkbook/sxssfworkbook-4-0.html
- https://qiita.com/tool-taro/items/4b3c802bb114a9110ecb