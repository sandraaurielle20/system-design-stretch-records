"use strict";

// Lesson 3: Promises, async, and await.
// Standalone programs and observations go in this file as code and comments.
// The loader work happens in stretch-records/script.js.

// ==========================================
// Step 3: Ordering Puzzle (Promise vs Timer)
// ==========================================
// Prediction:
// 1. "1: Start (synchronous)"
// 2. "4: End (synchronous)"
// 3. "3: Settled Promise (microtask)"
// 4. "2: Zero delay timer (macrotask)"
//
// Explanation:
// The Promise callback is placed in the Microtask Queue, which the Event Loop prioritizes
// and empties completely before executing any callbacks from the Macrotask Queue (setTimeout).

console.log("1: Start (synchronous)");

setTimeout(() => {
  console.log("2: Zero delay timer (macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Settled Promise (microtask)");
});

console.log("4: End (synchronous)");

// ==========================================
// Step 5: Custom Error Class
// ==========================================
class MissingArtistDataError extends Error {
  constructor(field, artistIndex) {
    super(
      `Validation Error: Missing required property '${field}' on artist at index ${artistIndex}.`,
    );
    this.name = "MissingArtistDataError";
    this.field = field;
    this.artistIndex = artistIndex;
  }
}

function validateArtist(artist, index) {
  if (!artist.name || artist.name.trim() === "") {
    throw new MissingArtistDataError("name", index);
  }
  return true;
}

try {
  const invalidArtist = { genre: "Afrobeats", total: "03:45" };
  validateArtist(invalidArtist, 0);
} catch (error) {
  if (error instanceof MissingArtistDataError) {
    console.error(`[Data Team Action Required] ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}
//
// Step 6: Paste the final rethrown message that reached the top
//
// Final rethrown message that reached the top:
// "Error: [Stretch Records - Artist Loader] Operation failed: Malformed JSON syntax"

function parseRoster() {
  try {
    throw new Error("Malformed JSON syntax");
  } catch (originalError) {
    // Add page and operation context, then rethrow
    throw new Error(
      `[Stretch Records - Artist Loader] Operation failed: ${originalError.message}`,
    );
  }
}

try {
  parseRoster();
} catch (topLevelError) {
  console.error("Top-level handled error:", topLevelError.message);
}
//
// Step 7: Promise.all vs Promise.allSettled
//
const delayTask = (ms, label, shouldFail = false) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Failed to load: ${label}`));
      else resolve(`Data from ${label}`);
    }, ms);
  });

const taskA = delayTask(100, "Primary Source");
const taskB = delayTask(200, "Secondary Source", true); // Rejects
const taskC = delayTask(150, "Backup Source");

// Promise.all: Fails entirely if any single task fails
Promise.all([taskA, taskB, taskC])
  .then((results) => console.log("Promise.all succeeded:", results))
  .catch((err) => console.log("Promise.all failed as expected:", err.message));

// Promise.allSettled: Waits for all and keeps the successful survivors
Promise.allSettled([taskA, taskB, taskC]).then((outcomes) => {
  console.log("Promise.allSettled outcomes:", outcomes);
  const survivors = outcomes
    .filter((outcome) => outcome.status === "fulfilled")
    .map((outcome) => outcome.value);
  console.log("Surviving results:", survivors);
});
//
// Step 8: User-Facing Error Defense
//
// Message: "Unable to load artists at this time. Please try again later."
// Defense: This message is clear and non-technical, avoiding confusing implementation details
// (like HTTP 404 or SyntaxError) while reassuring the visitor and giving a clear next step.
