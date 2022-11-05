// async function run(PDF_PATH) {
//     try {
//         return await readPdfText(PDF_PATH);
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function PDF_to_TXT(PATH_from, PATH_to) {
//     readPDF(PATH_from)
//         .catch((error) => console.log(error))
//         .then((pages) => {
//             fs.promises
//                 .mkdir(PATH_to, { recursive: true })
//                 .catch(console.error);
//             return pages;
//         })
//         .then((pages) => {
//             pages.forEach((page, i) => {
//                 let pageNumber = addLeadingZeros(i + 1, 3);
//                 let fullPath = `${PATH_to}/Page_${pageNumber}.txt`;
//                 dumpToTXT(page, fullPath);
//             });
//         });
// }
