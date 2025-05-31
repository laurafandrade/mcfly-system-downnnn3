import { default: makeWASocket, useSingleFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import * as fs from "fs";

const { state, saveState } = useSingleFileAuthState("./auth_info_baileys.json");

async function startSock() {
  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;
    if (qr) {
      console.log('Escaneie o QR Code abaixo:\n', qr);
    }
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        console.log('Tentando reconectar...');
        startSock();
      } else {
        console.log('Desconectado, logue novamente!');
      }
    }
    if (connection === 'open') {
      console.log('Conectado ao WhatsApp!');
    }
  });

  sock.ev.on('creds.update', saveState);
}

startSock();
