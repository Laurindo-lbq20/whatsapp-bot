const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Flags para evitar problemas de sandbox
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Web is ready!');
});

client.on('message', (msg) => {
  if (msg.body === 'Oi') {
    msg.reply('Olá! Como posso ajudar?');
  }
});

client.initialize();

app.listen(3000, () => console.log('Server is running on port 3000'));
