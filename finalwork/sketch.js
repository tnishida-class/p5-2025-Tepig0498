// 最終課題を制作しよう
let player; //プレイヤー
let playerBullets = []; //プレイヤー弾
let enemyBullets = []; //敵弾
let enemies = []; //敵
let playerImg; //プレイヤー画像

const playerBulletSpeed = 10; //プレイヤー弾の速さ
const enemyBulletSpeed = 2; //敵弾の速さ

let playerHP = 10; //プレイヤーHP
const maxHP = 10; //最大HP

// 牌の種類
const jiTiles = ["東","南","西","北","白","發","中"]; //字牌
const manTiles = ["1m","9m"]; //萬子
const pinTiles = ["1p","9p"]; //筒子
const souTiles = ["1s","9s"]; //索子

const kanjiNums = ["一","二","三","四","伍","六","七","八","九"]; //漢数字

let handTiles = []; //手牌
const maxHand = 13; //最大手牌

// 国士無双見本牌
const sampleTiles = [...jiTiles, "1m","9m","1p","9p","1s","9s"]; //見本牌(字牌+1,9)
const sampleStartX = 50; //見本牌の表示のスタート位置
const sampleStartY = 80; //見本牌の表示のスタート位置
const spacing = 35; //

function setup() {
  createCanvas(windowWidth, windowHeight); //スクリーンいっぱいに
  player = { x: width/2, y: height*0.8, size: 30, speed: 5 }; //プレイヤーの位置、大きさ、スピード

  textAlign(CENTER, CENTER); //中央寄せ（初）
  textSize(16); //文字サイズ（初）

  // プレイヤー三角形
  playerImg = createGraphics(30,30); //作成するキャンバスの大きさ（30*30）
  playerImg.fill(0,255,255); //水色
  playerImg.noStroke(); //枠線なし
  playerImg.triangle(15,0,0,30,30,30); //三角形の頂点三つの座標

  // 敵10体
  enemies.push({ x:100,y:100,w:40,h:40,shootTimer:0,vx:1,vy:5 }); 
  enemies.push({ x:200,y:150,w:40,h:40,shootTimer:0,vx:-2,vy:1 });
  enemies.push({ x:300,y:150,w:40,h:40,shootTimer:0,vx:-5,vy:1 });
  enemies.push({ x:400,y:90,w:40,h:40,shootTimer:0,vx:3,vy:2 });
  enemies.push({ x:500,y:80,w:40,h:40,shootTimer:0,vx:2,vy:2 });
  enemies.push({ x:600,y:70,w:40,h:40,shootTimer:0,vx:-4,vy:3 });
  enemies.push({ x:700,y:130,w:40,h:40,shootTimer:0,vx:-2,vy:3 });
  enemies.push({ x:800,y:100,w:40,h:40,shootTimer:0,vx:-1,vy:5 });
  enemies.push({ x:900,y:60,w:40,h:40,shootTimer:0,vx:5,vy:2 });
  enemies.push({ x:1000,y:150,w:40,h:40,shootTimer:0,vx:-5,vy:1 });
}
//画面の更新
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0,68,0);

  // 戦闘場
  rectMode(CORNER);
  fill(0);
  rect(0,height*0.6,width,height*0.4); //左上座標、幅、高さ

  // HPバー
  let barWidth = 200;
  let barHeight = 20;
  let leftX = 50;
  fill(255,0,0);
  rect(leftX,20,barWidth,barHeight); //赤バー
  fill(0,255,0);
  let greenWidth = map(playerHP,0,maxHP,0,barWidth); // 緑バー
  greenWidth = constrain(greenWidth,0,barWidth);
  rect(leftX,20,greenWidth,barHeight);


  // プレイヤー操作
  if(keyIsDown(LEFT_ARROW)) player.x -= player.speed;
  if(keyIsDown(RIGHT_ARROW)) player.x += player.speed;
  if(keyIsDown(UP_ARROW)) player.y -= player.speed;
  if(keyIsDown(DOWN_ARROW)) player.y += player.speed;
  player.x = constrain(player.x,player.size/2,width-player.size/2);
  player.y = constrain(player.y,height*0.6+player.size/2,height-player.size/2);

  // プレイヤー描画
  imageMode(CENTER);
  image(playerImg,player.x,player.y);

 // 敵動き＋弾発射
 for(let e of enemies){
  e.x += e.vx;
  e.y += e.vy;
  if(e.x<e.w/2||e.x>width-e.w/2) e.vx*=-1;
  if(e.y<0||e.y>height*0.6-e.h/2) e.vy*=-1;
  fill(120,0,150);
  rect(e.x-e.w/2,e.y-e.h/2,e.w,e.h);

  e.shootTimer++;
  if(e.shootTimer%40===0){
    // 1〜9を全部作る
   let allMan = [];
   let allPin = [];
   let allSou = [];
   for(let i=1; i<=9; i++){
    allMan.push(i+"m");
    allPin.push(i+"p");
    allSou.push(i+"s");
  }

// 牌プール（字牌 + 1〜9萬子 + 1〜9筒子 + 1〜9索子）
let tiles = [...jiTiles, ...allMan, ...allPin, ...allSou];

let tileName = random(tiles);

    enemyBullets.push({x:e.x,y:e.y,vx:0,vy:enemyBulletSpeed,tile:tileName,hit:false});
  }
 }


  // プレイヤー弾更新
  for(let pb of playerBullets){
    pb.y -= playerBulletSpeed;
    fill(255);
    ellipse(pb.x,pb.y,10);

    for(let eb of enemyBullets){
      if(!eb.hit && dist(pb.x,pb.y,eb.x,eb.y)<25){
        if(handTiles.length < maxHand){
          if(!sampleTiles.includes(eb.tile)){
            gameOver("不要牌を取った GAME OVER");
            return;
          }
          let neededCount = 1; // 全部1枚
          let currentCount = handTiles.filter(t=>t===eb.tile).length;
          if(currentCount >= neededCount){
            gameOver("必要以上の牌を取った GAME OVER");
            return;
          }
          handTiles.push(eb.tile);
        }
        eb.hit = true;
        pb.hit = true;
      }
    }
  }
  playerBullets = playerBullets.filter(b=>!b.hit && b.y>-10);

  // 敵弾描画
  for(let b of enemyBullets){
    if(b.hit) continue;
    b.x += b.vx;
    b.y += b.vy;
    drawTile(b.x,b.y,b.tile);
    if(dist(b.x,b.y,player.x,player.y)<10+player.size/2){
      if(frameCount%5===0) playerHP--;
    }
  }
  enemyBullets = enemyBullets.filter(b=>!b.hit && b.y<height+20);

  // 国士無双見本牌描画
  drawSampleTiles();

  // 手牌描画
  drawHand();

  // 勝利判定
  if(handTiles.length === maxHand){
    if(checkYakuman(handTiles)){
      fill(0,255,255);
      textSize(32);
      text("国士無双完成！", width/2, height/2);
      noLoop();
    }
  }

  // HP0でゲームオーバー
  if(playerHP <= 0){
    gameOver("HP0 GAME OVER");
  }
}

