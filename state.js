export default class State {
    subHandlers = [];
  
    state = {
      currentValue: 0,
      prevValue: "",
      action: "",
      statesHistory: [],
      isHavePoint: false,
    };
  
    setState = (newValues) => {
      const newState = Object.assign({}, this.state, newValues);
  
      this.subHandlers.forEach((fn) => {
        fn(newState, this.state);
      });
  
      this.state = newState;
    };
  
    subOnUpdateState = (cb) => {
      this.subHandlers = [cb, ...this.subHandlers];
    };
  
    ubSubOnUpdateState = (fn) => {
      this.subHandlers = this.subHandlers.filter((subFn) => subFn !== fn);
    };
}
  
