// ===== НАСТРОЙКИ ЗАДАЧИ =====
const CORRECT_ANSWER = 'Желание сбудется';

// ===== Переключение экранов =====
function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 's3') setTimeout(startQuiz, 300);
  if (id === 's4') setTimeout(startMaze, 300);
}

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => go(btn.dataset.next));
});

// ===== Проверка ответа =====
const answerInput = document.getElementById('answer');
const hint = document.getElementById('hint');
const checkBtn = document.getElementById('checkBtn');

function normalize(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ё/g, 'е')
    .replace(/Ё/g, 'Е')
    .replace(/[!?.]+$/g, '')
    .toLowerCase();
}

function checkAnswer() {
  const val = answerInput.value.trim();
  hint.textContent = '';

  if (val === '') {
    hint.style.color = '#fbbf24';
    hint.textContent = 'Введи вывод своей программы 🙂';
    return;
  }

  if (normalize(val) === normalize(CORRECT_ANSWER)) {
    hint.style.color = '#4ade80';
    hint.textContent = '✅ Верно! Дверь открывается...';
    setTimeout(() => {
      go('s3');
      confettiBurst();
    }, 1200);
  } else {
    hint.style.color = '#f87171';
    hint.textContent = '❌ Вывод не совпал с ожидаемым. Проверь код и попробуй ещё 🐍';
  }
}

checkBtn.addEventListener('click', checkAnswer);

answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkAnswer();
  }
});

// ===== ОПРОС =====
const QUESTIONS = [
  {
    q: '🎂 Утро дня рождения. Твои первые мысли?',
    a: [
      { t: 'Ещё 5 минут... и ещё 5... и ещё',        p: 'lazy' },
      { t: 'ГДЕ ТОРТ?! Я ЖДУ 364 ДНЯ!',               p: 'food' },
      { t: 'Так, кто сегодня придёт и во сколько?',   p: 'planner' },
      { t: 'А можно просто поспать? 🛌',              p: 'lazy' }
    ]
  },
  {
    q: '🎁 Тебе дарят носки. Твоя реакция?',
    a: [
      { t: 'Идеально! Мой гардероб пополнен',         p: 'wise' },
      { t: 'Ну... спасибо, конечно 🙃',                p: 'honest' },
      { t: 'Сойдёт как тряпка для питона',            p: 'hacker' },
      { t: 'Главное — не торт. Торт где?',            p: 'food' }
    ]
  },
  {
    q: '🎉 Вечеринка. Ты где?',
    a: [
      { t: 'В центре танцпола, конечно!',             p: 'party' },
      { t: 'У стола с едой, стратегически',           p: 'food' },
      { t: 'На диване. Наблюдаю. Анализирую',         p: 'wise' },
      { t: 'Уже дома. Устал(а) от людей',             p: 'lazy' }
    ]
  },
  {
    q: '🐍 Тебя просят починить баг в 2 часа ночи. Что делаешь?',
    a: [
      { t: 'Уже открыл(а) VS Code',                   p: 'hacker' },
      { t: 'Завтра. Всё завтра',                      p: 'lazy' },
      { t: 'Сначала чай, потом код',                  p: 'wise' },
      { t: 'А там есть торт?',                        p: 'food' }
    ]
  },
  {
    q: '🎂 Торт почти съеден. Последний кусок. Твои действия?',
    a: [
      { t: 'Он мой. Без вопросов',                    p: 'food' },
      { t: 'Уступлю, я же добрый(ая)',                p: 'wise' },
      { t: 'Разрежу пополам, всем хватит',            p: 'planner' },
      { t: 'Сфоткаю для инсты и съем',                p: 'party' }
    ]
  }
];

