module.exports = async (req, res) => {
    const { phoneNumber, message } = req.body;

    // Verifica se o cliente está conectado
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
};
