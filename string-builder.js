import actions from "./actions.js";

export function createHistoryString({ prevValue, action, currentValue }) {
    let result = `${actions[action].fun(prevValue, currentValue)}`;
  
    if (result.length > 8) {
      result = result.substring(0, 7) + "...";
    }
  
    return `${prevValue} ${actions[action].symbol} ${currentValue} = ${result}`;
  }
  