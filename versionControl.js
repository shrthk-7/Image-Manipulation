const dataHistory = [];

const getLatest = () => {
  const len = dataHistory.length;
  return dataHistory[len - 1];
};

const applyChange = (data) => {
  const len = dataHistory.length;
  if (len >= 10) {
    dataHistory.shift();
  }
  dataHistory.push(data);
  return data;
};

const undoChange = () => {
  if (dataHistory.length == 1) return dataHistory[0];
  dataHistory.pop();

  const len = dataHistory.length;
  return dataHistory[len - 1];
};

export default { getLatest, applyChange, undoChange };
