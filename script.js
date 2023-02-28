function generateKeys() {
  const leftKeyLabels = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.','%'];
  const rightKeyLabels = ['DEL', 'AC', '*', '/', '+', '-', '+/-', '='];
  
  // If not listed here, the key is a num
  keyLabelToKeyType = {
    '.' : 'dot',
    '+/-' : 'neg',
    'DEL' : 'del',
    'AC' : 'clr',
    '*' : 'opr',
    '/' : 'opr',
    '+' : 'opr',
    '-' : 'opr',
    '%' : 'per',
    '=' : 'eql',
  };

  function placeKey(keyLabel, container, i, col){
    if (i % col == 0){
      const newKeyRow = document.createElement('div');
      newKeyRow.classList.add("keyRow");
      container.appendChild(newKeyRow);
    }
    const newKey = document.createElement('div');
    newKey.classList.add("key");
    newKey.setAttribute('key-label', keyLabel);
    newKey.setAttribute('key-type', keyLabelToKeyType[keyLabel] || 'num');
    newKey.textContent = keyLabel;
    container.lastChild.appendChild(newKey);
  }

  const leftContainer = document.querySelector('.input-left');
  const rightContainer = document.querySelector('.input-right');
  for (let i = 0; i < leftKeyLabels.length; i++){
    placeKey(leftKeyLabels[i], leftContainer, i, 3);
  }
  for (let i = 0; i < rightKeyLabels.length; i++){
    placeKey(rightKeyLabels[i], rightContainer, i, 2);
  }
}


let calculator = {
  prev : 0,
  opr : '+',
  cur : '',
  mode : 'opr',
  neg : false,
  len : 8
};

function pressKey(e){
  label = this.getAttribute('key-label');
  type = this.getAttribute('key-type');
  switch(type){
    case 'num':
      if (calculator.mode == 'opr' || calculator.mode == 'num'){
        tryAppend(label);
        calculator.mode = 'num';
      }
      break;
    case 'dot':
      if (calculator.mode == 'num'){
        if (calculator.cur.includes('.')){
          calculator.mode = 'err';
          break;
        }
        tryAppend('.');
      }else if (calculator.mode == 'opr'){
        calculator.cur = '0.';
        calculator.mode = 'num';
      }
      break;
    case 'opr':
    case 'eql':
      if (calculator.mode == 'opr' && calculator.opr != '='){
          calculator.mode = 'err';
          break;
      }else if (calculator.opr == '=' || calculator.mode == 'num'){
        let output = computeValue(calculator.prev, calculator.cur, calculator.opr);
        if (output == 'err'){
          calculator.mode = 'err';
          break;
        }
        calculator.prev = output;
        calculator.cur = '';
        calculator.mode = 'opr';
        calculator.opr = label;
        calculator.neg = false;
        console.log('updated');
      }
      break;
    case 'neg':
      let flipToNum = false;
      if (calculator.mode == 'opr'){
        if (calculator.opr == '='){
          calculator.cur = calculator.prev.toString();
          calculator.prev = 0;
          calculator.opr = '+';
          calculator.neg = calculator.cur < 0;
          calculator.mode = 'num';
        }else{
          calculator.cur = '-';
          calculator.neg = true;
          flipToNum = true;
        }
      }
      if (calculator.mode == 'num' ){
        if (calculator.neg){
          calculator.neg = false;
          calculator.cur = calculator.cur.slice(1);
        }else{
          if (tryAppend('-', true)){
            calculator.neg = true;
          }
        }
      }
      if (flipToNum){
        calculator.mode = 'num';
      }
      break;
    case 'del':
      if (calculator.mode == "num"){
          calculator.cur = calculator.cur.slice(0, -1);
      }
      break;
    case 'clr':
      calculator.prev = 0;
      calculator.opr ='+';
      calculator.cur ='';
      calculator.mode = 'opr';
      calculator.neg =false;
      break;
    case 'per':
      if (calculator.mode == "opr" && calculator.opr == '='){
        calculator.cur = calculator.prev.toString();
        calculator.prev = 0;
        calculator.opr = '+';
        calculator.neg = calculator.cur < 0;
        calculator.mode = 'num';
      }
      if (calculator.mode == "num"){
        calculator.cur = String(calculator.cur / 100);
      }
      break;
    default:
      calculator.mode = 'err';
      console.log('error');
  }
  updateDisplay(type);
  console.log(calculator.prev, calculator.cur, calculator.mode, calculator.opr);
}

function computeValue(prev, cur, opr){
  curNum = Number(cur);
  let output;
  switch (opr){
    case '=':
      if (calculator.cur == ''){
        output = prev;
      }else{
        output = curNum;
      }
      break;
    case '+':
      output = prev + curNum;
      break;
    case '-':
      output = prev - curNum;
      break;
    case '*':
      output = prev * curNum;
      break;
    case '/':
      if (curNum == 0){
        output = 'err';
        break;
      }
      output = prev / curNum;
      break;
    default:
      console.log("Unknown computational error.")
      return;
  }
  if (output >= 1e8 || output <= -1e7){
    output = 'err';
    console.log('error');
  }
  return output;
}

function tryAppend(label, inFront=false){
  console.log(typeof calculator.cur, calculator.cur.length)
  if (calculator.cur.length < calculator.len){
    if (inFront){
      calculator.cur = label + calculator.cur;
    }else{
      console.log('append time');
      calculator.cur = String(calculator.cur + label);
      console.log(typeof calculator.cur);
    }
    return true;
  }
  return false;
}

function updateDisplay(type){
  let showPrev = (type == 'opr' || type == 'eql');
  let displayValue = showPrev ? calculator.prev.toString() : calculator.cur;
  if (calculator.mode == 'err'){
    displayValue = 'ERROR!!!';
  }else{
    let overflow = displayValue.length - calculator.len;
    if (overflow > 0){
      console.log('overflow', overflow, displayValue);
      let decPlace = displayValue.length - displayValue.indexOf('.') - 1;
      if (calculator.neg){
        decPlace--;
      }
      displayValue = (+displayValue).toFixed(decPlace - overflow);
    }
    if (calculator.mode == 'num' && (calculator.cur.slice(0,-1) == '0' || calculator.cur.slice(0,-1) == '-0')){
      if (displayValue[displayValue.length-1] != '.'){
        if (calculator.neg){
          displayValue = '-' + (+(displayValue)).toString();
        }else{
          displayValue = (+displayValue).toString();
        }
      }
    }
  }
  const display = document.querySelector('.display');
  if (showPrev){
    calculator.prev = +displayValue;
    display.textContent = displayValue;
  }else{
    calculator.cur = displayValue;
    display.textContent = calculator.cur;
  }
  return;
}


generateKeys();
const keys = document.querySelectorAll('.key');
keys.forEach(key=>key.addEventListener('click', pressKey));
