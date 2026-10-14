// Load data and setup event listeners when page loads
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultsDiv = document.getElementById("results");

  let inventory = [];

  // Fetch the data.json file
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      inventory = data;
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
      resultsDiv.innerHTML = `<p class="no-results">Error loading database file.</p>`;
    });

  // Function to perform the search
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    resultsDiv.innerHTML = ""; // Clear previous results

    if (!query) {
      resultsDiv.innerHTML = `<p class="no-results">Please enter a CAS number or chemical name.</p>`;
      return;
    }

    // Filter items matching CAS or Chemical Name
    const matches = inventory.filter((item) => {
      const matchCas = item.cas.toLowerCase().includes(query);
      const matchName = item.name.toLowerCase().includes(query);
      return matchCas || matchName;
    });

    if (matches.length === 0) {
      resultsDiv.innerHTML = `<p class="no-results">No matching reagents found.</p>`;
      return;
    }

    // Build the HTML display for matches
    matches.forEach((item) => {
      const card = document.createElement("div");
      card.className = "result-card";

      let containersListHTML = item.containers
        .map(
          (c) => `
          <li class="inventory-item">
            <span><strong>Container:</strong> ${c.container}</span>
            <span><strong>Location:</strong> ${c.location}</span>
          </li>
        `
        )
        .join("");

      card.innerHTML = `
        <h2 class="chemical-title">${item.name}</h2>
        <span class="cas-badge">CAS: ${item.cas}</span>
        <ul class="inventory-list">
          ${containersListHTML}
        </ul>
      `;

      resultsDiv.appendChild(card);
    });
  }

  // Trigger search on button click
  searchBtn.addEventListener("click", performSearch);

  // Trigger search when pressing "Enter" in the input field
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
});