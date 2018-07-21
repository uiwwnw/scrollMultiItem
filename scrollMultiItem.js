/*
  scrollMultiItem v0.2.0
  http:/github.com/uiwwnw/scrollMultiItem/
  copyright uiwwnw
*/
var scrollMultiItem = function (e, opt) {
    var _this = this;
    var ctr = [];
    var scr = {};
    var sto;
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
                var __ctr = {
                    // box: a[k],
                    boxTop: a[k].offsetTop,
                    // boxHeight: a[k].offsetHeight,
                    // boxBottom: a[k].offsetTop + a[k].offsetHeight,
                    item: b[k],
                    itemTop: b[k].offsetTop,
                    itemMaxTop: a[k].offsetHeight - (b[k].offsetTop * 2) - b[k].offsetHeight,
                    itemAbsTop: a[k].offsetTop + b[k].offsetTop,
                    itemAbsMaxTop: a[k].offsetTop + a[k].offsetHeight - b[k].offsetHeight - b[k].offsetTop * 2,
                    itemAbsBottom: a[k].offsetTop + a[k].offsetHeight,
                    // itemHeight: b[k].offsetHeight,
                    // itemBottom: b[k].offsetTop + b[k].offsetHeight
                };
                _ctr.push(__ctr);
            }

            return _ctr;
        }

        for (var k = 0; k < i; k++) {
            var _ctr = {
                wrap: wrap[k],
                wrapTop: wrap[k].offsetTop,
                wrapHeight: wrap[k].offsetHeight,
                wrapBottom: wrap[k].offsetTop + wrap[k].offsetHeight,
                totalItem: opt.totalItem === undefined?false:wrap[k].querySelector(opt.totalItem),
                totalItemTop: opt.totalItem === undefined?false:wrap[k].querySelector(opt.totalItem).offsetTop,
                totalItemHeight: opt.totalItem === undefined?false:wrap[k].querySelector(opt.totalItem).offsetHeight
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
            totalTop = ctr[idx].child[ctr[idx].child.length - 1].itemMaxTop;
            ctr[idx].child[ctr[idx].child.length - 1].item.setAttribute('style', 'top: ' + totalTop + 'px;');
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
            if (e.itemAbsTop < scr.scrollY - ctr[idx].wrapTop) {
                currentIdx = j;
            }
            if (j === currentIdx) {
                (e.itemAbsMaxTop <= scr.scrollY - ctr[idx].wrapTop) && (scr.scrollY = e.itemAbsMaxTop + ctr[idx].wrapTop);
                (e.itemAbsTop >= scr.scrollY - ctr[idx].wrapTop) && (scr.scrollY = e.itemAbsTop - e.itemTop + ctr[idx].wrapTop);
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