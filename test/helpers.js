window.listenOnce = (element, eventName, callback) => {
  const listener = e => {
    element.removeEventListener(eventName, listener);
    callback(e);
  };
  element.addEventListener(eventName, listener);
};
