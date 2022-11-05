#!/usr/bin/env node

import { readPdfText } from "pdf-text-reader";
import fs from "fs";

const PDF_1_PAGE = "./PDFs/US90_Tube-Counts_1page.pdf";
const PDF_FULL = "./PDFs/US90_Tube-Counts_FULL.pdf";
const PATH_TO_DESTINATION_TXT = `./TXT-files/RESULT${Date.now()}/`;

async function readPDF(PDF_PATH) {
    try {
        return await readPdfText(PDF_PATH);
    } catch (error) {
        console.log(error);
    }
}

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, "0");
}

function dumpToTXT(arr, TXT_PATH) {
    // combine array of single-lines and separate them with a "\n" new line
    let content = arr.lines.join("\n");

    fs.writeFile(TXT_PATH, content, (error) => error && console.log(error));
}

async function makeDir(path) {
    return await fs.promises
        .mkdir(path, { recursive: true })
        .catch(console.error);
}

export async function PDF_to_TXT(PATH_from, PATH_to) {
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

// PDF_to_TXT(PDF_1_PAGE, PATH_TO_DESTINATION_TXT);
PDF_to_TXT(PDF_FULL, PATH_TO_DESTINATION_TXT);
