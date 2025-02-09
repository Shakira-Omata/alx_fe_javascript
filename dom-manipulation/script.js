// Quotes array (loaded from local storage or initialized)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// Display a random quote
function displayRandomQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteDisplay").textContent = quotes[randomIndex].text;
    sessionStorage.setItem("lastViewedQuote", quotes[randomIndex].text);
}

// Add a new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category filter dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    document.getElementById("quoteDisplay").textContent = filteredQuotes.length ? filteredQuotes[0].text : "No quotes available.";
}

// Restore last selected category
function restoreCategoryFilter() {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        document.getElementById("categoryFilter").value = savedCategory;
        filterQuotes();
    }
}

// Export quotes to JSON file
function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert("Quotes imported successfully!");
        } catch (error) {
            alert("Invalid JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from the server
async function syncWithServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        if (data.length) {
            const serverQuotes = data.map(item => ({ text: item.title, category: "General" }));
            const mergedQuotes = [...quotes, ...serverQuotes].filter((q, index, self) =>
                index === self.findIndex(t => t.text === q.text)
            );

            if (mergedQuotes.length !== quotes.length) {
                quotes = mergedQuotes;
                saveQuotes();
                populateCategories();
                alert("New quotes synced from the server!");
            }
        }
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Auto-sync with server every 10 seconds
setInterval(syncWithServer, 10000);

// Initialize the application
window.onload = function () {
    displayRandomQuote();
    populateCategories();
    restoreCategoryFilter();
};
