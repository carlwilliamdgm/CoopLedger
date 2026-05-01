// Configuration de base pour CoopLedger
// Projet blockchain Stellar

const StellarSdk = require('stellar-sdk');

// Configuration du réseau Stellar
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Clés et configuration
const config = {
  network: 'testnet',
  horizonUrl: 'https://horizon-testnet.stellar.org',
  project: 'coopledger'
};

module.exports = { server, config };