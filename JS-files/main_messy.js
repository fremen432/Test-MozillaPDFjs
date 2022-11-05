#!/usr/bin/env node

import { readPdfText } from "pdf-text-reader";
import fs from "fs";
import readline from "readline";
// import { readline } from "readline";
// import Readline

// const PDF_1_PAGE = "./PDFs/US90_Tube-Counts_1page.pdf";
// const PDF_FULL = "./PDFs/US90_Tube-Counts_FULL.pdf";
// const PATH_TO_DESTINATION_TXT = `./TXT-files/RESULT${Date.now()}/`;

// const PDF_FULL = "FULL";
// const PATH_TO_DESTINATION_TXT = "TXT";

// let PDF_PATH = process.argv[2];
// let TEXT_FOLDER_PATH = process.argv[3];

let PDF_PATH = "";
let TEXT_FOLDER_PATH = "";

const Q_01 = "Please paste path to PDF : ";
const Q_02 = "Please paste destination path : ";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function checkPaths(pdf_path, folder_path) {
    const stats = fs.stat(pdf_path);

    console.log(stats.isDirectory());

    return stats.isDirectory();
    fs.lstatSync(pdf_path).isDirectory();
    // let check_pdf = fs.lstatSync(pdf_path).isDirectory();
    // let check_dir = fs.lstatSync(folder_path).isDirectory();

    // console.log(check_pdf);
}

const promptUser = () => {
    rl.question(Q_01, (PDF_PATH) => {
        rl.question(Q_02, async (TEXT_FOLDER_PATH) => {
            await checkPaths(PDF_PATH, TEXT_FOLDER_PATH);
            // console.log(
            //     `\n\nPDF_PATH : ${PDF_PATH}\nTEXT_FOLDER_PATH : ${TEXT_FOLDER_PATH}`
            // );
            rl.close();
        });
    });
    rl.on("close", () => {
        console.log("\nbye");
        process.exit(0);
    });
};

const listArgs = () =>
    console.log(
        `PDF_PATH : \n\t${PDF_PATH}\n\nTEXT_FOLDER_PATH : \n\t${TEXT_FOLDER_PATH}`
    );

const readPDF = async (PDF_PATH) => {
    try {
        return await readPdfText(PDF_PATH);
    } catch (error) {
        console.log(error);
    }
};

const addLeadingZeros = (num, totalLength) =>
    String(num).padStart(totalLength, "0");

function dumpToTXT(arr, TXT_PATH) {
    // combine array of single-lines and separate them with a "\n" new line
    let content = arr.lines.join("\n");

    fs.writeFile(TXT_PATH, content, (error) => {
        if (error) {
            console.log(error);
        }
    });
}

const makeDir = async (path) =>
    await fs.promises.mkdir(path, { recursive: true }).catch(console.error);

export async function PDF_to_TXT(PATH_from, PATH_to) {
    // return listArgs();
    makeDir(PATH_to).then(
        readPDF(PATH_from).then((pages) => {
            pages.forEach((page, i) => {
                let pageNumber = addLeadingZeros(i + 1, 3);
                let fullPath = `${PATH_to}/Page_${pageNumber}.txt`;
                dumpToTXT(page, fullPath);
            });
        })
    );
}

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

// PDF_to_TXT(PDF_1_PAGE, PATH_TO_DESTINATION_TXT);
// PDF_to_TXT(PDF_PATH, TEXT_FOLDER_PATH);
promptUser();
