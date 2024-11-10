const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

app.use(express.json()); // Middleware para permitir JSON no corpo da requisição

// Exibe o QR code no terminal
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Confirmação de conexão
client.on('ready', () => {
  console.log('WhatsApp Web is ready!');
});

// Verificar conexão com WhatsApp
app.get('/status', (req, res) => {
  const status = client.info ? 'Conectado' : 'Desconectado';
  res.json({ status });
});

// Enviar mensagem
app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;

  // Validações básicas
  if (!number || !message) {
    return res.status(400).json({ error: 'Número e mensagem são necessários' });
  }

  try {
    // Envia a mensagem para o número
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
