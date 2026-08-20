"use strict";

// Lesson 4: HTTP and the Fetch API.
// Recorded observations go in this file as comments. The loader and form
// work happens in stretch-records/script.js, against the server you run
// with json-server.

// =============================================================================
// Step 2: Both status codes and the response Content-Type
// =============================================================================
// 1. Valid endpoint (GET http://localhost:3000/artists):
//    - Status code: 200 OK
//    - Content-Type: application/json; charset=utf-8
//
// 2. Non-existent endpoint (GET http://localhost:3000/wrong-path):
//    - Status code: 404 Not Found
//    - Content-Type: application/json; charset=utf-8

// =============================================================================
// Step 3: ok, status, and one Access-Control-Allow header from the Network tab
// =============================================================================
// - response.ok: true
// - response.status: 200
// - Access-Control-Allow header: Access-Control-Allow-Origin: * (or Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS)

// =============================================================================
// Step 4: Show that the Promise fulfilled anyway on the wrong path
// =============================================================================
// Observation:
// Fetching a non-existent path (404) does NOT reject the fetch() promise. The promise
// fulfills successfully with a Response object where response.ok is false and response.status is 404.
// To handle it properly as an error, we manually test response.ok and throw an Error.

async function proveFetchTrap() {
  try {
    const response = await fetch("http://localhost:3000/wrong-path");
    console.log(
      "Step 4 - Promise fulfilled despite 404 status. Status:",
      response.status,
    ); // 404
    console.log("Step 4 - response.ok evaluated to:", response.ok); // false

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Caught by manual ok check:", error.message);
  }
}

// =============================================================================
// Step 5: How did the refused connection differ from the 404?
// =============================================================================
// Observation:
// - HTTP 404 (Not Found): The server is running and reachable. It processed the HTTP request
//   and returned a structured HTTP response stating the endpoint does not exist. The fetch()
//   promise was fulfilled with response.ok === false.
// - Refused Connection (Server stopped): No HTTP response was ever generated. The underlying TCP/network
//   handshake failed entirely, causing fetch() to reject immediately with a "TypeError: Failed to fetch".

// =============================================================================
// Step 7: Dual-Server Fetch with Promise.all (label.json & artists.json)
// =============================================================================
async function fetchRosterAndLabel() {
  try {
    const [artistsRes, labelRes] = await Promise.all([
      fetch("http://localhost:3000/artists"),
      fetch("http://localhost:3001/label"),
    ]);

    if (!artistsRes.ok || !labelRes.ok) {
      throw new Error("One or both endpoints failed to load successfully.");
    }

    const artists = await artistsRes.json();
    const label = await labelRes.json();

    console.log("Successfully fetched both data sources:", { artists, label });
  } catch (err) {
    console.error("Failed dual-server fetch:", err.message);
  }
}

// =============================================================================
// STRETCH, step 8: The public API's endpoint address, method, parameter, shape, and limit
// =============================================================================
// MusicBrainz Public API Documentation:
// - Endpoint address: https://musicbrainz.org/ws/2/artist/
// - HTTP Method: GET
// - One parameter: query (e.g., ?query=artist:asake&fmt=json)
// - Response shape to code against: A JSON object containing an "artists" array of objects,
//   each with fields like "id", "name", "score", "country", and "disambiguation".
// - Stated limit: Rate limited to 1 request per second per IP (requires a meaningful custom User-Agent header).
