
var Jasmine = require('jasmine'),
    reporters = require('jasmine-reporters');
    
var terminalReporter = new reporters.TerminalReporter({
    verbosity: 3,
    color: true,
    consolidateAll: true 
});

var j = new Jasmine();
if (process.argv.indexOf("unit") > -1 ) {
    j.loadConfigFile("tests/unit.json");
}
if (process.argv.indexOf("integ") > -1 ) {
    j.loadConfigFile("tests/integ.json");
}
j.addReporter(terminalReporter);

j.execute();
