document.addEventListener("DOMContentLoaded", () => {
    const aiNewsContainer = document.getElementById("ai-news-container");
    const securityContainer = document.getElementById("security-container");
    const openSourceContainer = document.getElementById("opensource-container");

    const showAINewsButton = document.getElementById("show-ai-news");
    const showSecurityNewsButton = document.getElementById("show-security-news");
    const showOpenSourceNewsButton = document.getElementById("show-opensource-news");

    // Swipe detection variables
    let touchStartX = 0;
    let touchEndX = 0;
    let currentCategory = "AI";

    // Event listeners for navigation buttons
    showAINewsButton.addEventListener("click", () => showSection("AI"));
    showSecurityNewsButton.addEventListener("click", () => showSection("Security"));
    showOpenSourceNewsButton.addEventListener("click", () => showSection("OpenSource"));

    // Swipe detection for mobile
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    // Handle swipe gestures
    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        if (swipeDistance > 50) {
            console.log("Swiped left: Switching to next category");
            switchCategory();
        }
    }

    // Switch category in sequence
    function switchCategory() {
        if (currentCategory === "AI") {
            currentCategory = "Security";
            showSection("Security");
        } else if (currentCategory === "Security") {
            currentCategory = "OpenSource";
            showSection("OpenSource");
        } else {
            currentCategory = "AI";
            showSection("AI");
        }
    }

    // Display specific category section
    function showSection(category) {
        aiNewsContainer.style.display = category === "AI" ? "block" : "none";
        securityContainer.style.display = category === "Security" ? "block" : "none";
        openSourceContainer.style.display = category === "OpenSource" ? "block" : "none";
        highlightButton(category);
        console.log(`Showing ${category} News section`);
    }

    // Highlight active navigation button
    function highlightButton(category) {
        showAINewsButton.classList.toggle("active", category === "AI");
        showSecurityNewsButton.classList.toggle("active", category === "Security");
        showOpenSourceNewsButton.classList.toggle("active", category === "OpenSource");
    }

    // Fetch and load articles
    fetch("data/articles.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error fetching articles.json: ${response.status}`);
            }
            return response.json();
        })
        .then((files) => {
            console.log("Fetched articles.json:", files);
            const aiArticles = files.filter((file) => file.category === "AI");
            const securityArticles = files.filter((file) => file.category === "Security");
            const openSourceArticles = files.filter((file) => file.category === "OpenSource");

            loadArticles(aiArticles, aiNewsContainer);
            loadArticles(securityArticles, securityContainer);
            loadArticles(openSourceArticles, openSourceContainer);
        })
        .catch((err) => {
            console.error("Error fetching articles.json:", err);
            aiNewsContainer.innerHTML = "<p>Error loading AI articles.</p>";
            securityContainer.innerHTML = "<p>Error loading Security articles.</p>";
            openSourceContainer.innerHTML = "<p>Error loading Open Source articles.</p>";
        });

    // Load and display articles in the container
    function loadArticles(articles, container) {
        if (articles.length === 0) {
            container.innerHTML = "<p>No articles found in this category.</p>";
            return;
        }

        console.log("Loading articles:", articles);

        Promise.all(
            articles.map((file) =>
                fetch(`data/${file.filename}`)
                    .then((res) => {
                        if (!res.ok) {
                            console.error(`Error fetching ${file.filename}`);
                            throw new Error(`File not found: ${file.filename}`);
                        }
                        return res.text();
                    })
                    .then((articleHTML) => {
                        const article = document.createElement("article");
                        const title = document.createElement("h2");
                        title.textContent = file.title;
                        article.appendChild(title);
                        article.innerHTML += articleHTML;
                        return article;
                    })
            )
        )
            .then((loadedArticles) => {
                container.innerHTML = ""; // Clear loading message
                loadedArticles.forEach((article) => container.appendChild(article));
            })
            .catch((err) => {
                console.error("Error loading articles:", err);
                container.innerHTML = "<p>Error loading articles. Check console for details.</p>";
            });
    }

    // Extract date from article title
    function extractDateFromTitle(title) {
        const dateRegex = /- (\w+ \d{1,2}, \d{4})$/;
        const match = title.match(dateRegex);
        return match ? new Date(match[1]) : new Date(0);
    }

    // Initialize page with AI category active
    showSection("AI");
});
