/**
 * @author 成雨
 * @date 2019/3/14 0014$
 * @Description:
 */

var expect = chai.expect;

describe('zepto', () => {
    describe('$.isFunction', () => {
        var f1 = function () {
        };

        function f2() {
        }

        it('$.isFunction return true', () => {
            expect($.isFunction(f1), 'var f1 = function () {};').to.be.true;
            expect($.isFunction(f2)).to.be.true;
            expect($.isFunction()).to.be.false;
            expect($.isFunction('')).to.be.false;
            expect($.isFunction(undefined)).to.be.false;
            expect($.isFunction(new Object())).to.be.false;
            expect($.isFunction([])).to.be.false;
            expect($.isFunction(1)).to.be.false;
            expect($.isFunction('a')).to.be.false;
            expect($.isFunction(new Date())).to.be.false;
            expect($.isFunction(window)).to.be.false;
            expect($.isFunction($('body'))).to.be.false;
        });
    });

    describe('$.isPlainObject 检测对象是否为纯对象', () => {
        it('new object 或 {} 创建的对象，为纯对象', () => {
            expect($.isPlainObject(new Object())).to.be.true;
            expect($.isPlainObject({})).to.be.true;
            expect($.isPlainObject({one: 1})).to.be.true;
            expect($.isPlainObject({one: 1, tow: [1, 2]})).to.be.true;
        });

        it('不是 new object 或 {} 创建的对象', () => {
            expect($.isPlainObject(new Array())).to.be.false;
            expect($.isPlainObject([])).to.be.false;
            expect($.isPlainObject()).to.be.false;
            expect($.isPlainObject(null)).to.be.false;
            expect($.isPlainObject(new String())).to.be.false;
            expect($.isPlainObject(new String('more'))).to.be.false;
            expect($.isPlainObject('')).to.be.false;
            expect($.isPlainObject('more')).to.be.false;
            expect($.isPlainObject(window)).to.be.false;
            expect($.isPlainObject($('html')[0])).to.be.false;
        });
    });
});