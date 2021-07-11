class State {
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

actions = {
  sum: {
    symbol: "+",
    fun: (a, b) => {
      return a + b;
    },
  },
  substract: {
    symbol: "-",
    fun: (a, b) => {
      return a - b;
    },
  },
  multiply: {
    symbol: "*",
    fun: (a, b) => {
      return a * b;
    },
  },
  divide: {
    symbol: "/",
    fun: (a, b) => {
      return a / b;
    },
  },
  root: {
    symbol: "√",
    fun: (a) => {
      return Math.sqrt(a);
    },
  },
  raiseToDegree: {
    symbol: "^",
    fun: (a, b) => {
      return Math.pow(a, b);
    },
  },
  getPercent: {
    symbol: "%",
    fun: (a) => {
      return a / 100;
    },
  },
  addPoint: (a, b) => {
    return +(a + "." + b);
  },
};

const output = document.querySelector(".calculator__output");
const history = document.querySelector(".history-operation__list");
const historyBlock = document.querySelector(".history-operation");

const stateManager = new State();

stateManager.subOnUpdateState(updateOutput);
stateManager.subOnUpdateState(updateLocalStorage);
stateManager.subOnUpdateState(updateHistory);

const loadHistory = JSON.parse(localStorage.getItem("history"));

if (!loadHistory || loadHistory <= 0) {
  historyBlock.hidden = true;
} else {
  stateManager.setState({
    statesHistory: loadHistory,
  });
}

function onClickOnValue(value) {
  const { currentValue, action, isHavePoint } = stateManager.state;

  if (isHavePoint) {
    stateManager.setState({
      currentValue: actions["addPoint"](currentValue, value),
      isHavePoint: false,
    });
    return;
  }

  if (
    isNaN(currentValue) ||
    currentValue === Infinity ||
    currentValue === "Error"
  ) {
    stateManager.setState({
      currentValue: value,
      action: "",
    });
    return;
  }

  if (action === "result") {
    stateManager.setState({
      currentValue: value,
      action: "",
    });
    return;
  }

  stateManager.setState({
    currentValue: +`${currentValue}${value}`,
  });
}

function onClickOnRoot() {
  const { currentValue, statesHistory } = stateManager.state;

  if (currentValue < 0) return;

  console.log(
    createHistoryString({
      currentValue: actions["root"].fun(currentValue),
      prevValue: currentValue,
      action: "root",
    })
  );

  stateManager.setState({
    currentValue: actions["root"].fun(currentValue),
    statesHistory: [
      {
        currentValue: "",
        prevValue: currentValue,
        action: "root",
      },
      ...statesHistory,
    ],
  });
}

function onClickOnPoint() {
  const { currentValue } = stateManager.state;
  const currentValueInSrting = `${currentValue}`;

  if (currentValueInSrting.includes(".")) return;

  stateManager.setState({
    currentValue,
    isHavePoint: true,
  });
}

function onClickOnPercent() {
  const { currentValue, statesHistory } = stateManager.state;

  console.log(
    createHistoryString({
      currentValue: actions["getPercent"].fun(currentValue),
      prevValue: currentValue,
      action: "getPercent",
    })
  );

  stateManager.setState({
    currentValue: actions["getPercent"].fun(currentValue),
    statesHistory: [
      {
        currentValue: "",
        prevValue: currentValue,
        action: "getPercent",
      },
      ...statesHistory,
    ],
  });
}

function onClear() {
  const { currentValue } = stateManager.state;
  const currentValueInSrting = `${currentValue}`;
  if (!currentValueInSrting.length) return;

  if (isNaN(currentValue) || currentValue === Infinity) {
    stateManager.setState({
      currentValue: 0,
    });
    return;
  }
  const newValue = currentValueInSrting.substring(
    0,
    currentValueInSrting.length - 1
  );

  stateManager.setState({
    currentValue: +newValue,
  });
}

function onClearAll() {
  const { currentValue } = stateManager.state;
  const currentValueInSrting = `${currentValue}`;
  if (!currentValueInSrting.length) return;

  if (isNaN(currentValue) || currentValue === Infinity) {
    stateManager.setState({
      currentValue: 0,
    });
    return;
  }
  stateManager.setState({
    currentValue: 0,
  });
}

function onAction(actionName) {
  const { currentValue, action } = stateManager.state;

  stateManager.setState({
    currentValue: 0,
    prevValue: currentValue,
    action: actionName,
  });
}

function onCalculate() {
  const { currentValue, prevValue, action, statesHistory } = stateManager.state;

  if (!action) return;

  console.log(createHistoryString(stateManager.state));

  stateManager.setState({
    currentValue: actions[action].fun(prevValue, currentValue),
    prevValue: ``,
    action: "result",
    statesHistory: [
      {
        currentValue,
        prevValue,
        action,
      },
      ...statesHistory,
    ],
  });
}
function createHistoryString({ prevValue, action, currentValue }) {
  let result = `${actions[action].fun(prevValue, currentValue)}`;

  if (result.length > 8) {
    result = result.substring(0, 7) + "...";
  }

  return `${prevValue} ${actions[action].symbol} ${currentValue} = ${result}`;
}

function updateOutput({ currentValue }) {
  const currentValueInSrting = `${currentValue}`.substring(0, 20);
  output.value = currentValueInSrting;
}

function updateHistory({ statesHistory }) {
  if (statesHistory && statesHistory.length > 0) {
    historyBlock.hidden = false;
  }

  history.innerHTML = "";
  statesHistory.forEach((state) => {
    const newElement = document.createElement("li");
    newElement.innerText = createHistoryString(state);
    history.append(newElement);
  });
}

function updateLocalStorage({ statesHistory }) {
  if (statesHistory) {
    const stringifyHistory = JSON.stringify(
      (statesHistory.length > 100) ? statesHistory.slice(1, 101) : statesHistory
    );
    localStorage.setItem("history", stringifyHistory);
  }
}
