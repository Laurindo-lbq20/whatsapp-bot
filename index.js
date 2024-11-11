const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const port = 3000;

// Inicializa o cliente do WhatsApp com armazenamento de sessão
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "bot-whatsapp" }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let qrCodeData = null; // Variável para armazenar o QR code

// Gera o QR code e armazena na variável qrCodeData
client.on('qr', async (qr) => {
    qrCodeData = await qrcode.toDataURL(qr); // Converte o QR code para Data URL
    console.log('QR code atualizado. Acesse http://localhost:' + port + '/qr para visualizar.');
});

// Evento de conexão bem-sucedida
client.on('ready', () => {
    console.log('Bot conectado e pronto para uso!');
    qrCodeData = null; // Limpa o QR code quando o cliente está conectado
});

// Inicializa o cliente do WhatsApp
client.initialize();

// Rota para exibir o QR code
app.get('/qr', (req, res) => {
    if (qrCodeData) {
        res.send(`
            <html>
                <body>
                    <h2>Escaneie o QR code abaixo para se conectar ao WhatsApp:</h2>
                    <img src="${qrCodeData}" alt="QR Code" />
                </body>
            </html>
        `);
    } else {
        res.send('<h2>O bot já está conectado ou o QR code ainda não foi gerado.</h2>');
    }
});

// Inicia o servidor Express
app.listen(port, () => {
    console.log(`Servidor Express rodando em http://localhost:${port}`);
});