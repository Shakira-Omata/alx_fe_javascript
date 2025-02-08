document.addEventListener("DOMContentLoaded", () => {
    let quotes = [
        { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Simplicity is the soul of efficiency.", category: "Design" }
    ];

    // Select elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const addQuoteButton = document.getElementById("addQuoteBtn");

    // Display random quote
    function displayRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>[${randomQuote.category}]</strong>`;
    }

    // Add new quote
    function addQuote() {
        const newText = document.getElementById("newQuoteText").value.trim();
        const newCategory = document.getElementById("newQuoteCategory").value.trim();

        if (!newText || !newCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);

        localStorage.setItem("quotes", JSON.stringify(quotes));

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        displayRandomQuote();
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", displayRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);

    // Display a random quote on page load
    displayRandomQuote();
});
