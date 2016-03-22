var Tests = {};
var globalScopeVar = "Variable in the global scope";
var scope = {};
scope.long = {};
scope.long.very = {};
scope.long.very.scopedVar = "Scoped Variable";
scope.long.very.id = 10;
scope.long.very.twobind = "unbound";
scope.long.very.checked = false;
scope.long.very.date = Date.now();
scope.long.very.boundVar = "unbound";
scope.long.very.unboundVar = "unbound";
Tests.results = [];

//String repeater for load tests
Tests.Utilities = {};
Tests.Utilities.Repeat = function (pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}

Tests.Utilities.MakeArray = function (count) {
    if (count < 1) return [];
    var result = [];
    while (count >= 1) {
        result.push(String(count));
        count--;
    }
    return result;
}

var testArr = Tests.Utilities.MakeArray(10);


//define tests

//variable - global scope
Tests.GlobalScopeVar = {};
Tests.GlobalScopeVar.template = "{{globalScopeVar}}";
Tests.GlobalScopeVar.expectedResult = globalScopeVar;
Tests.GlobalScopeVar.result = "";
Tests.GlobalScopeVar.success = false;
Tests.GlobalScopeVar.processingTime = 0;
Tests.GlobalScopeVar.run = function () {
    var startTime = Date.now();
    Tests.GlobalScopeVar.result = TemplateEngine.ParseAndReplace(Tests.GlobalScopeVar.template);
    Tests.GlobalScopeVar.success = Tests.GlobalScopeVar.expectedResult == Tests.GlobalScopeVar.result;
    Tests.GlobalScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.GlobalScopeVar.template + " : " + Tests.GlobalScopeVar.success + " : " + Tests.GlobalScopeVar.processingTime);
};

//variable - scoped
Tests.DeepScopeVar = {};
Tests.DeepScopeVar.template = "{{scope.long.very.scopedVar}}";
Tests.DeepScopeVar.expectedResult = scope.long.very.scopedVar;
Tests.DeepScopeVar.result = "";
Tests.DeepScopeVar.success = false;
Tests.DeepScopeVar.processingTime = 0;
Tests.DeepScopeVar.run = function () {
    var startTime = Date.now();
    Tests.DeepScopeVar.result = TemplateEngine.ParseAndReplace(Tests.DeepScopeVar.template);
    Tests.DeepScopeVar.success = Tests.DeepScopeVar.expectedResult == Tests.DeepScopeVar.result;
    Tests.DeepScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.DeepScopeVar.template + " : " + Tests.DeepScopeVar.success + " : " + Tests.DeepScopeVar.processingTime);
};

//variable - json
Tests.JsonScopeVar = {};
Tests.JsonScopeVar.template = "{{scope.long.very.json}}";
Tests.JsonScopeVar.expectedResult = JSON.stringify(scope.long.very);
Tests.JsonScopeVar.result = "";
Tests.JsonScopeVar.success = false;
Tests.JsonScopeVar.processingTime = 0;
Tests.JsonScopeVar.run = function () {
    var startTime = Date.now();
    Tests.JsonScopeVar.result = TemplateEngine.ParseAndReplace(Tests.JsonScopeVar.template);
    Tests.JsonScopeVar.success = Tests.JsonScopeVar.expectedResult == Tests.JsonScopeVar.result;
    Tests.JsonScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.JsonScopeVar.template + " : " + Tests.JsonScopeVar.success + " : " + Tests.JsonScopeVar.processingTime);
};

//variable - todate
Tests.DateScopeVar = {};
Tests.DateScopeVar.template = "{{scope.long.very.date.todate}}";
Tests.DateScopeVar.expectedResult = new Date(parseInt(scope.long.very.date)).toISOString().substr(0, 10);
Tests.DateScopeVar.result = "";
Tests.DateScopeVar.success = false;
Tests.DateScopeVar.processingTime = 0;
Tests.DateScopeVar.run = function () {
    var startTime = Date.now();
    Tests.DateScopeVar.result = TemplateEngine.ParseAndReplace(Tests.DateScopeVar.template);
    Tests.DateScopeVar.success = Tests.DateScopeVar.expectedResult == Tests.DateScopeVar.result;
    Tests.DateScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.DateScopeVar.template + " : " + Tests.DateScopeVar.success + " : " + Tests.DateScopeVar.processingTime);
};

