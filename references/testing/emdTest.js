console.log("Running EMD tests...");

let caseObj = {id: 1, pos: {lat: 50, lng: 55}, timeClock: "12:45", available: true};

function testAddCase(data) {
    console.log("Testing addCase with input: ");
    console.log(data);
    let warningCounter = 0;

    addCase(data);

    let row = caseList.rows[caseList.rows.length - 1];

    if (row.id != data.id) {
        console.log("Warning: Mismatching case ID.");
        warningCounter++;
    }

    if (JSON.stringify(row.marker.position) != JSON.stringify(data.pos)) {
        console.log("Warning: Mismatching marker position.");
        warningCounter++;
    }

    if (row.cells[2].innerText != data.timeClock) {
        console.log("Warning: Mismatching case time.");
        console.log(row.cells[2].innerText);
        warningCounter++;
    }

    if((data.available && row.cells[1].innerText != "Open") || (!data.available && row.cells[1].innerText != "Locked")) {
        console.log("Warning: Mismatching case status.");
        console.log(row.cells[1].innerText);
        warningCounter++;
    }

    caseList.deleteRow(-1);
    console.log("Testing of addCase completed with " + warningCounter + " issues.");
}

testAddCase(caseObj);
