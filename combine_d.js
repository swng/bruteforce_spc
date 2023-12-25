const fs = require('fs');
const readline = require('readline');

const fileList = [
    '1.txt', '2.txt', '3.txt', '4.txt', '5.txt', '6.txt', '7z.txt', '7zz.txt', '7.txt', '7b.txt', '7c.txt', '7d.txt', '8.txt', '9.txt', '10.txt', '11.txt', '12.txt'
]
const uniqueLines = new Set();

async function readAndFilterFile(filename) {
  const fileStream = fs.createReadStream(`step_d_files/${filename}`);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    uniqueLines.add(line);
  }
}

async function searchInFile(lineToSearch, filename) {
    let split_line = lineToSearch.trim().split(",");

    const fileStream = fs.createReadStream(filename);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let lineNumber = 0;

    for await (const line of rl) {
        split_line_b = line.trim().split(",");
        lineNumber++;

        if (split_line[1] === split_line_b[0] && split_line[2] === split_line_b[1]) {
            console.log(lineNumber);
        // console.log(`Line '${lineToSearch}' found in '${filename}' at line number ${lineNumber}`);
        }
    }
}

async function processFiles() {
  for (const filename of fileList) {
    await readAndFilterFile(filename);
  }

  const uniqueLinesArray = Array.from(uniqueLines);

  for (const line of uniqueLinesArray) {
    console.log(line);
    // await searchInFile(line, 'step_c_2.txt');
  }
}

processFiles();
