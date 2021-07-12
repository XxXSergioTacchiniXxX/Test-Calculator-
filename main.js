import State from "./state.js";
import actions from "./actions.js";
import {createHistoryString} from "./string-builder.js"

const output = document.querySelector(".calculator__output");
const history = document.querySelector(".history-operation__list");
const historyBlock = document.querySelector(".history-operation");

const stateManager = new State();

stateManager.subOnUpdateState(updateOutput);
stateManager.subOnUpdateState(updateLocalStorage);
stateManager.subOnUpdateState(updateHistory);

subAllDomItem();

loadHistory()

// --------------------------------------------sub on update state----------------------------------------------------------

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
      statesHistory.length > 100 ? statesHistory.slice(1, 101) : statesHistory
    );
    localStorage.setItem("history", stringifyHistory);
  }
}
// --------------------------------------------load history on local storage------------------------------------------------

function loadHistory() {
  const loadedHistory = JSON.parse(localStorage.getItem("history"));

  if (!loadedHistory || loadedHistory.length <= 0) {
    historyBlock.hidden = true;
  } else {
    stateManager.setState({
      statesHistory: loadedHistory,
    });
  }
}
// --------------------------------------------handlers---------------------------------------------------------------------

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

  if (currentValue < 0) {
    stateManager.setState({
      currentValue: "Error",
    });

    return;
  }

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
// --------------------------------------------sub handlers on dom events-------------------------------------------------------
function subAllDomItem() {
  for (let i = 0; i <= 9; i++) {
    document.getElementById(`${i}-button`).onclick = () => {
      onClickOnValue(i);
    };
  }
  document.getElementById("point-button").onclick = () => {
    onClickOnPoint();
  };
  document.getElementById("calculate-button").onclick = () => {
    onCalculate();
  };
  document.getElementById("sum-button").onclick = () => {
    onAction("sum");
  };
  document.getElementById("substract-button").onclick = () => {
    onAction("substract");
  };
  document.getElementById("multiply-button").onclick = () => {
    onAction("multiply");
  };
  document.getElementById("divide-button").onclick = () => {
    onAction("divide");
  };
  document.getElementById("root-button").onclick = () => {
    onClickOnRoot();
  };
  document.getElementById("degree-button").onclick = () => {
    onAction("raiseToDegree");
  };
  document.getElementById("percent-button").onclick = () => {
    onClickOnPercent();
  };
  document.getElementById("clear-button").onclick = () => {
    onClearAll();
  };
  document.getElementById("output").onclick = () => {
    onClear();
  };
}
