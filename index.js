const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const qrcode = require('qrcode-terminal')
const express = require('express')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('✅ McFly System WhatsApp Bot está online!')
})

// Inicializa o WhatsApp
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['McFlySystem', 'Chrome', '1.0.0']
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            console.log('📲 Scan this QR code to connect:')
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('🔌 Connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect)

            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('✅ Connected to WhatsApp')
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message) return

        const sender = msg.key.remoteJid
        const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text

        console.log('💬 Mensagem recebida:', messageContent)

        if (messageContent === '!ping') {
            await sock.sendMessage(sender, { text: '🏓 Pong!' })
        }

        if (messageContent === '!info') {
            await sock.sendMessage(sender, { text: '🚀 McFly System WhatsApp Bot Online' })
        }
    })
}

connectToWhatsApp()

app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`)
})
