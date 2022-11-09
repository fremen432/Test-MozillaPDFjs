// var fs = require("fs");
import fs from "fs";

const PATH_FROM_01 = "./TXT-files/pdf-to-text.txt";
const PATH_FROM_02 = "./TXT-files/pdf-to-text02.txt";

const PATH_FROM_03 = "../TXT-files/pdf-to-text.txt";
const PATH_FROM_04 = "../TXT-files/pdf-to-text02.txt";

const PDF_1_PAGE = "./PDF-files/US90_Tube-Counts_1page.pdf";
const PDF_FULL = "./PDF-files/US90_Tube-Counts_FULL.pdf";

import {
    PATTERNS,
    NORTH_SOUTH,
    SOUTH_NORTH,
    EAST_WEST,
    WEST_EAST,
} from "./constants.js";

/* 
High-Level:

for every report (2-page traffic volume report), return an object like this:

{
    Counter No: 00,
    Road: "EB US 90 off ramp E of IH 410",
    Direction-Bound: (Northbound | Southbound | Eastbound | Westbound)

    Day-1 AM peak: 00,
    Day-2 AM peak: 00,
    2-day average AM peak: 00,

    Day-1 PM peak: 00,
    Day-2 PM peak: 00,
    2-day average PM 

    *Extra*
    Day-1 Date recorded:
    Day-2 Date recorded:
}
Then, once an array is returned containing an object for every report,
Dump all data into a CSV file in ./RESULT/US90-Peak-Traffic-Volume.csv


- read

Step 1:
    Split full text doc into many 2 page reports

Step 2:
    for each report, we need an array returned containing all peak traffic volume values and times. 


if section

*/

const doesFileExist = (path) => fs.existsSync(path);

const textToReports = (text, pattern) => text.match(PATTERNS.wholeDoc);
// separated 1 text file into array of 'reports' (2-day traffic volume data reports)

const readFile = (path) =>
    fs.readFileSync(path, "utf-8", (err, data) =>
        data.catch((err) => console.log(err))
    );

const removeCommas = (txt) => txt.replaceAll(",", "");
// remove commas from numbers. also helps with CSV format

const fixTime = (txt) =>
    // add "0" before all 1:00 type times
    // then separate each time on it's own line
    txt
        .replaceAll(PATTERNS.addLeadingZero, "\n0")
        .replaceAll(PATTERNS.timeReturn, "\n");

const getPeaks = (text) => text.match(PATTERNS.getPeaks).sort();
const getCounter = (txt) => txt.match(PATTERNS.getCounter).toString();
const getLocation = (txt) => txt.match(PATTERNS.getLocation).toString();
const getProjNo = (txt) => txt.match(PATTERNS.getProjNo).toString();

function getDirection(report) {
    // return report;

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

export function transformReport(report) {
    // transforms raw text into an object { Direction, Time, Values }

    // return report;
    report = removeCommas(report);
    report = fixTime(report);

    const Project_No = getProjNo(report);
    const Counter_No = getCounter(report);
    const Location = getLocation(report);
    const Direction = getDirection(report);
    const peaks = getPeaks(report);

    // return ProjNo;

    let splitTimeAndValues = (thesePeaks) =>
        thesePeaks.map((el) => {
            let splitted = el.split(" * ");
            let Time = splitted[0];
            let Values = splitted[1].split(" ");
            // if the time values have 4 values, only return the 1st and 3rd value
            if (Values.length == 4) {
                Values = [Number(Values[0]), Number(Values[2])];
            } else {
                Values = [Number(Values[0]), Number(Values[1])];
            }
            return {
                Project_No,
                Counter_No,
                Location,
                Direction,
                Time,
                Value_01: Values[0],
                Value_02: Values[1],
            };
        });

    let AM_peaks = splitTimeAndValues(peaks.slice(0, 4));
    let PM_peaks = splitTimeAndValues(peaks.slice(-4));

    return { AM_peaks, PM_peaks };
}

export function printHi() {
    return console.log("hi");
}
