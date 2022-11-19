// var fs = require("fs");
import fs from "fs";

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

function removeCommas(txt) {
    // remove commas from numbers. also helps with CSV format
    return txt.replaceAll(",", "");
}

function fixTime(txt) {
    // add "0" before all 1:00 type times
    // then separate each time on it's own line
    return txt
        .replaceAll(PATTERNS.addLeadingZero, "\n0")
        .replaceAll(PATTERNS.timeReturn, "\n");
}

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

    const Direction = getDirection(report);

    const Peaks = report.match(PATTERNS.getPeaks).sort();
    const Counter_No = report.match(PATTERNS.getCounter).toString();
    const Location = report.match(PATTERNS.getLocation).toString();
    const Project_No = report.match(PATTERNS.getProjNo).toString();

    // return ProjNo;

    const splitTimeAndValues = (thesePeaks) =>
        thesePeaks.map((el) => {
            const splitted = el.split(" * ");
            const Time = splitted[0];
            let Values = splitted[1].split(" ");
            if (Values.length == 4) {
                // if the time values have 4 values, only return the 1st and 3rd value
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

    const AM_peaks = splitTimeAndValues(Peaks.slice(0, 4));
    const PM_peaks = splitTimeAndValues(Peaks.slice(-4));

    return { AM_peaks, PM_peaks };
}
