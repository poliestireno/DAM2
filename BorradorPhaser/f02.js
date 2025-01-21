//fijandose en gra
//pasar todo del html a index.js
//crear una escena que sea de gameover que ponga la puntuacion
//en el index importar las escena y ponerlo en el config:
import { Instrucciones } from './escenas/instrucciones.js';


const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 750 ,
    scene: [Loader,Juego,Congratulations,Gameover,Creditos,RankingScene,Instrucciones],


//cuando acabe cerrar todo, sonidos y todo y pasar a otra escena, 
// pasando un json como parámetro
this.audio_gameover.play();this.cerrarTodo();
                this.scene.start('creditos', { nivel: this.nivel,puntos:this.puntos });


//que la dar a click haga algo el juego, fijarse en gra
this.input.on('pointerdown', function(pointer) {
            // Obtener las coordenadas x e y del puntero
            let x = pointer.x;
            let y = pointer.y;
            
            // Imprimir las coordenadas en la consola
            console.log('Coordenadas del clic:', 'x:', x, 'y:', y);
        }, this);

//sobre un sprite o sobre cualquier imagen

this.via1= this.physics.add.image(75,375,'via');
    this.via1.setTint("0x000000");
    var graphics = this.add.graphics();
    var maskRect = new Phaser.Geom.Rectangle(this.via1.x - 37.5, this.via1.y - 375, this.via1.width, this.via1.height);
    graphics.fillStyle(0xffffff, 0);
    graphics.fillRectShape(maskRect);
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRectShape(maskRect);
    this.via1.setMask(graphics.createGeometryMask());
    this.via1.on('pointerdown', function(pointer) {
        this.scene.calcularHit_1();
    });
    this.via1.setInteractive();



 this.sprite_2.on('pointerdown', function(pointer) 
    {
        escena.desbloquearTodosLosPoderesMochila();
        escena.estadoBoomerang=true;
        escena.sprite_2.destroy();
        escena.iFigActual_2.destroy();