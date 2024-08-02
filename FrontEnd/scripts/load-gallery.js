document.addEventListener("DOMContentLoaded", async () => {
  // On charge la page avant d'executer le script
  const filters = document.getElementById("filters"); // On récupère la div des filtres via son ID "filters"

  // Je vérifie que les filtres ne sont pas déjà créés
  if (filters.childElementCount === 0) {
    try {
      // Je récupère les projets via l'api et je convertit la réponse en JSON
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();

      const gallery = document.getElementById("gallery"); // On récupère la div de la galerie via son ID "gallery"
      gallery.innerHTML = ""; // Vider la galerie avant d'ajouter les travaux filtrés

      works.forEach((work) => {
        //On boucle works pour récupérer chaque projets
        // On crée les éléments HTML nécessaires pour afficher les projets
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        // On remplit les éléments HTML avec les données des projets
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        // On gère l'arborecence des éléments HTML
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    } catch (error) {
      // Si une erreur survient alors on l'affiche dans la console
      console.error("Error fetching works:", error);
    }
  } else {
    // Si la div des filtres n'est pas vide alors on ne fait rien et on affiche un message dans la console
    console.log("Filters already loaded");
  }
});
