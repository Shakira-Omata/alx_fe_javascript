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
    const exportButton = document.getElementById("exportQuotes");
    const importInput = document.getElementById("importFile");

    //  Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>[${randomQuote.category}]</strong>`;
        sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
    }

    function loadLastQuote() {
        const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
        if (lastQuote) {
            quoteDisplay.innerHTML = `"${lastQuote.text}" - <strong>[${lastQuote.category}]</strong>`;
        } else {
            showRandomQuote();
        }
    }

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    //  Function to add a new quote
    function addQuote() {
        const newText = document.getElementById("newQuoteText").value.trim();
        const newCategory = document.getElementById("newQuoteCategory").value.trim();

        if (!newText || !newCategory) {
            alert("Please enter both a quote and a category.");
            return;
        }

     
        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote);
        saveQuotes();
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        // Display the newly added quote
        showRandomQuote();
    }

    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    alert("Quotes imported successfully!");
                    showRandomQuote();
                } else {
                    alert("Invalid JSON file format.");
                }
            } catch (error) {
                alert("Error reading JSON file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    exportButton.addEventListener("click", exportToJsonFile);
    importInput.addEventListener("change", importFromJsonFile);

    loadLastQuote();



   
    function createAddQuoteForm() {
        const formContainer = document.createElement("div");

        // Create input fields
        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";

        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";

        // Create add button
        const addButton = document.createElement("button");
        addButton.id = "addQuoteBtn";
        addButton.textContent = "Add Quote";
        addButton.addEventListener("click", addQuote);

        // Append everything
        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);

        // Add form to body
        document.body.appendChild(formContainer);
    }

    //  Event listener for "Show New Quote" button
    newQuoteButton.addEventListener("click", showRandomQuote);

    //  Call functions on page load
    showRandomQuote();
    createAddQuoteForm(); 
});
