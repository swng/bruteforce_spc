const { decoder, encoder, Mino} = require('tetris-fumen');
const fs = require('fs');
const readline = require('readline');

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

// Made by swng
async function generate(base_field, hold_piece) {
    let results = new Set();

    for (let col = 0; col < 10; col++) {
        for (let row = 0; row < 6; row++) {
            for (let rotation_state of ['spawn', 'right', 'reverse', 'left']) {
                let mino = new Mino(hold_piece, rotation_state, col, row);
                if (mino.isValid()) {
                    let field = base_field.copy();
                    if (field.canLock(mino)) {
                        let positions = mino.positions();
                        good = true;
                        for (position of positions) {
                            if (position.y >= 6) good = false;
                        }
                        if (good) {
                            field.put(mino);
                            // field = grey_out(field);
                            results.add(encoder.encode([{
                                field: field
                            }]))
                        }
                    }
                }

            }
        }
    }

    return results;

}

async function generate_dn(base_field, piece_list){
    if (piece_list.length === 0) {
        return new Set([encoder.encode([{field: base_field}])]);
    }
    if (piece_list.length === 1) {
        return await generate(base_field, piece_list[0]);
    }
    if (piece_list.length > 1) {
        let results = new Set();

        for (let i = 0; i < piece_list.length; i++) {
            let temp = await generate(base_field, piece_list[i]);
            for (const fumen of temp) {
                let temp_base_field = decoder.decode(fumen)[0].field;
                let temp_piece_list = piece_list.slice(0, i).concat(piece_list.slice(i + 1));

                let temp2 = await generate_dn(temp_base_field, temp_piece_list);
                results = new Set([...results, ...temp2]);
            
            }
        }
        return results;
    }
}


// EX


// let base_fumen = 'v115@7gRpHeRpg0CeBtywA8i0R4BtwwB8BeR4EeA8JeAgH';



// let field = decoder.decode(base_fumen)[0].field;

// let results = generate_dn(field, 'IL');

// for (let result of results) {
//     console.log(result);
// }

async function main() {
    const inputStream = fs.createReadStream("./real_d_2.txt", 'utf8');

    // Create a readable stream for reading lines
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity
    });
    
    // Create a writable stream for the output file
    const outputStream = fs.createWriteStream("step_e.txt");

    // Process each line asynchronously using for...of loop
    (async () => {
        for await (const line of rl) {
            if (true) {

                split_line = line.trim().split(",");
                let percent = parseFloat(split_line[0]);
                let missing_pieces = split_line[2];
                if ((missing_pieces.length == 0 && percent >= 98.0) ||
                    (missing_pieces.length == 1 && percent >= 99.0) ||
                    (missing_pieces.length >= 2 && percent >= 100.0)
                ) {
                    let fumens = split_line.slice(3);
                    for (let fumen of fumens) {
                        if (greyout(fumen) == split_line[1]) { // standard orientation
                            let field = decoder.decode(fumen)[0].field;
                            let results = await generate_dn(field, missing_pieces);
                            for (let result of results) {
                                // If the condition is true, write the line to the output file
                                // result_line = ``;
                                outputStream.write(`${result}\n`);
                            }
                        } else { // mirrored orientation
                            let field = decoder.decode(fumen)[0].field;
                            let missing_pieces_mirrored = missing_pieces.split('').map(char => reverseMappingLetters[char]).join('');
                            let results = await generate_dn(field, missing_pieces_mirrored);
                            for (let result of results) {
                                // If the condition is true, write the line to the output file
                                // result_line = ``;
                                outputStream.write(`${result}\n`);
                            }
                        }
                    }
                }
            }
            
        }

        // Close the writable stream for the output file
        outputStream.end();
        console.log('Processing completed.');
    })();
}

main();

