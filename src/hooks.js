function ControlledInputHook(injectedText) {
  this.injectedText = injectedText;
}

ControlledInputHook.prototype.hook = function hook(element) {
  if (this.injectedText !== null) {
    element.value = this.injectedText;
  }
};

export default {ControlledInputHook};
