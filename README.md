CoopLedger

Plateforme de gouvernance financière transparente pour coopératives agricoles togolaises, sécurisée par la blockchain Stellar.

À propos

CoopLedger permet aux coopératives agricoles de sceller leurs transactions financières sur la blockchain Stellar Testnet, rendant chaque écriture vérifiable et immuable par tous les membres.

Développé dans le cadre du MIABE Hackathon 2026 — Groupe TG-44 — Stark.


Fonctionnalités

* Dashboard synthétique de la coopérative
* Enregistrement de transactions scellées sur Stellar Testnet
* Hash blockchain comme preuve d'immuabilité
* Reçu blockchain vérifiable sur Stellar Expert
* Système de vote de gouvernance collective
* Gestion des membres et des rôles
* Score de transparence dynamique
* Mode démo guidée


Coopérative cible :

Coopérative Agri-Kara de Broukou
Filière maïs et soja — Canton de Léon, région de Kara, Togo
120 membres producteurs


Stack technique :

* Node.js + HTTP natif
* Stellar SDK (@stellar/stellar-sdk)
* Stellar Testnet
* HTML / CSS / JavaScript vanilla
* Déployé sur Railway


Installation locale

bashgit clone https://github.com/Coopledger/Coopledger.git

cd Coopledger

npm install



Créer un fichier .env :

PUBLIC_KEY=VOTRE_CLE_PUBLIQUE_STELLAR
SECRET_KEY=VOTRE_CLE_SECRETE_STELLAR
NETWORK=testnet



Lancer :

bashnode server.js



L'application sera disponible sur http://localhost:3000


Démo en ligne:
https://coopledger-demo.up.railway.app/



Compte Stellar Testnet

Adresse publique : GD4CNNZKAFO3ZNVDPPLLY7OHK6DYVLIOH3D3T2ZEPEDOIZGV6RMNXR6B

Explorateur : https://stellar.expert/explorer/testnet/account/GD4CNNZKAFO3ZNVDPPLLY7OHK6DYVLIOH3D3T2ZEPEDOIZGV6RMNXR6B


Auteurs:
* Carl-William DJEGUEMA, IAI-Togo, Génie Logiciel et Système d'Information
* Hèzou BODJONA, ESA, Développement application
* Wilfried TOUSSA, ESGIS, IA & Big Data
* Simplice AKEY, IAI-Togo, Architecture système



Contact

coopledger@gmail.com

GitHub : https://github.com/Coopledger


Licence
MIT — MIABE Hackathon 2026


CoopLedger — La confiance numérique au service de nos terres.
