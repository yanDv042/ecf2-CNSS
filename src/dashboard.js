// Exemple remplacé par les vraies données
document.getElementById('prenom-dashboard').textContent = "Yannis";
document.getElementById('prenom-dashboard2').textContent = "Yannis";
document.getElementById('nom-dashboard').textContent = "Bourhil";
document.getElementById('immat-dashboard').textContent = "123456789";
document.getElementById('email-dashboard').textContent = "yannis@mail.com";
document.getElementById('tel-dashboard').textContent = "+212600000000";

// Déco
document.getElementById('logout-btn').onclick = function() {
  window.location = "index.html";
};

const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById('prenom-dashboard').textContent = user.prenom;
  document.getElementById('prenom-dashboard2').textContent = user.prenom;
  document.getElementById('nom-dashboard').textContent = user.nom;
  document.getElementById('immat-dashboard').textContent = user.immatriculation;
  document.getElementById('email-dashboard').textContent = user.email;
  document.getElementById('tel-dashboard').textContent = user.telephone;
} else {
  // Pas d'utilisateur = retour login
  window.location = "index.html";
}

document.getElementById('logout-btn').onclick = function() {
  localStorage.removeItem("user");
  window.location = "index.html";
};
