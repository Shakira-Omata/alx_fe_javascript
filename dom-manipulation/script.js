document.addEventListener("DOMContentLoaded", function () {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Simplicity is the soul of efficiency.", category: "Design" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const exportButton = document.getElementById("exportQuotes");
    const importInput = document.getElementById("importFile");
    const categoryFilter = document.getElementById("categoryFilter");

    function populateCategories() {
        const categories = [...new Set(quotes.map(q => q.category))]; // Get unique categories
        categoryFilter.innerHTML = `<option value="all">All Categories</option>` + 
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
        
        // Restore last selected filter from local storage
        const savedCategory = localStorage.getItem("selectedCategory");
        if (savedCategory) {
            categoryFilter.value = savedCategory;
        }
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);

        let filteredQuotes = selectedCategory === "all" 
            ? quotes 
            : quotes.filter(q => q.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available for this category.";
        } else {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>[${randomQuote.category}]</strong>`;
            sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
        }
    }

    function loadLastQuote() {
        const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
        if (lastQuote) {
            quoteDisplay.innerHTML = `"${lastQuote.text}" - <strong>[${lastQuote.category}]</strong>`;
        } else {
            filterQuotes();
        }
    }

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories(); // Update dropdown when quotes change
    }

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
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        filterQuotes();
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
                    filterQuotes();
                } else {
                    alert("Invalid JSON file format.");
                }
            } catch (error) {
                alert("Error reading JSON file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    newQuoteButton.addEventListener("click", filterQuotes);
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    exportButton.addEventListener("click", exportToJsonFile);
    importInput.addEventListener("change", importFromJsonFile);

    populateCategories();
    loadLastQuote();
});
