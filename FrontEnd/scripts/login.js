document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    // On écoute l'événement submit du formulaire de connexion
    event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
      // Requête POST vers l'API pour se connecter
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indique que le corps de la requête est au format JSON
        },
        body: JSON.stringify({ email, password }), // Convertit les données du formulaire en string JSON
      });

      // Si la requête a réussi
      if (response.ok) {
        // Convertit la réponse en JSON et stocke le token dans le localStorage
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else {
        // Si la requête a échoué on affiche un message d'erreur à l'utilisateur
        const errorData = await response.json();
        errorMessage.textContent = errorData.message;
      }
    } catch (error) {
      // Si une erreur survient j'affiche un message générique à l'utilisateur et l'erreur dans la console
      console.error("Error during login:", error);
      errorMessage.textContent =
        "Une erreur est survenue. Veuillez réessayer plus tard.";
    }
  });
