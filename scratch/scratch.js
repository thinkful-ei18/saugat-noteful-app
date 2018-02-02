'use strict';

//Promise constructor with a resolve and a reject method which is assigned to a variable
//Random boolean value generated
//If the value is true resolve it with heads
function coinFlip(delay) {
  return new Promise((resolve, reject) => {
    const rand = Boolean(Math.round(Math.random()));
    setTimeout(function () {
      if (rand) {
        resolve('Heads!');
      } else {
        reject('Tails!');
      }
    }, delay);
  });
}

const coin1 = coinFlip(100).catch(err => err);
const coin2 = coinFlip(200).catch(err => err);
const coin3 = coinFlip(300).catch(err => err);

Promise.all( [coin1, coin2, coin3] )
  .then(arrayOfResults => {
    console.log(arrayOfResults);
  })
  .catch(err => {
    console.error(err);
  });