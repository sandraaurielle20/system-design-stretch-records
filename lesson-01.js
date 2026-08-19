"use strict";

// Lesson 1: The Client and Server Model.
// Your standalone code and written observations for this lesson live here,
// as code and comments. The site work happens in the stretch-records folder.
//
// Step 4: how many requests did the single page load make? List three by name.
//
// The page load make 10 requests. Three of them are: index.html, styles.css, script.js.
//
// Step 6: which files changed when you added the sixth artist, which did not,
// and why is that separation the point?
//
// Files changed: stretch-records/artists.json
// Files NOT changed: stretch-records/script.js, stretch-records/index.html, stretch-records/styles.css
// The separation at this point is because decoupling data from rendering logic allows us to update, extend, or pull content from
// different data sources (like databases or APIs) without risking bugs or requiring code changes
// in the user interface presentation layer

// Step 7: paste the console error the broken artists.json produced.
//
// The console error produced by the broken artists.json was:
// Uncaught SyntaxError: JSON.parse: unexpected character at line 37 column 1 of the JSON data.

// Step 8: build one artist object, JSON.stringify() it, log the text,
// JSON.parse() it back, and log one property of the result.
//
const testArtist = {
  name: "Stromae",
  genre: "Hip-hop / Chanson",
  total: "12:30",
  photo: "images/stromae.jpg",
};

// Convert to text
const artistJSON = JSON.stringify(testArtist);
console.log("JSON Stringified:", artistJSON);

// Parse back into an object
const parsedArtist = JSON.parse(artistJSON);

// Prove round trip by accessing a property
console.log("Parsed Artist Name:", parsedArtist.name);

// STRETCH, step 9: describe your page as a system. Name the client, name the
// server, and state what the request asked for and what the response carried.

// - Client: The web browser executing JavaScript and rendering DOM nodes.
// - Server: The local Live Server serving HTTP resources.
// - Request: HTTP GET request targeting 'artists.json'.
// - Response: HTTP 200 OK carrying the raw JSON text array of artist objects.
