export const NORTH_SOUTH = "NORTH-SOUTH";
export const SOUTH_NORTH = "SOUTH-NORTH";
export const EAST_WEST = "EAST-WEST";
export const WEST_EAST = "WEST-EAST";

export const thisDate = "Date";
export const Day_Number = "Day Number";
export const Project_Number = "Project Number";
export const Counter_Number = "Counter Number";
export const Location = "Location";
export const Direction = "Direction";
export const Time = "Time";
export const AM_PM = "AM or PM";
export const Value_01 = "Value 01";
export const Value_02 = "Value 02";

export const PATTERNS = {
    topOfPage: /Pape-Dawson Engineers,? Inc\. Automatic Traffic Counts/g,
    wholeDoc: /(?<=Pape-Dawson )([\s\S]+?)(?=PM Peak Hour)/g,
    pageTop: /\d/g,
    findCounterNumber: /(?<=Counter No\. : )\d+/g,
    findPeaks: /(\d+:\d{2} )\*( \d+)+/gi,
    findSingleDigitTime: /\n(?=\d:)/gi,
    addLeadingZero: /\n(?=\d:\d\d)/g,
    timeReturn: / (?=\d\d:\d\d)/g,

    getPeaks: /(\d+:\d{2} )\*( \d+)+/gi,
    getCounter: /(?<=Counter No\. : ).+/g,
    getLocation: /.+(?=\nLocation)/g,
    getDate: /./g,
    getProjNo: /(?<=Project No. :).+/g,
    getDayNum: /(?<=%\n).+/g,
    getDate: /(?<=Vehicles per Hour\n).+/g,
};
