(function() {

  var SimDispatcher = function() {
    this.fluxDispatcher = new Flux.Dispatcher();
  };

  SimDispatcher.prototype.registerStore = function(store) {
    store.$$$dispatcherToken = this.fluxDispatcher.register(function(payload) {
      if (store[payload.action]) store[payload.action].apply(store, payload.args);
    });
    return store;
  };

  SimDispatcher.prototype.unregisterStore = function(store) {
    this.fluxDispatcher.unregister(store.$$$dispatcherToken);
    delete store.$$$dispatcherToken;
    return store;
  };

  // unlike Facebook's dispatcher, the first argument is action and after that
  // we can pass in any number of arguments
  //
  // Original: dispatcher.dispatch({ type: 'ACTION_TYPE', data: {whatever:data} })
  //      New: dispatcher.dispatch('ACTION_TYPE', arg1, arg2, ...)
  SimDispatcher.prototype.dispatch = function(action) {
    return this.fluxDispatcher.dispatch({
      action: action,
      args: Array.prototype.slice.call(arguments, 1)
    });
  };

  // waitFor takes a list of stores instead of tokens
  SimDispatcher.prototype.waitFor = function (stores) {
    var tokens = [];
    for (var i=0; i<stores.length; i++) {
      tokens.push(stores[i].$$$dispatcherToken);
    }
    return this.fluxDispatcher.waitFor(tokens);
  };

  // todo: use prototypical inheritance instead
  SimDispatcher.prototype.isDispatching=function() {
    return this.fluxDispatcher.isDispatching();
  };

  window.simflux = {
    version: 'pre-beta',
    Dispatcher: SimDispatcher
  };

})();