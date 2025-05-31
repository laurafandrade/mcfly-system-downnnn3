import makeWASocket from "@whiskeysockets/baileys";

async function startSock() {
  const sock = makeWASocket();

  sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      console.log('🚨 Escaneie este QR code no seu WhatsApp:\n', qr);
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== 401;
      console.log('⚠️ Conexão fechada', lastDisconnect?.error?.toString() || '');
      if (shouldReconnect) {
        console.log('♻️ Tentando reconectar...');
        startSock();
      } else {
        console.log('❌ Sessão desconectada, reautentique-se.');
      }
    }

    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp!');
    }
  });

  // Aqui você pode colocar eventos de mensagens ou outros eventos do Baileys, ex:
  // sock.ev.on('messages.upsert', ({ messages }) => {
  //   console.log('Nova mensagem:', messages[0]);
  // });
}

startSock();
