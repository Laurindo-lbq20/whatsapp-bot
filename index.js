const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one" // Altere o clientId se precisar de múltiplas sessões.
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  },
});

app.use(express.json());

let qrCodeData = null;

// Evento de QR Code gerado
client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Erro ao gerar QR Code:', err);
    } else {
      qrCodeData = url;
    }
  });
});

// Evento de conexão estabelecida
client.on('ready', () => {
  console.log('WhatsApp Web is ready!');
  qrCodeData = null; // Limpa o QR Code após a conexão
});

// Rota para visualizar o QR Code
app.get('/connect', (req, res) => {
  if (qrCodeData) {
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

client.initialize();

app.listen(3000, () => console.log('Server is running on port 3000'));
