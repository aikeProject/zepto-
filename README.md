#### `zepto`源码
-   `zepto`的基本骨架
```js
(function (global, factory) {
    // 区分当前引用环境
    if (typeof define === 'function' && define.amd)
        define(function () {
            return factory(global)
        });
    else
        factory(global);
})(this, function (window) {
    // zepto核心代码写在这里面
    var zepto = (function () {

    })();

    // 将zepto挂载到window上，即可以直接使用Zepto或$调用
    window.Zepto = Zepto;
    window.$ === undefined && (window.$ = Zepto);
});
```
-   一些知识点
    - 真伪数组转换
    ```js
    // 真数组转化为伪数组
    var obj = {};
    var arr = [1,3,5];
    [].push.apply(obj,arr);
    console.log(obj);
    
     var arr = [];
     var obj = {
         0:'邵蒙蒙',
         1:25,
         2:'女',
         length:3
     };
     [].push.apply(arr,obj);
     console.log(arr);
 
    // 一般浏览器可以把系统自带的伪数组以及自定义的伪数组转化成真的数组,
    // 但是在ie8及其以下版本,在ie8以及以下不能通过apply方法把对应的自定义的伪数组转化成对应的值,
    // 所以我们可以先把伪数组转化成真的数组,然后通过apply方法来设置

    // 采用slice方法将自定义的伪数组转换为真数组
        var obj = {
            0:'邵蒙蒙',
            1:25,
            2:'女',
            length:3
        };
        var arr = [].slice.call(obj);
        console.log(arr);
    ```
    
    - nodeType
    
	| 节点类型                        | 描述                                                                                  | 子节点                                                                               |
	|  --------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
	| Element                         | 代表元素                                                                            | Element, Text, Comment, ProcessingInstruction, CDATASection, EntityReference |
	| Attr                                | 代表属性                                                                             | Text, EntityReference |
	| Text                               | 代表元素或属性中的文本内容。                                         | None |
	| CDATASection              | 代表文档中的 CDATA 部分（不会由解析器解析的文本）。 | None |
	| EntityReference            | 代表实体引用。                                                                     |  Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference |
	| Entity                             | 代表实体。                                                                            |  Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference |
	| ProcessingInstruction   | 代表处理指令。                                                                     |  None|
	| Comment                      | 代表注释。                                                                             |  None |
	| Document                     | 代表整个文档（DOM 树的根节点）。                                    |  Element, ProcessingInstruction, Comment, DocumentType|
	| DocumentFragment     | 代表轻量级的 Document 对象，能够容纳文档的某个部分     | Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference  |
	| Notation                       |  代表 DTD 中声明的符号。                                                     |  None |

    -   'readyState' HTML DOM readyState 属性返回当前文档状态  `document.readyState` [详见](https://segmentfault.com/a/1190000005869515)

	|  readyState   |  返回值   |
	| --- | --- |
	|  uninitialized     | 还未开始载入    |
	|  loading    | 载入中    |
	|  interactive     | 已加载，文档与用户可以交互    |
	|  complete    |  载入完成  |     
	
	-  关于页面加载的一些事件
		-  `onload`事件，`window.onload`. 作用: onload事件的实际效果是当页面解析完DOM树，并且完成了所有图片、样式表、脚本等资源的加载后才被触发
		-  `DOMContentLoaded`, DOM内容加载完后就触发，无需等待其他资源的加载完成。
		-   `onreadystatechange` 低版本ie不支持`DOMContentLoaded`，可以用`onreadystatechange`代替
		-   `doScroll` 低于`ie8`,可以通过每隔一段时间执行一次document.documentElement.doScroll("left")来检测这一状态，因为这条代码在DOM加载完毕之前执行时会抛出错误(throw an error)
	
	- `setTimeout(fn, 0)`的应用 [详见](https://blog.csdn.net/jingtian678/article/details/79547596)
	```
	setTimeout(fn, 0)的一大应用是，可以调整事件的发生顺序。比如，网页开发中，某个事件先发生在子元素，然后冒泡到父元素，即子元素的事件回调函数，会早于父元素的事件回调函数触发。如果，我们先让父元素的事件回调函数先发生，就要用到setTimeout(fn, 0);
	
	
	document.getElementById("haoroomsID").onclick = function A() {
	  setTimeout(function B() {
		console.log("触发子元素事件")
	  }, 0)
	};

	document.body.onclick = function C() {
	 console.log("触发父元素事件")
	};
	点击haoroomsID会先触发父级元素事件，然后再触发子元素事件
	```
    
        
-   `init`初始化函数入口
```js


```

