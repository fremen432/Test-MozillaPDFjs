import { readPdfText } from "pdf-text-reader";
import fs from "fs";

import {
    PATTERNS,
    NORTH_SOUTH,
    SOUTH_NORTH,
    EAST_WEST,
    WEST_EAST,
} from "./constants.js";

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

export function removeCommas(txt) {
    // remove commas from numbers. also helps with CSV format
    return txt.replaceAll(",", "");
}

export function fixTime(txt) {
    // add "0" before all 1:00 type times
    // then separate each time on it's own line
    return txt
        .replaceAll(PATTERNS.addLeadingZero, "\n0")
        .replaceAll(PATTERNS.timeReturn, "\n");
}

export function getDirection(report) {
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
    const DayNum = report.match(PATTERNS.getDayNum).toString();
    const Date = report.match(PATTERNS.getDate).toString();

    // return report;
    // return DayNum;

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
            const AM_PM = Time.split(":")[0] < 12 ? "AM" : "PM";
            // return { Time, AM_PM };
            return {
                Date,
                DayNum,
                Project_No,
                Counter_No,
                Location,
                Direction,
                Time,
                AM_PM,
                Value_01: Values[0],
                Value_02: Values[1],
            };
        });

    return splitTimeAndValues(Peaks);
    return Peaks.slice(0, 4);
    const AM_peaks = splitTimeAndValues(Peaks.slice(0, 4));
    const PM_peaks = splitTimeAndValues(Peaks.slice(-4));

    return { AM_peaks, PM_peaks };
}