function keyPressed(){
  if(key===" "){
    playerBullets.push({x:player.x,y:player.y-player.size/2,hit:false});
  }
}

// 見本牌描画
function drawSampleTiles(){
  for (let i=0; i<sampleTiles.length; i++){
    drawTile(sampleStartX + i*spacing, sampleStartY, sampleTiles[i]);
  }
  textSize(16);
  fill(255);
  textAlign(CENTER,CENTER);
  text("国士無双に必要な牌", sampleStartX + (sampleTiles.length*spacing)/2, sampleStartY-30);
}

// 手牌描画（見本牌の下に配置）
function drawHand(){
  for (let i=0; i<sampleTiles.length; i++){
    let tile = sampleTiles[i];
    let count = handTiles.filter(t => t===tile).length;
    for (let j=0; j<count; j++){
      let x = sampleStartX + i*spacing;
      let y = sampleStartY + 50 + j*45;
      drawTile(x,y,tile);
    }
  }
}

// 牌描画
function drawTile(x,y,tile){
  const tileHeight = 40;
  const tileWidth = 30;
  fill(255); stroke(0); strokeWeight(2);
  rectMode(CENTER);
  rect(x,y,tileWidth,tileHeight,5);

  noStroke();
  textAlign(CENTER,CENTER);
  textSize(16);
  textFont('serif');

  if(["東","南","西","北"].includes(tile)){
    fill(0); text(tile,x,y);
  } else if(tile==="發"){ fill(0,128,0); text(tile,x,y);
  } else if(tile==="中"){ fill(255,0,0); text(tile,x,y);
  } else if(tile==="白"){ fill(255); text(tile,x,y); }
  else if(tile.endsWith("m")){
    fill(255,0,0);
    let num = parseInt(tile);
    let kanji = kanjiNums[num-1]; // 漢数字
    let manChar = "萬";

    // 漢数字を黒で描く
    fill(0);
    text(kanji, x, y - 8);

    // 萬を赤で描く
    fill(255,0,0);
    text(manChar, x, y + 8);
  }   else if(tile.endsWith("p")){
    let num = parseInt(tile);
    let positions = [];

    if(num===1) positions = [[0,0]];
    else if(num===2) positions = [[0,-6],[0,6]];
    else if(num===3) positions = [[-6,-6],[0,0],[6,6]];
    else if(num===4) positions = [[-6,-8],[-6,8],[6,-8],[6,8]];
    else if(num===5) positions = [[-6,-9],[-6,9],[6,-9],[6,9],[0,0]];
    else if(num===6) positions = [[-6,-10],[-6,3],[-6,10],[6,-10],[6,3],[6,10]];
    else if(num===7) positions = [[-7,-11],[-6,3],[-6,10],[6,-9],[6,3],[6,10],[0,-10]];
    else if(num===8) positions = [[-6,-12],[-6,-4],[-6,4],[-6,12],[6,-12],[6,-4],[6,4],[6,12]];
    else if(num===9) positions = [[-6,-12],[-6,0],[-6,12],[0,-12],[0,0],[0,12],[6,-12],[6,0],[6,12]];

    for(let p of positions){
  let px = x + p[0];
  let py = y + p[1];
  fill(0);   ellipse(px, py, 12); // 黒外枠
  fill(255,0,0); ellipse(px, py, 6); // 赤内側
    }
  }
      else if(tile.endsWith("s")){
    let num = parseInt(tile);
    let positions = [];

    if(num===1) positions = [[0,0]];
    else if(num===2) positions = [[0,-6],[0,6]];
    else if(num===3) positions = [[0,-10], [-7,8], [7,8]];
    else if(num===4) positions = [[-6,-8],[-6,8],[6,-8],[6,8]];
    else if(num===5) positions = [[-6,-8],[-6,8],[6,-8],[6,8],[0,0]];
    else if(num===6) positions = [[-8,-6],[0,-6],[8,-6],[-8,6],[0,6],[8,6]];
    else if(num===7) positions = [[-8,8],[0,8],[8,8],[-8,0],[0,0],[8,0],[0,-10]];
    else if(num===8) positions = [[-8,-12],[-8,-4],[-8,4],[-8,12],[8,-12],[8,-4],[8,4],[8,12]];
    else if(num===9) positions = [[-6,-12],[-6,0],[-6,12],[0,-12],[0,0],[0,12],[6,-12],[6,0],[6,12]];

    for(let p of positions){
      let px = x + p[0];
      let py = y + p[1];
      fill(0,200,0);
      rect(px, py, 6, 8, 2);

    }
  }
}

// 国士無双判定
function checkYakuman(hand){
  for(let t of sampleTiles){
    if(hand.filter(ht => ht===t).length !== 1) return false;
  }
  return true;
}

// ゲームオーバー
function gameOver(msg){
  fill(255,0,0);
  textSize(32);
  text(msg, width/2, height/2);
  noLoop();
} 