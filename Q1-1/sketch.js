let player;
let bullets = [];
let enemies = [];
let enemySpawnTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = {
    x: width / 2,
    y: height / 2,
    speed: 5
  };
}

function draw() {
  background(20);

  movePlayer();
  drawPlayer();

  updateBullets();
  updateEnemies();

  // 敵を定期的に出す
  enemySpawnTimer--;
  if (enemySpawnTimer <= 0) {
    spawnEnemy();
    enemySpawnTimer = 40;
  }
}

// -----------------------------------
// プレイヤー
// -----------------------------------
function movePlayer() {
  if (keyIsDown(LEFT_ARROW))  player.x -= player.speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += player.speed;
  if (keyIsDown(UP_ARROW))    player.y -= player.speed;
  if (keyIsDown(DOWN_ARROW))  player.y += player.speed;
}

function drawPlayer() {
  fill(0, 200, 255);
  ellipse(player.x, player.y, 30);
}

// -----------------------------------
// 弾
// -----------------------------------
function keyPressed() {
  if (key === ' ') {
    bullets.push({
      x: player.x,
      y: player.y,
      vx: 12,
      vy: 0
    });
  }
}

function updateBullets() {
  fill(255, 200, 0);
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.vx;
    ellipse(b.x, b.y, 10);

    if (b.x > width) bullets.splice(i, 1);
  }
}

// -----------------------------------
// 敵
// -----------------------------------
function spawnEnemy() {
  enemies.push({
    x: width + 20,
    y: random(height),
    vx: 0,
    vy: 0
  });
}

function updateEnemies() {
  fill(255, 80, 80);
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];

    let v = vectorField(e.x, e.y);
    e.vx += v.x;
    e.vy += v.y;

    e.x += e.vx;
    e.y += e.vy;

    rect(e.x, e.y, 20, 20);

    // 当たり判定（弾）
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (dist(e.x, e.y, b.x, b.y) < 20) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }

    // 画面外に消えたら削除
    if (e.x < -50 || e.x > width + 50 || e.y < -50 || e.y > height + 50) {
      enemies.splice(i, 1);
    }
  }
}

// -----------------------------------
// ベクトル場（敵を曲線的に動かす力）
// -----------------------------------
function vectorField(x, y) {
  let cx = width / 2;
  let cy = height / 2;

  let dx = x - cx;
  let dy = y - cy;

  let r = sqrt(dx * dx + dy * dy);

  if (r < 10) r = 10;

  return {
    x: -dy / (r * 10),
    y: dx / (r * 10)
  };
}
