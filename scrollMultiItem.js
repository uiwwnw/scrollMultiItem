/*
  scrollMultiItem v0.2.1
  http:/github.com/uiwwnw/scrollMultiItem/
  copyright uiwwnw
*/
var scrollMultiItem = function (e, opt) {
    var _this = this;
    var ctr = [];
    var scr = {};
    scr.scrollY = window.scrollY;
    opt = opt === undefined ? {} : opt;
    opt.performance = opt.performance === undefined ? 1 : opt.performance;
    var idx = opt.idx === undefined ? 0 : opt.idx;
    var currentIdx = opt.currentIdx === undefined ? 0 : opt.currentIdx;
    var wrap = document.querySelectorAll(e);
    var i = wrap.length;
    if (i === 0) { return false };
    this.ele = function () {
        var _fnChild = function (e) {
            var a = e.querySelectorAll(opt.box);
            var b = e.querySelectorAll(opt.item);
            if (a.length !== b.length) {
                return false;
            };
            var j = a.length;
            var _ctr = [];
            for (var k = 0; k < j; k++) {
                var _boxTop = a[k].offsetTop;
                var _boxHeight = a[k].offsetHeight;
                var _item =  b[k];
                var _itemTop =  _item.offsetTop;
                var _itemHeight =  _item.offsetHeight;
                var _itemMaxTop =  _boxHeight - (_itemTop * 2) - _itemHeight;
                var _itemAbsTop =  _boxTop + _itemTop;
                var _itemAbsMaxTop =  _boxTop + _boxHeight - _itemHeight - _itemTop * 2;
                var _itemAbsBottom =  _boxTop + _boxHeight;
                var __ctr = {
                    // box: a[k],
                    boxTop: _boxTop,
                    // boxHeight: a[k].offsetHeight,
                    // boxBottom: a[k].offsetTop + a[k].offsetHeight,
                    item: _item,
                    itemTop: _itemTop,
                    itemMaxTop: _itemMaxTop,
                    itemAbsTop: _itemAbsTop,
                    itemAbsMaxTop: _itemAbsMaxTop,
                    itemAbsBottom: _itemAbsBottom
                    // itemHeight: b[k].offsetHeight,
                    // itemBottom: b[k].offsetTop + b[k].offsetHeight
                };
                _ctr.push(__ctr);
            }

            return _ctr;
        }

        for (var k = 0; k < i; k++) {
            var _wrap = wrap[k];
            var _wrapTop = _wrap.offsetTop;
            var _wrapHeight = _wrap.offsetHeight;
            var _wrapBottom = _wrapTop + _wrapHeight;
            var _totalItem = opt.totalItem === undefined?false:wrap[k].querySelector(opt.totalItem);
            var _totalItemTop = _totalItem === false?false:_totalItem.offsetTop;
            var _totalItemHeight = _totalItem === false?false:_totalItem.offsetHeight;
            var _ctr = {
                wrap: _wrap,
                wrapTop: _wrapTop,
                wrapHeight: _wrapHeight,
                wrapBottom: _wrapBottom,
                totalItem: _totalItem,
                totalItemTop: _totalItemTop,
                totalItemHeight: _totalItemHeight
            };
            var _child = _fnChild(_ctr.wrap);
            _ctr.child = _child;
            ctr.push(_ctr);
        }
    }
    var ready = function (fn) {
        if (document.readyState != 'loading') {
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState != 'loading')
                    fn();
            });
        }
    }
    var fnScroll = function () {
        scr.scrollY = Math.abs(window.scrollY);
        scr.oldScroll = scr.oldScroll === undefined ? 0 : scr.oldScroll;
        scr.updown = scr.oldScroll > scr.scrollY ? 'up' : 'down';

        if (Math.abs(scr.oldScroll - scr.scrollY) >= opt.performance) {
            for (var j = 0; j < i; j++) {
                ctr.find(function (e, i) {
                    if (scr.scrollY >= e.wrapTop && scr.scrollY <= e.wrapBottom) {
                        idx = i;
                    } else {
                        return false;
                    }
                })
            }
            _this.idx(idx);
            // console.log('performance');
            scr.oldScroll = scr.scrollY;
        }
        // console.log('normal');
        // clearTimeout(sto);
    }
    this.idx = function (idx) {
        // if(opt.totalItem){
        var totalTop = scr.scrollY - ctr[idx].wrapTop;
        if (ctr[idx].wrapTop > scr.scrollY) {
            if(opt.totalItem){
                ctr[idx].totalItem.removeAttribute('style');
            }
            ctr[idx].child[0].item.removeAttribute('style');
            return false;
        }
        if (ctr[idx].wrapBottom - ctr[idx].totalItemHeight - ctr[idx].totalItemTop * 2  < scr.scrollY) {
            if(opt.totalItem){
                totalTop = ctr[idx].wrapBottom  - ctr[idx].wrapTop- ctr[idx].totalItemHeight - ctr[idx].totalItemTop * 2;
                ctr[idx].totalItem.setAttribute('style', 'top: ' + totalTop + 'px;');
            }
            var lastItem = ctr[idx].child[ctr[idx].child.length - 1];
            totalTop = lastItem.itemMaxTop;
            lastItem.item.setAttribute('style', 'top: ' + totalTop + 'px;');
            return false;
        }
        ctr[idx].totalItem.setAttribute('style', 'top: ' + totalTop + 'px;');
        // }
        ctr[idx].child.find(function (e, j) {
            if (currentIdx !== 0 && j === currentIdx - 1 && scr.updown === 'up') {
                var top = e.itemMaxTop;
                e.item.setAttribute('style', 'top: ' + top + 'px;');
            }
            if (currentIdx !== i && j === currentIdx + 1) {
                e.item.removeAttribute('style');
            }
           
            if (e.itemAbsBottom < scr.scrollY - ctr[idx].wrapTop) {
                return false;
            }
            if (e.itemAbsTop - e.itemTop < scr.scrollY - ctr[idx].wrapTop) {
                currentIdx = j;
            }
            if (j === currentIdx) {
                (e.itemAbsMaxTop <= scr.scrollY - ctr[idx].wrapTop) && (scr.scrollY = e.itemAbsMaxTop + ctr[idx].wrapTop);
                (e.itemAbsTop - e.itemTop >= scr.scrollY - ctr[idx].wrapTop) && (scr.scrollY = e.itemAbsTop - e.itemTop + ctr[idx].wrapTop);
                var top = -e.itemAbsTop + e.itemTop + scr.scrollY - ctr[idx].wrapTop;
                e.item.setAttribute('style', 'top: ' + top + 'px;');
            }
        })
    }

    this.eventAdd = function () {
        window.addEventListener('scroll', fnScroll);
    }
    this.eventRemove = function () {
        window.removeEventListener('scroll', fnScroll);
    }
    // this.chk = function() {
    // }
    this.init = function () {
        ready(_this.ele);
        _this.eventAdd();
    }();
}