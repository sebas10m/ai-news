document.addEventListener("DOMContentLoaded", () => {
    const aiNewsContainer = document.getElementById("ai-news-container");
    const pokerContainer = document.getElementById("poker-container");
    const showAINewsButton = document.getElementById("show-ai-news");
    const showPokerNewsButton = document.getElementById("show-poker-news");

    // Debugging logs
    console.log("Page loaded, initializing scripts");

    // Event listeners for buttons
    showAINewsButton.addEventListener("click", () => {
        console.log("AI News button clicked");
        showSection("AI");
    });

    showPokerNewsButton.addEventListener("click", () => {
        console.log("Poker News button clicked");
        showSection("Poker");
    });

    // Function to toggle between sections
    function showSection(category) {
        if (category === "AI") {
            aiNewsContainer.style.display = "block";
            pokerContainer.style.display = "none";
            console.log("Showing AI News section");
        } else if (category === "Poker") {
            aiNewsContainer.style.display = "none";
            pokerContainer.style.display = "block";
            console.log("Showing Poker News section");
        }
    }

    // Fetch and load articles
    fetch("data/articles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching articles.json: ${response.status}`);
            }
            return response.json();
        })
        .then(files => {
            console.log("Fetched articles.json:", files); // Debugging log
            const aiArticles = files.filter(file => file.category === "AI");
            const pokerArticles = files.filter(file => file.category === "Poker");

            loadArticles(aiArticles, aiNewsContainer);
            loadArticles(pokerArticles, pokerContainer);
        })
        .catch(err => {
            console.error("Error fetching articles.json:", err);
            aiNewsContainer.innerHTML = "<p>Error loading AI articles.</p>";
            pokerContainer.innerHTML = "<p>Error loading Poker articles.</p>";
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
            loadedArticles.forEach(article => container.appendChild(article));
        })
        .catch(err => {
            console.error("Error loading articles:", err);
            container.innerHTML = "<p>Error loading articles.</p>";
        });
    }
}); // Ensure this is the final closing brace
