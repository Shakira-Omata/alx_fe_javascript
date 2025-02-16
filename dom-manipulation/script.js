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
    const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Simulated API
            const serverQuotes = await response.json();
    
            // Convert to the format used in local storage
            const formattedQuotes = serverQuotes.map(post => ({
                text: post.title,
                category: "General"
            }));
    
            // Merge server quotes with local quotes
      function mergeQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    
    // Avoid duplicates
    const mergedQuotes = [...localQuotes, ...serverQuotes.filter(sq => 
        !localQuotes.some(lq => lq.text === sq.text))];

    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
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


function resolveConflict(localQuotes, serverQuotes) {
    return serverQuotes.map(serverQuote => {
        const localMatch = localQuotes.find(lq => lq.text === serverQuote.text);
        return localMatch ? localMatch : serverQuote; // Keep local version if conflict exists
    });
}



    // Display a Random Quote
function displayRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
        
        // Save last viewed quote in session storage
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
    }
}


// Restore Last Viewed Quote
function restoreLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastQuote) {
        document.getElementById("quoteDisplay").textContent = `"${lastQuote.text}" - ${lastQuote.category}`;
    }
}

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
        console.log("Quotes synced with server!"); // 
    } catch (error) {
        console.error("Error syncing quotes to server:", error);
    }
}


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
            quoteDisplay.textContent = "No quotes available for this category.";
        } else {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.textContent = `"${randomQuote.text}" - [${randomQuote.category}]`;
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
        populateCategories();
    }

    //  Function to add a new quote
    function addQuote() {
        const text = document.getElementById("newQuoteText").value;
        const category = document.getElementById("newQuoteCategory").value;
    
        if (text && category) {
            const newQuote = { text, category };
            const quotes = JSON.parse(localStorage.getItem("quotes")) || [];
            quotes.push(newQuote);
            localStorage.setItem("quotes", JSON.stringify(quotes));
    
            syncNewQuotesToServer(newQuote);
        }
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

    window.onload = function () {
        displayRandomQuote();
    populateCategories();
    filterQuotes();
});
