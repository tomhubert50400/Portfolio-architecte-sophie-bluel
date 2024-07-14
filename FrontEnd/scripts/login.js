document.getElementById('login-form').addEventListener('submit', async (event) => { // Ajout d'un event 'submit' sur le formulaire de connexion
    event.preventDefault(); // j'empêche le rechargement de la page
    const email = document.getElementById('email').value; // Je récupère la valeur de l'input email
    const password = document.getElementById('password').value; // Je récupère la valeur de l'input password
    const errorMessage = document.getElementById('error-message'); // Je récupère l'élément HTML qui a pour ID 'error-message'

    try { // J'essaie le script, en cas d'erreur
        const response = await fetch('http://localhost:5678/api/users/login', { // Je récupère dans une constante la réponse de ma requête POST
            method: 'POST', // Je défini la méthode de ma requête
            headers: { // Je défini les headers de ma requête
                'Content-Type': 'application/json' // Je défini le type de contenu de ma requête
            },
            body: JSON.stringify({ email, password }) // Je défini le corps de ma requête
        });

        if (response.ok) { // Si la réponse est ok
            const data = await response.json(); // Je stock le résultat dans une constante
            localStorage.setItem('token', data.token); // Je stock le token dans le localStorage
            window.location.href = 'index.html'; // Je redirige l'utilisateur vers la page d'accueil
        } else {
            const errorData = await response.json(); // Je stock le résultat de ma requête dans une constante en cas d'erreur
            errorMessage.textContent = errorData.message;  // J'affiche le message d'erreur
        }
    } catch (error) {  // Je catch les potentielles erreurs
        console.error('Error during login:', error); // Je les log dans ma console
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.'; // J'affiche un message d'erreur
    }
});