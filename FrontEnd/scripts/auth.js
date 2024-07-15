document.addEventListener("DOMContentLoaded", () => {
    const modalEditButton = document.getElementById('modal-edit');
    const loginButton = document.getElementById('login-button');

    // Vérifiez si l'utilisateur est connecté en vérifiant le token dans le localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // L'utilisateur est connecté, afficher le bouton "modifier"
        modalEditButton.style.display = 'inline-block';
        loginButton.style.display = 'inline-block';
    } else {
        // L'utilisateur n'est pas connecté, masquer le bouton "modifier"
        modalEditButton.style.display = 'none';
        loginButton.style.display = 'inline-block';
    }
});
