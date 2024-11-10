const express = require('express');
const cors = require('cors');
const { Client } = require('wwebjs');
const QRCode = require('qrcode'); // Importa a biblioteca QRCode

// Inicializando o app do Express
const app = express();
const port = 3000; // Porta da API

// Usando CORS
app.use(cors());
app.use(express.json()); // Para que a API aceite JSON no corpo das requisições

// Inicializa o cliente do WhatsApp Web
const client = new Client({
    puppeteer: {
        headless: true,  // Defina como false se você quiser visualizar o navegador
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Variáveis para armazenar o estado do WhatsApp (QR Code e Conexão)
let qrCode = '';
let isConnected = false;

// Rota para conectar ao WhatsApp e gerar o QR Code
app.get('/connect', (req, res) => {
    // Verifica se já está conectado
    if (isConnected) {
        return res.status(200).json({ message: 'Já conectado ao WhatsApp Web!' });
    }

    // Captura o QR Code quando a conexão ainda não está feita
    client.on('qr', (qr) => {
        qrCode = qr;

        // Converte a string do QR Code em uma imagem PNG
        QRCode.toDataURL(qr, (err, url) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao gerar o QR Code' });
            }

            // Retorna o QR Code como imagem (DataURL)
            res.status(200).json({ qrCode: url });
        });
    });

    // Evento de 'ready' quando o cliente está autenticado e pronto
    client.on('ready', () => {
        isConnected = true;
        console.log('Cliente do WhatsApp pronto!');
    });

    // Evento de 'authenticated' quando a autenticação foi bem-sucedida
    client.on('authenticated', () => {
        console.log('Cliente autenticado');
    });

    // Inicializa a conexão
    client.initialize();
});

// Rota para enviar uma mensagem
app.post('/send-message', async (req, res) => {
    const { phoneNumber, message } = req.body;

    // Verifica se o cliente está conectado ao WhatsApp Web
    if (!isConnected) {
        return res.status(400).json({ message: 'Não conectado ao WhatsApp Web. Tente novamente.' });
    }

    try {
        const chatId = `${phoneNumber}@c.us`; // Formato esperado pelo wwebjs
        await client.sendMessage(chatId, message);
        res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ message: 'Erro ao enviar mensagem.' });
    }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`API rodando na http://localhost:${port}`);
});