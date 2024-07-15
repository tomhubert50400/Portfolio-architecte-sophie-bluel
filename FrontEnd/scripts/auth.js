document.addEventListener("DOMContentLoaded", () => { // On charge la page avant d'executer le script
    const modalEditButton = document.getElementById('modal-edit'); // On récupère le boutton "modifier" via son ID "modal-edit"
    const loginButton = document.getElementById('login-button'); // On récupère le boutton "connexion" via son ID "login-button"

    // Vérifiez si l'utilisateur est connecté en vérifiant le token dans le localStorage
    const token = localStorage.getItem('token'); // On récupère le token dans le localStorage

    if (token) {  // Si le token est présent dans le localStorage alors l'utilisateur est connecté
        // L'utilisateur est connecté, afficher le bouton "modifier"
        modalEditButton.style.display = 'inline-block';
    } else {
        // L'utilisateur n'est pas connecté, masquer le bouton "modifier"
        modalEditButton.style.display = 'none';
    }
});
