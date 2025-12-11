document.addEventListener('DOMContentLoaded', () => {
    const addStoryBtn = document.getElementById('add-story-btn');
    const addStoryForm = document.getElementById('add-story-form');
    const storyForm = document.getElementById('story-form');
    const storiesContainer = document.getElementById('stories-container');

    // Funcție pentru a încărca stories de la back-end
    async function loadStories() {
        try {
            const response = await fetch('/api/stories');
            const stories = await response.json();
            storiesContainer.innerHTML = '';
            const now = Date.now();
            stories.forEach(story => {
                if (now - story.timestamp < 86400000) { // 24 ore în ms
                    const storyElem = document.createElement('div');
                    storyElem.classList.add('story');
                    if (story.image) {
                        const img = document.createElement('img');
                        img.src = story.image;
                        storyElem.appendChild(img);
                    }
                    if (story.text) {
                        const p = document.createElement('p');
                        p.textContent = story.text;
                        storyElem.appendChild(p);
                    }
                    storiesContainer.appendChild(storyElem);
                }
            });
        } catch (error) {
            console.error('Eroare la încărcare stories:', error);
        }
    }

    // Arată formularul de adăugare
    addStoryBtn.addEventListener('click', () => {
        addStoryForm.style.display = 'block';
    });

    // Trimite story la back-end
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('text', document.getElementById('story-text').value);
        const imageFile = document.getElementById('story-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await fetch('/api/stories', {
                method: 'POST',
                body: formData
            });
            addStoryForm.style.display = 'none';
            storyForm.reset();
            loadStories();
        } catch (error) {
            console.error('Eroare la postare story:', error);
        }
    });

    // Încarcă stories inițial
    loadStories();
});