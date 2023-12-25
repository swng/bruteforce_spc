const fs = require('fs');
const readline = require('readline');
const { decoder, encoder } = require('tetris-fumen');
var assert = require('assert');

function check_divider_rule(fumen) {
    let pages = decoder.decode(fumen);
    let field = pages[0].field;
    // console.log(field.str())

    for (let divider_col=1; divider_col<8; divider_col++) { // checking 2 columns, divider and divider+1
        let is_filled_column = true;
        for (let row=0; row<6; row++) {
            if (field.at(divider_col, row) == "_" && field.at(divider_col+1, row) == "_") { // a row with both empty
                is_filled_column = false;
                break; // exit loop early
            }
        }
        if (is_filled_column) {
            // this means we have a divider at column col
            // count number of empty cells on either side...
            let num_empty_cells = 0;
            for (let col=0; col < divider_col+1; col++) {
                for (let row=0; row<6; row++) {
                    if (field.at(col, row) == "_") {
                        num_empty_cells++;
                    }
                }
            }
            if ((num_empty_cells % 4) != 0) return false;
        }
    }
    return true;

}

const inputStream = fs.createReadStream("./step_f.txt", 'utf8');

// Create a readable stream for reading lines
const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
});

// Create a writable stream for the output file
const outputStream = fs.createWriteStream("step_f_2.txt");

// Event listener for each line read
rl.on('line', (line) => {
    // Check the condition using the check() function
    if (check_divider_rule(line)) {
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