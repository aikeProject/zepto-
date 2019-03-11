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
    // 类似于这样的'<html>', '<html>d</html>'会被匹配
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

    //TODO 类型检测的方法
    function type(obj) {
        // 第一次调用都会返回‘object’
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
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

    // 将dom挂载到Z对象实例上
    function Z(dom, selector) {
        var i, len = dom ? dom.length : 0;
        for (i = 0; i < len; i++) this[i] = dom[i];
        this.length = len;
        this.selector = selector || '';
    }

    // 实例化Z构造函数
    zepto.Z = function (dom, selector) {
        return new Z(dom, selector);
    };

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

        // TODO $('<div></div>', {height: '10px'}) 如果是一个纯数组
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
        } else {
            if (isArray(selector)) dom = compact(selector);
            else if (isObject(selector)) {
                dom = [selector], selector = null;
            } else if (fragmentRE.test(selector)) {
                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
            } else if (context !== undefined) {
                return $(context).find(selector)
            } else {
                dom = zepto.qsa(document, selector)
            }
            return zepto.Z(dom, selector);
        }

        return zepto.Z(dom, selector)
    };

    // 调用`zepto.init`进行初始化
    $ = function (selector, context) {
        return zepto.init(selector, context)
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

    // 工具方法
    $.type = type;
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

    // Populate the class2type map
    // 第一次调用 ‘$.each’ 给 'class2type' 赋值, 类型检测的运用
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    return $;
})();

// 将zepto挂载到window上，即可以直接使用Zepto或$调用
window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);
