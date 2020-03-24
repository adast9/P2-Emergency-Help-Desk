function authenticate(form) {
  if(form.username.value=="Bobby" || form.username.value=="bobby" && form.password.value=="123")
  {
    window.open("../emd.html","_self")
  }
  else
  {
    alert("Incorrect input.")
  }
}
