const fs = require('fs');
const readline = require('readline');
const { decoder, encoder, Field } = require('tetris-fumen');
var assert = require('assert');

const reverseMappingLetters = {
    "L": "J",
    "J": "L",
    "S": "Z",
    "Z": "S",
    "T": "T",
    "O": "O",
    "I": "I",
    "_": "_",
    "X": "X"
}

function greyout(fumen) {
    let pages = decoder.decode(fumen);
    let page = pages[0];

    let field = page.field;

    // field.clearLine(); // for reasons I decided not to do this. It doesn't remove much, and keeping lines uncleared makes PC check less work (consistent -c 6 argument)

    for (let row=0; row<6; row++) {
        for (let col=0; col<10; col++) {
            let a = (field.at(col, row));
            if (a != "_") {
                field.set(col, row, 'X');
            }
        }
    }

    return encoder.encode([{field: field}]);
}

function mirror_fumen(fumen) {
    let pages = decoder.decode(fumen);
    let page = pages[0];

    let field = page.field;
    let mirrored_field = field.copy();

    for (let row=0; row<6; row++) {
        for (let col=0; col<10; col++) {
            let a = (field.at(col, row));
            mirrored_field.set(9 - col, row, reverseMappingLetters[a]);
        }
    }

    return encoder.encode([{field: mirrored_field}]);

}

// let temp = greyout_and_clear_line("v115@zgwhBeg0FewhBei0Q4CewhywBtR4hlwhA8wwRpBtQ4?AeglC8RpDeglJeAgH");
// let temp2 = mirror(temp)

// console.log(temp)
// console.log(temp2)

let setup_dict = {};

const inputStream = fs.createReadStream("./step_f_2.txt", 'utf8');

// Create a readable stream for reading lines
const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
});

// Event listener for each line read
rl.on('line', (line) => {
    let fumen = line;
    let greyed_fumen = greyout(fumen);

    let key = greyed_fumen;

    let greyed_fumen_mirrored = mirror_fumen(greyed_fumen);
    let key_mirrored = greyed_fumen_mirrored;

    if (key in setup_dict) {
        setup_dict[key].push(fumen);
    }
    else if (key_mirrored in setup_dict) {
        setup_dict[key_mirrored].push(fumen);
    }
    else { // new
        setup_dict[key] = [fumen];
    }
    // if (check_parity(line)) {
    //     // If the condition is true, write the line to the output file
    //     // outputStream.write(`${line}\n`);
    // }
});

const outputStream = fs.createWriteStream("step_f_3.txt");

// Event listener for the end of the file
rl.on('close', () => {
    // Close the writable stream for the output file
    console.log(Object.keys(setup_dict).length);


    // Create a writable stream for the output file
    
    for (const [key, value] of Object.entries(setup_dict)) {
        // if (value.length > 2) console.log(`${key} ${value.join(' ')}\n`)
        outputStream.write(`${key},${value.join(',')}\n`);
      }

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