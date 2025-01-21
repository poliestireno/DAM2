import {pantalla01} from './escenas/pantalla01.js';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene:[pantalla01],
  physics: {
  default: 'arcade',
  arcade: {
      gravity: { y: 300 },
      debug: false
  }
}
};
var game = new Phaser.Game(config);