//variable - todate.local
Tests.LocalScopeVar = {};
Tests.LocalScopeVar.template = "{{scope.long.very.date.todate.local}}";
Tests.LocalScopeVar.expectedResult = new Date(parseInt(scope.long.very.date)).toLocaleString();
Tests.LocalScopeVar.result = "";
Tests.LocalScopeVar.success = false;
Tests.LocalScopeVar.processingTime = 0;
Tests.LocalScopeVar.run = function () {
    var startTime = Date.now();
    Tests.LocalScopeVar.result = TemplateEngine.ParseAndReplace(Tests.LocalScopeVar.template);
    Tests.LocalScopeVar.success = Tests.LocalScopeVar.expectedResult == Tests.LocalScopeVar.result;
    Tests.LocalScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.LocalScopeVar.template + " : " + Tests.LocalScopeVar.success + " : " + Tests.LocalScopeVar.processingTime);
};

//variable - bind
Tests.BindVar = {};
Tests.BindVar.template = "{{scope.long.very.boundVar.bind}}";
Tests.BindVar.expectedResult = "bound";
Tests.BindVar.result = "";
Tests.BindVar.success = false;
Tests.BindVar.processingTime = 0;
Tests.BindVar.run = function () {
    TemplateEngine.settings.BINDING = false;
    var startTime = Date.now();

    var callback = function () {
        Tests.BindVar.processingTime = Date.now() - this.startTime;
        

        setTimeout(function () {
            scope.long.very._boundVar = "bound";
            Tests.BindVar.result = document.getElementsByClassName("binding_hook_scope.long.very.boundVar.bind")[0].innerHTML;
            Tests.BindVar.success = Tests.BindVar.expectedResult == Tests.BindVar.result;
            Tests.results.push(Tests.BindVar.template + " : " + Tests.BindVar.success + " : " + Tests.BindVar.processingTime);
        }, 100);
    }
    callback = callback.bind({ "startTime": startTime });

    $(document.getElementsByTagName("body")[0]).append("<div style='display: none'>" + TemplateEngine.ParseAndReplace(Tests.BindVar.template, null, null, null, callback) + "</div>");
};


//variable - unbind
Tests.UnBindVar = {};
Tests.UnBindVar.template = "{{scope.long.very.unboundVar.unbind}}";
Tests.UnBindVar.expectedResult = "unbound";
Tests.UnBindVar.result = "";
Tests.UnBindVar.success = false;
Tests.UnBindVar.processingTime = 0;
Tests.UnBindVar.run = function () {
    TemplateEngine.settings.BINDING = true;
    var startTime = Date.now();

    var callback = function () {
        Tests.UnBindVar.processingTime = Date.now() - this.startTime;
        TemplateEngine.settings.BINDING = false;
        setTimeout(function () {
            scope.long.very._unboundVar = "bound";
            Tests.UnBindVar.result = document.getElementById("unboundTest").innerHTML;
            Tests.UnBindVar.success = Tests.UnBindVar.expectedResult == Tests.UnBindVar.result;
            Tests.results.push(Tests.UnBindVar.template + " : " + Tests.UnBindVar.success + " : " + Tests.UnBindVar.processingTime);
        }, 100);
    }
    callback = callback.bind({ "startTime": startTime });

    $(document.getElementsByTagName("body")[0]).append("<div style='display: none' id='unboundTest'>" + TemplateEngine.ParseAndReplace(Tests.UnBindVar.template, null, null, null, callback) + "</div>");
};

//variable - replace-whitespace._
Tests.ReplaceScopeVar = {};
Tests.ReplaceScopeVar.template = "{{scope.long.very.scopedVar.replace-whitespace._}}";
Tests.ReplaceScopeVar.expectedResult = scope.long.very.scopedVar.replace(/ /g, "_");
Tests.ReplaceScopeVar.result = "";
Tests.ReplaceScopeVar.success = false;
Tests.ReplaceScopeVar.processingTime = 0;
Tests.ReplaceScopeVar.run = function () {
    var startTime = Date.now();
    Tests.ReplaceScopeVar.result = TemplateEngine.ParseAndReplace(Tests.ReplaceScopeVar.template);
    Tests.ReplaceScopeVar.success = Tests.ReplaceScopeVar.expectedResult == Tests.ReplaceScopeVar.result;
    Tests.ReplaceScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.ReplaceScopeVar.template + " : " + Tests.ReplaceScopeVar.success + " : " + Tests.ReplaceScopeVar.processingTime);
};

