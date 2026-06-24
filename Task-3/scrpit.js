// ===========================
// Element References
// ===========================
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

// ===========================
// State Variables
// ===========================
// "expression" holds the string of numbers/operators the user has typed
let expression = '';
// "justEvaluated" tracks whether the last action was pressing "="
// so that typing a new number after a result starts a fresh expression
let justEvaluated = false;

// ===========================
// Helper: Update the Display
// ===========================
function updateDisplay(exprText, resultText) {
  expressionEl.textContent = exprText;
  resultEl.textContent = resultText;
  resultEl.classList.remove('error');
}

// ===========================
// Helper: Show Error Message
// ===========================
function showError(message) {
  resultEl.textContent = message;
  resultEl.classList.add('error');
  expression = '';
  expressionEl.textContent = '';
}

// ===========================
// Helper: Check if character is an operator
// ===========================
function isOperator(char) {
  return char === '+' || char === '-' || char === '×' || char === '÷' || char === '%';
}

// ===========================
// Core Calculation Logic
// ===========================
// Converts the display-friendly expression (×, ÷) into a JS-evaluable one
// and calculates the result manually using basic operator precedence rules.
function calculateResult(expr) {
  // Replace calculator symbols with JS-friendly operators
  let jsExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');

  // Basic validation: expression should not end with an operator or be empty
  if (jsExpr === '' || isOperator(jsExpr[jsExpr.length - 1])) {
    throw new Error('Invalid Expression');
  }

  // Split the expression into numbers and operators using a regex
  // This allows us to manually apply * and / before + and -
  const tokens = jsExpr.match(/(\d+\.?\d*)|[+\-*/]/g);

  if (!tokens) {
    throw new Error('Invalid Expression');
  }

  // First pass: handle multiplication and division (left to right)
  let pass1 = [];
  let i = 0;
  pass1.push(parseFloat(tokens[0]));
  i = 1;
  while (i < tokens.length) {
    const op = tokens[i];
    const nextNum = parseFloat(tokens[i + 1]);

    if (op === '*' || op === '/') {
      const prevNum = pass1.pop();
      if (op === '/' && nextNum === 0) {
        throw new Error('Cannot divide by 0');
      }
      pass1.push(op === '*' ? prevNum * nextNum : prevNum / nextNum);
    } else {
      // '+' or '-' get pushed as-is to be handled in the second pass
      pass1.push(op);
      pass1.push(nextNum);
    }
    i += 2;
  }

  // Second pass: handle addition and subtraction (left to right)
  let total = pass1[0];
  for (let j = 1; j < pass1.length; j += 2) {
    const op = pass1[j];
    const num = pass1[j + 1];
    total = op === '+' ? total + num : total - num;
  }

  if (!isFinite(total) || isNaN(total)) {
    throw new Error('Invalid Expression');
  }

  return total;
}

// ===========================
// Button Click Handling
// ===========================
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      // Reset everything back to the starting state
      expression = '';
      justEvaluated = false;
      updateDisplay('', '0');
      return;
    }

    if (action === 'delete') {
      // Remove the last character typed
      expression = expression.slice(0, -1);
      updateDisplay(expression, expression === '' ? '0' : expression);
      return;
    }

    if (action === 'equals') {
      // Attempt to evaluate the current expression
      try {
        const result = calculateResult(expression);
        updateDisplay(expression + ' =', formatNumber(result));
        expression = String(result);
        justEvaluated = true;
      } catch (err) {
        showError(err.message || 'Error');
      }
      return;
    }

    // --- Number or Operator button was pressed ---
    if (value !== undefined) {
      // If a result was just shown and the user types a number,
      // start a brand-new expression instead of appending to the old result
      if (justEvaluated && !isOperator(value)) {
        expression = '';
      }
      justEvaluated = false;

      // Prevent two operators in a row (replace the last one instead)
      const lastChar = expression[expression.length - 1];
      if (isOperator(value) && isOperator(lastChar)) {
        expression = expression.slice(0, -1) + value;
      } else {
        expression += value;
      }

      updateDisplay(expression, expression);
    }
  });
});

// ===========================
// Helper: Format Numbers Nicely
// ===========================
// Rounds long decimals so the display doesn't overflow with floating point errors
function formatNumber(num) {
  if (Number.isInteger(num)) return String(num);
  return String(Math.round(num * 1e10) / 1e10);
}

// ===========================
// Keyboard Support (bonus UX feature)
// ===========================
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/[0-9.]/.test(key)) {
    document.querySelector(`.btn[data-value="${key}"]`)?.click();
  } else if (key === '+') {
    document.querySelector('.btn[data-value="+"]').click();
  } else if (key === '-') {
    document.querySelector('.btn[data-value="-"]').click();
  } else if (key === '*') {
    document.querySelector('.btn[data-value="×"]').click();
  } else if (key === '/') {
    e.preventDefault();
    document.querySelector('.btn[data-value="÷"]').click();
  } else if (key === 'Enter' || key === '=') {
    document.querySelector('.btn.equals').click();
  } else if (key === 'Backspace') {
    document.querySelector('.btn.delete').click();
  } else if (key === 'Escape') {
    document.querySelector('.btn.clear').click();
  }
});