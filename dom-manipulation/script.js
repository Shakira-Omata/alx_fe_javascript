// Ensure script runs only after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Load existing quotes from localStorage or use defaults
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Simplicity is the soul of efficiency.", category: "Design" }
    ];

    // Select elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // ✅ Function to display a random quote & store it in sessionStorage
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>[${randomQuote.category}]</strong>`;

        // Save last displayed quote in sessionStorage
        sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
    }

    // ✅ Function to load last viewed quote from sessionStorage (if available)
    function loadLastQuote() {
        const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
        if (lastQuote) {
            quoteDisplay.innerHTML = `"${lastQuote.text}" - <strong>[${lastQuote.category}]</strong>`;
        } else {
            showRandomQuote();
        }
    }

    // ✅ Function to save quotes array to localStorage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // ✅ Function to add a new quote
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
        saveQuotes();

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        // Display the newly added quote
        showRandomQuote();
    }

    // ✅ Function to dynamically create the Add Quote form
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

        // Create Export Button
        const exportButton = document.createElement("button");
        exportButton.textContent = "Export JSON";
        exportButton.addEventListener("click", exportToJsonFile);

        // Create Import Input
        const importInput = document.createElement("input");
        importInput.type = "file";
        importInput.id = "importFile";
        importInput.accept = ".json";
        importInput.addEventListener("change", importFromJsonFile);

        // Append everything
        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);
        formContainer.appendChild(exportButton);
        formContainer.appendChild(importInput);

        // Add form to body
        document.body.appendChild(formContainer);
    }

    // ✅ Function to export quotes to a JSON file
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

    // ✅ Function to import quotes from a JSON file
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

    // ✅ Event listener for "Show New Quote" button
    newQuoteButton.addEventListener("click", showRandomQuote);

    // ✅ Call functions on page load
    createAddQuoteForm();
    loadLastQuote();
});
