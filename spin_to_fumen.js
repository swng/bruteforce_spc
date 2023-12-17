const fs = require("fs");
const htmlparser = require("htmlparser2");

const outputFile = "output.txt";

// Create a writable stream to a text file
const writeStream = fs.createWriteStream(outputFile);

let isHeader = false; // Flag to indicate whether currently inside a header tag
let lastHeader = "";

// Create a new HTML parser
const parser = new htmlparser.Parser(
    {
        onopentag(name, attribs) {
            if (["Single [Regular]", "Single [ISO]"].includes(lastHeader)
                && name === "a" && attribs.href) {
                let fumen = attribs.href;
                if (fumen.includes("v115@")) {
                    fumen = fumen.substring(21);
                    // Write the href to the text file
                    writeStream.write(`${fumen}\n`);
                } 
            } else if (name.match(/^h[1-6]$/i)) {
                // Set the flag to indicate that we are inside a header tag
                isHeader = true;
              }
        },
        ontext(text) {
            if (isHeader) {
              // Write the header text content to the text file
              lastHeader = text;
            }
          },
          onclosetag(tagname) {
            if (tagname.match(/^h[1-6]$/i)) {
              // Reset the flag when closing a header tag
              isHeader = false;
            }
          },
    },
    { decodeEntities: true }
);

for(let i = 1; i < 35; i++) {
    // Read the HTML file and feed it to the parser
    let inputFile = `spin_files/t_spc_spin_${i}.html`;
    const htmlContent = fs.readFileSync(inputFile, "utf-8");
    parser.write(htmlContent);
}


parser.end();
writeStream.end();