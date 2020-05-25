//
// Authors:
// Adam Stück, Bianca Kevy, Cecilie Hejlesen
// Frederik Stær, Lasse Rasmussen and Tais Hors
//
// Group: DAT2 - C1-14
// Date: 27/05-2020
//

// Search function for the editor page, where each post is listed as a table cell
function searchPostsEditor () {
    let input = document.getElementById("input").value;
    searchBarInput = input.toLowerCase();
    let table = document.getElementById("myTable");
    let tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td");
        let matches = false;

        for (let j = 0; j < 4; j++) {
            if (td[j]) {
                let txtValue = td[j].textContent;
                if (txtValue.toLowerCase().indexOf(searchBarInput) > -1) {
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

// Search function for the public info page, where each post is listed as a list item
let blogposts = document.getElementsByName('list');

function searchPostsPublic () {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();

    for (i = 0; i < blogposts.length; i++) {
        if (!blogposts[i].title.toLowerCase().includes(input)) {
            blogposts[i].style.display = "none";
        }
        else {
            blogposts[i].style.display = "list-item";
        }
    }
}
