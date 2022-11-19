#!/usr/bin/env node

import { transformReport } from "./extract-peak-counts.js";
import { addLeadingZeros, readPDF, makeDir } from "./helperFunctions.js";
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

export async function PDF_to_TXT(PATH_from, PATH_to) {
    makeDir(PATH_to).then(
        readPDF(PATH_from)
            .catch((error) => console.log(error))
            .then((pages) => {
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
