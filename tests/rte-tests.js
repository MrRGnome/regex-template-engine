if (!Tests)
    var Tests = {};

Tests.results = [];

Tests.RunAll = function()
{
    for (var test in Tests.VariableTests) {
        if (Tests.VariableTests[test].run)
            Tests.VariableTests[test].run();
    }

    for (var test in Tests.TemplateTests) {
        if (Tests.TemplateTests[test].run)
            Tests.TemplateTests[test].run();
    }
    
}

Tests.PrintResults = function () {
    for (var r in Tests.results)
        console.log(Tests.results[r]);
}

