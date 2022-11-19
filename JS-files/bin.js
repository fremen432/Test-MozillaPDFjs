import fs from "fs";

// async function run(PDF_PATH) {
//     try {
//         return await readPdfText(PDF_PATH);
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function PDF_to_TXT(PATH_from, PATH_to) {
//     readPDF(PATH_from)
//         .catch((error) => console.log(error))
//         .then((pages) => {
//             fs.promises
//                 .mkdir(PATH_to, { recursive: true })
//                 .catch(console.error);
//             return pages;
//         })
//         .then((pages) => {
//             pages.forEach((page, i) => {
//                 let pageNumber = addLeadingZeros(i + 1, 3);
//                 let fullPath = `${PATH_to}/Page_${pageNumber}.txt`;
//                 dumpToTXT(page, fullPath);
//             });
//         });
// }

function doesFileExist(path) {
    return fs.existsSync(path);
}

function textToReports(text, pattern) {
    // separated 1 text file into array of 'reports' (2-day traffic volume data reports)
    return text.match(PATTERNS.wholeDoc);
}

function readFile(path) {
    return fs.readFileSync(path, "utf-8", (err, data) =>
        data.catch((err) => console.log(err))
    );
}
