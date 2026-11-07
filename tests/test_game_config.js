const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const configSource = fs.readFileSync(path.join(root, "static", "game-config.js"), "utf8");
const configContext = { window: {} };
vm.runInNewContext(configSource, configContext, { filename: "game-config.js" });

const config = configContext.window.TYPE_SPRINT_GAME_CONFIG;
const speed = configContext.window.TYPE_SPRINT_GAME_SPEED;
assert.deepStrictEqual(Object.keys(config), ["easy", "normal", "hard"]);
assert.deepStrictEqual(JSON.parse(JSON.stringify(config.normal)), { label: "Normal", speedMin: 22, speedMax: 40, spawnInterval: 1450 });
assert.strictEqual(speed("easy", 0), 14);
assert.strictEqual(speed("easy", 1), 21);
assert.strictEqual(speed("normal", 0.5), 31);
assert.strictEqual(speed("hard", 0), 41);
assert.strictEqual(speed("hard", 1), 62);
assert(config.easy.speedMax < config.normal.speedMin, "Easy must be slower than Normal");
assert(config.hard.speedMin > config.normal.speedMax, "Hard must be faster than Normal");
assert(config.easy.spawnInterval > config.normal.spawnInterval, "Easy must spawn less often");
assert(config.hard.spawnInterval < config.normal.spawnInterval, "Hard must spawn more often");

const appSource = fs.readFileSync(path.join(root, "static", "app.js"), "utf8");
assert(appSource.includes("GAME_SPEED(game.difficulty, Math.random())"));
assert(appSource.includes("setInterval(spawnWord, settings.spawnInterval)"));
assert(appSource.includes('difficulty: "normal"'));
assert(appSource.includes("game.score += 10"));
assert(appSource.includes("game.lives -= 1"));
assert(appSource.includes("game.time = 60"));

const result = {
  encoding: "UTF-8",
  baseline: {
    speedMin: 22,
    speedMax: 40,
    spawnInterval: 1450,
    timerSeconds: 60,
    lives: 3
  },
  difficulties: config,
  fixedRandomSpeedSamples: {
    easy: [speed("easy", 0), speed("easy", 0.5), speed("easy", 1)],
    normal: [speed("normal", 0), speed("normal", 0.5), speed("normal", 1)],
    hard: [speed("hard", 0), speed("hard", 0.5), speed("hard", 1)]
  },
  assertions: "passed"
};

const artifactDir = path.join(root, "artifacts");
fs.mkdirSync(artifactDir, { recursive: true });
fs.writeFileSync(path.join(artifactDir, "game-config-results.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log("Game difficulty tests passed.");
console.table(Object.entries(config).map(([name, value]) => ({
  difficulty: value.label,
  speed: `${value.speedMin}-${value.speedMax} px/s`,
  spawnInterval: `${value.spawnInterval} ms`
})));
