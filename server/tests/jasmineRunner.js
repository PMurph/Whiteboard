
var Jasmine = require('jasmine'),
    reporters = require('jasmine-reporters');
    
var terminalReporter = new reporters.TerminalReporter({
    verbosity: 3,
    color: true,
    consolidateAll: true 
});

var j = new Jasmine();
if (process.argv[2] === "unit") {
    j.loadConfigFile("tests/unit.json");
} else if (process.argv[2] === "integ") {
    j.loadConfigFile("tests/integ.json");
}
j.addReporter(terminalReporter);

j.execute();
