var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
function preload(){
  trex_running = loadAnimation("trex blue 1.png","trex blue 2.png","trex blue 3.png","trex 1.png","trex 2.png","trex 3.png","trex green 1.png","trex 2.png","trex 3.png");
  trex_collided = loadAnimation("trex_collided.png");
  restartImg=loadImage("restart.png")
  groundImage = loadImage("ground2.png");
  gameOverImg=loadImage("gameOver.png")
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  bgImg=loadImage("bg.jpg")
  scaryImg=loadImage("scaryBg.jpg")
  winImg=loadImage("win.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}
function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

 // ground.debug=true;
  ground.setCollider('rectangle',0,0,ground.width,3)
  ox=0;
  cx=0;
}
function draw() {
  background(bgImg);
  textFont("Courier New")
  textSize(25)
  fill("chartreuse")
  text("*DINO-TREX THE INFINITE*",camera.position.x-230,50)
  fill("white")
  text("Score: "+ score, camera.position.x+150,50);
  trex.x=camera.position.x-250;
  console.log(trex.y)
  if (gameState===PLAY){
    if(frameCount%4==0)
  {
    score++;
  }
    camera.position.x+=6;   
    if(camera.position.x>ground.width/2+300)
    {
      camera.position.x=300;
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
    }
    if(keyDown("space") && trex.y >= 150) {
      jumpSound.play();
      trex.velocityY = -14;
    }
    trex.velocityY = trex.velocityY + 0.6
    trex.collide(ground);
    //spawnClouds();
    spawnObstacles();
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
  
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();  
      gameState = END;
        
    }
  }
  else if (gameState === END) {
    background(scaryImg)
    textFont("Courier New")
    textSize(25)
    fill("chartreuse")
    text("click on reset button to play!",camera.position.x-230,50)
    fill("yellow")
    text("SCORE 500 and win!",camera.position.x-230,85)
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    trex.velocityY = 0;
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    trex.scale=0.6
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
  } 
  // call the function:- end();
  end();
  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(camera.position.x+300,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    
     //assign lifetime to the variable
    cloud.lifetime = 100;   
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;  
    //add each cloud to the group
    cloudsGroup.add(cloud);
    cx+=1;
  }
}
function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(camera.position.x+300,165,10,40);
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 350;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    ox+=1;
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  trex.scale=0.2
  camera.position.x=300;
  
  score = 0;
}
// THE if condition to "END-the-GAME" in the FUNCTION end();
function end(){
  if (score>500) {
    gameState=3
  }
  if (gameState===3) {
    background(winImg)
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    trex.velocityY = 0;
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    trex.scale=0.6
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    textSize(25)
    fill("skyblue")
    textFont("Times New Roman")
    text("Great Job! YOU'VE WON! you're a genius",camera.position.x-230,50)
  }
}