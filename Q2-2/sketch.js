// チェッカー
function setup() {
  createCanvas(200, 200);
  background(255);
  noStroke();
  const size = width / 8; // マスの一辺の長さ
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // BLANK[1] ヒント： rectのx座標は size * i, y座標は size * j
      if ((i + j) % 2 === 1) {
        fill(122);
        rect(size * i, size * j, size, size);
      }
      if (((i + j) % 2 === 1) && (j < 3)) {
        fill(255, 0, 0);
        ellipse(size * i + size / 2, size * j + size / 2, 20, 20);
      }
      if (((i + j) % 2 === 1) && (4 < j)) {
        fill(0);
        ellipse(size * i + size / 2, size * j + size / 2, 20, 20);
      }
    }
  }
}
