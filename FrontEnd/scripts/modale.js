document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("modal-edit");
    const span = document.getElementsByClassName("close")[0];
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const galleryView = document.getElementById("gallery-view");
    const addPhotoView = document.getElementById("add-photo-view");
    const backBtn = document.querySelector("#add-photo-view .back");

    btn.onclick = function() {
        modal.style.display = "block";
        displayWorksInModal();
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    addPhotoBtn.onclick = function() {
        galleryView.style.display = "none";
        addPhotoView.style.display = "block";
        populateCategories();
    }

    backBtn.onclick = function() {
        galleryView.style.display = "block";
        addPhotoView.style.display = "none";
    }
});

async function displayWorksInModal() {
    const gallery = document.querySelector('.modal-content .gallery');
    gallery.innerHTML = ''; // Clear existing content

    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();

        works.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');
            const deleteIcon = document.createElement('i');

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

async function deleteWork(workId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('Projet supprimé avec succès !');
            // Mettre à jour l'affichage de la galerie
            displayWorksInModal();
        } else {
            alert('Erreur lors de la suppression du projet.');
        }
    } catch (error) {
        console.error('Error deleting work:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
}

async function populateCategories() {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = ''; // Clear existing options

    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

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

document.getElementById('add-photo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    const photoInput = document.getElementById('photo');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');

    formData.append('image', photoInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);

    console.log('Form Data:', formData.get('image'), formData.get('title'), formData.get('category'));

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (response.ok) {
            alert('Photo ajoutée avec succès !');
            // Retourner à la vue galerie et actualiser les travaux
            const galleryView = document.getElementById("gallery-view");
            const addPhotoView = document.getElementById("add-photo-view");

            if (galleryView && addPhotoView) {
                galleryView.style.display = "block";
                addPhotoView.style.display = "none";
            }
            displayWorksInModal();
        } else {
            alert('Erreur lors de l\'ajout du projet.');
        }
    } catch (error) {
        console.error('Error adding photo:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
});
