export default {
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