//variable - this
Tests.ThisScopeVar = {};
Tests.ThisScopeVar.template = "{{this.val}}";
Tests.ThisScopeVar.expectedResult = "hello";
Tests.ThisScopeVar.result = "";
Tests.ThisScopeVar.success = false;
Tests.ThisScopeVar.processingTime = 0;
Tests.ThisScopeVar.run = function () {
    var startTime = Date.now();
    Tests.ThisScopeVar.result = TemplateEngine.ParseAndReplace(Tests.ThisScopeVar.template, null, { "val": "hello" });
    Tests.ThisScopeVar.success = Tests.ThisScopeVar.expectedResult == Tests.ThisScopeVar.result;
    Tests.ThisScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.ThisScopeVar.template + " : " + Tests.ThisScopeVar.success + " : " + Tests.ThisScopeVar.processingTime);
};

//variable - replacementMatrix
Tests.ReplacementMatrix = {};
Tests.ReplacementMatrix.template = "testing is the worst";
Tests.ReplacementMatrix.replaceMatrix = { "testing is the worst": "testing is great" };
Tests.ReplacementMatrix.expectedResult = "testing is great";
Tests.ReplacementMatrix.result = "";
Tests.ReplacementMatrix.success = false;
Tests.ReplacementMatrix.processingTime = 0;
Tests.ReplacementMatrix.run = function () {
    var startTime = Date.now();
    Tests.ReplacementMatrix.result = TemplateEngine.ParseAndReplace(Tests.ReplacementMatrix.template, Tests.ReplacementMatrix.replaceMatrix);
    Tests.ReplacementMatrix.success = Tests.ReplacementMatrix.expectedResult == Tests.ReplacementMatrix.result;
    Tests.ReplacementMatrix.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.ReplacementMatrix.template + " : " + Tests.ReplacementMatrix.success + " : " + Tests.ReplacementMatrix.processingTime);
};

//loadtemplate
Tests.LoadTemplate = {};
Tests.LoadTemplate.template = "{{loadtemplate test-template.html at loadtemplateTest}}";
Tests.LoadTemplate.expectedResult = "Template Loaded " + globalScopeVar;
Tests.LoadTemplate.result = "";
Tests.LoadTemplate.success = false;
Tests.LoadTemplate.processingTime = 0;
Tests.LoadTemplate.run = function () {
    var startTime = Date.now();
    TemplateEngine.settings.VIEWS_FOLDER = "/tests/testviews";
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='loadtemplateTest'></div>");

    var callback = function () {
        Tests.LoadTemplate.processingTime = Date.now() - this.startTime;
        Tests.LoadTemplate.result = document.getElementById("loadtemplateTest").innerHTML;
        Tests.LoadTemplate.success = Tests.LoadTemplate.expectedResult == Tests.LoadTemplate.result;
        Tests.results.push(Tests.LoadTemplate.template + " : " + Tests.LoadTemplate.success + " : " + Tests.LoadTemplate.processingTime);
    }
    callback = callback.bind({ "startTime": startTime });

    TemplateEngine.ParseAndReplace(Tests.LoadTemplate.template, null, null, null, callback);
    
    
};

//Two Way Binding - text
Tests.TwoWayBinding = {};
Tests.TwoWayBinding.template = "<input id='ID_{{id}}' value='{{twobind.bind}}' />";
Tests.TwoWayBinding.expectedResult = "bound";
Tests.TwoWayBinding.expectedResult2 = "rebound";
Tests.TwoWayBinding.result = "";
Tests.TwoWayBinding.success = false;
Tests.TwoWayBinding.processingTime = 0;
Tests.TwoWayBinding.run = function () {
    var startTime = Date.now();
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='twowayTest-text'>" + TemplateEngine.ParseAndReplace(Tests.TwoWayBinding.template, null, scope.long.very, "scope.long.very.") + "</div");
    Tests.TwoWayBinding.processingTime = Date.now() - startTime;

    scope.long.very._twobind = "bound";
    Tests.TwoWayBinding.result = $("#ID_10").val();
    Tests.TwoWayBinding.success = Tests.TwoWayBinding.expectedResult == Tests.TwoWayBinding.result;

    if (Tests.TwoWayBinding.success)
    {
        $("#ID_10").val("rebound");
        $("#ID_10").change();
        Tests.TwoWayBinding.result = scope.long.very.twobind;
        Tests.TwoWayBinding.success = Tests.TwoWayBinding.expectedResult2 == Tests.TwoWayBinding.result;
    }

    Tests.results.push(Tests.TwoWayBinding.template + " : " + Tests.TwoWayBinding.success + " : " + Tests.TwoWayBinding.processingTime);
};

