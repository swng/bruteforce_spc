const {make_sys_call} = require('./make_sys_call.js');
const fs = require('fs');
const readline = require('readline');
const {decoder, encoder, Field} = require('tetris-fumen');
const {call_sfinder_path} = require('./call_sfinder_path.js');
const {calculate_all_scores, generate_all_permutations, loadPathCSV} = require('./avg_score.js');
const {glue} = require('./gluer.js');

async function score_field(fumen) {
    await call_sfinder_path(fumen);
    let results;
    let queues = generate_all_permutations('LJSZIOT').map(q => q.join(''));
    results = calculate_all_scores(
        queues,
        // loadCSV('output/cover.csv'), // loadCSV('output/cover.csv')
        loadPathCSV('output/path.csv'),
        true, // initial b2b
        0, // initial combo
        0, // b2b end bonus
        'output/score_cover.csv', // score cover file
    );
    console.log(results);
    return results.average_covered_score * results.num_pc_queues / 5040;
}

function color_the_greyed_T(fumens) { // array of fumens
    let results = [];
    for (let fumen of fumens) {
        let field = decoder.decode(fumen)[0].field;
        for (let row=0; row<6; row++) {
            for (let col=0; col<10; col++) {
                let a = (field.at(col, row));
                if (a == "X") {
                    field.set(col, row, 'T');
                }
            }
        }
        results.push(encoder.encode([{field: field}]));
    }
    return results;
}

async function main() {
    const inputStream = fs.createReadStream("./step_h_sorted.txt", 'utf8');

    // Create a readable stream for reading lines
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity
    });

    // Create a writable stream for the output file
    // const outputStream = fs.createWriteStream("step_h.txt");


    let lineCount = 0;
    let all_fumens = [];
    let names = [];
    let scores = [];

    // Process each line asynchronously using for...of loop
    (async () => {
        for await (const line of rl) {
            lineCount++;
            if (lineCount <= 55) {
                console.log(`Line ${lineCount}`);

                split_line = line.trim().split(",");
                let the_score = split_line[0];

                // let pc_chance = split_line[0]; 
                let fumens = split_line.splice(3); // first 3 removed - score, pc chance, greyed fumen
                fumens = color_the_greyed_T(fumens);
                fumens = glue(fumens);

                all_fumens.push(...fumens);

                let name = `T-s-${String(lineCount).padStart(2, '0')}`;

                names.push(...Array(fumens.length).fill(name));

                scores.push(...Array(fumens.length).fill(the_score));

                // let score = await score_field(fumen);
    
                // outputStream.write(`${score},${line}\n`);
                
            }
            
        }

        // Close the writable stream for the output file
        // outputStream.end();
        console.log('Processing completed.');
        let command = `java -jar sfinder.jar cover -K +t -d 180 -p 'T,*!' -t '${all_fumens.join(' ')}' --mode tss`
        console.log(command);
        console.log(names.join(','));
        console.log(scores.join(','));
    })();
    
}

main();