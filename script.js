document.addEventListener("DOMContentLoaded", () => {
    const aiNewsContainer = document.getElementById("ai-news-container");
    const pokerContainer = document.getElementById("poker-container");
    const showAINewsButton = document.getElementById("show-ai-news");
    const showPokerNewsButton = document.getElementById("show-poker-news");

    // Swipe detection variables
    let touchStartX = 0;
    let touchEndX = 0;
    let currentCategory = "AI"; // Track the currently displayed category

    // Event listeners for buttons
    showAINewsButton.addEventListener("click", () => {
        showSection("AI");
    });

    showPokerNewsButton.addEventListener("click", () => {
        showSection("Poker");
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
            currentCategory = "Poker";
            showSection("Poker");
        } else {
            currentCategory = "AI";
            showSection("AI");
        }
    }

    function showSection(category) {
        if (category === "AI") {
            aiNewsContainer.style.display = "block";
            pokerContainer.style.display = "none";
            highlightButton("AI"); // Highlight the AI button
            console.log("Showing AI News section");
        } else if (category === "Poker") {
            aiNewsContainer.style.display = "none";
            pokerContainer.style.display = "block";
            highlightButton("Poker"); // Highlight the Poker button
            console.log("Showing Poker News section");
        }
    }

    function highlightButton(category) {
        if (category === "AI") {
            showAINewsButton.classList.add("active");
            showPokerNewsButton.classList.remove("active");
        } else if (category === "Poker") {
            showAINewsButton.classList.remove("active");
            showPokerNewsButton.classList.add("active");
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
                    .then(res =>
