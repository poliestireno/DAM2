
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';



const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/phaser_scores', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema y modelo de puntuaciones
const scoreSchema = new mongoose.Schema({
    playerName: String,
    score: Number,
    date: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

// Rutas
app.post('/api/scores', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        const newScore = new Score({ playerName, score });
        await newScore.save();
        res.status(201).json({ message: 'Puntuación guardada correctamente', data: newScore });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la puntuación', error });
    }
});

app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10); // Top 10 puntuaciones
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las puntuaciones', error });
    }
});
// Ruta para actualizar una puntuación existente
app.put('/api/scores/:playerName', async (req, res) => {
    try {
        const { playerName } = req.params;
        const { score } = req.body;

        const updatedScore = await Score.findOneAndUpdate(
            { playerName }, 
            { score }, 
            { new: true } // Devuelve el nuevo documento actualizado
        );

        if (!updatedScore) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        res.status(200).json({ message: 'Puntuación actualizada correctamente', data: updatedScore });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la puntuación', error });
    }
});
// Ruta para incrementar la puntuación en 200 puntos
app.patch('/api/scores/:playerName/increase200', async (req, res) => {
    try {
        const { playerName } = req.params;

        const updatedScore = await Score.findOneAndUpdate(
            { playerName }, 
            { $inc: { score: 200 } }, // Incrementar en 200 puntos
            { new: true }
        );

        if (!updatedScore) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        res.status(200).json({ message: 'Puntuación incrementada en 200', data: updatedScore });
    } catch (error) {
        res.status(500).json({ message: 'Error al incrementar la puntuación', error });
    }
});
// Ruta para resetear la puntuación a 0
app.patch('/api/scores/:playerName/reset', async (req, res) => {
    try {
        const { playerName } = req.params;

        const updatedScore = await Score.findOneAndUpdate(
            { playerName }, 
            { score: 0 }, // Poner la puntuación en 0
            { new: true }
        );

        if (!updatedScore) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        res.status(200).json({ message: 'Puntuación reiniciada a 0', data: updatedScore });
    } catch (error) {
        res.status(500).json({ message: 'Error al reiniciar la puntuación', error });
    }
});
// Ruta para eliminar una puntuación
app.delete('/api/scores/:playerName', async (req, res) => {
    try {
        const { playerName } = req.params;

        const deletedScore = await Score.findOneAndDelete({ playerName });

        if (!deletedScore) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        res.status(200).json({ message: 'Puntuación eliminada correctamente', data: deletedScore });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la puntuación', error });
    }
});



// metodo get para modificar, no recomendable por por seguridad y standares de REST
// pero se puede llamar directamente desde un navegador

app.get('/api/scores/:player/increase/:amount', async (req, res) => {
    try {
        const { player, amount } = req.params;
        const increaseValue = parseInt(amount, 10);

        if (isNaN(increaseValue)) {
            return res.status(400).json({ message: 'La cantidad debe ser un número' });
        }

        const updatedScore = await Score.findOneAndUpdate(
            { playerName: player },
            { $inc: { score: increaseValue } },
            { new: true }
        );

        if (!updatedScore) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        res.status(200).json({ message: `Puntuación aumentada en ${increaseValue}`, data: updatedScore });
    } catch (error) {
        res.status(500).json({ message: 'Error al incrementar la puntuación', error });
    }
});




// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));
