export class gameover extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'gameover'});
    }
    create()
    {       
        this.add.image(400, 300, 'sky');
        this.overText = this.add.text(300,400,'GAMEOVER');
        this.overText.setTint(0xff0000);
    }
}