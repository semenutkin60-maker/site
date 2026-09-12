// ===== Переключение экранов =====
function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Кнопки с data-next автоматически переключают экран
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => go(btn.dataset.next));
});

// ===== Опрос =====
const COMMENTS = {
  '🦥': 'Лень — двигатель прогресса! Отдыхай с удовольствием 😴',
  '🚀': 'Огонь! Пусть вечеринка будет легендарной 🔥',
  '🧠': 'Мудрость — сила. Спокойный праздник — тоже праздник ✨',
  '🍕': 'Торт уже в пути! Держись 🍰'
};

document.querySelectorAll('.option').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.vote;
    document.getElementById('voteResult').textContent = COMMENTS[key] || 'Отличный выбор!';
    setTimeout(() => go('s5'), 1800);
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
  // сброс состояния
  gift.classList.remove('open');
  gift.textContent = '🎁';
  document.getElementById('giftText').classList.add('hidden');
  document.getElementById('restartBtn').classList.add('hidden');
  document.getElementById('voteResult').textContent = '';

  // сброс кода и вывода
  const codeEl = document.getElementById('code');
  if (codeEl) {
    codeEl.value = `def happy_birthday(name):
    # твой код здесь
    pass

print(happy_birthday("Аня"))
`;
  }
  const outEl = document.getElementById('output');
  if (outEl) outEl.textContent = '';
  const hintEl = document.getElementById('hint');
  if (hintEl) hintEl.textContent = '';

  go('s1');
});

// ===== Конфетти без библиотек =====
function confettiBurst() {
  const emojis = ['🎉', '✨', '🎊', '💚', '⭐'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -30px;
      font-size: ${16 + Math.random() * 24}px;
      pointer-events: none;
      z-index: 9999;
      transition: transform ${2 + Math.random() * 2}s linear, opacity 3s;
    `;
    document.body.appendChild(c);
    requestAnimationFrame(() => {
      c.style.transform = `translateY(110vh) rotate(${Math.random() * 720}deg)`;
      c.style.opacity = 0;
    });
    setTimeout(() => c.remove(), 4500);
  }
}