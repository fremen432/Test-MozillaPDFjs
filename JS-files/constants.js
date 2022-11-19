export const NORTH_SOUTH = "NORTH-SOUTH";
export const SOUTH_NORTH = "SOUTH-NORTH";
export const EAST_WEST = "EAST-WEST";
export const WEST_EAST = "WEST-EAST";

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
