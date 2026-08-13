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
// 1. doors open    // right: first synchronous log
// 2. main act      // right: second synchronous log
// 3. lights down   // right: third synchronous log
// 4. soundcheck    // right: 0ms timeout runs after script
// 5. intermission  // right: 500ms timeout runs next
// 6. encore        // right: 1000ms timeout runs last

// ===== Provided program (task step 4): trace the call stack =====
// Trace this as a written call stack diagram in comments, listing every push
// and pop in order. Then cause an error inside the innermost function and
// confirm the stack trace in the console matches your diagram, innermost
// first. Keep it commented out while you work on step 2.

function prepare(artist) {
  return "Now playing " + format(artist);
}
function format(artist) {
  return artist.name.toUpperCase();
}
console.log(prepare({ name: "Asake" }));

// The TypeError stack trace lists format → prepare → (top-level console.log),
// which matches the call stack diagram: the innermost function where the
// error happened is listed first, followed by each caller.

//Task step 3
// While the blocking loop ran, the call stack was busy with one long task.
// The page becomes unresponsive for about 3 seconds.
// Shuffle button and form did not react until the loop finishes.
// This shows the call stack is occupied by one long synchronous task, so timers and event handlers can’t run until it returns.

//Task step 5
// The 2-second setTimeout simulates slow data: the event loop waits with
// the callback in the timer queue while the call stack is free for other tasks.

// Step 6: countdown from 10 to 0 with setInterval, then stop it.

let count = 10;
console.log("Countdown starting at", count);

const intervalId = setInterval(() => {
  console.log(count);
  count -= 1;

  if (count < 0) {
    console.log("Countdown finished");
    clearInterval(intervalId);
    // Prove it stopped: nothing logs after this.
  }
}, 1000);

// clearInterval(intervalId) removes the repeating task from the timer queue,
// so the event loop no longer schedules it and nothing logs after "finished".

//Task step 7
// In this lesson, the single-threaded JavaScript engine used:
// - The call stack for synchronous work (logs, blocking loop, prepare/format).
// - Facilities like timers to schedule callbacks (setTimeout, setInterval).
// - Queues to hold ready callbacks (timer queue, event queue).
// - The event loop to move callbacks onto the stack when it is empty.
//
// This lets JavaScript handle many waiting tasks (timeouts, clicks) without
// freezing, as long as no single synchronous task blocks the stack for too long.
