import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import { createSVG } from './src/code/svgCreator.js';
import { transformDataToSVGElements } from './src/code/svgCreator.js';


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Обработка POST-запроса
app.post('/', (req, res) => {
    const data = req.body; // Получаем данные из запроса
    console.log(data); // Логируем данные на сервере
    res.json({ message: 'Данные успешно получены', data }); // Отправляем ответ
});


app.post('/create-svg', async (req, res) => {
    const { data } = req.body; // Ожидаем массив объектов с текстом, размером шрифта и штрих-кодом
    const { svgWidth, svgHeight, elements } = transformDataToSVGElements(req.body);

    try {
        const svg = await createSVG(elements, svgWidth, svgHeight);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.json(svg);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

