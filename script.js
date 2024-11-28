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

    // Function to toggle between sections
    function showSection(category) {
        if (category === "AI") {
            aiNewsContainer.style.display = "block";
            pokerContainer.style.display = "none";
        } else if (category === "Poker") {
            aiNewsContainer.style.display = "none";
            pokerContainer.style.display = "block";
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
                        if (
