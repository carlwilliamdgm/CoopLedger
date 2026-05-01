const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Horizon, Keypair, TransactionBuilder, Networks, Operation, BASE_FEE } = require('@stellar/stellar-sdk');

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

function parseMontant(value) {
  const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.');
  const montant = Number(normalized);

  if (!Number.isInteger(montant) || montant === 0) {
    throw new Error('Le montant doit etre un nombre entier non nul.');
  }

  return montant;
}

// Enregistrer une transaction sur Stellar
async function enregistrerStellar(libelle, montant) {
  const sourceKeypair = Keypair.fromSecret(process.env.SECRET_KEY);
  const sourcePublicKey = process.env.PUBLIC_KEY;

  const account = await server.loadAccount(sourcePublicKey);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.manageData({
      name: libelle.substring(0, 64),
      value: montant.toString().substring(0, 64),
    }))
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

// Servir les fichiers statiques
function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Serveur HTTP
const httpServer = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // API Transaction
  if (req.method === 'POST' && req.url === '/api/transaction') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { libelle, montant } = JSON.parse(body);
        const libelleNettoye = String(libelle ?? '').trim();
        const montantValide = parseMontant(montant);

        if (!libelleNettoye) {
          throw new Error('Le libelle est obligatoire.');
        }

        const hash = await enregistrerStellar(libelleNettoye, montantValide);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          hash,
          montant: montantValide,
          explorer: `https://stellar.expert/explorer/testnet/tx/${hash}`
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Fichiers statiques
  const routes = {
    '/': ['public/index.html', 'text/html'],
    '/css/style.css': ['public/css/style.css', 'text/css'],
    '/js/app.js': ['public/js/app.js', 'application/javascript'],
  };

  const route = routes[req.url];
  if (route) {
    serveFile(res, path.join(__dirname, route[0]), route[1]);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`CoopLedger en ligne sur le port ${PORT}`);
  console.log('Reseau : Stellar Testnet');
  console.log(`Dashboard : http://localhost:${PORT}`);
});