const PROFILES = {
  lazy:   { emoji: '🦥', title: 'Ленивый гений',       text: 'Ты способен(на) свернуть горы... но сначала полежишь. Учёные доказали: 90% твоих лучших идей приходят в горизонтальном положении!' },
  food:   { emoji: '🍕', title: 'Голодный оптимист',   text: 'Твоя философия проста: есть еда — есть счастье. Ты знаешь, где лучший столик, и никогда не оставляешь торт без внимания!' },
  planner:{ emoji: '🧠', title: 'Главный по таймингу', text: 'Ты заранее знаешь, кто придёт, во сколько и что подарит. Пока другие импровизируют, у тебя готов план на 3 дня вперёд!' },
  wise:   { emoji: '🦉', title: 'Дзен-именинник',      text: 'Ты — спокойствие, мудрость и чай с печенькой. Умеешь уступить последний кусок торта (даже если очень хочется). Твой баланс — завидный!' },
  honest: { emoji: '😏', title: 'Честный скептик',     text: 'Ты говоришь правду, даже если это носки. Твоё «ну... спасибо» вошло в легенды. Друзья ценят за прямоту!' },
  hacker: { emoji: '💻', title: 'Кибер-именинник',     text: 'Пока другие спят, ты пишешь код. Твой день рождения — просто ещё один день, когда можно закоммитить что-то классное!' },
  party:  { emoji: '🎉', title: 'Душа компании',       text: 'Ты заводишь танцпол, фоткаешь всех и делаешь вечеринку незабываемой. Без тебя праздник — просто встреча!' }
};

let quizIndex = 0;
let quizScores = {};

function startQuiz() {
  quizIndex = 0;
  quizScores = {};

  const card = document.querySelector('.quiz-card');
  card.innerHTML = `
    <p class="quiz-question" id="quizQuestion">Загрузка...</p>
    <div class="quiz-options" id="quizOptions"></div>
  `;

  renderQuestion();
}

function renderQuestion() {
  const total = QUESTIONS.length;
  const current = QUESTIONS[quizIndex];

  document.getElementById('quizBar').style.width = (quizIndex / total * 100) + '%';
  document.getElementById('quizCounter').textContent = `Вопрос ${quizIndex + 1} из ${total}`;
  document.getElementById('quizQuestion').textContent = current.q;

  const wrap = document.getElementById('quizOptions');
  wrap.innerHTML = '';

  current.a.forEach(ans => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = ans.t;
    btn.addEventListener('click', () => {
      quizScores[ans.p] = (quizScores[ans.p] || 0) + 1;
      quizIndex++;
      if (quizIndex < QUESTIONS.length) {
        renderQuestion();
      } else {
        showQuizResult();
      }
    });
    wrap.appendChild(btn);
  });
}

function showQuizResult() {
  document.getElementById('quizBar').style.width = '100%';
  document.getElementById('quizCounter').textContent = 'Готово!';

  let winner = 'wise';
  let max = -1;
  for (const key in quizScores) {
    if (quizScores[key] > max) { max = quizScores[key]; winner = key; }
  }
  const leaders = Object.keys(quizScores).filter(k => quizScores[k] === max);
  if (leaders.length > 1) winner = leaders[Math.floor(Math.random() * leaders.length)];

  const profile = PROFILES[winner] || PROFILES.wise;

  const card = document.querySelector('.quiz-card');
  card.innerHTML = `
    <div class="quiz-result">
      <span class="quiz-result-emoji">${profile.emoji}</span>
      <h2 class="quiz-result-title">Ты — «${profile.title}»!</h2>
      <p class="quiz-result-text">${profile.text}</p>
      <button class="btn" id="toMaze">Идти искать подарок 🗺️</button>
    </div>
  `;

  confettiBurst();

  document.getElementById('toMaze').addEventListener('click', () => {
    go('s4');
  });
}

// ===== ЛАБИРИНТ =====
const MAZE_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,1,2,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1]
];

const PLAYER_START = { x: 1, y: 1 };

let mazeState = null;

