const fs = require('fs');
const readline = require('readline');
const { decoder, encoder } = require('tetris-fumen');
var assert = require('assert');

function validCoordinates(col, row) {
    return row >= 0 && row < 6 && col >= 0 && col < 10;
}

function floodFill(field, col, row) {
    if (!validCoordinates(col, row)) return;

    if (field.at(col, row) != '_') return;

    field.set(col, row, 'X');

    floodFill(field, col + 1, row);
    floodFill(field, col - 1, row);
    floodFill(field, col, row + 1);
    floodFill(field, col, row - 1);
}

function check_holes(fumen) {
    let pages = decoder.decode(fumen);
    let field = pages[0].field;
    field.clearLine();

    floodFill(field, 0, 5); // starting from just above the top row of the 6L
                            // at laeast 1 row has been cleared by definition so we can start here
                            // fill in all the "traditionally" empty space

    // now look for holes (empty space unfilled by the initial floodfill)
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < 10; col++) {
            if (field.at(col, row) == '_') { // there's a hole, dead 
                console.log(col, row)
                return false;
            }
        }
    }
    return true;

}

const inputStream = fs.createReadStream("./step_b_2.txt", 'utf8');

// Create a readable stream for reading lines
const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
});

// Create a writable stream for the output file
const outputStream = fs.createWriteStream("step_b_3.txt");

// Event listener for each line read
rl.on('line', (line) => {
    // Check the condition using the check() function
    if (check_holes(line)) {
        // If the condition is true, write the line to the output file
        outputStream.write(`${line}\n`);
    }
});

// Event listener for the end of the file
rl.on('close', () => {
    // Close the writable stream for the output file
    outputStream.end();
    console.log('Processing completed.');
});

// Event listener for errors
rl.on('error', (err) => {
    console.error(`Error reading the file: ${err}`);
});

// Event listener for the end of the writing process
outputStream.on('finish', () => {
    console.log('Writing completed.');
});