document.addEventListener("DOMContentLoaded", () => {
    const aiNewsContainer = document.getElementById("ai-news-container");
    const pokerContainer = document.getElementById("poker-container");
    const showAINewsButton = document.getElementById("show-ai-news");
    const showPokerNewsButton = document.getElementById("show-poker-news");

    // Event listeners for buttons
    showAINewsButton.addEventListener("click", () => {
        showSection("AI");
    });

    showPokerNewsButton.addEventListener("click", () => {
        showSection("Poker");
    });

    // Swipe detection logic
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        if (swipeDistance > 50) {
            // Swipe left
            showSection("Poker");
        } else if (swipeDistance < -50) {
            // Swipe right
            showSection("AI");
        }
    }

    // Function to show a section
    function showSection(category) {
        if (category === "AI") {
            aiNewsContainer.style.display = "block";
            pokerContainer.style.display = "none";
        } else if (category === "Poker") {
            aiNewsContainer.style.display = "none";
            pokerContainer.style.display = "block";
        }
    }

    // Initial article loading (as before)
    fetch("data/articles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching articles.json: ${response.status}`);
            }
            return response.json();
        })
        .then(files => {
            const aiArticles = files.filter(file => file.category === "AI");
            const pokerArticles = files.filter(file => file.category === "Poker");

            loadArticles(aiArticles, aiNewsContainer);
            loadArticles(pokerArticles, pokerContainer);
        })
        .catch(err => {
            console.error("Error fetching articles.json:", err);
            aiNewsContainer.innerHTML = "<p>Error loading AI articles list.</p>";
            pokerContainer.innerHTML = "<p>Error loading Poker articles list.</p>";
        });

    function loadArticles(articles, container) {
        if (articles.length === 0) {
            container.innerHTML = "<p>No articles found in this category.</p>";
            return;
        }

        Promise.all(
            articles.map(file =>
                fetch(`data/${file.filename}`)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`Error fetching ${file.filename}: ${res.status}`);
                        }
                        return res.text();
                    })
                    .then(articleHTML => {
                        const article = document.createElement("article");
                        const title = document.createElement("h2");
                        title.textContent = file.title;
                        article.appendChild(title);
                        article.innerHTML += articleHTML;
                        return article;
                    })
            )
        )
        .then(loadedArticles => {
            container.innerHTML = ""; // Clear loading message
            loadedArticles.forEach(article => container.prepend(article));
        })
        .catch(err => {
            console.error("Error loading articles:", err);
            container.innerHTML = "<p>Error loading articles.</p>";
        });
    }
});
