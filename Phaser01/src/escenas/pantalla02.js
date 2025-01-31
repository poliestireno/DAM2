

export class pantalla02 extends Phaser.Scene
{

    constructor()
    {
        super({key:'pantalla02'});
    }

    score=0;

    preload ()
    {
    this.load.image('sky2', 'assets/sky2.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    }

  //  poner un enemigo con el propio sprite que ande aleatorio y
  //  que se le pueda disparar.

  vRandomX=100;

createEnemigo()
{
  this.enemigo = this.physics.add.sprite(150,400,'enemigo');
  this.enemigo.setCollideWorldBounds(true);
  this.enemigo.setBounce(.8);
  this.physics.add.collider(this.enemigo, this.platforms);
  this.time.addEvent({
    delay:2000,
    callback: () =>
    {
      //const vRandomX = Phaser.Math.Between(-200,200);
      const vRandomY = Phaser.Math.Between(-400,0);
      this.enemigo.setVelocity(this.vRandomX,vRandomY);
    },
    loop: true
  });

}
maxBalas=10;
balasRestantes=this.maxBalas;
createBalas()
{
  this.balas = this.physics.add.group({defaultKey:'torpedo',maxSize:this.maxBalas});
  this.textoBalas = this.add.text(10,10,"Balas restantes "+this.balasRestantes);
}


createPlayer()
{
  this.player = this.physics.add.sprite(100, 150, 'dude');
  this.player.setBounce(.2);
  this.player.setCollideWorldBounds(true);
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });
  
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });

  this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  this.keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

  this.physics.add.overlap(this.balas,this.enemigo,this.toqueEnemigo,null,this);

}
toqueEnemigo(laBala,elenemigo)
{
  this.balas.killAndHide(laBala);
  //elenemigo.disableBody(true,true);
  this.enemigo.disableBody(true,true);
  console.log("enemigo eliminado");
  this.vRandomX= this.vRandomX * 1.2;
  this.score += 100;
  this.scoreText.setText('Score: ' + this.score);
  setTimeout(()=>{
    this.enemigo.enableBody(true,150,400,true,true);
  },2000);

}
create ()
{
//  -cada 60 puntos genera otra bomba
 //cuando se acaba que vaya a otra escena que ponga gameover y diga los puntos.
 // -dispara/pegar y se elimina la bomba


this.add.image(400, 300, 'sky2');
//this.add.image(400, 300, 'star');
this.platforms = this.physics.add.staticGroup();

this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

this.platforms.create(600, 400, 'ground');
this.platforms.create(50, 250, 'ground');
this.platforms.create(750, 220, 'ground');

this.createBalas();

this.createEnemigo();

this.createPlayer();

this.physics.add.collider(this.player, this.platforms);
this.cursors = this.input.keyboard.createCursorKeys();

this.stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
});

this.stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

this.physics.add.collider(this.stars, this.platforms);

this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
this.physics.add.overlap(this.player, this.enemigo, this.hitBomb, null, this);

this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
this.gameOverText = this.add.text(350, 300, '', { fontSize: '60px', fill: '#000' });
    

this.bombs = this.physics.add.group();

  this.physics.add.collider(this.bombs, this.platforms);

  this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
}
crearBomba() 
{
  var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb = this.bombs.create(x, 16, 'bomb');
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}
collectStar (player, star)
{
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

  if (this.score % 60 == 0)
  {
    this.crearBomba();
  }
  if (this.stars.countActive(true) === 0)
  {
    this.stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true);
      });
      this.crearBomba();

  }
}
hitBomb (player, bomb)
{
  this.physics.pause();

  this.player.setTint(0xff0000);

  this.player.anims.play('turn');

  //this.gameOverText.setText('GAME OVER');

  this.scene.start('gameover');

}
update ()
{
if (this.cursors.left.isDown)
{
    this.player.setVelocityX(-160);

    this.player.anims.play('left', true);
}
else if (this.cursors.right.isDown)
{
    this.player.setVelocityX(160);

    this.player.anims.play('right', true);
}
else
{
    this.player.setVelocityX(0);

    this.player.anims.play('turn');
}

if (this.cursors.up.isDown && this.player.body.touching.down)
{
    this.player.setVelocityY(-330);
}

if(Phaser.Input.Keyboard.JustDown(this.keyM) && this.balasRestantes>0)
  {
    this.disparar(300);
  }
if(Phaser.Input.Keyboard.JustDown(this.keyN) && this.balasRestantes>0)
  {
    this.disparar(-300);
  }
      
}

disparar(vel)
{
  console.log("dispara");
  const balaAux = this.balas.get(this.player.x, this.player.y);
  if (balaAux)
  {
    balaAux.setActive(true);
    balaAux.setVisible(true);
    balaAux.body.velocity.x=vel;
    balaAux.body.velocity.y=-300;
    this.balasRestantes--;
    this.textoBalas.setText("Balas restantes "+this.balasRestantes);
    balaAux.setCollideWorldBounds(true);

    balaAux.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', function(body){
    this.balas.killAndHide(balaAux);
    },this);
  }
}


}