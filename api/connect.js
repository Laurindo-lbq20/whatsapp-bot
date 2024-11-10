const { Client } = require('wwebjs');
const QRCode = require('qrcode');

let client = null;
let isConnected = false;

module.exports = async (req, res) => {
    // Apenas inicializa o cliente uma vez
    if (!client) {
        client = new Client({
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        // Inicializa o cliente WhatsApp
        client.on('qr', (qr) => {
            QRCode.toDataURL(qr, (err, url) => {
                if (err) {
                    res.status(500).json({ message: 'Erro ao gerar o QR Code' });
                } else {
                    res.status(200).json({ qrCode: url });
                }
            });
        });

        // Evento de ready (quando o cliente está pronto)
        client.on('ready', () => {
            isConnected = true;
            console.log('WhatsApp Web está pronto');
        });

        // Evento de autenticação
        client.on('authenticated', () => {
            console.log('Cliente autenticado');
        });

        // Inicia o cliente
        client.initialize();
    } else {
        if (isConnected) {
            return res.status(200).json({ message: 'Já conectado ao WhatsApp Web!' });
        }
    }
};
