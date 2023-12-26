const {make_sys_call} = require('./make_sys_call.js');
const fs = require('fs');
const readline = require('readline');
const {call_sfinder_path} = require('./call_sfinder_path.js');
const {calculate_all_scores, generate_all_permutations, loadPathCSV} = require('./avg_score.js');

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

async function main() {
    const inputStream = fs.createReadStream("./real_g.txt", 'utf8');

    // Create a readable stream for reading lines
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity
    });

    // Create a writable stream for the output file
    const outputStream = fs.createWriteStream("step_h.txt");


    let lineCount = 0;

    // Process each line asynchronously using for...of loop
    (async () => {
        for await (const line of rl) {
            lineCount++;
            if (lineCount >= 0) {
                console.log(`Line ${lineCount}`);

                split_line = line.trim().split(",");
                // let process_pc_chance = await pc_chance_filter(split_line[0]);

                // let pc_chance = split_line[0]; 
                let fumen = split_line[1];

                let score = await score_field(fumen);
    
                outputStream.write(`${score},${line}\n`);
                
            }
            
        }

        // Close the writable stream for the output file
        outputStream.end();
        console.log('Processing completed.');
    })();
    
}

main();