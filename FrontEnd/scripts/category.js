document.addEventListener("DOMContentLoaded", async () => { // Charge totalement le contenu du site avant d'executer le script
  try { // On essaye le script, en cas de potentielles erreurs
    // Récupérer les travaux
    const responseWorks = await fetch('http://localhost:5678/api/works'); //Je récupère dans une constante les projets
    const works = await responseWorks.json(); // Je stock mon résultat (les projets) dans un JSON

    // Récupérer les catégories
    const responseCategories = await fetch('http://localhost:5678/api/categories'); // Je récupère mes catégories, toujours dans une constante
    const categories = await responseCategories.json(); // Je les stocks dans un JSON

    // Générer le menu de catégories dynamiquement
    const filters = document.getElementById('filters'); // Je récupère mon élément HTML qui a pour ID : 'filters'
    
    // Vider les filtres existants pour éviter les duplications
    filters.innerHTML = ''; // Je vide les filtres existants pour éviter les duplications (suite à certains problèmes)

    // Ajouter le bouton "Tous" pour afficher tous les travaux
    const allButton = document.createElement('button'); // Je crée un élément HTML "<button>"
    allButton.id = 'all'; // J'attribue l'ID "all" à mon <button>
    allButton.textContent = 'Tous'; //<button>Tous</button>
    filters.appendChild(allButton); // Je passe <button> en tant qu'enfant de ma <div id="filters"></div>
    
    allButton.addEventListener('click', () => displayWorks(works)); // J'ajoute un event 'click' à mon button 'tous' et je défini une fonction fléchée qui défini une action lorsque le bouton est cliqué

    categories.forEach(category => { // Je boucle sur mes catégories
      const button = document.createElement('button'); // Je crée un <button> que je stock dans une constante
      button.id = category.id; // j'assigne un ID unique à chaque bouton et selon sa catégorie
      button.textContent = category.name; // J'assigne le nom de la catégorie comme texte du bouton
      filters.appendChild(button); // Je passe mon bouton enfant de filters
      
      button.addEventListener('click', () => { // Je refais un event click mais sur le reste de mes boutons cette fois
        const filteredWorks = works.filter(work => work.categoryId === category.id); // Je crée un tableau contenant uniquement les projets dont l'identifiant est le meme que la catégorie du bouton
        displayWorks(filteredWorks); // J'affiche les projets filtrés
      });
    });

    // Fonction pour afficher les travaux
    function displayWorks(worksToDisplay) { // Je crée une fonction qui prend en paramètre les travaux à afficher
      const gallery = document.getElementById('gallery'); //Je récupère mon ID gallery dans une constante
      gallery.innerHTML = ''; // Je vide la galerie avant d'ajouter les travaux filtrés

      worksToDisplay.forEach(work => { // Je boucle worksToDisplay 
        const figure = document.createElement('figure'); // Je crée une balise <figure></figure> 
        const img = document.createElement('img'); // Je crée une balise <img src="" alt="" />
        const figcaption = document.createElement('figcaption'); // Je crée une balise <figcaption></figcaption>

        img.src = work.imageUrl; // J'ajoute l'url de mon image au src de ma balise img 
        img.alt = work.title; // J'ajoute le titre de mon projet à l'alt 
        figcaption.textContent = work.title; // j'ajoute encore le titre de mon projet, mais à <figcaption>.

        figure.appendChild(img); // Je transfert <img /> en tant qu'enfant de <figure> 
        figure.appendChild(figcaption); // Je transfert <figcaption> en tant qu'enfant de <figure>
        gallery.appendChild(figure); // Enfin, j'ajoute le tout dans ma DIV avec l'ID gallery (récupérée plus haut)
      });
    }

    // Afficher tous les travaux par défaut et affichage des potentielles erreurs
    displayWorks(works);
  } catch (error) {
    console.error('Error fetching data:', error); 
  }
});
