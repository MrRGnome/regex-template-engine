if (!Tests)
    var Tests = {};

Tests.results = [];

Tests.RunAll = function()
{
    var to = 3000;
    var i = 0;
    
    console.log("//////START TESTS//////");

    for (var test in Tests.VariableTests) {
        if (Tests.VariableTests[test].run) {
            var runFunc = function () { console.log("Running test: " + this.test + " " + Tests.VariableTests[this.test].template); Tests.VariableTests[this.test].run(); }
            runFunc = runFunc.bind({test: test});
            setTimeout(runFunc, to * i);
            i++;
        }
    }

    for (var test in Tests.TemplateTests) {
        if (Tests.TemplateTests[test].run) {
            var runFunc = function () { console.log("Running test: " + this.test + " " + Tests.TemplateTests[this.test].template); Tests.TemplateTests[this.test].run(); }
            runFunc = runFunc.bind({ test: test });
            setTimeout(runFunc, to * i);
            i++;
        }
    }

    setTimeout(function () { console.log("//////END TESTS//////"); }, to * i)
    
}

Tests.PrintResults = function () {
    for (var r in Tests.results)
        console.log(Tests.results[r]);
}