function startMaze() {
  mazeState = {
    player: { x: PLAYER_START.x, y: PLAYER_START.y },
    map: MAZE_MAP.map(row => row.slice()),
    finished: false
  };
  renderMaze();
  document.getElementById('gameMsg').textContent = '';
  document.getElementById('gameMsg').style.color = '#d8b4fe';

  window.focus();
}

function renderMaze() {
  const mazeEl = document.getElementById('maze');
  mazeEl.innerHTML = '';

  const map = mazeState.map;
  const player = mazeState.player;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (map[y][x] === 1) cell.classList.add('wall');
      else if (map[y][x] === 2) cell.classList.add('gift');

      if (player.x === x && player.y === y) cell.classList.add('player');

      mazeEl.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  if (!mazeState || mazeState.finished) return;

  const nx = mazeState.player.x + dx;
  const ny = mazeState.player.y + dy;

  if (ny < 0 || ny >= mazeState.map.length) return;
  if (nx < 0 || nx >= mazeState.map[0].length) return;

  const target = mazeState.map[ny][nx];
  if (target === 1) return;

  mazeState.player.x = nx;
  mazeState.player.y = ny;

  if (target === 2) {
    mazeState.finished = true;
    mazeState.map[ny][nx] = 0;
    renderMaze();
    document.getElementById('gameMsg').textContent = '🎁 Ты нашла подарок! Открываем...';
    document.getElementById('gameMsg').style.color = '#4ade80';
    confettiBurst();
    setTimeout(() => {
      go('s5');
      confettiBurst();
    }, 1500);
    return;
  }

  renderMaze();
}

// Клавиатура
document.addEventListener('keydown', (e) => {
  const screen = document.getElementById('s4');
  if (!screen || !screen.classList.contains('active')) return;
  if (!mazeState || mazeState.finished) return;

  const key = e.key.toLowerCase();

  if (key === 'arrowup'    || key === 'w' || key === 'ц') { e.preventDefault(); movePlayer(0, -1); }
  else if (key === 'arrowdown'  || key === 's' || key === 'ы') { e.preventDefault(); movePlayer(0,  1); }
  else if (key === 'arrowleft'  || key === 'a' || key === 'ф') { e.preventDefault(); movePlayer(-1, 0); }
  else if (key === 'arrowright' || key === 'd' || key === 'в') { e.preventDefault(); movePlayer( 1, 0); }
});

// D-pad для телефона
document.querySelectorAll('.dpad-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    if (dir === 'up')    movePlayer(0, -1);
    if (dir === 'down')  movePlayer(0,  1);
    if (dir === 'left')  movePlayer(-1, 0);
    if (dir === 'right') movePlayer( 1, 0);
  });
});

// ===== Подарок =====
const gift = document.getElementById('gift');

gift.addEventListener('click', () => {
  gift.classList.add('open');
  gift.textContent = '🎊';
  document.getElementById('giftText').classList.remove('hidden');
  document.getElementById('restartBtn').classList.remove('hidden');
  confettiBurst();
});

document.getElementById('restartBtn').addEventListener('click', () => {
  gift.classList.remove('open');
  gift.textContent = '🎁';
  document.getElementById('giftText').classList.add('hidden');
  document.getElementById('restartBtn').classList.add('hidden');
  document.getElementById('hint').textContent = '';
  answerInput.value = '';
  go('s1');
});

// ===== Конфетти (лёгкое) =====
function confettiBurst() {
  const emojis = ['🎉', '✨', '💜', '⭐'];
  for (let i = 0; i < 20; i++) {
    const c = document.createElement('div');
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -30px;
      font-size: ${18 + Math.random() * 16}px;
      pointer-events: none;
      z-index: 9999;
      will-change: transform;
    `;
    document.body.appendChild(c);
    const duration = 2500;
    c.animate(
      [
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(110vh) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
      ],
      { duration, easing: 'linear' }
    ).onfinish = () => c.remove();
  }
}