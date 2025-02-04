import { PlayButton } from '../componentes/play-button.js';

export class menu extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'menu'});
        this.playButton = new PlayButton(this);
    }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('sky2', 'assets/sky2.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('enemigo', 'assets/joker.png');
        this.load.image('torpedo', 'assets/torpedo.png');
        this.load.image('pistola', 'assets/pistola.png');
        this.load.audio('audio_ok1','assets/sonidos/ok1.ogg');
        this.load.audio('enemigoKO','assets/sonidos/enemigoKO.ogg');
        this.load.audio('pistola','assets/sonidos/pistola.ogg');
        
        this.load.spritesheet('dude', 
          'assets/dude.png',
          { frameWidth: 32, frameHeight: 48 }
      );
    this.load.spritesheet('playbutton', 'assets/playbutton.png', { frameWidth: 190, frameHeight: 49 });
    }
    

    create()
    {       
        this.add.image(400, 300, 'sky');
        this.overText = this.add.text(225,400,'Bienvenido al juego mejor del mundo');
        this.overText.setTint(0xff0000);
        this.playButton.create();
    }
}