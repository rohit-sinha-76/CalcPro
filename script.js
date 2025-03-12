// grab the elements we need
let display = document.getElementById('result');
let historyList = document.getElementById('history-list');
let historySection = document.getElementById('history');
let buttonsContainer = document.getElementById('buttons');
let modeBtn = document.getElementById('mode-btn');
let isScientific = false; // track if we're in scientific mode

// add stuff to the display when buttons are clicked
function appendToDisplay(value) {
    display.value += value;
    display.scrollLeft = display.scrollWidth; // keep the latest input in view
}

// wipe the display clean
function clearDisplay() {
    display.value = '';
    historySection.classList.remove('active'); // hide history too
}

// do the math!
function calculate() {
    try {
        let expression = display.value.replace('×', '*').replace('÷', '/');
        let result = parseExpression(expression); // custom parser ftw
        display.value = result;
        addToHistory(`${expression} = ${result}`);
        historySection.classList.add('active'); // show history
    } catch (err) {
        display.value = 'Error';
        setTimeout(() => { display.value = ''; }, 1000); // clear after a sec
    }
}

// my little math parser, handles basic stuff and some sci funcs
function parseExpression(expr) {
    // replace sci functions with actual math
    expr = expr.replace(/sin\(([^)]+)\)/g, (_, x) => Math.sin(parseFloat(parseExpression(x))));
    expr = expr.replace(/cos\(([^)]+)\)/g, (_, x) => Math.cos(parseFloat(parseExpression(x))));
    expr = expr.replace(/tan\(([^)]+)\)/g, (_, x) => Math.tan(parseFloat(parseExpression(x))));
    expr = expr.replace(/sqrt\(([^)]+)\)/g, (_, x) => Math.sqrt(parseFloat(parseExpression(x))));
    expr = expr.replace(/ln\(([^)]+)\)/g, (_, x) => Math.log(parseFloat(parseExpression(x))));
    expr = expr.replace(/\^/g, '**'); // power operator

    // this does the basic math, kinda hacky but works for now
    return Function('"use strict"; return (' + expr + ')')();
}

// add a calculation to the history list
function addToHistory(entry) {
    let li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
}

// clear out the history
function clearHistory() {
    historyList.innerHTML = '';
    historySection.classList.remove('active');
}

// switch between light and dark themes
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// toggle scientific mode on/off
function toggleMode() {
    isScientific = !isScientific;
    buttonsContainer.classList.toggle('scientific-mode');
    modeBtn.textContent = `Scientific Mode: ${isScientific ? 'On' : 'Off'}`;
}

// let’s add some keyboard support, makes it feel pro
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[0-9+\-*/().]/.test(key)) {
        appendToDisplay(key === '*' ? '×' : key === '/' ? '÷' : key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1); // chop off last char
    }
});