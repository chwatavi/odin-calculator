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

generateKeys();

