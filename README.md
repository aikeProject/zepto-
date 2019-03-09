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
-   `init`初始化函数入口
```js

```