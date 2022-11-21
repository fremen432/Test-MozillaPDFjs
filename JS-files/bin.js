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

// export async function readPDF(PDF_PATH) {
//     try {
//         return await readPdfText(PDF_PATH);
//     } catch (error) {
//         console.log(error);
//     }
// }

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

export function getDirection_OLD(report) {
    const N_S = report.match(/Northbound Southbound(?=\n)/g);
    const S_N = report.match(/Southbound Northbound(?=\n)/g);
    const E_W = report.match(/Eastbound Westbound(?=\n)/g);
    const W_E = report.match(/Westbound Eastbound(?=\n)/g);

    const thisDirection =
        N_S != null
            ? NORTH_SOUTH
            : S_N != null
            ? SOUTH_NORTH
            : E_W != null
            ? EAST_WEST
            : W_E != null
            ? WEST_EAST
            : "None";
    return thisDirection;
}
