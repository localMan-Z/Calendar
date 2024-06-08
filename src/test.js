const dateRegex = new RegExp(/[/][0-9]{1,2}/, "g");
console.log("12/12".match(dateRegex)[0].substring(1));
