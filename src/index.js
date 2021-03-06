module.exports = () => {
  return listenerInterceptor => {
    const events = {};

    return {
      emit: (...args) => emit(events, ...args),
      on: (...args) => on(events, listenerInterceptor, ...args),
      off: (...args) => off(events, ...args)
    };
  };

  function emit(events, event) {
    const listeners = events[event] || [],
        args = Array.prototype.slice.call(arguments, 2);

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].apply(null, args);
    }
  }

  function on(events, listenerInterceptor, event, listener) {
    if (typeof event == 'object') {
      const unregister = () => _.each(unregister, fn => fn());
      return _.transform(event, (result, listener, eventName) => {
        result[eventName] = on(events, listenerInterceptor, eventName, listener);
      }, unregister);
    }

    if (listenerInterceptor) {
      const ret = listenerInterceptor.attemptIntercept(event, listener);
      if (ret) return ret;
    }

    events[event] = events[event] || [];
    events[event].push(listener);

    return () => off(events, event, listener);
  }

  function off(events, event, listener) {
    if (typeof event == 'object') {
      for (let eventName in event) off(events, eventName, event[eventName]);
      return;
    }

    const listeners = events[event];
    if (listeners && listeners.length > 0) {
      removeListener(listeners, listener);
      if (listeners.length === 0) delete events[event];
    }

    function removeListener(listeners, listener) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
        }
      }
      return listeners;
    }
  }
};