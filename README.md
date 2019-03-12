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
// @author 成雨
// @date 2017/12/21
// @Description: zepto.js

// zepto核心代码写在这里面
var Zepto = (function () {
    var $, zepto = {};

    var emptyArray = [];
    var sconcat = emptyArray.concat,
        filter = emptyArray.filter,
        slice = emptyArray.slice;

    // 正则表达式
    // 类似于这样的'<html>', '<html>d</html>'会被匹配，html片段
    var fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        // '<html></html>' '<html>' '<html/>' 将会被匹配
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        // 匹配这样的内容 '<div id="dddd"/> <p />'
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        simpleSelectorRE = /^[\w-]*$/;

    // 设置属性
    var methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'];

    var table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table,
            'thead': table,
            'tfoot': table,
            'td': tableRow,
            'th': tableRow,
            '*': document.createElement('div')
        };
    var isArray = Array.isArray ||
        function (object) {
            return object instanceof Array
        };

    var class2type = {},
        toString = class2type.toString;

    var camelize, uniq;

    //TODO 类型检测的方法
    function type(obj) {
        // 第一次调用都会返回‘object’
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }

    //TODO isFunction 检测是否是函数
    function isFunction(value) {
        return type(value) == 'function'
    }

    //TODO 判断是不是 'window'对象 window == window.window -> true
    function isWindow(obj) {
        return obj != null && obj == obj.window
    }

    function isObject(obj) {
        return type(obj) == "object"
    }

    //TODO 纯对象
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }

    // 判断是不是伪数组
    // TODO likeArray 伪数组
    function likeArray(obj) {
        var length = !!obj && 'length' in obj && obj.length,
            type = $.type(obj);
        return 'function' != type && !isWindow(obj) && (
            'array' == type || length === 0 ||
            (typeof length == 'number' && length > 0 && (length - 1) in obj)
        )
    }

    function compact(array) {
        return filter.call(array, function (item) {
            return item != null
        })
    }

    // 将一组字符串变成“骆驼”命名法的新字符串，如果该字符已经是“骆驼”命名法，则不变化。
    camelize = function (str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
            // toUpperCase首字母大写
            return chr ? chr.toUpperCase() : '';
        });
    };

    // 将dom挂载到Z对象实例上
    function Z(dom, selector) {
        var i, len = dom ? dom.length : 0;
        for (i = 0; i < len; i++) this[i] = dom[i];
        this.length = len;
        this.selector = selector || '';
    }

    // 接受一个html字符串和一个可选的标签名
    // 从给定的html字符串生成DOM节点
    // 生成的DOM节点作为数组返回
    // html 标签字符串 name 标签名 properties 属性对象
    zepto.fragment = function (html, name, properties) {
        var dom, nodes, container;

        // 空标签将会被匹配
        // '<div></div>' '<div>' '<div/>' 将会被匹配 其中'RegExp.$1'的$1代表了'html'
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

        // 如果不符合上一个条件
        if (!dom) {
            // '<div id="dddd"/> <p />' 将转换为 '<div id="dddd"></div> <p ></p>'
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
            // 获取到标签名 比如'<div id="dddd"/> <p />' -> name = div(RegExp.$1)
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
            // 根据'containers'的内容来确定要用来包裹内容的元素
            if (!(name in containers)) name = '*';

            container = containers[name];
            container.innerHTML = '' + html;
            // TODO slice.call 真伪数组转换
            // container.childNodes伪数组 这里是将伪数组转化真数组
            dom = $.each(slice.call(container.childNodes), function () {
                container.removeChild(this);
            });
        }

        // TODO $('<div></div>', {height: '10px'}) 如果是一个纯对象
        // 作用就是将其添加到创建好的dom里面
        if (isPlainObject(properties)) {
            // zepto对象
            nodes = $(dom);
            $.each(properties, function (key, value) {
                // ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset']
                // 如果是设置这些属性，调用定义在zepto的方法进行设置
                if (methodAttributes.indexOf(key) > -1) {
                    nodes[key](value);
                }
                // attr方法进行设置
                else {
                    nodes.attr(key, value);
                }
            });
        }

        return dom;
    };

    // 实例化Z构造函数
    zepto.Z = function (dom, selector) {
        return new Z(dom, selector);
    };

    //isZ 其中 instanceof 可检测对象是否在对象的上或者其原型上
    zepto.isZ = function (object) {
        return object instanceof zepto.Z;
    };

    // TODO 选择器方法
    // 作用：
    // '#id' -> document.getElementById
    // '.class' -> document.getElementsByClassName
    // 'div' -> document.getElementsByTagName
    // '其他' -> document.querySelectorAll
    zepto.qsa = function (element, selector) {
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
            isSimple = simpleSelectorRE.test(nameOnly);

        if (element.getElementById && isSimple && maybeID) {
            found = element.getElementById(nameOnly);
            if (found) {
                return [found];
            } else {
                return [];
            }
        } else {
            if (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) {
                return [];
            } else {
                return slice.call(
                    isSimple && !maybeID && element.getElementsByClassName ?
                        maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector)
                        : element.querySelectorAll(selector)
                )
            }
        }
    };

    // TODO 初始化函数 init
    // selector 传入的选择器
    // 'init'主要做的事情就是根据传入的'selector'类型，分别判断执行不同的任务
    zepto.init = function (selector, context) {
        var dom;
        // 如果未传入参数'selector'
        // 如果什么都没有给出，返回一个空的Zepto集合
        // zepto.Z()将创建一个空的对象集合
        if (!selector) return zepto.Z();
        // 如果'selector'传入字符串
        else if (typeof selector == 'string') {
            // 去除前后空格
            selector = selector.trim();
            // 判断‘selector’是不是一个标签字符串
            if (selector[0] == '<' && fragmentRE.test(selector)) {
                dom = zepto.fragment(selector, RegExp.$1, context), selector = null
            }
            // 如果有上下文，要在上下文里查找
            else if (context !== undefined) return $(context).find(selector);
            // TODO css选择器
            else {
                dom = zepto.qsa(document, selector)
            }
        }
        // 如果传入的是一个函数‘function’，该函数在dom加载完时调用,这个就是平时我们用的jquery的ready函数
        else if (isFunction(selector)) {
            return $(document).ready(selector);
        }
        // 传入对象是不是zepto对象
        else if (zepto.isZ(selector)) {
            return selector;
        } else {
            // 传入数组
            if (isArray(selector)) dom = compact(selector);
            // 传入一个对象
            else if (isObject(selector)) {
                dom = [selector], selector = null;
            }
            // 传入html片段
            else if (fragmentRE.test(selector)) {
                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
            }
            // 是否传入上下文
            else if (context !== undefined) {
                return $(context).find(selector)
            }
            // 是一个选择器
            else {
                dom = zepto.qsa(document, selector)
            }
        }
        // 最后将找到的dom转化为zepto对象
        return zepto.Z(dom, selector)
    };

    // 调用`zepto.init`进行初始化
    $ = function (selector, context) {
        return zepto.init(selector, context)
    };

    // 将一个对象复制到另一个目标对象上
    function extend(target, source, deep) {
        for (key in source) {
            // 深拷贝
            if (deep && (isPlainObject(source[key])) || isArray(source[key])) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])) {
                    target[key] = [];
                }
                extend(target[key], source[key], deep);
            }
            // 浅拷贝
            else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    }

    // 通过源对象扩展目标对象的属性，源对象属性将覆盖目标对象属性。
    // 默认情况下为，复制为浅拷贝（浅复制）。如果第一个参数为true表示深度拷贝（深度复制）。
    $.extend = function (target) {
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
            deep = target;
            target = args.shift();
        }
        args.forEach(function (org) {
            extend(target, org, deep)
        });
        return target;
    };

    // 工具方法
    // TODO 类型检测
    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;

    // 如果该值为有限数值或一个字符串表示的数字，则返回ture。
    $.isNumeric = function (val) {
        var num = Number(val), type = typeof val;
        return val != null && type != 'boolean' &&
            (type != 'string' || val.length) &&
            !isNaN(num) && isFinite(num) || false
    };

    // $.inArray(element, array, [fromIndex])   ⇒ number
    // 返回数组中指定元素的索引值（注：以0为基数），如果没有找到该元素则返回-1。
    $.inArray = function (elem, array, i) {
        return emptyArray.indexOf.call(array, elem, i);
    };

    // 驼峰 命名转化
    $.camelCase = camelize;

    // TODO 遍历 each
    $.each = function (elements, callback) {
        var i, key;
        if (likeArray(elements)) {
            // 用数组的循环方法
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        }
        // 用对象的循环方法
        else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }
        return elements;
    };

    // $.grep(items, function(item){ ... })   ⇒ array
    // 获取一个新数组，新数组只包含回调函数中返回 ture 的数组项。
    // 同 filter()方法
    $.grep = function (element, callback) {
        return filter.call(element, callback);
    };

    // Populate the class2type map
    // 第一次调用 ‘$.each’ 给 'class2type' 赋值, 类型检测的运用
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    // TODO s.fn 定义所有可用方法
    // Zepto.fn是一个对象，它拥有Zepto对象上所有可用的方法，如 addClass()， attr()，和其它方法。在这个对象添加一个方法，所有的Zepto对象上都能用到该方法。
    $.fn = {
        // 将其指向 zepto.Z 这个函数
        constructor: zepto.Z,
        length: 0,

        // dom加载完毕的检测函数
        // 详见 https://segmentfault.com/a/1190000005869515
        // TODO ready
        ready: function (callback) {
            // 详见README readyState 的几个状态
            // document.documentElement.doScroll 这句话作用是非ie，也就是这里ie不支持
            if (document.readyState === 'complete'
                || (document.readyState === 'loading' && !document.documentElement.doScroll)) {
                // setTimeout(fn, 0)的应用 详见 https://blog.csdn.net/jingtian678/article/details/79547596
                setTimeout(function () {
                    callback($);
                }, 0);
            } else {
                var handler = function () {
                    document.removeEventListener('DOMContentLoaded', handler, false);
                    window.removeEventListener('load', handler, false);
                    callback($);
                };

                document.addEventListener('DOMContentLoaded', handler, false);
                window.addEventListener('load', handler, false);
            }
        },
    };

    // 这里就是将‘$.fn’ 添加到 ‘zepto.Z’的原型上 和 ‘Z’的原型上
    zepto.Z.prototype = Z.prototype = $.fn;

    return $;
})();

// 将zepto挂载到window上，即可以直接使用Zepto或$调用
window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);
```

