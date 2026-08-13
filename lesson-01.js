"use strict";

// Lesson 1: The Client and Server Model.
// Your standalone code and written observations for this lesson live here,
// as code and comments. The site work happens in the stretch-records folder.
//
// Step 4: how many requests did the single page load make? List three by name.

//On initial page load, the browser made 10 requests.
// Three example requests by name: index.html, styles.css, script.js.
// Additional requests included font files and images like pinkfong.jpeg

// Step 6: which files changed when you added the sixth artist, which did not,
// and why is that separation the point?

//When I added the sixth artist, only stretch-records/artists.json changed.
// stretch-records/script.js did not change.
// This separation is the point: data (the roster) can grow or update
// without touching the code that renders it, making the system easier to maintain.

// Step 7: paste the console error the broken artists.json produced.

// Uncaught (in promise) SyntaxError: Unexpected token ] in JSON at position 234
//     at JSON.parse (<anonymous>)
//     at script.js:15:20
//
// Step 8: build one artist object, JSON.stringify() it, log the text,
// JSON.parse() it back, and log one property of the result.
// Step 8:
const testArtist = {
  name: "Test Artist",
  genre: "Synthwave",
  total: "09:30",
};

const jsonText = JSON.stringify(testArtist);
console.log("Stringified artist:", jsonText);

const parsedArtist = JSON.parse(jsonText);
console.log("Parsed artist name:", parsedArtist.name);
//
// STRETCH, step 9: describe your page as a system. Name the client, name the
// server, and state what the request asked for and what the response carried.

// The client: the browser showing index.html to the user.
// The server: the web server (Live Server or GitHub) hosting the stretch-records files.
// The client requests index.html, styles.css, script.js, and label.json.
// script.js uses fetch to ask the server for label.json.
// The response carries JSON data for all artists.
// The client parses that JSON and uses it to render the artist cards and
// to support the shuffle and signup features.
