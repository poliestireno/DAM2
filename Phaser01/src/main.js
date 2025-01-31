import {pantalla01} from './escenas/pantalla01.js';
import {gameover} from './escenas/gameover.js';
import {pantalla02} from './escenas/pantalla02.js';
import {menu} from './escenas/menu.js';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene:[menu,pantalla02,pantalla01,gameover],
  physics: {
  default: 'arcade',
  arcade: {
      gravity: { y: 300 },
      debug: false
  }
}
};
var game = new Phaser.Game(config);

