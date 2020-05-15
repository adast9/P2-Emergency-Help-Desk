/* This file contains isolated functions taken from javascript files
 * throughout the project folder with the intention of testing them.
 *
 * The type of tests of the functions are listed as follow:
 * Unit testing: 1 - ???
 * Integration testing: ??? - ???
 * End to end testing: ??? - ???
 *
*/

/* 1 - Test of the convert function */
const convert = (date) => {
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    // hours  = ("0" + date.getHours()).slice(-2);
    // minutes = ("0" + date.getMinutes()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
};


/* 2 - Test to see if Mongoose connects to MongoDB */

// function connectDatabase() {
//     let mongodbURL = 'mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority';
//
//     mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(response => {
//             console.log("MongoDB Connected Successfully.");
//         }).catch(err => {
//             console.log("Database connection failed.");
//     });
// }
// module.exports = connectDatabase;



/* ??? - Test of the sortTable function */    /*skal nok være en end to end test*/
const sortTable = (tableID, colIndex, sortByID) => {
    let sorting = true;
    let rows, i, caseId1, caseId2, x, y, shouldSwap, direction;
    let switchcount = 0;
    let table = document.getElementById(tableID);
    direction = 'asc';

    while (sorting) {
        sorting = false;
        rows = table.rows;

        if (sortByID) {
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwap = false;
                caseId1 = rows[i].getElementsByTagName("TD")[colIndex];
                caseId2 = rows[i + 1].getElementsByTagName("TD")[colIndex];
                if (direction == 'asc') {
                    if (Number(caseId1.innerText) > Number(caseId2.innerText)) {
                        shouldSwap = true;
                        break;
                    }
                } else if (direction == 'desc') {
                    if (Number(caseId1.innerText) < Number(caseId2.innerText)) {
                        shouldSwap = true;
                        break;
                    }
                }
            }
        } else {
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwap = false;
                x = rows[i].getElementsByTagName("TD")[colIndex];
                y = rows[i + 1].getElementsByTagName("TD")[colIndex];
                if (direction == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwap = true;
                        break;
                    }
                } else if (direction == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwap = true;
                        break;
                    }
                }
            }
        }

        if (shouldSwap) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            sorting = true;
            switchcount++;
        } else {
            if (switchcount == 0 && direction == 'asc') {
                direction = 'desc';
                sorting = true;
            }
        }
    }
};

exports.sortTable = sortTable;
exports.convert = convert;
