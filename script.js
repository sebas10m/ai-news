document.addEventListener("DOMContentLoaded", () => {
    const aiNewsContainer = document.getElementById("ai-news-container");
    const securityContainer = document.getElementById("security-container");
    const showAINewsButton = document.getElementById("show-ai-news");
    const showSecurityNewsButton = document.getElementById("show-security-news");

    // Swipe detection variables
    let touchStartX = 0;
    let touchEndX = 0;
    let currentCategory = "AI"; // Track the currently displayed category

    // Event listeners for buttons
    showAINewsButton.addEventListener("click", () => {
        showSection("AI");
    });

    showSecurityNewsButton.addEventListener("click", () => {
        showSection("Security");
    });

    // Swipe detection logic
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;

        // Check for left swipe
        if (swipeDistance > 50) {
            console.log("Swiped left: Switching to next category");
            switchCategory();
        }
    }

    function switchCategory() {
        if (currentCategory === "AI") {
            currentCategory = "Security";
            showSection("Security");
        } else {
            currentCategory = "AI";
            showSection("AI");
        }
    }

    function showSection(category) {
        if (category === "AI") {
            aiNewsContainer.style.display = "block";
            securityContainer.style.display = "none";
            highlightButton("AI");
            console.log("Showing AI News section");
        } else if (category === "Security") {
            aiNewsContainer.style.display = "none";
            securityContainer.style.display = "block";
            highlightButton("Security");
            console.log("Showing Security News section");
        }
    }

    function highlightButton(category) {
        if (category === "AI") {
            showAINewsButton.classList.add("active");
            showSecurityNewsButton.classList.remove("active");
        } else if (category === "Security") {
            showAINewsButton.classList.remove("active");
            showSecurityNewsButton.classList.add("active");
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
            console.log("Fetched articles.json:", files);
            const aiArticles = files.filter(file => file.category === "AI");
            const securityArticles = files.filter(file => file.category === "Security");

            loadArticles(aiArticles, aiNewsContainer);
            loadArticles(securityArticles, securityContainer);
        })
        .catch(err => {
            console.error("Error fetching articles.json:", err);
            aiNewsContainer.innerHTML = "<p>Error loading AI articles.</p>";
            securityContainer.innerHTML = "<p>Error loading Security articles.</p>";
        });

    function loadArticles(articles, container) {
        if (articles.length === 0) {
            container.innerHTML = "<p>No articles found in this category.</p>";
            return;
        }

        // Sort articles by date (most recent first)
        articles.sort((a, b) => {
            const dateA = extractDateFromTitle(a.title);
            const dateB = extractDateFromTitle(b.title);
            return dateB - dateA; // Sort descending
        });

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
            loadedArticles.forEach(article => {
                container.appendChild(article); // Append each article
            });
        })
        .catch(err => {
            console.error("Error loading articles:", err);
            container.innerHTML = "<p>Error loading articles.</p>";
        });
    }

    function extractDateFromTitle(title) {
        const dateRegex = /- (\w+ \d{1,2}, \d{4})$/; // Match date at the end of the title
        const match = title.match(dateRegex);
        if (match) {
            return new Date(match[1]); // Convert to Date object
        }
        return new Date(0); // Default to very old date if parsing fails
    }

    // Initialize with AI category highlighted
    highlightButton("AI");
});
