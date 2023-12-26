const { exec } = require("child_process");

async function call_sfinder_path(fumen) {
    return new Promise((resolve, reject) => {

        let command = 'java -jar sfinder.jar path -K +t -d 180 -p *p7 --tetfu ' + fumen + ' --hold avoid -split yes -f csv -k pattern -o output/path.csv -c 6'
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Error: ${error.message}`));
                return;
            }
            if (stderr) {
                reject(new Error(`stderr: ${stderr}`));
                return;
            }
            resolve(stdout);
        });
    });
}

// Example usage:
// let fumen = "v115@/gyhCexhAezhBeGiJeAAPMAyno2AlsCSASY9tC";
// let temp_pieces = 'S'; // Read from the file for what temp pieces
//

// console.log("attempting to find congruents for this board state: " + fumen)
// call_sfinder_setup_congruent(fumen, temp_pieces)

//
// .then(result => console.log(`stdout: ${result}`))
// .catch(error => console.error(error));

module.exports = {call_sfinder_path};