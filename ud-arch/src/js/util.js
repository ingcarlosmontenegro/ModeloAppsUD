function getRandomNumberInRange(start, end) {
  return Math.floor(Math.random() * (end - start)) + start;
}

function getRandomNumber(digits) {
  const start = (Math.pow(10, digits - 1));
  const end = Math.pow(10, digits) - 1;
  return getRandomNumberInRange(start, end);
}

function getRandomFromArray(array) {
  return array[getRandomNumberInRange(0, array.length)];
}

function getAverageFromList(list = []) {
  totalPercent = list.reduce((accumulator, item) => accumulator + item.percent, 0);
  if (totalPercent > 1) {
    return null;
  }
  return list.reduce((accumulator, item) => accumulator + (item.value, item.percent), 0);
}
