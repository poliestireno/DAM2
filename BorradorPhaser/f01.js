/*
Vamos a agregar un enemigo que se mueve aleatoriamente y 
que puede ser eliminado al ser golpeado por una bala! 
Usaremos la física de colisiones de Phaser para detectar 
cuando una bala toca al enemigo.
Con implementación de límite de balas:
*/

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let keyG;
let bullets;
let enemy;

// Límite de balas
let maxBullets = 10; // Número máximo de balas que el jugador puede disparar
let currentBullets; // Balas restantes

function preload() {
    // Cargar sprites
    this.load.image('player', 'ruta_del_sprite_del_jugador.png');
    this.load.image('bullet', 'ruta_del_sprite_de_la_bala.png');
    this.load.image('enemy', 'ruta_del_sprite_del_enemigo.png');
}

function create() {
    // Crear jugador
    player = this.physics.add.sprite(400, 500, 'player');
    player.setCollideWorldBounds(true);

    // Crear grupo de balas

bullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: maxBullets}); // El grupo puede tener como máximo las mismas balas disponibles });
   
 // Inicializar las balas restantes
    currentBullets = maxBullets;

    // Configurar teclas
    cursors = this.input.keyboard.createCursorKeys();
    keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

    // Crear enemigo
    enemy = this.physics.add.sprite(400, 100, 'enemy');
    enemy.setCollideWorldBounds(true);

    // Movimiento aleatorio del enemigo
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            const randomX = Phaser.Math.Between(-200, 200);
            const randomY = Phaser.Math.Between(-200, 200);
            enemy.setVelocity(randomX, randomY);
        },
        loop: true
    });

    // Detectar colisión entre balas y enemigo
    this.physics.add.overlap(bullets, enemy, hitEnemy, null, this);

    // Mostrar balas restantes en pantalla
    this.bulletText = this.add.text(10, 10, `Balas restantes: ${currentBullets}`, {
        fontSize: '20px',
        fill: '#ffffff'
    });
}

function update() {
    // Movimiento del jugador
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    }

    // Disparar si hay balas disponibles
    if (Phaser.Input.Keyboard.JustDown(keyG) && currentBullets > 0) {
        shootBullet();
    }
}

function shootBullet() {
    const bullet = bullets.get(player.x, player.y);

    if (bullet) {
        // Activar la bala
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -300;

        // Reducir el contador de balas
        currentBullets--;

        // Actualizar el texto en pantalla
        game.scene.scenes[0].bulletText.setText(`Balas restantes: ${currentBullets}`);

        // Desactivar la bala al salir de los límites del mundo
        //Hace que el proyectil colisione con los límites del mundo en lugar de atravesarlos.
        bullet.setCollideWorldBounds(true);
        //Habilita el evento de colisión con los bordes del mundo. Sin esto, el evento 'worldbounds' no se activará.
        bullet.body.onWorldBounds = true;
//Escucha el evento 'worldbounds' y, cuando el proyectil choca con un borde del mundo, lo elimina con killAndHide(bullet).
//killAndHide(bullet) lo marca como inactivo y lo oculta, ideal si estás usando un Group 
// para reciclar balas en lugar de destruirlas y crear nuevas.
        bullet.once('worldbounds', () => {
            bullets.killAndHide(bullet);
        });
    }
}

function hitEnemy(bullet, enemy) {
    // Desactivar la bala y el enemigo
    bullets.killAndHide(bullet);
    enemy.disableBody(true, true);

    // Mensaje en consola
    console.log('¡Enemigo eliminado!');
}


Para hacer que el enemigo reaparezca con mayor velocidad después de ser eliminado, puedes modificar la función hitEnemy para:

Reactivar al enemigo tras un tiempo usando setTimeout o un evento de Phaser.Timer.
Aumentar su velocidad cada vez que reaparece.
Aquí tienes una versión mejorada de tu código:

Código actualizado:
javascript
Copiar
Editar
function hitEnemy(bullet, enemy) {
    // Desactivar la bala y el enemigo
    bullets.killAndHide(bullet);
    enemy.disableBody(true, true);

    // Mensaje en consola
    console.log('¡Enemigo eliminado!');

    // Incrementar la velocidad (opcionalmente, podrías almacenarla en `enemy.speed` en su inicialización)
    let nuevaVelocidad = enemy.body.velocity.x * 1.2; // Aumenta un 20% cada vez
    if (Math.abs(nuevaVelocidad) < 50) nuevaVelocidad = 50; // Velocidad mínima

    // Reactivar al enemigo después de un tiempo
    setTimeout(() => {
        enemy.enableBody(true, Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), true, true);
        enemy.setVelocityX(nuevaVelocidad); // Aplicar nueva velocidad
    }, 1000); // Espera 1 segundo antes de reaparecer
}
Explicación:
Oculta el enemigo y la bala al colisionar.
Aumenta su velocidad en un 20% cada vez que reaparece.
Evita que la velocidad sea demasiado baja estableciendo un mínimo de 50.
Reaparece después de 1 segundo en una posición aleatoria.