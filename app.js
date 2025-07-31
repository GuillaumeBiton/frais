const app = new Framework7({
    el: '#app',
    theme: 'auto',
    darkMode: 'auto'
});

const fraisStorageKey = 'fraisData';

function getFrais() {
  return JSON.parse(localStorage.getItem(fraisStorageKey)) || [];
}

function saveFrais(data) {
  localStorage.setItem(fraisStorageKey, JSON.stringify(data));
}

function generateId() {
  return 'frais-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

function renderFraisList() {
  const fraisList = document.getElementById('frais-list');
  const frais = getFrais();

  fraisList.innerHTML = frais.map((item, index) => `
  <li class="swipeout selectable" data-id="${item.id}" data-index="${index}">
    <div class="swipeout-content item-content">
      <div class="item-media">
        <span class="select-icon"></span>
      </div>
      <div class="item-inner">
        <div class="item-title">${item.description}<div class="item-footer">${item.date}</div></div>
        <div class="item-after">${item.montant} €</div>
      </div>
    </div>
    <div class="swipeout-actions-right">
      <a href="#" class="swipeout-delete">Supprimer</a>
    </div>
  </li>
`).join('');

  // Lier les suppressions swipe
  document.querySelectorAll('.swipeout-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = parseInt(btn.getAttribute('data-index'));
      const frais = getFrais();
      frais.splice(index, 1);
      saveFrais(frais);
      renderFraisList(); // refresh
    });
  });
}

// Action "Ajouter frais"
document.addEventListener('DOMContentLoaded', () => {
  renderFraisList();

  // Initialiser le champ date avec aujourd'hui
const today = new Date();
const todayStr = today.toLocaleDateString('fr-FR');
document.getElementById('input-date').value = todayStr;

// Créer le calendrier Framework7
app.calendar.create({
  inputEl: '#input-date',
  dateFormat: 'dd/mm/yyyy',
  openIn: 'popup',
  locale: 'fr',
  value: [today],
  closeOnSelect: true
});

  document.querySelector('.add-frais-link').addEventListener('click', () => {
    app.popup.open('#popup-ajout-frais');
  });

  document.querySelectorAll('.selectable').forEach(li => {
  li.addEventListener('click', e => {
    if (e.target.closest('.swipeout-actions-right')) return;

    li.classList.toggle('selected');
    const icon = li.querySelector('.select-icon');

    if (li.classList.contains('selected')) {
      icon.textContent = '✔️';
    } else {
      icon.textContent = '';
    }
  });
});

  document.getElementById('btn-valider-frais').addEventListener('click', () => {
    const desc = document.getElementById('input-description').value.trim();
    const montant = parseFloat(document.getElementById('input-montant').value);
    const date = document.getElementById('input-date').value;


    if (!desc || isNaN(montant)) {
      app.dialog.alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    const frais = getFrais();

    frais.push({
    id: generateId(), // 🔑 nouveau champ ID
    description: desc,
    montant: montant.toFixed(2),
    date: date
    });

    saveFrais(frais);
    renderFraisList();

    app.popup.close('#popup-ajout-frais');

    // Reset form
    document.getElementById('input-description').value = '';
    document.getElementById('input-montant').value = '';
  });
});