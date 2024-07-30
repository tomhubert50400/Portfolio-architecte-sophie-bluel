document.addEventListener("DOMContentLoaded", async () => { // On charge la page avant d'executer le script
  const filters = document.getElementById('filters'); // On récupère la div des filtres via son ID "filters"
  
  // Je vérifie que les filtres ne sont pas déjà créés
  if (filters.childElementCount === 0) { 
    try {
      // Je récupère les projets via l'api et je convertit la réponse en JSON
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json(); 
      
      const gallery = document.getElementById('gallery'); // On récupère la div de la galerie via son ID "gallery"
      gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les travaux filtrés

      works.forEach(work => { //On boucle works pour récupérer chaque projets
        const figure = document.createElement('figure'); // On crée une balise figure
        const img = document.createElement('img'); // On crée une balise img 
        const figcaption = document.createElement('figcaption'); // On crée une balise figcaption

        img.src = work.imageUrl; // On ajoute l'URL de l'image du projet
        img.alt = work.title; // On ajoute le titre du projet en alt de l'image 
        figcaption.textContent = work.title; // On ajoute le titre du projet dans le figcaption

        figure.appendChild(img); // On ajoute l'image dans la balise figure
        figure.appendChild(figcaption); // On ajoute le figcaption dans la balise figure
        gallery.appendChild(figure); // On ajoute la figure dans la div de la galerie
      });
    } catch (error) { // Si une erreur survient alors on l'affiche dans la console
      console.error('Error fetching works:', error); 
    }
  } else { // Si la div des filtres n'est pas vide alors on ne fait rien
    console.log('Filters already loaded'); // On affiche un message dans la console pour indiquer que les filtres sont déjà chargés
  }
});
