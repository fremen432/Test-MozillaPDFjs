#!/usr/bin/env node

import { readPdfText } from "pdf-text-reader";
import fs from "fs";
import { transformReport } from "./extract-peak-counts.js";
// import { PATTERNS } from "./extract-peak-counts.js";
import {
    PATTERNS,
    NORTH_SOUTH,
    SOUTH_NORTH,
    EAST_WEST,
    WEST_EAST,
} from "./constants.js";

const PDF_1_PAGE = "./PDFs/US90_Tube-Counts_1page.pdf";
const PDF_2_PAGE = "./PDFs/US90_Tube-Counts_2page.pdf";
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

function dumpToTXT(content, TXT_PATH) {
    // return console.log(content);
    fs.writeFile(TXT_PATH, content, (error) => error && console.log(error));
}

async function makeDir(path) {
    return;
    if (!fs.existsSync(path)) {
        return await fs.promises
            .mkdir(path, { recursive: true })
            .catch(console.error);
    } else {
        return console.log(`A directory already exists at path: ${path}`);
    }
}

function JSONToCSV(JSON) {
    var json = JSON.items;
    var fields = Object.keys(json[0]);
    var replacer = function (key, value) {
        return value === null ? "" : value;
    };
    var csv = json.map(function (row) {
        return fields
            .map(function (fieldName) {
                return JSON.stringify(row[fieldName], replacer);
            })
            .join(",");
    });
    csv.unshift(fields.join(",")); // add header column
    csv = csv.join("\r\n");
    console.log(csv);
}

export async function PDF_to_TXT(PATH_from, PATH_to) {
    // return makeDir(PATH_to);
    makeDir(PATH_to).then(
        readPDF(PATH_from).then((pages) => {
            pages.forEach((page, i) => {
                const text = page.lines.join("\n");
                const pageNumber = addLeadingZeros(i + 1, 3);

                // const fullPath = `${PATH_to}/Page_${pageNumber}.txt`;
                const fullPath = `${PATH_to}/Page_${pageNumber}.json`;
                // return console.log(text);
                const txtContent = transformReport(text);
                // const txtContent = JSON.stringify(transformReport(text));
                return console.log(txtContent);
                // dumpToTXT(txtContent, fullPath);
            });
        })
    );
}
// PDF_to_TXT(PDF_1_PAGE, PATH_TO_DESTINATION_TXT);
PDF_to_TXT(PDF_2_PAGE, PATH_TO_DESTINATION_TXT);
// PDF_to_TXT(PDF_FULL, PATH_TO_DESTINATION_TXT);

// printHi();
