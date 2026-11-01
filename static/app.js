const sentences = [
  "Small steps every day create remarkable results over time.",
  "Clear focus turns practice into progress and confidence.",
  "The quick brown fox jumps over the lazy dog near the river.",
  "Great typing is a calm conversation between thought and fingers."
];

const wordBank = ["focus", "rhythm", "bright", "create", "steady", "signal", "little", "moment", "result", "power", "dream", "build", "swift", "calm", "practice", "future", "learn", "flow", "pixel", "spark", "green", "magic", "hello", "world", "type", "brave", "clear", "motion", "energy", "simple"];

const $ = (selector) => document.querySelector(selector);
const sentenceEl = $("#sentence-text");
const typingInput = $("#typing-input");
let sentence = sentences[0];
let testStartedAt = null;
let testTimer = null;

function showError(message) {
  $("#error-banner p").textContent = message;
  $("#error-banner").hidden = false;
}

function hideError() { $("#error-banner").hidden = true; }

function renderSentence() {
  const typed = typingInput.value;
  sentenceEl.innerHTML = [...sentence].map((char, index) => {
    const cls = index < typed.length ? (typed[index] === char ? "typed" : "wrong") : (index === typed.length ? "current" : "");
    return `<span class="${cls}">${char === " " ? "&nbsp;" : char}</span>`;
  }).join("");
  $("#sentence-progress").style.width = `${Math.min(typed.length / sentence.length * 100, 100)}%`;
}

function updateTestMetrics() {
  const typed = typingInput.value;
  const elapsed = testStartedAt ? Math.max((Date.now() - testStartedAt) / 1000, .1) : 0;
  let errors = 0;
  for (let i = 0; i < typed.length; i += 1) if (typed[i] !== sentence[i]) errors += 1;
  const correct = Math.max(typed.length - errors, 0);
  const wpm = elapsed ? Math.round(correct / 5 / (elapsed / 60)) : 0;
  const accuracy = typed.length ? Math.round(correct / typed.length * 100) : 100;
  $("#wpm-value").textContent = wpm;
  $("#accuracy-value").innerHTML = `${accuracy}<sup>%</sup>`;
  $("#errors-value").textContent = errors;
  $("#test-time-value").innerHTML = `${Math.floor(elapsed)}<sup>초</sup>`;
  $("#test-status").innerHTML = typed.length ? `<i></i>${typed === sentence ? "완료! 새 문장으로 더 연습해 보세요" : "집중해서 입력하고 있어요"}` : `<i></i>입력을 시작하면 측정됩니다`;
}

function resetTest(selectNew = false) {
  if (selectNew) sentence = sentences[(sentences.indexOf(sentence) + 1) % sentences.length];
  clearInterval(testTimer); testTimer = null; testStartedAt = null;
  typingInput.value = ""; renderSentence(); updateTestMetrics(); typingInput.focus();
}

typingInput.addEventListener("input", () => {
  hideError();
  if (!testStartedAt && typingInput.value) { testStartedAt = Date.now(); testTimer = setInterval(updateTestMetrics, 250); }
  renderSentence(); updateTestMetrics();
  if (typingInput.value === sentence) clearInterval(testTimer);
});
$("#reset-test").addEventListener("click", () => resetTest());
$("#new-sentence").addEventListener("click", () => resetTest(true));
$(".dismiss-error").addEventListener("click", hideError);

const game = { active: false, score: 0, lives: 3, time: 60, words: [], animation: 0, tick: null, spawn: null, lastTime: 0 };
const arena = $("#game-arena");
const gameInput = $("#game-input");

function updateGameHud() {
  $("#score-value").textContent = game.score;
  $("#lives-value").textContent = `${"♥ ".repeat(game.lives).trim()}${game.lives ? "" : "—"}`;
  $("#game-time-value").textContent = game.time;
}

function removeWord(word) { word.el?.remove(); game.words = game.words.filter((item) => item !== word); }

function spawnWord() {
  if (!game.active) return;
  const text = wordBank[Math.floor(Math.random() * wordBank.length)];
  const word = { text, x: 7 + Math.random() * 86, y: -10, speed: 22 + Math.random() * 18, el: document.createElement("span") };
  word.el.className = "falling-word"; word.el.textContent = text; word.el.style.left = `${word.x}%`; word.el.style.top = `${word.y}px`;
  arena.appendChild(word.el); game.words.push(word);
}

function endGame(message) {
  game.active = false; cancelAnimationFrame(game.animation); clearInterval(game.tick); clearInterval(game.spawn);
  gameInput.disabled = true; $("#start-game").textContent = "다시 시작 →"; $("#game-status").textContent = message;
  $("#game-overlay").hidden = false; $("#game-overlay").querySelector("strong").textContent = game.time === 0 ? "시간 종료!" : "게임 오버";
  $("#game-overlay").querySelector("span").textContent = `최종 점수 ${game.score}점 · 다시 도전해 보세요.`;
}

function gameFrame(timestamp) {
  if (!game.active) return;
  const delta = Math.min((timestamp - game.lastTime) / 1000, .06); game.lastTime = timestamp;
  game.words.slice().forEach((word) => {
    word.y += word.speed * delta; word.el.style.top = `${word.y}px`;
    if (word.y > arena.clientHeight - 32) { removeWord(word); game.lives -= 1; updateGameHud(); if (!game.lives) endGame("모든 목숨을 사용했어요. 다시 도전해 보세요."); }
  });
  game.animation = requestAnimationFrame(gameFrame);
}

function startGame() {
  game.words.forEach((word) => word.el.remove()); game.words = []; game.active = true; game.score = 0; game.lives = 3; game.time = 60;
  updateGameHud(); gameInput.value = ""; gameInput.disabled = false; gameInput.focus(); $("#start-game").textContent = "재시작 →"; $("#game-status").textContent = "단어가 바닥에 닿기 전에 입력하세요."; $("#game-overlay").hidden = true;
  clearInterval(game.tick); clearInterval(game.spawn); game.tick = setInterval(() => { game.time -= 1; updateGameHud(); if (game.time <= 0) endGame("60초가 끝났어요. 훌륭한 플레이였습니다!"); }, 1000); game.spawn = setInterval(spawnWord, 1450);
  spawnWord(); game.lastTime = performance.now(); game.animation = requestAnimationFrame(gameFrame);
}

gameInput.addEventListener("input", () => {
  const value = gameInput.value.trim().toLowerCase(); if (!value) return;
  const hit = game.words.find((word) => word.text === value);
  if (hit) { removeWord(hit); game.score += 10; updateGameHud(); gameInput.value = ""; }
});
$("#start-game").addEventListener("click", startGame);

document.querySelectorAll(".mode-tab").forEach((tab) => tab.addEventListener("click", () => {
  const isGame = tab.dataset.mode === "game";
  document.querySelectorAll(".mode-tab").forEach((item) => { item.classList.toggle("is-active", item === tab); item.setAttribute("aria-selected", item === tab); });
  $("#test-panel").hidden = isGame; $("#game-panel").hidden = !isGame;
  if (!isGame) typingInput.focus(); else if (game.active) gameInput.focus();
}));

window.addEventListener("error", () => showError("앱에서 예기치 않은 오류가 발생했습니다. 페이지를 새로고침해 주세요."));
resetTest();
