// This algorithm functions as a cash register, returning the status of the cash register
// in addition to an object with the amount of each currency denomination that will be returned

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

function checkCashRegister(price, cash, cid) {
  let changeOwed = (cash - price) * 100;

  const CURRENCY = {
    PENNY: 1,
    NICKEL: 5,
    DIME: 10,
    QUARTER: 25,
    ONE: 100,
    FIVE: 500,
    TEN: 1000,
    TWENTY: 2000,
    "ONE HUNDRED": 10000
  };
  let status = ["OPEN", "INSUFFICIENT_FUNDS", "CLOSED"];

  let haveSufficientFunds = true;
  let isClosed = false;
  // multiply values by 100 to convert to integers for more accurate computation
  let roundedCID = cid.map(unit => [unit[0], Math.round(unit[1] * 100)]);
  // determine total funds currently available in cash register
  let fundsAvailable = roundedCID.reduce(
    (sum, unitAmount) => sum + unitAmount[1],
    0
  );
  let cashReturned = {
    status: status[0],
    change: []
  };
  let changeCounted = 0;
  if (fundsAvailable < changeOwed) {
    haveSufficientFunds = false;
  } else if (fundsAvailable === changeOwed) {
    isClosed = true;
    cashReturned.change = roundedCID;
  } else {
    // determine how much of each currency denomination should be returned
    for (let i = roundedCID.length - 1; i >= 0; i--) {
      let unitString = roundedCID[i][0];
      let unitAmount = [unitString, 0];
      while (changeCounted + CURRENCY[unitString] <= changeOwed) {
        if (roundedCID[i][1] < CURRENCY[unitString]) {
          break;
        } else {
          changeCounted += CURRENCY[unitString];
          unitAmount[1] += CURRENCY[unitString];
          roundedCID[i][1] -= CURRENCY[unitString];
        }
      }
      if (unitAmount[1] !== 0) {
        cashReturned.change.push(unitAmount);
      }
    }
    if (changeCounted !== changeOwed) {
      haveSufficientFunds = false;
    }
  }
  // determine status of the cash register after the transaction is complete
  if (!haveSufficientFunds) {
    cashReturned.status = status[1];
    cashReturned.change = [];
  } else if (isClosed) {
    cashReturned.status = status[2];
  }
  cashReturned.change.forEach(unit => {
    unit[1] /= 100;
  });
  // console.log(`cash returned: ${JSON.stringify(cashReturned)}`);
  return cashReturned;
}

//Tests
// checkCashRegister(19.5, 20, [
//   ["PENNY", 1.01],
//   ["NICKEL", 2.05],
//   ["DIME", 3.1],
//   ["QUARTER", 4.25],
//   ["ONE", 90],
//   ["FIVE", 55],
//   ["TEN", 20],
//   ["TWENTY", 60],
//   ["ONE HUNDRED", 100]
// ]); // should return an object.
// checkCashRegister(19.5, 20, [
//   ["PENNY", 1.01],
//   ["NICKEL", 2.05],
//   ["DIME", 3.1],
//   ["QUARTER", 4.25],
//   ["ONE", 90],
//   ["FIVE", 55],
//   ["TEN", 20],
//   ["TWENTY", 60],
//   ["ONE HUNDRED", 100]
// ]); // should return {status: "OPEN", change: [["QUARTER", 0.5]]}.
// checkCashRegister(3.26, 100, [
//   ["PENNY", 1.01],
//   ["NICKEL", 2.05],
//   ["DIME", 3.1],
//   ["QUARTER", 4.25],
//   ["ONE", 90],
//   ["FIVE", 55],
//   ["TEN", 20],
//   ["TWENTY", 60],
//   ["ONE HUNDRED", 100]
// ]); // should return {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}.
// checkCashRegister(19.5, 20, [
//   ["PENNY", 0.01],
//   ["NICKEL", 0],
//   ["DIME", 0],
//   ["QUARTER", 0],
//   ["ONE", 0],
//   ["FIVE", 0],
//   ["TEN", 0],
//   ["TWENTY", 0],
//   ["ONE HUNDRED", 0]
// ]); // should return {status: "INSUFFICIENT_FUNDS", change: []}.
// checkCashRegister(19.5, 20, [
//   ["PENNY", 0.01],
//   ["NICKEL", 0],
//   ["DIME", 0],
//   ["QUARTER", 0],
//   ["ONE", 1],
//   ["FIVE", 0],
//   ["TEN", 0],
//   ["TWENTY", 0],
//   ["ONE HUNDRED", 0]
// ]); // should return {status: "INSUFFICIENT_FUNDS", change: []}.
checkCashRegister(19.5, 20, [
  ["PENNY", 0.5],
  ["NICKEL", 0],
  ["DIME", 0],
  ["QUARTER", 0],
  ["ONE", 0],
  ["FIVE", 0],
  ["TEN", 0],
  ["TWENTY", 0],
  ["ONE HUNDRED", 0]
]); // should return {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}
