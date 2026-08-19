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

// 1. Create and display the loading message immediately
const loadingMessage = document.createElement("p");
loadingMessage.className = "loading";
loadingMessage.textContent = "Loading artists...";
cardArea.append(loadingMessage);

// 2. Fetch the data, but delay rendering by 2000ms (2 seconds)
fetch("artists.json")
  .then((response) => response.json())
  .then((artists) => {
    setTimeout(() => {
      loadingMessage.remove(); // Clear loading message
      renderCards(artists); // Render the cards
    }, 2000);
  });

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
