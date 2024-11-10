const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

app.use(express.json()); // Middleware para permitir JSON no corpo da requisição

// Variável para armazenar o QR Code
let qrCodeData = null;

// Evento de QR Code gerado
client.on('qr', (qr) => {
  // Converte o QR Code em imagem base64 para exibir na página HTML
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Erro ao gerar QR Code:', err);
    } else {
      qrCodeData = url; // Salva o QR Code em base64
    }
  });
});

// Evento quando o cliente está pronto
client.on('ready', () => {
  console.log('WhatsApp Web is ready!');
  qrCodeData = null; // Limpa o QR Code quando está conectado
});

// Rota para visualizar o QR Code
app.get('/connect', (req, res) => {
  if (qrCodeData) {
    // Exibe a página HTML com o QR Code
    res.send(`
      <html>
      <body>
        <h1>Conecte-se ao WhatsApp</h1>
        <p>Escaneie o QR Code abaixo com o seu WhatsApp para conectar:</p>
        <img src="${qrCodeData}" alt="QR Code para conexão com WhatsApp" />
      </body>
      </html>
    `);
  } else {
    // Exibe uma mensagem caso o QR Code não esteja disponível
    res.send(`
      <html>
      <body>
        <h1>WhatsApp Web</h1>
        <p>O WhatsApp Web está ${client.info ? 'conectado' : 'inicializando...'}</p>
      </body>
      </html>
    `);
  }
});

// Verificar conexão com WhatsApp
app.get('/status', (req, res) => {
  const status = client.info ? 'Conectado' : 'Desconectado';
  res.json({ status });
});

// Enviar mensagem
app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: 'Número e mensagem são necessários' });
  }

  try {
    await client.sendMessage(`${number}@c.us`, message);
    res.json({ status: 'Mensagem enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Inicializar o cliente
client.initialize();

// Servidor ouvindo na porta 3000
app.listen(3000, () => console.log('Server is running on port 3000'));
