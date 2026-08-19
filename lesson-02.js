"use strict";

// Lesson 2: Asynchronous JavaScript and the Event Loop.
// Standalone programs and observations go in this file as code and comments.

// ===== Provided program (task step 2): predict before you run =====
// Write your predicted output order as a comment BELOW, before running this
// file with node. Then run it, mark each line of your prediction right or
// wrong, and correct the wrong ones with one sentence each explaining why.

console.log("doors open");
setTimeout(() => console.log("encore"), 1000);
setTimeout(() => console.log("soundcheck"), 0);
console.log("main act");
setTimeout(() => console.log("intermission"), 500);
console.log("lights down");

// Your prediction:
// 1. "doors open"      - (Right) Synchronous code executes immediately on the Call Stack.
// 2. "main act"        - (Right) Synchronous code continues before any timers execute.
// 3. "lights down"     - (Right) Final synchronous log finishes before the stack clears.
// 4. "soundcheck"      - (Right) 0ms timer callback enters the Task Queue first and runs once the stack is empty.
// 5. "intermission"    - (Right) 500ms timer expires second and is processed by the Event Loop.
// 6. "encore"          - (Right) 1000ms timer has the longest delay and finishes last
//
// ===== Task Step 3:
//Observations on the blocking loop:
// The part of the execution model that was occupied:
//    - The Call Stack (the main JavaScript execution thread).
// What could not happen while it was occupied:
//    - The browser could not re-render the DOM, process user input (clicks/scrolling),
//      or execute any asynchronous callbacks in the Task Queue because the synchronous
//      while-loop had exclusive control of the thread.

// ===== Provided program (task step 4): trace the call stack =====
// Trace this as a written call stack diagram in comments, listing every push
// and pop in order. Then cause an error inside the innermost function and
// confirm the stack trace in the console matches your diagram, innermost
// first. Keep it commented out while you work on step 2.
//
// Written Call Stack Push / Pop Lifecycle:
// 1. push: console.log(prepare(...))
// 2. push: prepare({ name: "Asake" })
// 3. push: format({ name: "Asake" })
// 4. pop:  format() returns "ASAKE"
// 5. pop:  prepare() returns "Now playing ASAKE"
// 6. pop:  console.log() prints result and completes
//
// Stack trace when an error is thrown inside format():
// - at format (lesson-02.js)
// - at prepare (lesson-02.js)
// - at top-level execution

function prepare(artist) {
  return "Now playing " + format(artist);
}

function format(artist) {
  return artist.name.toUpperCase();
}

console.log(prepare({ name: "Asake" }));

// ==== Task Step 5: Delayed Loading Simulation
// Implemented inside stretch-records/script.js:
// 1. Added a 'Loading artists...' paragraph to the DOM before fetching.
// 2. Wrapped renderCards(artists) in a 2000ms setTimeout.
// 3. Removed the loading message right before rendering the cards.
//
// ==== Task Step 6: 10 to 0 Countdown with setInterval
let count = 10;

// Start interval running every 1000ms (1 second)
const timerId = setInterval(() => {
  console.log(`Countdown: ${count}`);

  // When count hits 0, stop the interval
  if (count === 0) {
    clearInterval(timerId);
    console.log("Countdown complete. Interval cleared.");
  }

  count--;
}, 1000);

//
// ==== Task Step 7 (Optional): Single-Threaded Concurrency Explanation
//
// How JavaScript handles thousands of simultaneous waiting tasks without freezing:
// 1. The Call Stack runs one line of code at a time on the main thread.
// 2. Slow tasks (like timers and network requests) are handed off to the browser (Web APIs) so the main thread doesn't freeze.
// 3. When those background tasks finish, their callbacks wait in line in the Task Queue.
// 4. The Event Loop waits until the Call Stack is completely empty, then pushes the queued callbacks to run one by one.
