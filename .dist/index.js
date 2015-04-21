'use strict';

module.exports = function () {
  return function (listenerInterceptor) {
    var events = {};

    return {
      emit: (function (_emit) {
        function emit(_x) {
          return _emit.apply(this, arguments);
        }

        emit.toString = function () {
          return _emit.toString();
        };

        return emit;
      })(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return emit.apply(undefined, [events].concat(args));
      }),
      on: (function (_on) {
        function on(_x2) {
          return _on.apply(this, arguments);
        }

        on.toString = function () {
          return _on.toString();
        };

        return on;
      })(function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return on.apply(undefined, [events, listenerInterceptor].concat(args));
      }),
      off: (function (_off) {
        function off(_x3) {
          return _off.apply(this, arguments);
        }

        off.toString = function () {
          return _off.toString();
        };

        return off;
      })(function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return off.apply(undefined, [events].concat(args));
      })
    };
  };

  function emit(events, event) {
    var listeners = events[event] || [],
        args = Array.prototype.slice.call(arguments, 2);

    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(null, args);
    }
  }

  function on(events, listenerInterceptor, event, listener) {
    if (typeof event == 'object') {
      var _ret = (function () {
        var unregister = (function (_unregister) {
          function unregister() {
            return _unregister.apply(this, arguments);
          }

          unregister.toString = function () {
            return _unregister.toString();
          };

          return unregister;
        })(function () {
          return _.each(unregister, function (fn) {
            return fn();
          });
        });
        return {
          v: _.transform(event, function (result, listener, eventName) {
            result[eventName] = on(events, listenerInterceptor, eventName, listener);
          }, unregister)
        };
      })();

      if (typeof _ret === 'object') {
        return _ret.v;
      }
    }

    if (listenerInterceptor) {
      var ret = listenerInterceptor.attemptIntercept(event, listener);
      if (ret) {
        return ret;
      }
    }

    events[event] = events[event] || [];
    events[event].push(listener);

    return function () {
      return off(events, event, listener);
    };
  }

  function off(events, event, listener) {
    if (typeof event == 'object') {
      for (var eventName in event) {
        off(events, eventName, event[eventName]);
      }return;
    }

    var listeners = events[event];
    if (listeners && listeners.length > 0) {
      removeListener(listeners, listener);
      if (listeners.length === 0) delete events[event];
    }

    function removeListener(listeners, listener) {
      for (var i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
        }
      }
      return listeners;
    }
  }
};
//# sourceMappingURL=index.js.map