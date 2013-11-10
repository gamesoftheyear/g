var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

process.argv.slice(2).forEach(function (filename) {
  fs.readFile(filename, 'utf8', function (err, data) {
    var start = data.indexOf('<script>') + 9;
    var end = data.lastIndexOf('</script>');

    var beforeScript = data.substring(0, start);
    var script = data.substring(start, end);
    var afterScript = data.substr(end);

    var linesBefore = beforeScript.split('\n').length;
    var linesAfter = afterScript.split('\n').length;

    var tmpFilename = '/tmp/' + path.basename(filename);

    var tmpOutput = Array(linesBefore).join('\n') + script + Array(linesAfter).join('\n');

    fs.writeFile(tmpFilename, tmpOutput, function (err) {
      exec('./node_modules/jshint/bin/jshint ' + tmpFilename, function (err, stdout, stderr) {
        console.error(stderr);
        console.log(stdout);
        fs.unlink(tmpFilename);
      });
    });
  });
});