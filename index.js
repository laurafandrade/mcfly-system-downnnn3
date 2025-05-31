import makeWASocket from "@whiskeysockets/baileys";

async function startSock() {
  const sock = makeWASocket();

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;
    if(qr) {
      console.log('Escaneie o QR code abaixo:\n', qr);
    }
    if(connection === 'close') {
      console.log('Conexão fechada, tentando reconectar...');
      startSock();
    }
    if(connection === 'open') {
      console.log('Conectado ao WhatsApp!');
    }
  });
}

startSock();
