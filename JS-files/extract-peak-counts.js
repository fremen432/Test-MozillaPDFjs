import fs from "fs";

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
