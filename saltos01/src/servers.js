
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

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));
