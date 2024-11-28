document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");

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

            Promise.all(
                files.map(file =>
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
            .then(articles => {
                newsContainer.innerHTML = ""; // Clear loading message
                // Prepend each article to the container to display the latest first
                articles.forEach(article => newsContainer.prepend(article));
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
