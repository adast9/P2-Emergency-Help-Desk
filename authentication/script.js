let people = [
  {
    username: "Bobby",
    password: "123"
  },
  {
    username: "John",
    password: "321"
  }
]

function authenticate(form) {
  let username = form.username.value;
  let password = form.password.value;

  for(i = 0; i < people.length; i++) {

    if (username == people[i].username && password == people[i].password){
      window.open("../emd.html","_self");
      return;
    }
  }
  alert("Incorrect input!")
}
