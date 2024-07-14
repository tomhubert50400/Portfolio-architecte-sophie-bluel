/* 
 * Ce script permet de charger les projets depuis la base de données et de les afficher dans la galerie.
 */

document.addEventListener("DOMContentLoaded", async () => {  // On attend que la page charge avant de dynamiser le contenu
  try { // on essaye de charger nos projets, et de vérifier qu'il n'y a aucune erreur
    const response = await fetch('http://localhost:5678/api/works'); // On récupère le contenu de la base de données (SQLITE) via notre API
    const works = await response.json(); // On déclare notre constante works et on transforme le contenu de notre API en JSON (récupéré au dessus)

    const gallery = document.getElementById('gallery'); // On récupère la div dont l'ID est gallery qu'on assigne à notre constante
    works.forEach(work => { // On boucle chaque élément dans la liste 'works'
      const figure = document.createElement('figure'); // On crée la balise <figure></figure>
      const img = document.createElement('img'); // On crée la balise <img src="" alt="" />
      const figcaption = document.createElement('figcaption'); // On crée la balise <figcaption></figcaption>

      img.src = work.imageUrl; // J'ajoute l'url de mon image au src de ma balise img
      img.alt = work.title; // J'ajoute le titre de mon projet à l'alt
      figcaption.textContent = work.title; // j'ajoute encore le titre de mon projet, mais à <figcaption>.

      figure.appendChild(img); // Je tranfert <img /> en tant qu'enfant de <figure> 
      figure.appendChild(figcaption); // Je tranfert <figcaption> en tant qu'enfant de <figure> 
      gallery.appendChild(figure); // Enfin, j'ajoute le tout dans ma DIV avec l'ID gallery (récupérée plus haut)
    });
  } catch (error) { // j'attrape les potentielles erreurs
    console.error('Error fetching works:', error); // je les log dans ma console 
  }
});