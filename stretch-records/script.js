const cardArea = document.querySelector(".cards");
const loadingMessage = document.querySelector(".loading");

// Every artist currently on the page, whatever the data's source. renderCards
// maintains this list, so the shuffle button and the form keep working no
// matter where the artists came from.
const roster = [];

// One card from one artist: the shared builder, used by the first render
// and by the form below.
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

// Load artists from artists.json with the three-line fetch pattern,
// then simulate a slow data source with a 2-second delay.
fetch("artists.json")
  .then((response) => response.json())
  .then((artists) => {
    // Show loading message immediately when data arrives
    loadingMessage.textContent = "Loading artists...";

    // Simulate slow data source: delay render by 2 seconds
    setTimeout(() => {
      renderCards(artists);
      // Clear the loading message once cards appear
      loadingMessage.textContent = "";
    }, 2000);
  })
  .catch((error) => {
    console.error("Error loading artists JSON:", error);
    loadingMessage.textContent = "Failed to load artists.";
  });

// Shuffle: pick a random artist and feature them.
const shuffleButton = document.querySelector(".shuffle");

shuffleButton.addEventListener("click", () => {
  if (roster.length === 0) return;
  const pick = roster[Math.floor(Math.random() * roster.length)];
  document.querySelector(".featured").textContent =
    `Featured today: ${pick.name}`;
});

// The suggestion form: an empty submission does nothing, because an empty
// string is falsy.
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
