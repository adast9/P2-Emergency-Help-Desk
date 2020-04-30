function search_posts() {
    let input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        let matches = false;

        for (j = 0; j < 3; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    matches = true;
                }
            }
        }

        if(matches === true) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
