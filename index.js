const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Configuração para desabilitar o sandbox
    }
});

// Evento para gerar o QR code no terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Escaneie o QR code para conectar no WhatsApp.");
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Bot conectado e pronto para uso!');
});

// Resposta básica a mensagens recebidas
client.on('message', (msg) => {
    if (msg.body.toLowerCase() === 'menu') {
        msg.reply('Olá! Como posso ajudar? Aqui estão algumas opções:\n1 - Informações\n2 - Contato\n3 - Ajuda');
    } else if (msg.body === '1') {
        msg.reply('Aqui estão as informações sobre nossos serviços...');
    } else if (msg.body === '2') {
        msg.reply('Entre em contato conosco pelo número (XX) XXXX-XXXX.');
    } else if (msg.body === '3') {
        msg.reply('Para obter ajuda, visite nosso site ou responda com "menu" para mais opções.');
    }
});

// Inicializa o cliente
client.initialize();