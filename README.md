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
-   `init`初始化函数入口
```js

```