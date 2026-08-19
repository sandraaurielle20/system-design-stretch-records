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
  for (const artist of list) {
    roster.push(artist);
    cardArea.append(buildCard(artist));
  }
}

// Helper to preserve the 2-second simulated delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadArtists() {
  // 1. Create and show loading message
  const loadingMessage = document.createElement("p");
  loadingMessage.className = "loading";
  loadingMessage.textContent = "Loading artists...";
  cardArea.append(loadingMessage);

  try {
    // 2. Wait 2 seconds (simulated network delay from Lesson 2)
    await sleep(2000);

    const response = await fetch("artists.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const artists = await response.json();
    renderCards(artists);
  } catch (error) {
    // 3. Render error message on failure
    const errorMessage = document.createElement("p");
    errorMessage.className = "error";
    errorMessage.textContent =
      "Unable to load artists at this time. Please try again later.";
    cardArea.append(errorMessage);
    console.error("Failed to load artists:", error);
  } finally {
    // 4. Always remove loading indicator
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value;
  if (name) {
    const genre = genreInput.value || "Unsigned";
    renderCards([{ name: name, genre: genre, total: "0:00" }]);
    nameInput.value = "";
    genreInput.value = "";
  }
});