//Two Way Binding - checkbox
Tests.TwoWayCheckbox = {};
Tests.TwoWayCheckbox.template = "<input id='twoway-checkbox' type='checkbox' value='{{twobind.bind}}' checked='{{checked}}' />";
Tests.TwoWayCheckbox.expectedResult = true;
Tests.TwoWayCheckbox.expectedResult2 = false;
Tests.TwoWayCheckbox.result = "";
Tests.TwoWayCheckbox.success = false;
Tests.TwoWayCheckbox.processingTime = 0;
Tests.TwoWayCheckbox.run = function () {
    var startTime = Date.now();
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;'>" + TemplateEngine.ParseAndReplace(Tests.TwoWayCheckbox.template, null, scope.long.very, "scope.long.very.") + "</div");
    Tests.TwoWayCheckbox.processingTime = Date.now() - startTime;

    scope.long.very._checked = true;
    Tests.TwoWayCheckbox.result = $("#twoway-checkbox").prop("checked");
    Tests.TwoWayCheckbox.success = Tests.TwoWayCheckbox.expectedResult == Tests.TwoWayCheckbox.result;

    if (Tests.TwoWayCheckbox.success) {
        $("#twoway-checkbox").prop("checked", false);
        $("#twoway-checkbox").change();
        Tests.TwoWayCheckbox.result = scope.long.very.checked;
        Tests.TwoWayCheckbox.success = Tests.TwoWayCheckbox.expectedResult2 == Tests.TwoWayCheckbox.result;
    }

    Tests.results.push(Tests.TwoWayCheckbox.template + " : " + Tests.TwoWayCheckbox.success + " : " + Tests.TwoWayCheckbox.processingTime);
};

//foreach
Tests.ForeachTemplate = {};
Tests.ForeachTemplate.template = "{{foreach testArr loadtemplate foreach-template.html at foreachTest}}";
Tests.ForeachTemplate.expectedResult = "";
for (var i = 0; i < testArr.length; i++) {
    Tests.ForeachTemplate.expectedResult += "foreach " + testArr[i];
}
Tests.ForeachTemplate.result = "";
Tests.ForeachTemplate.success = false;
Tests.ForeachTemplate.processingTime = 0;
Tests.ForeachTemplate.run = function () {
    var startTime = Date.now();
    TemplateEngine.settings.VIEWS_FOLDER = "/tests/testviews";
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='foreachTest'></div>");

    var callback = function () {
        Tests.ForeachTemplate.processingTime = Date.now() - this.startTime;
        Tests.ForeachTemplate.result = document.getElementById("foreachTest").innerHTML;
        Tests.ForeachTemplate.success = Tests.ForeachTemplate.expectedResult == Tests.ForeachTemplate.result;
        Tests.results.push(Tests.ForeachTemplate.template + " : " + Tests.ForeachTemplate.success + " : " + Tests.ForeachTemplate.processingTime);
    }
    callback = callback.bind({ "startTime": startTime });

    TemplateEngine.ParseAndReplace(Tests.ForeachTemplate.template, null, null, null, callback);
};

//Stress test
Tests.Stress = {};
Tests.Stress.intensity = 1000;
Tests.Stress.template = Tests.Utilities.Repeat("{{foreach testArr loadtemplate foreach-template.html at stressTest}}", Tests.Stress.intensity);
Tests.Stress.expectedResult = "";
for (var i = 0; i < testArr.length; i++) {
    Tests.Stress.expectedResult += "foreach " + testArr[i];
}
Tests.Stress.expectedResult = Tests.Utilities.Repeat(Tests.Stress.expectedResult, Tests.Stress.intensity);
Tests.Stress.result = "";
Tests.Stress.success = false;
Tests.Stress.processingTime = 0;
Tests.Stress.run = function () {
    TemplateEngine.settings.ANTI_XHR_CACHING = true;
    
    TemplateEngine.settings.VIEWS_FOLDER = "/tests/testviews";
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='stressTest'></div>");

    var callback = function () {
        Tests.Stress.processingTime = Date.now() - this.startTime;
        if(TemplateEngine.settings.DEBUG) console.log("done stress test, time:" + Tests.Stress.processingTime);
        Tests.Stress.result = document.getElementById("stressTest").innerHTML;
        Tests.Stress.success = Tests.Stress.expectedResult == Tests.Stress.result;
        Tests.results.push(Tests.Stress.template + " : " + Tests.Stress.success + " : " + Tests.Stress.processingTime);
    }
    var startTime = Date.now();
    callback = callback.bind({ "startTime": startTime });
    
    TemplateEngine.ParseAndReplace(Tests.Stress.template, null, null, null, callback);
};

Tests.RunAll = function()
{
    for (var test in Tests) {
        if (Tests[test].run)
            Tests[test].run();
    }
    
}

Tests.PrintResults = function () {
    for (var r in Tests.results)
        console.log(Tests.results[r]);
}

