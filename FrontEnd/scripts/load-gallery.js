document.addEventListener("DOMContentLoaded", async () => {
  const filters = document.getElementById('filters');
  
  // Vérifiez que les filtres ne sont pas déjà créés
  if (filters.childElementCount === 0) {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json();
      
      const gallery = document.getElementById('gallery');
      gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les travaux filtrés

      works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  }
});
