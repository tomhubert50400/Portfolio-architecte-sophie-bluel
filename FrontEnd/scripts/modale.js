document.addEventListener("DOMContentLoaded", () => { // On charge la page avant d'executer le script

    //On récupère chaque élément via son ID de référence
    const modal = document.getElementById("myModal"); 
    const modalButton = document.getElementById("modal-edit");
    const span = document.getElementsByClassName("close")[0];
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const galleryView = document.getElementById("gallery-view");
    const addPhotoView = document.getElementById("add-photo-view");
    const backBtn = document.querySelector("#add-photo-view .back");

    // Quand l'utilisateur clique sur le bouton "Modifier" je passe la modale en display block et j'affiche les travaux
    modalButton.onclick = function() { 
        modal.style.display = "block"; 
        displayWorksInModal(); 
    }

    // Quand l'utilisateur clique sur la croix, je passe la modale en display none
    span.onclick = function() { 
        modal.style.display = "none"; 
    }
    
    // Je ferme la modale si l'utilisateur clique en dehors
    window.onclick = function(event) { 
        if (event.target == modal) { 
            modal.style.display = "none"; 
        }
    }

    // Quand l'utilisateur clique sur le bouton "Ajouter une photo" je passe la galerie en display none et j'affiche la vue d'ajout de photo
    addPhotoBtn.onclick = function() { 
        galleryView.style.display = "none"; 
        addPhotoView.style.display = "block";
        populateCategories(); // On affiche les catégories dans le formulaire d'ajout de photo
    }

    // Quand l'utilisateur clique sur le bouton "Retour" je passe la galerie en display block et j'enlève la vue d'ajout de photo
    backBtn.onclick = function() { 
        galleryView.style.display = "block"; 
        addPhotoView.style.display = "none"; 
    }
});

async function displayWorksInModal() { // Fonction pour afficher les travaux dans la modale
    const gallery = document.querySelector('.modal-content .gallery'); 
    gallery.innerHTML = ''; 

    try {

        // Je récupère les travaux depuis l'api et je stock le résultat dans un JSON
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json(); 

        works.forEach(work => { // On boucle works pour récupérer chaque projets

            // On crée les différents éléments HTML
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');
            const deleteIcon = document.createElement('i');

            // Configuration de l'image et du figcaption
            img.src = work.imageUrl; 
            img.alt = work.title; 
            figcaption.textContent = work.title; 

            // Configuration de l'icône de suppression
            deleteIcon.className = 'fa-solid fa-trash-can delete-icon';

            // Ajouter l'icône de suppression à la figure
            figure.appendChild(deleteIcon);
            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);

            // Ajouter un événement de clic pour supprimer le projet
            deleteIcon.addEventListener('click', () => deleteWork(work.id));
        });
    } catch (error) {
        console.error('Error fetching works for modal:', error);
    }
}

async function deleteWork(workId) { // Fonction pour supprimer un projet
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) { // On demande une confirmation avant de supprimer le projet
        return; // Si l'utilisateur annule, on ne fait rien
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, { // On envoie une requête DELETE à l'API pour supprimer le projet
            method: 'DELETE', // Méthode HTTP DELETE
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // On envoie le token dans le header de la requête
            }
        });

        if (response.ok) { // Si la requête a réussi je met à jour la modale 
            alert('Projet supprimé avec succès !');
            displayWorksInModal(); 
        } else {
            alert('Erreur lors de la suppression du projet.');
        }
    } catch (error) { 
        console.error('Error deleting work:', error); 
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
}

// Je récupère les catégories depuis l'api et je les affiche dans le formulaire d'ajout de photo
async function populateCategories() { 
    const categorySelect = document.getElementById('category'); 
    categorySelect.innerHTML = ''; // On vide le select avant d'ajouter les catégories pour éviter les doublons

    try {
        // Je récupère les catégories depuis l'api et je stock le résultat dans un JSON
        const response = await fetch('http://localhost:5678/api/categories'); 
        const categories = await response.json(); 

        // Je boucle sur les catégories pour les afficher dans le formulaire
        categories.forEach(category => { 
            const option = document.createElement('option');  
            option.value = category.id; 
            option.textContent = category.name; 
            categorySelect.appendChild(option); 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// On écoute l'événement submit du formulaire d'ajout de photo 
document.getElementById('add-photo-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
    
    // On crée un objet FormData pour envoyer les données du formulaire et on récupère les éléments du formulaire
    const formData = new FormData(); 
    const photoInput = document.getElementById('photo'); 
    const titleInput = document.getElementById('title'); 
    const categorySelect = document.getElementById('category'); 

    // On ajoute les données du formulaire dans le FormData
    formData.append('image', photoInput.files[0]); 
    formData.append('title', titleInput.value); 
    formData.append('category', categorySelect.value); 

    // Console log des données du formulaire
    console.log('Form Data:', formData.get('image'), formData.get('title'), formData.get('category')); 

    try {
        const response = await fetch('http://localhost:5678/api/works', { // On envoie une requête POST à l'API pour ajouter un projet
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // On envoie le token dans le header de la requête
            },
            body: formData // On envoie les données du formulaire
        });

        console.log('Response status:', response.status); 
        const responseData = await response.json(); 
        console.log('Response data:', responseData); 

        if (response.ok) { 
            alert('Photo ajoutée avec succès !'); 

            // On récupère les éléments de la galerie et de la vue d'ajout de photo
            const galleryView = document.getElementById("gallery-view");
            const addPhotoView = document.getElementById("add-photo-view");

            // Si les éléments existent, on affiche la galerie et on cache la vue d'ajout de photo
            if (galleryView && addPhotoView) { 
                galleryView.style.display = "block";
                addPhotoView.style.display = "none";
            }
            displayWorksInModal(); // On affiche les travaux dans la modale
        } else { 
            alert('Erreur lors de l\'ajout du projet.');
        }
    } catch (error) {
        console.error('Error adding photo:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
});
