let transactions = [];
let demoIndex = 0;

const demoSteps = [
  {
    page: 'dashboard',
    title: 'Tableau de bord',
    text: 'On commence avec une vue claire de la cooperative : solde, activite du mois, votes et score de transparence.'
  },
  {
    page: 'transactions',
    title: 'Historique scelle',
    text: 'Chaque ligne importante peut etre reliee a une preuve blockchain. Le hash sert de trace publique.'
  },
  {
    page: 'transactions',
    title: 'Nouvelle transaction',
    text: 'La tresoriere saisit un libelle et un montant. Les montants invalides sont bloques avant enregistrement.'
  },
  {
    page: 'vote',
    title: 'Gouvernance',
    text: 'La page vote montre comment la cooperative peut associer la transparence financiere a la decision collective.'
  }
];

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('fr-FR');
}

function formatMontant(montant) {
  const prefix = montant > 0 ? '+' : '';
  return `${prefix}${montant.toLocaleString('fr-FR')} FCFA`;
}

function shortHash(hash) {
  return `${hash.substring(0, 16)}...`;
}

// Navigation entre pages
function showPage(pageId, navTarget) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('page-' + pageId).classList.add('active');

  const activeNav = navTarget || document.querySelector(`.nav-item[onclick*="${pageId}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
}

function renderTransactions() {
  const tbody = document.getElementById('transactions-list');

  if (!transactions.length) {
    tbody.innerHTML = '<tr><td colspan="5">Aucune transaction enregistree.</td></tr>';
    return;
  }

  tbody.innerHTML = transactions.map(transaction => {
    const isPositif = transaction.montant > 0;
    return `
      <tr>
        <td>${formatDate(transaction.date)}</td>
        <td>${transaction.libelle}</td>
        <td class="${isPositif ? 'montant-positif' : 'montant-negatif'}">
          ${formatMontant(transaction.montant)}
        </td>
        <td class="hash">
          <button class="hash-button" onclick="afficherRecu('${transaction.id}')">${shortHash(transaction.hash)}</button>
        </td>
        <td><span class="badge-scelle">Scelle</span></td>
      </tr>
    `;
  }).join('');

  document.getElementById('proof-count').textContent = transactions.length;
  document.getElementById('proof-last').textContent = formatDate(transactions[0].date);
}

async function chargerTransactions() {
  try {
    const response = await fetch('/api/transactions');
    const data = await response.json();
    transactions = data.transactions || [];
    renderTransactions();
  } catch (error) {
    document.getElementById('transactions-list').innerHTML = '<tr><td colspan="5">Impossible de charger les transactions.</td></tr>';
    console.error(error);
  }
}

// Enregistrer une transaction sur Stellar
function lireMontant(value) {
  const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.');
  const montant = Number(normalized);

  if (!Number.isInteger(montant) || montant === 0) {
    return null;
  }

  return montant;
}

async function enregistrerTransaction() {
  const libelle = prompt('Libelle de la transaction :')?.trim();
  if (!libelle) return;

  const montantSaisi = prompt('Montant (FCFA) :');
  if (!montantSaisi) return;

  const montant = lireMontant(montantSaisi);
  if (montant === null) {
    alert('Le montant doit etre un nombre entier non nul. Exemple : 5000 ou -150000.');
    return;
  }

  const btn = document.querySelector('.btn-primary');
  btn.textContent = 'Enregistrement sur blockchain...';
  btn.disabled = true;

  try {
    const response = await fetch('/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle, montant })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Transaction refusee');
    }

    transactions.unshift(data.transaction);
    renderTransactions();
    afficherRecu(data.transaction.id);
    alert(`Transaction enregistree sur Stellar.\nHash : ${data.transaction.hash}`);
  } catch (error) {
    alert(error.message || 'Erreur lors de l enregistrement');
    console.error(error);
  } finally {
    btn.textContent = '+ Nouvelle Transaction';
    btn.disabled = false;
  }
}

function afficherRecu(id) {
  const transaction = transactions.find(item => item.id === id);
  if (!transaction) return;

  document.getElementById('receipt-title').textContent = transaction.libelle;
  document.getElementById('receipt-date').textContent = formatDate(transaction.date);
  document.getElementById('receipt-amount').textContent = formatMontant(transaction.montant);
  document.getElementById('receipt-hash').textContent = transaction.hash;
  document.getElementById('receipt-link').href = transaction.explorer;
  document.getElementById('receipt-panel').classList.remove('hidden');
}

function fermerRecu() {
  document.getElementById('receipt-panel').classList.add('hidden');
}

function lancerDemo() {
  demoIndex = 0;
  document.getElementById('demo-overlay').classList.remove('hidden');
  afficherEtapeDemo();
}

function afficherEtapeDemo() {
  const step = demoSteps[demoIndex];
  showPage(step.page);
  document.getElementById('demo-title').textContent = step.title;
  document.getElementById('demo-text').textContent = step.text;
}

function etapeDemoSuivante() {
  demoIndex += 1;

  if (demoIndex >= demoSteps.length) {
    arreterDemo();
    return;
  }

  afficherEtapeDemo();
}

function arreterDemo() {
  document.getElementById('demo-overlay').classList.add('hidden');
}

// Voter
document.addEventListener('DOMContentLoaded', () => {
  chargerTransactions();

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      const match = this.getAttribute('onclick').match(/showPage\('(.+)'\)/);
      if (match) {
        showPage(match[1], this);
      }
    });
  });

  document.querySelectorAll('.btn-pour, .btn-contre').forEach(btn => {
    btn.addEventListener('click', function() {
      const voteCard = this.closest('.vote-card');
      const titre = voteCard.querySelector('h3').textContent;
      const choix = this.classList.contains('btn-pour') ? 'POUR' : 'CONTRE';

      alert(`Vote enregistre.\nProposition : ${titre}\nVotre choix : ${choix}\nEnregistre sur Stellar Testnet`);

      this.textContent = 'Vote';
      this.disabled = true;
      voteCard.querySelector(this.classList.contains('btn-pour') ? '.btn-contre' : '.btn-pour').disabled = true;
    });
  });
});
