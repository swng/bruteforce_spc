const { make_sys_call } = require("./make_sys_call.js");
const { decoder, encoder, Field } = require("tetris-fumen");
const fs = require("fs");
const readline = require("readline");
const cheerio = require('cheerio');
const {glue} = require('./gluer.js');
const {unglue} = require('./unglueFumens.js')

// function check_parity(fumen) {
//     let pages = decoder.decode(fumen);
//     let field = pages[0].field;
//     // console.log(field.str())

//     let checkerboard_parity = 0;

//     for (let row = 0; row < 6; row++) {
//         for (let col = 0; col < 10; col++) {
//             let a = field.at(col, row);
//             if (a != "_") {
//                 if ((row + col) % 2 == 0) checkerboard_parity++;
//                 else checkerboard_parity--;
//             }
//         }
//     }
//     console.log(checkerboard_parity);
//     if (Math.abs(checkerboard_parity % 4) == 2) {
//         return false;
//         // console.log(checkerboard_parity)
//         // assert(false)
//     }
//     return true;
// }

function get_line_clear_congruent_fields(fumen) {
    let field_str = decoder.decode(fumen)[0].field.str();
    field_str = field_str.replace(/X/g, "I");

    let rows = field_str.split("\n");
    rows.pop(); // last row in the field string seems to be an inserted empty garbage row that isn't part of the field
    let line_clear_indices = [];
    rows.forEach((row, index) => {
        if (!row.includes("_")) line_clear_indices.push(index);
    });
    if (line_clear_indices.length == 1) {
        let index = line_clear_indices[0];
        let allReorderings = new Set();

        for (let i = 0; i <= rows.length; i++) {
            if (true) {
                const reorderedRows = [...rows];
                const removedItem = reorderedRows.splice(index, 1)[0];
                reorderedRows.splice(i, 0, removedItem);
                allReorderings.add(
                    encoder.encode([
                        {
                            field: Field.create(reorderedRows.join("")),
                        },
                    ])
                );
            }
        }
        return allReorderings;
    } else {
        throw new Error("weird, line clears = " + line_clear_indices.length);
    }
}

async function main() {
    const inputStream = fs.createReadStream("./step_h_sorted.txt", "utf8");

    // Create a readable stream for reading lines
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity,
    });

    // Create a writable stream for the output file
    const outputStream = fs.createWriteStream("generated_iosz_congruents.txt");

    let lineCount = 0;

    // Process each line asynchronously using for...of loop
    (async () => {
        for await (const line of rl) {
            lineCount++;
            if (lineCount !=20 && lineCount <= 48) {
                // good scoring fields that outscore OOJ DPC
                console.log(`T-${lineCount}`);
                outputStream.write(`T-${lineCount}\n`);

                split_line = line.trim().split(",");
                let greyed_fumen = split_line[2];

                let line_clear_congruent_field_fumens = get_line_clear_congruent_fields(greyed_fumen);
                // line_clear_congruent_fielda_fumens = line_clear_congruent_fields.filter(check_parity); // this is a bad filter to use?

                for (let fumen of line_clear_congruent_field_fumens) {
                    let command = `java -jar sfinder.jar setup -p '[^T]p1,*!' -t '${fumen}' -fill I`;
                    // console.log(command);
                    let results_string = await make_sys_call(command);
                    let results_list = results_string.split("\n");
                    for (let results_line of results_list) {
                        if (results_line.includes("Found solutions")) {
                            const match = results_line.match(/\d+/g);
                            if (match && match[0]) {
                                const num_solutions = parseFloat(match[0]);
                                if (num_solutions > 0) {
                                    // time to parse the setup.html file
                                    // grab the first link
                                    const html = fs.readFileSync('output/setup.html', 'utf-8');
                                    const $ = cheerio.load(html);
                                    const all_solutions = $('a').first().attr('href');
                                    let glued_fumens = glue([all_solutions]);
                                    command = `java -jar sfinder.jar cover -p '[^T]p1,*!' -t '${glued_fumens.join(' ')}' --mode tss`
                                    let results_string = await make_sys_call(command);
                                    // console.log(results_string)
                                    let results_list = results_string.split("\n");
                                    for (let results_line of results_list) {
                                        if (results_line.includes("%") && !results_line.includes("0.00") && !results_line.includes("OR")) {
                                            let fumen = results_line.substring(results_line.indexOf("v115@"));
                                            let unglued_fumen = unglue([fumen])[0];
                                            console.log(unglued_fumen);
                                            outputStream.write(`${unglued_fumen}\n`);
                                        }
                                    }
                                    // console.log(glued_fumens.join("\n"))
                                } 
                            }
                        }
                    }
                }

                // console.log(line_clear_congruent_fields.join("\n"));

                // if (true) {
                //     // If the condition is true, write the line to the output file
                //     outputStream.write(`${2 + 2},${line}\n`);
                // }
            }
        }

        // Close the writable stream for the output file
        outputStream.end();
        console.log("Processing completed.");
    })();
}

main();
