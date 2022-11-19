import { readPdfText } from "pdf-text-reader";
import fs from "fs";

export function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, "0");
}

export async function readPDF(PDF_PATH) {
    try {
        return await readPdfText(PDF_PATH);
    } catch (error) {
        console.log(error);
    }
}

// function JSONToCSV(JSON) {
//     var json = JSON.items;
//     var fields = Object.keys(json[0]);
//     var replacer = function (key, value) {
//         return value === null ? "" : value;
//     };
//     var csv = json.map(function (row) {
//         return fields
//             .map(function (fieldName) {
//                 return JSON.stringify(row[fieldName], replacer);
//             })
//             .join(",");
//     });
//     csv.unshift(fields.join(",")); // add header column
//     csv = csv.join("\r\n");
//     console.log(csv);
// }

export function JSONToCSV(myJSON) {
    // myJSON.
}

export async function makeDir(path) {
    return;
    if (!fs.existsSync(path)) {
        return await fs.promises
            .mkdir(path, { recursive: true })
            .catch(console.error);
    } else {
        return console.log(`A directory already exists at path: ${path}`);
    }
}

export function dumpToTXT(content, TXT_PATH) {
    // return console.log(content);
    fs.writeFile(TXT_PATH, content, (error) => error && console.log(error));
}
