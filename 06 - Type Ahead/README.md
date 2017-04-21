# 06 Fetch 結合 filter 實現快速匹配古詩

> 作者：©[緝熙Soyaine](https://github.com/soyaine)   
> 簡介：[JavaScript30](https://javascript30.com) 是 [Wes Bos](https://github.com/wesbos) 推出的一個 30 天挑戰。專案免費提供了 30 個視頻教程、30 個挑戰的起始文檔和 30 個挑戰解決方案原始程式碼。目的是説明人們用純 JavaScript 來寫東西，不借助框架和庫，也不使用編譯器和引用。現在你看到的是這系列指南的第 6 篇。完整指南在 [GitHub](https://github.com/soyaine/JavaScript30)，喜歡請 Star 哦♪(^∇^*)

## 實現效果

![仿即時搜索詩句效果](https://cl.ly/0b360y270s0f/Screen%20recording%202016-12-31%20at%2010.05.23%20PM.gif)

在輸入框中輸入一個詞，迅速匹配，展示含有這個詞的詩句，詩句的來源 json 資料是載入頁面時從網路中非同步獲得。[線上效果請查看。](http://soyaine.cn/JavaScript30/06%20-%20Type%20Ahead/index-SOYAINE.html)

初始文檔中提供了 HTML 和 CSS，我們需要補全 JS 代碼。這個挑戰是 Ajax 的預熱練習，在非同步方面用到了一些目前還未被完全支持的新特性，但很好用。

原文檔中選的內容是英文城市名，我將其換成了唐詩，構造了一個含有 70 多首唐詩的 JSON 資料，訪問位址是 [https://gist.githubusercontent.com/soyaine/81399bb2b24ca1bb5313e1985533c640/raw/bdf7df2cbcf70706c4a5e51a7dfb8c933ed78878/TangPoetry.json](https://gist.githubusercontent.com/soyaine/81399bb2b24ca1bb5313e1985533c640/raw/bdf7df2cbcf70706c4a5e51a7dfb8c933ed78878/TangPoetry.json)，請自由取用。

## 涉及特性

- Promise
    - `fetch()`
    - `then()`
    - `json()`
- Array
    - `filter()`
    - `map()`
    - `push()`
    - `join()`
    - Spread syntax 擴展語句
- RegExp
    - `match()`
    - `replace()`
    
## 過程指南

1. 聲明一個空陣列，用於存放解析 json 後的資料
2. 運用 `fetch()` 發送 HTTP 請求
    1. 獲取返回的 Promise 對象
    2. 解析 JSON 數據
    3. 存入陣列
3. 獲取兩個主要 HTML 元素（`<input>`，`<ul>`），給 `<input>` 添加事件監聽（`change`, `keyup`）
4. 編寫匹配輸入的函數
    1. 運用 `filter()` 過濾陣列資料
    2. 創建規則運算式，構造過濾條件
5. 編寫展示匹配結果的函數
    1. 獲取匹配資料
    2. 替換關鍵字放入高亮的標籤
    3. 構造 HTML 標籤數據
    4. 將匹配值的 HTML 標籤放入 `<ul>` 中

## 相關知識

### [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

Fetch API 這個新特性，是 XMLHttpRequest 獲取資源新的替代方案，目前還是一個實驗中的功能，截至到 2017.01.01 在 MDN 顯示的支援情況是：Chrome 42.0、Firefox (Gecko) 39、Opera 29、Chrome for Android 42.0、Android Webview。如何使用可以看[這篇文章](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)。

####  [fetch()](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch)

Fetch API 提供一個全域的方法 `fetch()`，這個方法（至少）需要接受 `資源的路徑` 作為參數，返回值是一個 Promise 物件。若請求成功，這個物件包含了（對應 Request 的）Response，但這只是一個 HTTP 響應。

語法如下：

```js
fetch(input, init).then(function(response) { ... });
```

MDN 中有個[發送基本的 fetch 請求的示例](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch#發起_fetch_請求)如下：

```js
    var myImage = document.querySelector('img');
    
    fetch('flowers.jpg')
    .then(function(response) {
      return response.blob();
    })
    .then(function(myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      myImage.src = objectURL;
    });
```

用 ES6 的語法來寫就是這樣：

```js
    const myImage = document.querySelector('img');
    
    fetch('flowers.jpg')
    .then(response => response.blob())
    .then(myBlob => {
        const objectURL = URL.createObjectURL(myBlob);
        myImage.src = objectURL;
    });
```

這個示例中使用了 `blob()` 方法來獲取圖片的內容，這是 Body 類定義的一個方法，除此之外還有可以獲取其他內容的方法，可以[在這裡看](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch#Body)，也可以在 Console 面板中查看： 

![Body 類的方法](https://cl.ly/143N2R1b3T1o/Image%202017-01-03%20at%209.15.37%20AM.png)

在這個挑戰中，我們主要是利用 `.json()`，以使用 JSON 物件來讀取 Response 流中的資料，讀取之後，Body 的 body.Uesd 屬性值會變為已讀。另外較為常用的方法還有：`blob()`、`text()`、`arrayBuffer()`、`formData()`。

### [ES6 中的陣列擴展語法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)

利用擴展運算子可以[替代 ES5 中的 `push` 方法添加一個陣列到另一個陣列末尾](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator#更好的_push_方法)，兩種語法的寫法如下：

```js
// 將arr2中的所有元素添加到arr1中

// ES5
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(...arr2);
```

### 此挑戰中如何非同步獲取資料並解析

這一部分用到的語句很簡單，但都用了 ES6 的語法，所以不熟悉 ES6 的話需要時間適應一下。

````js
    const endpoint = 'https://raw.githubusercontent.com/soyaine/FE-Practice/f438d3bdf099461f88322b1b1f20c9d58f66f1ec/TangPoetryCut.json';
    const  poetrys = [];
    fetch(endpoint)
        .then(blob => blob.json())
        .then(data => poetrys.push(...data));
````

如果把每條語句分解開來運行，得到的返回結果可以看下面的截圖。

![fetch(url).then()](https://cl.ly/3P3F1F2y1510/Image%202017-01-01%20at%206.58.45%20PM.png)

### 規則運算式

獲取到了資料之後，如何匹配輸入值呢？就要利用規則運算式了。規則運算式的 `match()` 可以執行一個匹配操作，我們再結合 `Array.filter()` 便能篩出整個陣列中，滿足條件的項，再經過字串處理即可輸出到頁面。

> 這篇我寫了很久也寫不滿意，如果你能讀到這裡，說明你對實現的效果有興趣，如果你覺得有什麼地方我寫得不清楚，或者我遺漏了什麼，請告訴我。我一直在思考和調整，用什麼樣的方式去寫會比較容易看懂，萬分期待和感恩能有讀者回饋 soyaine1@gmail。    

> 創建時間：2016-12-31
> 最後更新：2017-01-03
