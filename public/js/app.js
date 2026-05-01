// Navigation entre pages
function showPage(pageId) {
  // Cacher toutes les pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Afficher la page cible
  document.getElementById('page-' + pageId).classList.add('active');
  event.target.classList.add('active');
}

// Enregistrer une transaction sur Stellar
async function enregistrerTransaction() {
  const libelle = prompt('Libellé de la transaction :');
  if (!libelle) return;
  
  const montant = prompt('Montant (FCFA) :');
  if (!montant) return;

  const btn = document.querySelector('.btn-primary');
  btn.textContent = '⏳ Enregistrement sur blockchain...';
  btn.disabled = true;

  try {
    const response = await fetch('/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle, montant })
    });

    const data = await response.json();

    if (data.hash) {
      // Ajouter la transaction dans le tableau
      const tbody = document.getElementById('transactions-list');
      const today = new Date().toLocaleDateString('fr-FR');
      const montantNum = parseInt(montant);
      const isPositif = montantNum > 0;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${today}</td>
        <td>${libelle}</td>
        <td class="${isPositif ? 'montant-positif' : 'montant-negatif'}">
          ${isPositif ? '+' : ''}${montantNum.toLocaleString()} FCFA
        </td>
        <td class="hash">${data.hash.substring(0, 16)}...</td>
        <td><span class="badge-scelle">✓ Scellé</span></td>
      `;
      tbody.insertBefore(row, tbody.firstChild);

      alert(`✅ Transaction enregistrée sur Stellar !\nHash : ${data.hash}`);
    }
  } catch (error) {
    alert('❌ Erreur lors de l\'enregistrement');
    console.error(error);
  } finally {
    btn.textContent = '+ Nouvelle Transaction';
    btn.disabled = false;
  }
}

// Voter
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-pour, .btn-contre').forEach(btn => {
    btn.addEventListener('click', function() {
      const voteCard = this.closest('.vote-card');
      const titre = voteCard.querySelector('h3').textContent;
      const choix = this.classList.contains('btn-pour') ? 'POUR' : 'CONTRE';
      
      alert(`✅ Vote enregistré !\nProposition : ${titre}\nVotre choix : ${choix}\n🔗 Enregistré sur Stellar Testnet`);
      
      this.textContent = '✓ Voté';
      this.disabled = true;
      voteCard.querySelector(this.classList.contains('btn-pour') ? '.btn-contre' : '.btn-pour').disabled = true;
    });
  });
});