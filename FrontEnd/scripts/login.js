document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST', // Méthode HTTP
            headers: {
                'Content-Type': 'application/json' // Indique que le corps de la requête est au format JSON
            },
            body: JSON.stringify({ email, password }) // Convertit les données du formulaire en chaîne JSON
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Stocker le token
            window.location.href = 'index.html'; // Rediriger vers la page d'accueil
        } else {
            const errorData = await response.json();
            errorMessage.textContent = errorData.message; // Afficher le message d'erreur
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    }
});
