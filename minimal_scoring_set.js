const fs = require("fs");

function is2L(queue) {
    return false; // not running on extra O

   if (queue.indexOf("I") > 4) return false;
   if (queue.indexOf("L") > 4) return false;
   if (queue.indexOf("J") > 4) return false;
   if (queue.indexOf("O") > 4) return false;

   return true;
}

const inputFile = "output/T-s.csv"; // input is a curated / modified cover file ORDERED BY SCORE
// const outputFile = 'step_h_sorted.txt';

// Read the content of the input file
fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
        console.error(`Error reading file ${inputFile}: ${err.message}`);
        return;
    }

    // Split the content into lines
    const lines = data.trim().split("\n");

    // Parse each line into an array of values
    const parsedLines = lines.map((line) => line.split(","));

    let fumens = parsedLines[0];
    let scores = parsedLines[2];
    let names = parsedLines[1];

    //   let minimal_set = new Set();

    let indices = new Set();

    let total_Score = 0;

    let count = 0;

    for (let i = 3; i < parsedLines.length; i++) {
        count += 1;
        if (is2L(parsedLines[i][0])) { // lol manual addition of 2L
            // minimal_set.add(fumens[index]);
            indices.add(0);
            total_Score += 8620.21;
        } else {
            let applicable_solutions = parsedLines[i];
            let index = applicable_solutions.indexOf("O"); // first applicable solution. These are pre-sorted by score, so the first one is the best one.
            // minimal_set.add(fumens[index]);
            if (index == -1) {
                
            } else {
                indices.add(index);
                total_Score += parseFloat(scores[index]);
            }
            
        }

        // console.log(count);
    }
    console.log(total_Score / 5040); // or /count because count should be 5040.
    //   console.log(Array.from(minimal_set).sort().join(' '))
    let sorted_indices = Array.from(indices).sort(function(a, b) {
        return a - b;
      });;
    // console.log(sorted_indices)
    let minimal_set_fumens = sorted_indices.map((index) => fumens[index]);
    let minimal_set_names = sorted_indices.map((index) => names[index]);
    console.log(minimal_set_fumens.join(' '));
    console.log(minimal_set_names.join(' '));
});
