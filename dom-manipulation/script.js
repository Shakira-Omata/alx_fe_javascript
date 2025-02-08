// Ensure the DOM is fully loaded before executing script
document.addEventListener("DOMContentLoaded", () => {
    // Default quotes array with objects (text & category)
    let quotes = [
        { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Simplicity is the soul of efficiency.", category: "Design" }
    ];

    // Select elements from the DOM
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const addQuoteButton = document.getElementById("addQuoteBtn");

    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerText = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerText = `"${randomQuote.text}" - [${randomQuote.category}]`;
    }

    // Function to add a new quote dynamically
    function addQuote() {
        const newText = document.getElementById("newQuoteText").value.trim();
        const newCategory = document.getElementById("newQuoteCategory").value.trim();

        if (!newText || !newCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

        // Add the new quote to the array
        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);
        
        // Save updated quotes array to localStorage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        // Display the newly added quote
        showRandomQuote();
    }

    // Attach event listeners
    newQuoteButton.addEventListener("click", showRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);

    // Display a random quote when the page loads
    showRandomQuote();
});
