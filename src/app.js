// MODALE D’INSCRIPTION 
["open-inscription", "open-inscription-btn", "open-inscription-link"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.onclick = function (e) {
    e.preventDefault();
    document.getElementById('modal-inscription').style.display = 'flex';
  };
});

const closeModal = document.getElementById('close-modal');
if (closeModal) {
  closeModal.onclick = function () {
    document.getElementById('modal-inscription').style.display = 'none';
    document.getElementById('insc-msg').textContent = '';
  };
}

// INSCRIPTION UTILISATEUR 
const formInscription = document.getElementById('inscription-form');
if (formInscription) {
  formInscription.onsubmit = async function (e) {
    e.preventDefault();

    const data = {
      immatriculation: document.querySelector('[name=immatriculation]').value,
      nom: document.querySelector('[name=nom]').value,
      prenom: document.querySelector('[name=prenom]').value,
      email: document.querySelector('[name=email]').value,
      telephone: document.querySelector('[name=telephone]').value,
      password: document.querySelector('[name=password]').value
    };

    const msg = document.getElementById('insc-msg');

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        msg.style.color = 'green';
        msg.textContent = "Inscription réussie !";
        setTimeout(() => {
          document.getElementById('modal-inscription').style.display = 'none';
          msg.textContent = '';
          formInscription.reset();
        }, 1500);
      } else {
        msg.style.color = 'red';
        msg.textContent = result.error || "Erreur d'inscription.";
      }
    } catch (e) {
      msg.style.color = 'red';
      msg.textContent = "Erreur serveur : " + e.message;
    }
  };
}

// CONNEXION UTILISATEUR 
const formLogin = document.getElementById('login-form');
if (formLogin) {
  formLogin.onsubmit = async function (e) {
    e.preventDefault();

    const login = document.querySelector('[name=login]').value;
    const motdepasse = document.querySelector('[name=motdepasse]').value;
    const msg = document.getElementById('login-msg');

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, password: motdepasse })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location = "dashboard.html";
      } else {
        msg.style.color = 'red';
        msg.textContent = data.message || "Échec de connexion.";
      }
    } catch (err) {
      msg.style.color = 'red';
      msg.textContent = "Erreur réseau ou serveur.";
    }
  };
}

// DECONNEXION 
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.onclick = function () {
    localStorage.removeItem("user");
    window.location = "index.html";
  };
}


