document.addEventListener("DOMContentLoaded", () => { // On charge la page avant d'executer le script
    const modalEditButton = document.getElementById('modal-edit'); // On récupère le boutton "modifier" via son ID "modal-edit"

    // Je récupère le token depuis le localStorage
    const token = localStorage.getItem('token');
    // Je vérifie que le token soit bien stocké (utilisateur connecté), ensuite j'affiche le bouton, ou pas.
    if (token) {  
        modalEditButton.style.display = 'inline-block';
    } else {
        modalEditButton.style.display = 'none';
    }
});
