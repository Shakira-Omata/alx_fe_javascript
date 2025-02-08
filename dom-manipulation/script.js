document.addEventListener("DOMContentLoaded", () => {
    
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Simplicity is the soul of efficiency.", category: "Design" }
    ];

    
    localStorage.setItem("quotes", JSON.stringify(quotes));

    
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Function to display a random quote
    function displayRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerText = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerText = `"${randomQuote.text}" - [${randomQuote.category}]`;
    }

    // Function to add a new quote
    function addQuote() {
        const newText = document.getElementById("newQuoteText").value.trim();
        const newCategory = document.getElementById("newQuoteCategory").value.trim();

        if (!newText || !newCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

        // Add the new quote to the quotes array
        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);

        // Save updated quotes array to localStorage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        // Display the newly added quote
        displayRandomQuote();
    }

    // Ensure event listener is correctly attached to the button
    newQuoteButton.addEventListener("click", displayRandomQuote);

    // Display a random quote when the page loads
    displayRandomQuote();
});
