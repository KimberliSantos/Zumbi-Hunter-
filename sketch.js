var fundo,imagemFundo;
var jogador, atirador1, atirador2, atirador3;
var  vida1,vida2,vida3;
var imagemVida1,imagemVida2,imagemVida3;
var imagemZumbi;
var somPerdeu,somGanhou,somExplosao;
var grupoDeZumbis,grupoDeBalas;
var vidas = 3
var balas = 70;
var estado = "lutar";
var pontuacao = 0

function preload(){
  atirador1 = loadImage("assets/shooter_1.png")
  atirador2 = loadImage("assets/shooter_2.png")
  atirador3 = loadImage("assets/shooter_3.png")

  imagemVida1 = loadImage("assets/heart_1.png")
  imagemVida2 = loadImage("assets/heart_2.png")
  imagemVida3 = loadImage("assets/heart_3.png")

  imagemZumbi = loadImage("assets/zombie.png")  

  imagemFundo = loadImage("assets/bg.jpeg")

  somPerdeu = loadSound("assets/lose.mp3")
  somGanhou = loadSound("assets/win.mp3")
  somExplosao = loadSound("assets/explosion.mp3")
}

function zumbi() {
  if(frameCount%60 ===0){
    var zumbi = createSprite(1300,933);
    zumbi.velocityX = -5
    zumbi.addImage(imagemZumbi);
    zumbi.y = Math.round(random(500,800))
    zumbi.lifetime = 1300;
    zumbi.depth = jogador.depth;
    zumbi.scale = 0.2;
    zumbi.debug = true;
    zumbi.setCollider("rectangle",0,0,400,400)
    jogador.depth = zumbi.depth +1;
    
    grupoDeZumbis.add(zumbi);  
  }
}

function setup() {
  createCanvas(1280,933);

  textSize(90)
  fill("red")

  //adicionando a imagem de fundo
  fundo = createSprite(640,467)
  fundo.addImage(imagemFundo)

  //criando o sprite do jogador
  jogador = createSprite(displayWidth-1150, displayHeight-300);
  jogador.addImage(atirador2)
  jogador.scale = 0.3
  jogador.debug = true;
  jogador.setCollider("rectangle",0,0,200,200)

  vida1 = createSprite(900,50);
  vida1.addImage(imagemVida1)
  vida1.scale = 0.3

  vida2 = createSprite(900,50);
  vida2.addImage(imagemVida2)
  vida2.scale = 0.3

  vida3 = createSprite(900,50);
  vida3.addImage(imagemVida3)
  vida3.scale = 0.3

  grupoDeBalas = new Group()
  grupoDeZumbis =  new Group()
}

function draw() {
  background(0); 

  drawSprites()

  if(estado ==="lutar"){
    //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques
    if(keyDown("UP_ARROW")||touches.length>0){
      jogador.y = jogador.y-30
    }

    if(keyDown("DOWN_ARROW")||touches.length>0){
      jogador.y = jogador.y+30
    }

    //solte balas e mude a imagem do atirador para a posição de tiro quando a tecla de espaço for pressionada
    if(keyWentDown("space")){
      var bala = createSprite(jogador.x,jogador.y-20,20,10)
      bala.velocityX = 20; 
      jogador.addImage(atirador3)
      grupoDeBalas.add(bala)
      balas = balas-1
    }
    //o jogador volta à imagem original quando pararmos de pressionar a barra de espaço
    else if(keyWentUp("space")){
      jogador.addImage(atirador2)
    }

    for (var index = 0; index < grupoDeZumbis.length; index++) {
      if(grupoDeZumbis[index].isTouching(jogador)){
        somExplosao.play()
        grupoDeZumbis[index].destroy()
        vidas--
      }

      if(grupoDeZumbis[index].isTouching(grupoDeBalas)){
        grupoDeZumbis[index].destroy()
        grupoDeBalas.destroyEach()
        pontuacao += 2
      }
    }

    if(pontuacao === 100){
      estado = "ganhou"
      somGanhou.play()
    }

    if(balas=== 0 ){
      estado = "sem bala"
      somPerdeu.play()
    }
    
    if(vidas===0){
      vida1.visible = false
      vida2.visible = false
      vida3.visible = false
      estado = "morreu"
      somPerdeu.play()
    }

    if(vidas===1){
      vida1.visible = true;
      vida2.visible = false;
      vida3.viseble = false;
    }
    
    if(vidas===2){
      vida1.visible = false
      vida2.visible = true
      vida3.visible = false  
    }
    
    if(vidas===3){
      vida1.visible = false
      vida2.visible = false
      vida3.visible = true
    }

    zumbi();
  } else if(estado ===  "ganhou"){
    grupoDeZumbis.destroyEach()
    text ("Você ganhou, parabéns!",300,600)

  } else if(estado === "morreu"){
    grupoDeZumbis.destroyEach()
    text("Você perdeu!",300,600)

  } else if(estado === "sem bala"){
    text("As balas acabaram...",300,600)

  }

  textSize(50);
  fill("white");
  text("Pontos:"+pontuacao,50,50);
}
