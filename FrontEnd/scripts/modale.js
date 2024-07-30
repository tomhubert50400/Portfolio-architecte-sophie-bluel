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

async function populateCategories() { // Fonction pour afficher les catégories dans le formulaire d'ajout de photo
    const categorySelect = document.getElementById('category'); // On récupère le select des catégories via son ID "category"
    categorySelect.innerHTML = ''; // On vide le select avant d'ajouter les catégories pour éviter les doublons

    try { 
        const response = await fetch('http://localhost:5678/api/categories'); // On récupère les catégories via l'API
        const categories = await response.json(); // On convertit la réponse en JSON

        categories.forEach(category => { // On boucle categories pour récupérer chaque catégories 
            const option = document.createElement('option');  // On crée une balise option
            option.value = category.id; // On ajoute l'ID de la catégorie en valeur de l'option
            option.textContent = category.name; // On ajoute le nom de la catégorie dans le texte de l'option
            categorySelect.appendChild(option); // On ajoute l'option dans le select 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

document.getElementById('add-photo-form').addEventListener('submit', async (event) => { // On écoute l'événement submit du formulaire d'ajout de photo
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
    
    const formData = new FormData(); // On crée un objet FormData pour envoyer les données du formulaire
    const photoInput = document.getElementById('photo'); // On récupère l'input de type file via son ID "photo"
    const titleInput = document.getElementById('title'); // On récupère l'input du titre via son ID "title"
    const categorySelect = document.getElementById('category'); // On récupère le select des catégories via son ID "category"

    formData.append('image', photoInput.files[0]); // On ajoute l'image dans le FormData
    formData.append('title', titleInput.value); // On ajoute le titre dans le FormData
    formData.append('category', categorySelect.value); // On ajoute la catégorie dans le FormData

    console.log('Form Data:', formData.get('image'), formData.get('title'), formData.get('category')); // On affiche les données du formulaire dans la console (déboggue)

    try {
        const response = await fetch('http://localhost:5678/api/works', { // On envoie une requête POST à l'API pour ajouter un projet
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // On envoie le token dans le header de la requête
            },
            body: formData // On envoie les données du formulaire
        });

        console.log('Response status:', response.status); // On affiche le statut de la réponse dans la console (déboggue)
        const responseData = await response.json(); // On convertit la réponse en JSON
        console.log('Response data:', responseData); // On affiche les données de la réponse dans la console (déboggue)

        if (response.ok) { // Si la requête a réussi
            alert('Photo ajoutée avec succès !'); // On affiche un message de succès
            // Retourner à la vue galerie et actualiser les travaux
            const galleryView = document.getElementById("gallery-view"); // On récupère la vue de la galerie via son ID "gallery-view"
            const addPhotoView = document.getElementById("add-photo-view"); // On récupère la vue d'ajout de photo via son ID "add-photo-view"

            if (galleryView && addPhotoView) { // Si les deux éléments existent
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
