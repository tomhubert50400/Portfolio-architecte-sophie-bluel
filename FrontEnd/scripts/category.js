document.addEventListener("DOMContentLoaded", async () => { // Charge totalement le contenu du site avant d'executer le script
  try {

    // Je récupère les travaux depuis l'api et stocker le résultat dans un JSON
    const responseWorks = await fetch('http://localhost:5678/api/works'); 
    const works = await responseWorks.json(); 

    // Je récupère les catégories (filtres) depuis l'api et stocker le résultat dans un JSON
    const responseCategories = await fetch('http://localhost:5678/api/categories'); 
    const categories = await responseCategories.json(); 

    // Je récupère mon élément HTML qui a pour ID : 'filters'
    const filters = document.getElementById('filters'); 
    
    // Je vide les filtres existants pour éviter les duplications (suite à certains problèmes)
    filters.innerHTML = ''; 

    // Je crée le bouton "Tous" pour afficher tous les travaux
    const allButton = document.createElement('button'); 
    allButton.id = 'all'; 
    allButton.textContent = 'Tous';
    filters.appendChild(allButton);
    
    // J'ajoute un event click sur le bouton "Tous" pour afficher tous les travaux
    allButton.addEventListener('click', () => displayWorks(works)); 

    // Je boucle sur mes catégories pour créer un bouton par catégorie
    categories.forEach(category => {
      const button = document.createElement('button'); 
      button.id = category.id; 
      button.textContent = category.name;
      filters.appendChild(button); 
      
      // J'ajoute un event click sur chaque bouton pour afficher les travaux de la catégorie correspondante
      button.addEventListener('click', () => { 
        const filteredWorks = works.filter(work => work.categoryId === category.id); 
        displayWorks(filteredWorks); 
      });
    });

    // Je crée une fonction qui prend en paramètre les travaux à afficher 
    function displayWorks(worksToDisplay) { 
      const gallery = document.getElementById('gallery'); 
      gallery.innerHTML = ''; 

      // Je boucle sur les travaux à afficher pour les afficher
      worksToDisplay.forEach(work => { 
        // Je crée les éléments HTML nécessaires pour afficher les travaux
        const figure = document.createElement('figure');
        const img = document.createElement('img'); 
        const figcaption = document.createElement('figcaption');

        // Je remplis les éléments HTML avec les données des travaux
        img.src = work.imageUrl; 
        img.alt = work.title; 
        figcaption.textContent = work.title; 

        // Je gère l'arborecence des éléments HTML
        figure.appendChild(img); 
        figure.appendChild(figcaption); 
        gallery.appendChild(figure); 
      });
    }

    // J'affiche tous les travaux par défaut et je vérifie les potentielles erreurs
    displayWorks(works);
  } catch (error) {
    console.error('Error fetching data:', error); 
  }
});
