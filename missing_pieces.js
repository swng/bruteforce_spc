const fs = require('fs');
const readline = require('readline');
const { decoder, encoder } = require('tetris-fumen');
var assert = require('assert');

function find_missing_pieces(fumen) {
    let all_pieces = ['L', 'J', 'S', 'Z', 'I', 'O', 'T'];

    let pages = decoder.decode(fumen);
    let queue = pages[0].comment;

    let missing_pieces = "";

    if (queue.length < 7) { // there'll be 0 missing pieces if queue uses all 7 pieces
        for (const piece of all_pieces) {
            if (!queue.includes(piece)) {
              missing_pieces += piece;
            }
        }
    }

    pages[0].comment = '';
    pages[0].quiz = false;

    stripped_fumen = encoder.encode([pages[0]]);

    return `${stripped_fumen},${missing_pieces}`;
    
}


const inputStream = fs.createReadStream("./step_b_2.txt", 'utf8');

// Create a readable stream for reading lines
const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
});

// Create a writable stream for the output file
const outputStream = fs.createWriteStream("step_c.txt");

// Event listener for each line read
rl.on('line', (line) => {
    // Check the condition using the check() function
    let processed_line = find_missing_pieces(line);
    outputStream.write(`${processed_line}\n`);
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