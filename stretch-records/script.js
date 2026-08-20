"use strict";

const cardArea = document.querySelector(".cards");
const roster = [];

function buildCard(artist) {
  const card = document.createElement("article");
  if (artist.photo) {
    const photo = document.createElement("img");
    photo.src = artist.photo;
    photo.alt = `${artist.name}, artist photo`;
    card.append(photo);
  }
  const title = document.createElement("h3");
  title.textContent = artist.name;
  const line = document.createElement("p");
  line.textContent = `${artist.genre}, ${artist.total} of music`;
  card.append(title, line);
  return card;
}

function renderCards(list) {
  // Handle both direct arrays and wrapped { artists: [...] } objects safely
  const items = Array.isArray(list) ? list : list.artists || [];

  for (const artist of items) {
    roster.push(artist);
    cardArea.append(buildCard(artist));
  }
}

// Helper to preserve simulated delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadArtists() {
  const loadingMessage = document.createElement("p");
  loadingMessage.className = "loading";
  loadingMessage.textContent = "Loading artists...";
  cardArea.append(loadingMessage);

  try {
    await sleep(1500);

    // Fetch from your json-server endpoint
    const response = await fetch("http://localhost:3000/artists");

    // Step 3 requirements: Log response properties
    console.log("Response Object:", response);
    console.log("Response ok:", response.ok);
    console.log("Response status:", response.status);

    // Step 4 requirement: Throw on HTTP error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    renderCards(data);
  } catch (error) {
    // Show visitor-friendly fallback error message
    const errorMessage = document.createElement("p");
    errorMessage.className = "error";
    errorMessage.textContent =
      "Unable to load artists at this time. Please try again later.";
    cardArea.append(errorMessage);
    console.error("Failed to load artists:", error);
  } finally {
    // Step 5: Always clear the loading indicator
    loadingMessage.remove();
  }
}

loadArtists();

// Shuffle button handler
const shuffleButton = document.querySelector(".shuffle");
shuffleButton.addEventListener("click", () => {
  if (roster.length === 0) return;
  const pick = roster[Math.floor(Math.random() * roster.length)];
  document.querySelector(".featured").textContent =
    `Featured today: ${pick.name}`;
});

// Form submission handler
const form = document.querySelector(".signup");
const nameInput = document.querySelector("#artist-name");
const genreInput = document.querySelector("#artist-genre");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const genre = genreInput.value.trim() || "Unsigned";

  if (!name) return;

  const newArtist = {
    name: name,
    genre: genre,
    total: "0:00",
  };

  try {
    const response = await fetch("http://localhost:3000/artists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArtist),
    });

    console.log("POST Response status:", response.status); // 201 Created

    if (response.ok) {
      const savedArtist = await response.json();
      roster.push(savedArtist);
      cardArea.append(buildCard(savedArtist));
      nameInput.value = "";
      genreInput.value = "";
    }
  } catch (error) {
    console.error("Failed to submit artist:", error);
  }
});
