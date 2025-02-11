
import Phaser from 'phaser';
// game.js

// Configuración de Phaser
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

/*
 Presionar "D" → Elimina una puntuación de la base de datos.
 Presionar "K" → Incrementa la puntuación de un jugador en 200 puntos.
 Presionar "R" → Reinicia la puntuación a 0.
 Presionar "U" para actualizar la puntuación
 Presionar "Espacio" para introducir una puntuación
 
*/

const game = new Phaser.Game(config);

let score = 0;
let playerName = 'Jugador';
let scoreText;
let scores = [];

// Función preload para cargar recursos
function preload() {
  this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
  // Cargar más recursos según el juego
}

// Función create para crear los objetos iniciales en la escena
function create() {
  // Fondo del juego
  this.add.image(400, 300, 'sky');

  // Texto de puntuación
  scoreText = this.add.text(20, 20, `Puntuación: ${score}`, { font: '32px Arial', fill: '#fff' });


// Escuchar la tecla "U" para actualizar la puntuación
this.input.keyboard.on('keydown-U', () => {
  const playerToUpdate = prompt('Ingrese el nombre del jugador a actualizar:');
  const newScore = parseInt(prompt('Ingrese la nueva puntuación:'));
  if (playerToUpdate && !isNaN(newScore)) {
      updateScore(playerToUpdate, newScore);
  }
});
this.input.keyboard.on('keydown-K', () => {
  const playerToIncrease = prompt('Ingrese el nombre del jugador a incrementar en 200:');
  if (playerToIncrease) {
      increaseScore200(playerToIncrease);
  }
});
this.input.keyboard.on('keydown-D', () => {
  const playerToDelete = prompt('Ingrese el nombre del jugador a eliminar:');
  if (playerToDelete) {
      deleteScore(playerToDelete);
  }
});

this.input.keyboard.on('keydown-R', () => {
  const playerToReset = prompt('Ingrese el nombre del jugador para reiniciar su puntuación:');
  if (playerToReset) {
      resetScore(playerToReset);
  }
});

  // Escuchar la tecla "Espacio"
  this.input.keyboard.on('keydown-SPACE', () => {
      // Pedir el nombre del jugador y la puntuación
      playerName = prompt('Ingrese su nombre:');
      const scoreValue = parseInt(prompt('Ingrese su puntuación:'));
      if (playerName && !isNaN(scoreValue)) {
          score = scoreValue;
          insertScore(playerName, score); // Insertar la puntuación en la base de datos
      }
  });

  // Cargar puntuaciones al inicio del juego
  loadScores(this);
}

// Función update para actualizar la escena (si es necesario)
function update() {
  // Aquí podrías agregar la lógica de tu juego
}

// Función para insertar una puntuación en el backend
function insertScore(player, score) {
  fetch('http://localhost:3000/api/scores', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ playerName: player, score: score })
  })
  .then(response => response.json())
  .then(() => {
      loadScores(game.scene.scenes[0]); // Recargar las puntuaciones
      console.log('insertado correctamente');
  })
  .catch(error => {
      console.error('Error al insertar la puntuación:', error);
  });
}

// Función para cargar las puntuaciones desde el backend y mostrarlas en la escena
function loadScores(scene) {
  fetch('http://localhost:3000/api/scores')
      .then(response => response.json())
      .then(data => {
          scores = data; // Almacenar las puntuaciones en la variable 'scores'
          updateScoreboard(scene); // Actualizar la visualización de puntuaciones
      })
      .catch(error => {
          console.error('Error al cargar las puntuaciones:', error);
      });
}

// Función para actualizar la visualización de las puntuaciones
function updateScoreboard(scene) {
  const topScores = scores.slice(0, 10); // Solo mostrar las 10 mejores puntuaciones
  let text = 'Top 10 Puntuaciones:\n';
  topScores.forEach((score, index) => {
      text += `${index + 1}. ${score.playerName}: ${score.score}\n`;
  });

  // Mostrar las puntuaciones en la escena de Phaser
  if (scene.scoreboardText) {
      scene.scoreboardText.setText(text); // Actualizar el texto
  } else {
      scene.scoreboardText = scene.add.text(20, 100, text, { font: '20px Arial', fill: '#fff' });
  }
}
// Función para modificar una puntuación en el backend
function updateScore(player, newScore) {
  fetch(`http://localhost:3000/api/scores/${player}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score: newScore })
  })
  .then(response => response.json())
  .then(() => {
      loadScores(game.scene.scenes[0]); // Recargar las puntuaciones
      console.log('Puntuación actualizada correctamente');
  })
  .catch(error => {
      console.error('Error al actualizar la puntuación:', error);
  });
}

function increaseScore200(player) {
  fetch(`http://localhost:3000/api/scores/${player}/increase200`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(() => {
      loadScores(game.scene.scenes[0]); // Recargar puntuaciones
      console.log('Puntuación incrementada en 200');
  })
  .catch(error => {
      console.error('Error al incrementar la puntuación:', error);
  });
}

function resetScore(player) {
  fetch(`http://localhost:3000/api/scores/${player}/reset`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(() => {
      loadScores(game.scene.scenes[0]); // Recargar puntuaciones
      console.log('Puntuación reiniciada a 0');
  })
  .catch(error => {
      console.error('Error al reiniciar la puntuación:', error);
  });
}

function deleteScore(player) {
  fetch(`http://localhost:3000/api/scores/${player}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(() => {
      loadScores(game.scene.scenes[0]); // Recargar puntuaciones
      console.log('Puntuación eliminada correctamente');
  })
  .catch(error => {
      console.error('Error al eliminar la puntuación:', error);
  });
}
