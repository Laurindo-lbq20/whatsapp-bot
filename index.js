const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Configuração do cliente com `LocalAuth` para armazenamento da sessão
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "bot-whatsapp" }), // Garante persistência de sessão com um identificador único
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necessário para ambientes sem sandbox, como Railway
        headless: true // Executa em segundo plano para consumir menos recursos
    }
});

// Gera o QR code para conexão inicial
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Escaneie o QR code para conectar no WhatsApp.");
});

// Confirma quando o cliente está conectado e pronto
client.on('ready', () => {
    console.log('Bot conectado e sessão ativa!');
});

// Garante que o bot responda a mensagens para manter a sessão ativa
client.on('message', (msg) => {
    if (msg.body.toLowerCase() === 'menu') {
        msg.reply('Olá! Aqui estão algumas opções:\n1 - Informações\n2 - Contato\n3 - Ajuda');
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