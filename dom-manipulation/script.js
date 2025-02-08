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
});
