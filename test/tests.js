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
            expect($.isPlainObject(new Boolean())).to.be.false;
            expect($.isPlainObject(new Function())).to.be.false;
            expect($.isPlainObject(new Date())).to.be.false;
            expect($.isPlainObject(function () {
            })).to.be.false;
            expect($.isPlainObject(2)).to.be.false;
            expect($.isPlainObject(true)).to.be.false;
            expect($.isPlainObject(false)).to.be.false;

            var F = function () {
            }, obj;
            F.prototype = {'a': 1};
            obj = new F();

            expect($.isPlainObject(obj)).to.be.false;
        });
    });

    describe('$.isWindow', () => {
        it('should window $.isWindow return true', function () {
            expect($.isWindow()).to.be.false;
            expect($.isWindow({})).to.be.false;
            expect($.isWindow(document)).to.be.false;
            expect($.isWindow(document.body)).to.be.false;
            expect($.isWindow(window)).to.be.true;
            expect($.isWindow(window.document)).to.be.false;
            expect($.isWindow(window.window)).to.be.true;
            expect($.isWindow(window.location)).to.be.false;
            expect($.isWindow($('iframe')[0].contentWindow)).to.be.true;
        });
    })

    describe('$.isNumber', () => {
        it('$.isNumber 测试', function () {
            expect($.isNumeric('-10')).to.be.true
            expect($.isNumeric('0')).to.be.true
            expect($.isNumeric(0)).to.be.true
            expect($.isNumeric(10)).to.be.true
            expect($.isNumeric('0xFF')).to.be.true
            expect($.isNumeric('8e5')).to.be.true
            expect($.isNumeric('3.124445')).to.be.true
            expect($.isNumeric(-10)).to.be.true
            expect($.isNumeric(+10)).to.be.true
            expect($.isNumeric(0144)).to.be.true

            expect($.isNumeric('-0x42')).to.be.false
            expect($.isNumeric('7.2acdgs')).to.be.false
            expect($.isNumeric('')).to.be.false
            expect($.isNumeric({})).to.be.false
            expect($.isNumeric(NaN)).to.be.false
            expect($.isNumeric(null)).to.be.false
            expect($.isNumeric(true)).to.be.false
            expect($.isNumeric(Infinity)).to.be.false
            expect($.isNumeric(undefined)).to.be.false
        });
    });
});