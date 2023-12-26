const fs = require('fs');

const inputFile = 'step_h.txt';
const outputFile = 'step_h_sorted.txt';

// Read the content of the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file ${inputFile}: ${err.message}`);
    return;
  }

  // Split the content into lines
  const lines = data.trim().split('\n');

  // Parse each line into an array of values
  const parsedLines = lines.map(line => line.split(','));

  // Sort the parsed lines based on the 0th value in descending order
  parsedLines.sort((a, b) => b[0] - a[0]);

  // Convert the sorted lines back to a string
  const sortedContent = parsedLines.map(line => line.join(',')).join('\n');

  // Write the sorted content to the output file
  fs.writeFile(outputFile, sortedContent, 'utf8', err => {
    if (err) {
      console.error(`Error writing file ${outputFile}: ${err.message}`);
    } else {
      console.log(`Successfully sorted and saved to ${outputFile}`);
    }
  });
});
