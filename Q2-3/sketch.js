// ギリシャ国旗（ほかの国旗に挑戦してもOK）
function setup() {
  createCanvas(270, 180);
  noStroke();
  background(255);

  const d = height / 9; // 縞1本の太さ
  const blue = color(0, 51, 160);

  // 縞を描く
  for(let i = 0; i < 9; i++){
    if(i % 2 === 1){
      fill(255);
    }else{
      fill(blue);
    }    
    // BLANK[1] ヒント：縞の色を交互に変えるには2で割った余りを使おう
    rect(0, i * d, width, (i + 1) * d);
  }

  // 十字を描く
  const size = d * 5;
  fill(blue);
  rect(0, 0, size, size);
  fill(255);
  rect(d * 2, 0, d, size);
  rect(0, d * 2, size, d)
  // BLANK[2] 十字を完成させよう
}
