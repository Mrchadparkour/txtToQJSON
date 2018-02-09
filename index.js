var readline = require('readline');
var jsonfile = require('jsonfile');
var fs = require('fs');
var file = process.argv[2];

var rl = readline.createInterface({
  input: fs.createReadStream(file)
});

function qObj() {
  this.q = "",
    this.a1 = "",
    this.a2 = "",
    this.a3 = "",
    this.a4 = "",
    this.a5 = "",
    this.c = ""
}

function autoDropLoc(obj) {
  var openKeys = Object.keys(obj).filter(function(key) {
    return obj[key] === "" && key[0] === "a" ;
  });

  return openKeys[Math.floor(Math.random() * openKeys.length)];
}

var nextIsQ = true;
var nextIsA = false;
var obj = new qObj();
var count = 0;
var questionArr = [];

rl.on('line', function(line) {
  var lLine = line !== "";

  if (nextIsQ && lLine) {
    nextIsQ = false;
    nextIsA = true;
    count++;
    obj.q = line;
  } else if (nextIsA && lLine) {
    nextIsA = false;
    if (obj.c === "") {
      console.log(line);
      obj.c = autoDropLoc(obj);
      obj[obj.c] = line;
      count++;
    }
  } else if (!nextIsA && !nextIsQ && !lLine) {
    nextIsQ = true;
    questionArr.push(obj);
    obj = new qObj();
  } else if (lLine) {
    obj[autoDropLoc(obj)] = line;
    count++;
  }
}).on('close', function() {
    var json = { data: questionArr };
    jsonfile.writeFile('data.json', json,  {spaces: 2, EOL: '\r\n'},function(err) {
      if (err) console.error(err);
      else console.log("done");
    });
});
