document.addEventListener("DOMContentLoaded", () => {
    const aiNewsContainer = document.getElementById("ai-news-container");
    const pokerContainer = document.getElementById("poker-container");

    // Load articles and sort them by category
    fetch("data/articles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching articles.json: ${response.status}`);
            }
            return response.json();
        })
        .then(files => {
            if (files.length === 0) {
                aiNewsContainer.innerHTML = "<p>No AI news articles found.</p>";
                pokerContainer.innerHTML = "<p>No Poker news articles found.</p>";
                return;
            }

            const aiArticles = files.filter(file => file.category === "AI");
            const pokerArticles = files.filter(file => file.category === "Poker");

            // Load AI articles
            loadArticles(aiArticles, aiNewsContainer);

            // Load Poker articles
            loadArticles(pokerArticles, pokerContainer);
        })
        .catch(err => {
            console.error("Error fetching articles.json:", err);
            aiNewsContainer.innerHTML = "<p>Error loading AI articles list.</p>";
            pokerContainer.innerHTML = "<p>Error loading Poker articles list.</p>";
        });

    // Function to load articles into a container
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
