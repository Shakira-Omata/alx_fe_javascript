// Ensure script runs only after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Quotes array with objects containing "text" and "category"
    let quotes = [
        { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Simplicity is the soul of efficiency.", category: "Design" }
    ];

    // Select elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const addQuoteButton = document.getElementById("addQuoteBtn");

    // ✅ Function name changed from displayRandomQuote to showRandomQuote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>[${randomQuote.category}]</strong>`;
    }

    // ✅ Function name stays the same for adding quotes
    function addQuote() {
        const newText = document.getElementById("newQuoteText").value.trim();
        const newCategory = document.getElementById("newQuoteCategory").value.trim();

        if (!newText || !newCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

        // Add new quote object to array
        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);

        // Save updated quotes to localStorage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        // Display the newly added quote
        showRandomQuote();
    }

    // ✅ Updated event listener to call showRandomQuote
    newQuoteButton.addEventListener("click", showRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);

    // ✅ Show a random quote on page load
    showRandomQuote();
});
