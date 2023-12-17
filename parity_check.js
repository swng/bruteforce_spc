const fs = require('fs');
const readline = require('readline');
const { decoder, encoder } = require('tetris-fumen');
var assert = require('assert');

function check_parity(fumen) {
    let pages = decoder.decode(fumen);
    let field = pages[0].field;
    field.clearLine();
    // console.log(field.str())

    let checkerboard_parity = 0;

    for (let row=0; row<6; row++) {
        for (let col=0; col<10; col++) {
            let a = (field.at(col, row));
            if (a != "_") {
                if ((row+col) % 2 == 0) checkerboard_parity++;
                else checkerboard_parity--;
            }
        }
    }
    if (Math.abs(checkerboard_parity % 4) == 2) {
        return true;
        // console.log(checkerboard_parity)
        // assert(false)
    }
    return false;
}

const inputStream = fs.createReadStream("./step_a.txt", 'utf8');

// Create a readable stream for reading lines
const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
});

// Create a writable stream for the output file
const outputStream = fs.createWriteStream("step_b.txt");

// Event listener for each line read
rl.on('line', (line) => {
    // Check the condition using the check() function
    if (check_parity(line)) {
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