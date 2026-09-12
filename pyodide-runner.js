// ===== Загрузка Pyodide =====
let pyodide = null;
const pyodideReady = (async () => {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
  });
  document.getElementById('loading').classList.add('done');
  document.getElementById('runBtn').disabled = false;
  document.getElementById('checkBtn').disabled = false;
  return pyodide;
})();

// ===== Запуск кода пользователя =====
async function runUserCode() {
  await pyodideReady;

  const code = document.getElementById('code').value;
  const output = document.getElementById('output');
  output.textContent = '';

  // Перехватываем stdout и stderr
  pyodide.setStdout({
    batched: (str) => { output.textContent += str + '\n'; }
  });
  pyodide.setStderr({
    batched: (str) => { output.textContent += str + '\n'; }
  });

  try {
    await pyodide.runPythonAsync(code);
    return output.textContent.trim();
  } catch (err) {
    output.textContent += '❌ Ошибка:\n' + err.message;
    return null;
  }
}

// ===== Проверка ответа =====
const EXPECTED = '🎂 С днём рождения, Аня! 🎉';

async function checkAnswer() {
  const hint = document.getElementById('hint');
  hint.textContent = '';
  const result = await runUserCode();

  if (result === null) {
    hint.style.color = '#ff5555';
    hint.textContent = 'Код упал с ошибкой 😢';
    return;
  }

  if (result.trim() === EXPECTED) {
    hint.style.color = '#7CFC00';
    hint.textContent = '✅ Верно! Дверь открывается...';
    setTimeout(() => {
      go('s3');
      confettiBurst();
    }, 1200);
  } else {
    hint.style.color = '#ff5555';
    hint.textContent = '❌ Вывод не совпал.\nОжидалось:\n' + EXPECTED + '\n\nПолучено:\n' + result;
  }
}

// ===== Обработчики =====
document.getElementById('runBtn').addEventListener('click', runUserCode);
document.getElementById('checkBtn').addEventListener('click', checkAnswer);

// ===== Хоткей Ctrl+Enter для запуска =====
document.getElementById('code').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    runUserCode();
  }
});

// ===== Поддержка Tab в textarea =====
document.getElementById('code').addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const ta = e.target;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + 4;
  }
});