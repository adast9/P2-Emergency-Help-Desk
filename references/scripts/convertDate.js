// Makes dates look better

function convert(date) {
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    // skalrettes
    // hours  = ("0" + date.getHours()).slice(-2);
    // minutes = ("0" + date.getMinutes()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

let table = document.getElementById("myTable");
let tr = table.getElementsByTagName("tr");
for (let i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[3];
    if(td) {
        date = new Date(td.textContent);
        date = convert(date);
        tr[i].getElementsByTagName("td")[3].textContent = date;
    }
}
