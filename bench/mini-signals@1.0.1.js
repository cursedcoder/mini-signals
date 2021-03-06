(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('MiniSignal', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.MiniSignal = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MiniSignalBinding = function MiniSignalBinding(fn) {
    var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, MiniSignalBinding);

    this._fn = fn;
    this._next = this._prev = null;
    this._once = once;
  };

  function _addMiniSignalBinding(self, node) {
    if (!self._head) {
      self._head = node;
      self._tail = node;
    } else {
      self._tail._next = node;
      node._prev = self._tail;
      self._tail = node;
    }

    node.detach = (function () {
      self.detach(this);
    }).bind(node);

    return node;
  }

  var MiniSignal = (function () {
    function MiniSignal() {
      _classCallCheck(this, MiniSignal);

      this._head = this._tail = undefined;
    }

    _createClass(MiniSignal, [{
      key: 'handlers',
      value: function handlers() {
        var exists = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        var node = this._head;

        if (exists) {
          return !!node;
        }

        var ee = [];

        while (node) {
          ee.push(node);
          node = node._next;
        }

        return ee;
      }
    }, {
      key: 'dispatch',
      value: function dispatch() {
        var node = this._head;

        if (!node) {
          return false;
        }

        while (node) {
          node._fn.apply(this, arguments);
          if (node._once) {
            this.detach(node);
          }
          node = node._next;
        }

        return true;
      }
    }, {
      key: 'add',
      value: function add(fn) {
        if (typeof fn !== 'function') {
          throw new Error('MiniSignal#add(): First arg must be a Function.');
        }
        return _addMiniSignalBinding(this, new MiniSignalBinding(fn));
      }
    }, {
      key: 'once',
      value: function once(fn) {
        if (typeof fn !== 'function') {
          throw new Error('MiniSignal#once(): First arg must be a Function.');
        }
        return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true));
      }
    }, {
      key: 'detach',
      value: function detach(node) {
        if (!(node instanceof MiniSignalBinding)) {
          throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
        }
        if (!node._fn) {
          return this;
        }
        if (node === this._head) {
          this._head = node._next;
          if (!this._head) {
            this._tail = null;
          } else {
            this._head._prev = null;
          }
        } else if (node === this._tail) {
          this._tail = node._prev;
          this._tail._next = null;
        } else {
          node._prev._next = node._next;
          node._next._prev = node._prev;
        }
        node._fn = null;
        return this;
      }
    }, {
      key: 'detachAll',
      value: function detachAll() {
        this._head = this._tail = null;
        return this;
      }
    }]);

    return MiniSignal;
  })();

  MiniSignal.MiniSignalBinding = MiniSignalBinding;

  module.exports = MiniSignal;
});
