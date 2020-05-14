/*Makes dates look better */
function convert(date) {
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    // hours  = ("0" + date.getHours()).slice(-2);
    // minutes = ("0" + date.getMinutes()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

table = document.getElementById("myTable");
tr = table.getElementsByTagName("tr");
for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if(td){
        date = new Date(td.textContent);
        date = convert(date);
        tr[i].getElementsByTagName("td")[3].textContent = date;
    }
}