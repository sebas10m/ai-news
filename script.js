document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");

    // Fetch the list of articles from the JSON file
    fetch("data/articles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching articles.json: ${response.status}`);
            }
            return response.json();
        })
        .then(files => {
            if (files.length === 0) {
                newsContainer.innerHTML = "<p>No news articles found.</p>";
                return;
            }

            // Load each article
            Promise.all(
                files.map(filename =>
                    fetch(`data/${filename}`)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`Error fetching ${filename}: ${res.status}`);
                            }
                            return res.text();
                        })
                        .then(articleHTML => {
                            const article = document.createElement("article");
                            article.innerHTML = articleHTML;
                            return article;
                        })
                )
            )
            .then(articles => {
                newsContainer.innerHTML = ""; // Clear the loading message
                articles.forEach(article => newsContainer.appendChild(article));
            })
            .catch(err => {
                console.error("Error loading articles:", err);
                newsContainer.innerHTML = "<p>Error loading news articles.</p>";
            });
        })
        .catch(err => {
            console.error("Error fetching articles.json:", err);
            newsContainer.innerHTML = "<p>Error loading articles list.</p>";
        });
});
