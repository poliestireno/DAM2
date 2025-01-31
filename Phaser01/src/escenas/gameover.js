export class gameover extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'gameover'});
    }
    create()
    {       
        this.add.image(400, 300, 'sky');
        this.overText = this.add.text(180,300,'GAMEOVER');
        this.overText.setTint(0xff0000);
        this.overText.setFontSize('100px');
    }
}