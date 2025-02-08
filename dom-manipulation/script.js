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

    // Function to display a random quote
    function displayRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>[${randomQuote.category}]</strong>`;
    }

    // Function to add a new quote
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
        displayRandomQuote();
    }

    // Attach event listeners
    newQuoteButton.addEventListener("click", displayRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);

    // Display a random quote when the page loads
    displayRandomQuote();
});
