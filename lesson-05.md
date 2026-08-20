# Lesson 5: The System Audit

The written audit of your running system. Every claim must be backed by
something you observed in the Network tab, the console, or the server's
terminal output.

## Single point of failure

- **Observed failure:** When `json-server` was stopped and the page reloaded, the network handshake failed immediately with `TypeError: Failed to fetch`. The `catch` block caught the error, removed the loading indicator, and rendered the visitor fallback message: _"Unable to load artists at this time. Please try again later."_

- **Single point of failure identification:** The single `json-server` process running locally on port 3000 is a single point of failure because any disruption to that one process completely takes down data retrieval and storage for the entire application.

- **What redundancy means here:** Redundancy would mean running multiple server instances behind a reverse proxy or load balancer with database replication, so if one server instance stops, incoming requests are seamlessly rerouted to a surviving instance without user-facing downtime.

## Latency

- **Observed load time:** Under the **Slow 3G / Slow 4G** preset, the request load time jumped from under 10ms to approximately 2.3 seconds in the Network tab.

- **Screen state while waiting:** The `<p class="loading">Loading artists...</p>` message remained visible on the screen, indicating an active background process until the response resolved.

- **Latency definition:** The artificial roundtrip delay introduced between the client dispatching the HTTP request and the server's response returning is defined as network latency.

## Caching

- **Observed difference:**
  - With **Disable cache** checked, every asset was re-fetched over the network, resulting in full payload transfers (~1.2 KB for data/scripts) and `200 OK` status codes taking 10–20ms.

  - With **Disable cache** unchecked, static assets resolved in <2ms with `(from disk cache)` / `304 Not Modified` and 0 bytes transferred over the network wire.

- **Caching definition:** Caching is the mechanism where the browser temporarily stores previously fetched web assets locally on the machine to avoid redundant network roundtrips and speed up page load times.

## The layers

- **Presentation Layer (Frontend):**
  - Built with HTML, CSS, and vanilla JavaScript (`stretch-records/index.html`, `styles.css`, `script.js`).
  - Handles DOM manipulation, listening for form submits, rendering `<article>` artist cards, and managing loading/error states in the UI.

- **Application Layer (Middle Tier):**
  - Powered by `json-server` (running on Node.js/Express).
  - **What sits in this layer:** Basic RESTful routing (`GET`, `POST`), HTTP request/response serialization, automated 200/201/404 HTTP status header generation, and CORS handling (`Access-Control-Allow-Origin: *`).
  - **What does NOT sit in this layer:** True business logic, authentication/authorization checks, payload schema validation, input sanitization, or rate limiting.

- **Data Layer (Backend Datastore):**
  - The `artists.json` flat file on disk.
  - Serves as the persistent store that holds the structured JSON document across requests and server restarts.

## One request's full journey

1. **Trigger:** `script.js` initiates the lifecycle by invoking `loadArtists()` and inserting a `<p class="loading">Loading artists...</p>` element into the DOM.
2. **Dispatch:** `fetch('http://localhost:3000/artists')` creates and sends an asynchronous HTTP `GET` request across the local loopback interface (`127.0.0.1:3000`).
3. **Server Processing:** `json-server` intercepts the request, reads `artists.json` from the filesystem, serializes the data array into a JSON string, and logs `GET /artists 200` in the terminal.
4. **Response Delivery:** The server returns HTTP headers (`Content-Type: application/json; charset=utf-8`, `Access-Control-Allow-Origin: *`) along with the `200 OK` status and data body.
5. **DOM Render & Cleanup:** The browser receives the payload, `await response.json()` parses the stream into JavaScript objects, `renderCards()` appends the `<article>` elements to `.cards`, and the `finally` block removes the loading indicator.

## STRETCH: what a real system would need that json-server skipped

- **Validation (Application Layer):** Verifying data types, field limits (e.g., maximum character length for artist names), and required properties before database entry.
- **Identity & Authentication (Application Layer):** Requiring authentication tokens (e.g., Bearer tokens, OAuth, JWT) so only authorized admin accounts can execute `POST` or `DELETE` requests.
- **Business Rules (Application / Data Layer):** Enforcing domain logic, such as preventing duplicate artist entries and managing relational links between labels and artists.
- **Browser Isolation Reality:** Frontend checks alone are insufficient because anyone can bypass browser UI restrictions and submit malformed or malicious payloads directly to an open API using tools like cURL, Postman, or custom fetch scripts. Critical validation and authorization rules must reside on the server.
