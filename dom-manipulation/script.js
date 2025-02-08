document.addEventListener("DOMContentLoaded" ,() => {
    const quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to invent it.", Category: "Inspiration" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", Category: "Programm" },
        { text: "Simplicity is the soul of efficiency.", Category: "Design" },
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    function showRandomQuote() {
        const randomIndex =Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerText = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].Category}`;
    }

    function addQuote() {
       const newText = document.getElementById("newQuoteText").ariaValueMax.trim();
       const newCategory = document.getElementById("newQuoteCategory").ariaValueMax.trim();

         if (newText === "" || newCategory === "") {
              alert("Both fields are required!");
              return;
         }

         quotes.push({ text: newText, category: newCategory });
         localStorage.setItem("quotes", JSON.stringify(quotes));
         document.getElementById("newQuoteText").value = "";
         document.getElementById("newQuoteCategory").value = "";
         showRandomQuote();
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    showRandomQuote();
});