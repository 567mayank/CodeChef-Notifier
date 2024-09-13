const submit = document.querySelector(".submit")
function fun(){
  console.log("id caught");
}
if (submit) {
  submit.addEventListener('click', fun);
}

// https://www.codechef.com/api/ide/submit?solution_id=1089386436

// {
//   "upid": "1089385639",
//   "result_code": "wait",
//   "result_description": "",
//   "signal": null,
//   "show_status_table": "yes",
//   "error_link": null,
//   "time": "0.00",
//   "score": null
// }