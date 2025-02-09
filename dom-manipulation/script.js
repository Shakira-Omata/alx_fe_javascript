// Quotes array (loaded from local storage or initialized)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL

// Fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.length) {
            const serverQuotes = data.map(item => ({ text: item.title, category: "General" }));
            resolveConflicts(serverQuotes);
        }
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Resolve conflicts: Keep unique quotes and update local storage
function resolveConflicts(serverQuotes) {
    const allQuotes = [...quotes, ...serverQuotes];
    const uniqueQuotes = allQuotes.filter((q, index, self) =>
        index === self.findIndex(t => t.text === q.text)
    );

    if (uniqueQuotes.length !== quotes.length) {
        quotes = uniqueQuotes;
        saveQuotes();
        populateCategories();
        notifyUser("Quotes updated from the server!");
    }
}

// Sync local quotes with the server
// Sync local quotes with the server
async function syncQuotes() {
    try {
        for (let quote of quotes) {
            await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(quote),
                headers: { "Content-Type": "application/json" }
            });
        }
        notifyUser("Quotes synced with server!"); // 
        console.log("Quotes synced with server!"); 
    } catch (error) {
        console.error("Error syncing quotes to server:", error);
    }
}


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
    syncQuotes();
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

// Notify user of updates
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = "position: fixed; top: 10px; right: 10px; background: #28a745; color: white; padding: 10px; border-radius: 5px;";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Auto-sync with server every 10 seconds
setInterval(fetchQuotesFromServer, 10000);

// Initialize the application
window.onload = function () {
    displayRandomQuote();
    populateCategories();
    restoreCategoryFilter();
    fetchQuotesFromServer();
};
