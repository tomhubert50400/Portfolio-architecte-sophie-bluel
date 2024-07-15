document.addEventListener("DOMContentLoaded", () => { // On charge la page avant d'executer le script
    //On récupère chaque élément via son ID de référence
    const modal = document.getElementById("myModal"); 
    const btn = document.getElementById("modal-edit");
    const span = document.getElementsByClassName("close")[0];
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const galleryView = document.getElementById("gallery-view");
    const addPhotoView = document.getElementById("add-photo-view");
    const backBtn = document.querySelector("#add-photo-view .back");

    btn.onclick = function() { // Quand l'utilisateur clique sur le bouton "modifier"
        modal.style.display = "block"; // On affiche la modale
        displayWorksInModal(); // On affiche les travaux dans la modale
    }

    span.onclick = function() { // Quand l'utilisateur clique sur le bouton de fermeture de la modale
        modal.style.display = "none"; // On passe la modale en display none
    }
 
    window.onclick = function(event) { // Quand l'utilisateur clique en dehors de la modale
        if (event.target == modal) { // Si l'élément cliqué est la modale
            modal.style.display = "none"; // On passe la modale en display none
        }
    }

    addPhotoBtn.onclick = function() { // Quand l'utilisateur clique sur le bouton "Ajouter une photo"
        galleryView.style.display = "none"; // On passe la galerie en display none
        addPhotoView.style.display = "block"; // On affiche la vue d'ajout de photo
        populateCategories(); 
    }

    backBtn.onclick = function() { // Quand l'utilisateur clique sur le bouton de retour
        galleryView.style.display = "block"; // On affiche la galerie
        addPhotoView.style.display = "none"; // On passe la vue d'ajout de photo en display none
    }
});

async function displayWorksInModal() { // Fonction pour afficher les travaux dans la modale
    const gallery = document.querySelector('.modal-content .gallery'); // On récupère la div de la galerie dans la modale
    gallery.innerHTML = '';  // On vide la galerie avant d'ajouter les projets pour éviter les dupicatas

    try { // On essaie de récupérer les travaux via l'API
        const response = await fetch('http://localhost:5678/api/works'); // On récupère les projets via l'API
        const works = await response.json(); // On convertit la réponse en JSON

        works.forEach(work => { // On boucle works pour récupérer chaque projets
            // On crée les éléments différents éléments HTML
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');
            const deleteIcon = document.createElement('i');

            img.src = work.imageUrl; // On ajoute l'URL de l'image du projet
            img.alt = work.title; // On ajoute le titre du projet en alt de l'image
            figcaption.textContent = work.title; // On ajoute le titre du projet dans figcaption

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

    try { // On essaie de supprimer le projet via l'API
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {  // On envoie une requête DELETE à l'API pour supprimer le projet
            method: 'DELETE', // Méthode HTTP DELETE
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // On envoie le token dans le header de la requête
            }
        });

        if (response.ok) { // Si la requête a réussi
            alert('Projet supprimé avec succès !'); // On affiche un message de succès
            // Mettre à jour l'affichage de la galerie
            displayWorksInModal(); 
        } else { // Si la requête a échoué
            alert('Erreur lors de la suppression du projet.'); // On affiche un message d'erreur
        }
    } catch (error) { // Si une erreur survient
        console.error('Error deleting work:', error); // On affiche l'erreur dans la console
        alert('Une erreur est survenue. Veuillez réessayer plus tard.'); // On affiche un message d'erreur générique
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
