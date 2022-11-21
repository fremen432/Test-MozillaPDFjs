import { readPdfText } from "pdf-text-reader";
import fs from "fs";

import {
    PATTERNS,
    NORTH_SOUTH,
    SOUTH_NORTH,
    EAST_WEST,
    WEST_EAST,
    thisDate,
    Day_Number,
    Project_Number,
    Counter_Number,
    Location,
    Direction,
    Time,
    AM_PM,
    Value_01,
    Value_02,
} from "./constants.js";
const PATH_TO_CSV = "./CSVs/";
const CSV_Columns = [
    thisDate,
    Day_Number,
    Project_Number,
    Counter_Number,
    Location,
    Direction,
    Time,
    AM_PM,
    Value_01,
    Value_02,
];
const CSV_separator = ",";
const CSV_firstLine = CSV_Columns.join(CSV_separator);
const CSV_filePath = `${PATH_TO_CSV}Report_${Date.now()}.csv`;

export function makeCSV() {
    fs.existsSync(CSV_filePath)
        ? console.log(`File: ${CSV_filePath} already exists`)
        : fs.writeFileSync(CSV_filePath, CSV_firstLine);
}

export function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, "0");
}

export async function readPDF(PDF_PATH) {
    return readPdfText(PDF_PATH).catch((error) => console.log(error));
}

export function JSON_to_CSV(myJSON, path) {
    const fullString = [];
    for (let obj of myJSON) {
        fullString.push(
            "".concat(
                obj.thisDate,
                CSV_separator,
                obj.Day_Number,
                CSV_separator,
                obj.Project_Number,
                CSV_separator,
                obj.Counter_Number,
                CSV_separator,
                obj.Location,
                CSV_separator,
                obj.Direction,
                CSV_separator,
                obj.Time,
                CSV_separator,
                obj.AM_PM,
                CSV_separator,
                obj.Value_01,
                CSV_separator,
                obj.Value_02,
                CSV_separator
            )
        );
        // const arr = [
        //     obj.thisDate,
        //     obj.Day_Number,
        //     obj.Project_Number,
        //     obj.Counter_Number,
        //     obj.Location,
        //     obj.Direction,
        //     obj.Time,
        //     obj.AM_PM,
        //     obj.Value_01,
        //     obj.Value_02,
        // ];
        // fullString.push(arr.join(CSV_separator));
        // fullString.push(arr.join(CSV_separator));
    }
    return fs.appendFileSync(CSV_filePath, "\n".concat(fullString.join("\n")));
}

export function dumpToTXT(content, TXT_PATH) {
    fs.writeFile(TXT_PATH, content, (error) => error && console.log(error));
}

export function removeCommas(txt) {
    // remove commas from numbers. also helps with CSV format
    return txt.replaceAll(",", "");
}

export function fixTime(txt) {
    return (
        txt
            // add "0" before all 1:00 type times
            .replaceAll(PATTERNS.addLeadingZero, "\n0")
            // then separate each time on it's own line
            .replaceAll(PATTERNS.timeReturn, "\n")
    );
}

export function getDirection(report) {
    const N_S = report.match(/Northbound Southbound(?=\n)/g) && NORTH_SOUTH;
    const S_N = report.match(/Southbound Northbound(?=\n)/g) && SOUTH_NORTH;
    const E_W = report.match(/Eastbound Westbound(?=\n)/g) && EAST_WEST;
    const W_E = report.match(/Westbound Eastbound(?=\n)/g) && WEST_EAST;

    return N_S || S_N || E_W || W_E || "None";
}

export function transformReport(report) {
    // transforms raw text into an object { Direction, Time, Values }

    report = removeCommas(report);
    report = fixTime(report);

    const Direction = getDirection(report);

    // const matches = {
    //     Peaks: report.match(PATTERNS.getPeaks),
    //     Counter_No: report.match(PATTERNS.getCounter),
    //     Location: report.match(PATTERNS.getLocation),
    //     Project_No: report.match(PATTERNS.getProjNo),
    //     DayNum: report.match(PATTERNS.getDayNum),
    //     Date: report.match(PATTERNS.getDate),
    // };

    // const Peaks = matches.Peaks ? matches.Peaks : "NO MATCH FOUND FOR: 'Peaks'";
    // const Counter_No = matches.Counter_No
    //     ? matches.Counter_No
    //     : "NO MATCH FOUND FOR: 'Counter_No'";
    // const Location = matches.Location
    //     ? matches.Location
    //     : "NO MATCH FOUND FOR: 'Location'";
    // const Project_No = matches.Project_No
    //     ? matches.Project_No
    //     : "NO MATCH FOUND FOR: 'Project_No'";
    // const DayNum = matches.DayNum
    //     ? matches.DayNum
    //     : "NO MATCH FOUND FOR: 'DayNum'";
    // const Date = matches.Date ? matches.Date : "NO MATCH FOUND FOR: 'Date'";

    const Peaks =
        report.match(PATTERNS.getPeaks) || "NO MATCH FOUND FOR: 'Peaks'";
    const Counter_No =
        report.match(PATTERNS.getCounter) || "NO MATCH FOUND FOR: 'Counter_No'";
    const Location =
        report.match(PATTERNS.getLocation) || "NO MATCH FOUND FOR: 'Location'";
    const Project_No =
        report.match(PATTERNS.getProjNo) || "NO MATCH FOUND FOR: 'Project_No'";
    const DayNum =
        report.match(PATTERNS.getDayNum) || "NO MATCH FOUND FOR: 'DayNum'";
    const Date = report.match(PATTERNS.getDate) || "NO MATCH FOUND FOR: 'Date'";

    const splitTimeAndValues = (thesePeaks) =>
        thesePeaks.map((el) => {
            const splitted = el.split(" * ");
            const Time = splitted[0];
            let Values = splitted[1].split(" ");

            // if the time values have 4 values, only return the 1st and 3rd value
            Values =
                Values.length == 4
                    ? [Number(Values[0]), Number(Values[2])]
                    : [Number(Values[0]), Number(Values[1])];

            // if (Values.length == 4) {
            //     // if the time values have 4 values, only return the 1st and 3rd value
            //     Values = [Number(Values[0]), Number(Values[2])];
            // } else {
            //     Values = [Number(Values[0]), Number(Values[1])];
            // }
            const AM_PM = Time.split(":")[0] < 12 ? "AM" : "PM";
            return {
                thisDate: Date,
                Day_Number: DayNum,
                Project_Number: Project_No,
                Counter_Number: Counter_No,
                Location: Location,
                Direction: Direction,
                Time: Time,
                AM_PM: AM_PM,
                Value_01: Values[0],
                Value_02: Values[1],
            };
        }) || "No peaks found";
    return splitTimeAndValues(Peaks);
    return Peaks.slice(0, 4);
    const AM_peaks = splitTimeAndValues(Peaks.slice(0, 4));
    const PM_peaks = splitTimeAndValues(Peaks.slice(-4));

    return { AM_peaks, PM_peaks };
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
