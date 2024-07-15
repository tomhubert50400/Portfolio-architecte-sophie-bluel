document.getElementById('login-form').addEventListener('submit', async (event) => { // On écoute l'événement submit du formulaire de connexion
    event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
    const email = document.getElementById('email').value; // On récupère la valeur de l'email via son ID "email"
    const password = document.getElementById('password').value; // On récupère la valeur du mot de passe via son ID "password"
    const errorMessage = document.getElementById('error-message'); 

    try {
        const response = await fetch('http://localhost:5678/api/users/login', { // On envoie une requête POST à l'API pour se connecter
            method: 'POST', // Méthode HTTP 
            headers: { 
                'Content-Type': 'application/json' // Indique que le corps de la requête est au format JSON 
            },
            body: JSON.stringify({ email, password }) // Convertit les données du formulaire en chaîne JSON
        });

        if (response.ok) { // Si la requête a réussi
            const data = await response.json(); // Convertit la réponse en JSON
            localStorage.setItem('token', data.token); // Stock le token dans le localStorage
            window.location.href = 'index.html'; // Redirige vers la page d'accueil 
        } else { // Si la requête a échoué
            const errorData = await response.json(); // Convertit la réponse en JSON
            errorMessage.textContent = errorData.message; // Affiche le message d'erreur
        }
    } catch (error) { // Si une erreur survient
        console.error('Error during login:', error); // Affiche l'erreur dans la console
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.'; // Affiche un message d'erreur générique
    }
});
