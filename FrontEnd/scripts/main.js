// 
document.addEventListener("DOMContentLoaded", () => { // Charge totalement le contenu du site avant d'executer le script
    const token = localStorage.getItem('token'); 
    const loginMenuItem = document.querySelector('nav ul li:nth-child(3)'); // Je récupère le 3ème élément de ma nav (le bouton login)
    
    if (token) { 
        // Utilisateur connecté
        loginMenuItem.textContent = 'Logout'; 
        loginMenuItem.addEventListener('click', () => { 
            // Quand l'utilisateur clique sur le bouton logout, je supprime le token et je recharge la page
            localStorage.removeItem('token');
            window.location.reload(); 
        });
    } else { 
        // Si l'utilisateur n'est pas connecté je change le texte du bouton login et j'ajoute un event click pour rediriger vers la page de connexion
        loginMenuItem.textContent = 'Login';
        loginMenuItem.addEventListener('click', () => { 
            window.location.href = 'login.html';
        });
    }
});
