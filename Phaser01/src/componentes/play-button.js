import { Button } from './button.js';
export class PlayButton extends Button {
  constructor(scene) {
    super(scene, 'playbutton', 400, 300);
  }

  doClick() {
    
    this.relatedScene.scene.start('pantalla01');
  }
  
}