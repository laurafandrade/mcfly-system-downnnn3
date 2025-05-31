import makeWASocket from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import fs from 'fs'

const authFile = './auth_info_baileys.json'

async function start() {
  let authInfo = undefined

  if (fs.existsSync(authFile)) {
    authInfo = JSON.parse(fs.readFileSync(authFile, 'utf-8'))
  }

  const sock = makeWASocket({
    auth: authInfo
  })

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('Escaneie o QR Code abaixo:')
      console.log(qr)
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== Boom.statusCodes['loggedOut']

      console.log('Conexão fechada, motivo:', lastDisconnect.error)
      if (shouldReconnect) {
        start()
      } else {
        console.log('Usuário desconectou, reinicie o bot para reconectar')
      }
    }

    if (connection === 'open') {
      console.log('Conectado ao WhatsApp!')
    }
  })

  sock.ev.on('creds.update', () => {
    const auth = sock.authState
    fs.writeFileSync(authFile, JSON.stringify(auth, null, 2))
  })
}

start()
