window.TYPE_SPRINT_GAME_CONFIG = Object.freeze({
  easy: Object.freeze({
    label: "Easy",
    speedMin: 14,
    speedMax: 21,
    spawnInterval: 1900
  }),
  normal: Object.freeze({
    label: "Normal",
    speedMin: 22,
    speedMax: 40,
    spawnInterval: 1450
  }),
  hard: Object.freeze({
    label: "Hard",
    speedMin: 41,
    speedMax: 62,
    spawnInterval: 1000
  })
});

window.TYPE_SPRINT_GAME_SPEED = (difficulty, randomValue) => {
  const settings = window.TYPE_SPRINT_GAME_CONFIG[difficulty] || window.TYPE_SPRINT_GAME_CONFIG.normal;
  const sample = Math.min(Math.max(Number.isFinite(randomValue) ? randomValue : Math.random(), 0), 1);
  return settings.speedMin + (settings.speedMax - settings.speedMin) * sample;
};
