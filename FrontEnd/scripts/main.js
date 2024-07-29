// 
document.addEventListener("DOMContentLoaded", () => { // Charge totalement le contenu du site avant d'executer le script
    const token = localStorage.getItem('token'); // Je récupère le token stocké dans le localStorage
    const loginMenuItem = document.querySelector('nav ul li:nth-child(3)'); // Je récupère le 3ème élément de ma nav (le bouton login)
    
    if (token) { 
        // Utilisateur connecté
        loginMenuItem.textContent = 'Logout'; // Je change le texte du bouton login en Logout
        loginMenuItem.addEventListener('click', () => { // J'ajoute un event 'click' sur le bouton
            localStorage.removeItem('token'); // Je supprime le token
            window.location.reload(); // Je reload la page
        });
    } else { 
        // Utilisateur non connecté
        loginMenuItem.textContent = 'Login'; // J'écris login, si l'utilisateur n'est pas connecté, pour m'assurer de ne pas laisser logout par erreur
        loginMenuItem.addEventListener('click', () => { // J'ajoute un event 'click' sur le bouton
            window.location.href = 'login.html';  // Je redirige l'utilisateur vers la page de connexion
        });
    }
});
