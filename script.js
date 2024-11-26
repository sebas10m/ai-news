document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");

    // Fetch the list of files from the server (assuming the server allows directory listing)
    fetch("data/")
        .then(response => response.text())
        .then(html => {
            // Parse the directory listing
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const links = Array.from(doc.querySelectorAll("a"))
                .map(link => link.getAttribute("href"))
                .filter(name => name.endsWith(".html"));

            if (links.length === 0) {
                newsContainer.innerHTML = "<p>No news articles found.</p>";
                return;
            }

            // Load each article
            Promise.all(
                links.map(filename =>
                    fetch(`data/${filename}`)
                        .then(res => res.text())
                        .then(articleHTML => {
                            const article = document.createElement("article");
                            article.innerHTML = articleHTML;
                            return article;
                        })
                )
            ).then(articles => {
                newsContainer.innerHTML = "";
                articles.forEach(article => newsContainer.appendChild(article));
            });
        })
        .catch(err => {
            console.error("Error loading news articles:", err);
            newsContainer.innerHTML = "<p>Error loading news articles.</p>";
        });
});
