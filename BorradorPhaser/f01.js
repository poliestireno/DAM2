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
        bullet.setCollideWorldBounds(true);
        bullet.body.onWorldBounds = true;

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