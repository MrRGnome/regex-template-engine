if (!Tests)
    var Tests = {};

Tests.VariableTests = {};

var globalScopeVar = "Variable in the global scope";
if (!scope)
{
    var scope = {};
    scope.long = {};
    scope.long.very = {};
}
    
scope.long.very.scopedVar = "Scoped Variable";
scope.long.very.date = Date.now();
scope.long.very.boundVar = "unbound";
scope.long.very.unboundVar = "unbound";
scope.long.very.id = 10;
scope.long.very.twobind = "unbound";
scope.long.very.checked = false;

//variable - global scope
Tests.VariableTests.GlobalScopeVar = {};
Tests.VariableTests.GlobalScopeVar.template = "{{globalScopeVar}}";
Tests.VariableTests.GlobalScopeVar.expectedResult = globalScopeVar;
Tests.VariableTests.GlobalScopeVar.result = "";
Tests.VariableTests.GlobalScopeVar.success = false;
Tests.VariableTests.GlobalScopeVar.processingTime = 0;
Tests.VariableTests.GlobalScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.GlobalScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.GlobalScopeVar.template);
    Tests.VariableTests.GlobalScopeVar.success = Tests.VariableTests.GlobalScopeVar.expectedResult == Tests.VariableTests.GlobalScopeVar.result;
    Tests.VariableTests.GlobalScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.GlobalScopeVar.template + " : " + Tests.VariableTests.GlobalScopeVar.success + " : " + Tests.VariableTests.GlobalScopeVar.processingTime);
};

//variable - scoped
Tests.VariableTests.DeepScopeVar = {};
Tests.VariableTests.DeepScopeVar.template = "{{scope.long.very.scopedVar}}";
Tests.VariableTests.DeepScopeVar.expectedResult = scope.long.very.scopedVar;
Tests.VariableTests.DeepScopeVar.result = "";
Tests.VariableTests.DeepScopeVar.success = false;
Tests.VariableTests.DeepScopeVar.processingTime = 0;
Tests.VariableTests.DeepScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.DeepScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.DeepScopeVar.template);
    Tests.VariableTests.DeepScopeVar.success = Tests.VariableTests.DeepScopeVar.expectedResult == Tests.VariableTests.DeepScopeVar.result;
    Tests.VariableTests.DeepScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.DeepScopeVar.template + " : " + Tests.VariableTests.DeepScopeVar.success + " : " + Tests.VariableTests.DeepScopeVar.processingTime);
};

//variable - json
Tests.VariableTests.JsonScopeVar = {};
Tests.VariableTests.JsonScopeVar.template = "{{scope.long.very.json}}";
Tests.VariableTests.JsonScopeVar.expectedResult = JSON.stringify(scope.long.very);
Tests.VariableTests.JsonScopeVar.result = "";
Tests.VariableTests.JsonScopeVar.success = false;
Tests.VariableTests.JsonScopeVar.processingTime = 0;
Tests.VariableTests.JsonScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.JsonScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.JsonScopeVar.template);
    Tests.VariableTests.JsonScopeVar.success = Tests.VariableTests.JsonScopeVar.expectedResult == Tests.VariableTests.JsonScopeVar.result;
    Tests.VariableTests.JsonScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.JsonScopeVar.template + " : " + Tests.VariableTests.JsonScopeVar.success + " : " + Tests.VariableTests.JsonScopeVar.processingTime);
};

//variable - todate
Tests.VariableTests.DateScopeVar = {};
Tests.VariableTests.DateScopeVar.template = "{{scope.long.very.date.todate}}";
Tests.VariableTests.DateScopeVar.expectedResult = new Date(parseInt(scope.long.very.date)).toISOString().substr(0, 10);
Tests.VariableTests.DateScopeVar.result = "";
Tests.VariableTests.DateScopeVar.success = false;
Tests.VariableTests.DateScopeVar.processingTime = 0;
Tests.VariableTests.DateScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.DateScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.DateScopeVar.template);
    Tests.VariableTests.DateScopeVar.success = Tests.VariableTests.DateScopeVar.expectedResult == Tests.VariableTests.DateScopeVar.result;
    Tests.VariableTests.DateScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.DateScopeVar.template + " : " + Tests.VariableTests.DateScopeVar.success + " : " + Tests.VariableTests.DateScopeVar.processingTime);
};

//variable - todate.local
Tests.VariableTests.LocalScopeVar = {};
Tests.VariableTests.LocalScopeVar.template = "{{scope.long.very.date.todate.local}}";
Tests.VariableTests.LocalScopeVar.expectedResult = new Date(parseInt(scope.long.very.date)).toLocaleString();
Tests.VariableTests.LocalScopeVar.result = "";
Tests.VariableTests.LocalScopeVar.success = false;
Tests.VariableTests.LocalScopeVar.processingTime = 0;
Tests.VariableTests.LocalScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.LocalScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.LocalScopeVar.template);
    Tests.VariableTests.LocalScopeVar.success = Tests.VariableTests.LocalScopeVar.expectedResult == Tests.VariableTests.LocalScopeVar.result;
    Tests.VariableTests.LocalScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.LocalScopeVar.template + " : " + Tests.VariableTests.LocalScopeVar.success + " : " + Tests.VariableTests.LocalScopeVar.processingTime);
};

//variable - bind
Tests.VariableTests.BindVar = {};
Tests.VariableTests.BindVar.template = "{{scope.long.very.boundVar.bind}}";
Tests.VariableTests.BindVar.expectedResult = "bound";
Tests.VariableTests.BindVar.result = "";
Tests.VariableTests.BindVar.success = false;
Tests.VariableTests.BindVar.processingTime = 0;
Tests.VariableTests.BindVar.run = function () {
    TemplateEngine.settings.BINDING = false;
    var startTime = Date.now();

    var callback = function () {
        Tests.VariableTests.BindVar.processingTime = Date.now() - this.startTime;


        setTimeout(function () {
            scope.long.very._boundVar = "bound";
            Tests.VariableTests.BindVar.result = document.getElementsByClassName("binding_hook_scope.long.very.boundVar.bind")[0].innerHTML;
            Tests.VariableTests.BindVar.success = Tests.VariableTests.BindVar.expectedResult == Tests.VariableTests.BindVar.result;
            Tests.results.push(Tests.VariableTests.BindVar.template + " : " + Tests.VariableTests.BindVar.success + " : " + Tests.VariableTests.BindVar.processingTime);
        }, 100);
    }
    callback = callback.bind({ "startTime": startTime });

    $(document.getElementsByTagName("body")[0]).append("<div style='display: none'>" + TemplateEngine.ParseAndReplace(Tests.VariableTests.BindVar.template, null, null, null, callback) + "</div>");
};


//variable - unbind
Tests.VariableTests.UnBindVar = {};
Tests.VariableTests.UnBindVar.template = "{{scope.long.very.unboundVar.unbind}}";
Tests.VariableTests.UnBindVar.expectedResult = "unbound";
Tests.VariableTests.UnBindVar.result = "";
Tests.VariableTests.UnBindVar.success = false;
Tests.VariableTests.UnBindVar.processingTime = 0;
Tests.VariableTests.UnBindVar.run = function () {
    TemplateEngine.settings.BINDING = true;
    var startTime = Date.now();

    var callback = function () {
        Tests.VariableTests.UnBindVar.processingTime = Date.now() - this.startTime;
        TemplateEngine.settings.BINDING = false;
        setTimeout(function () {
            scope.long.very._unboundVar = "bound";
            Tests.VariableTests.UnBindVar.result = document.getElementById("unboundTest").innerHTML;
            Tests.VariableTests.UnBindVar.success = Tests.VariableTests.UnBindVar.expectedResult == Tests.VariableTests.UnBindVar.result;
            Tests.results.push(Tests.VariableTests.UnBindVar.template + " : " + Tests.VariableTests.UnBindVar.success + " : " + Tests.VariableTests.UnBindVar.processingTime);
        }, 100);
    }
    callback = callback.bind({ "startTime": startTime });

    $(document.getElementsByTagName("body")[0]).append("<div style='display: none' id='unboundTest'>" + TemplateEngine.ParseAndReplace(Tests.VariableTests.UnBindVar.template, null, null, null, callback) + "</div>");
};

//variable - replace-whitespace._
Tests.VariableTests.ReplaceScopeVar = {};
Tests.VariableTests.ReplaceScopeVar.template = "{{scope.long.very.scopedVar.replace-whitespace._}}";
Tests.VariableTests.ReplaceScopeVar.expectedResult = scope.long.very.scopedVar.replace(/ /g, "_");
Tests.VariableTests.ReplaceScopeVar.result = "";
Tests.VariableTests.ReplaceScopeVar.success = false;
Tests.VariableTests.ReplaceScopeVar.processingTime = 0;
Tests.VariableTests.ReplaceScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.ReplaceScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.ReplaceScopeVar.template);
    Tests.VariableTests.ReplaceScopeVar.success = Tests.VariableTests.ReplaceScopeVar.expectedResult == Tests.VariableTests.ReplaceScopeVar.result;
    Tests.VariableTests.ReplaceScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.ReplaceScopeVar.template + " : " + Tests.VariableTests.ReplaceScopeVar.success + " : " + Tests.VariableTests.ReplaceScopeVar.processingTime);
};

//variable - this
Tests.VariableTests.ThisScopeVar = {};
Tests.VariableTests.ThisScopeVar.template = "{{this.val}}";
Tests.VariableTests.ThisScopeVar.expectedResult = "hello";
Tests.VariableTests.ThisScopeVar.result = "";
Tests.VariableTests.ThisScopeVar.success = false;
Tests.VariableTests.ThisScopeVar.processingTime = 0;
Tests.VariableTests.ThisScopeVar.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.ThisScopeVar.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.ThisScopeVar.template, null, { "val": "hello" });
    Tests.VariableTests.ThisScopeVar.success = Tests.VariableTests.ThisScopeVar.expectedResult == Tests.VariableTests.ThisScopeVar.result;
    Tests.VariableTests.ThisScopeVar.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.ThisScopeVar.template + " : " + Tests.VariableTests.ThisScopeVar.success + " : " + Tests.VariableTests.ThisScopeVar.processingTime);
};

//variable - replacementMatrix
Tests.VariableTests.ReplacementMatrix = {};
Tests.VariableTests.ReplacementMatrix.template = "testing is the worst";
Tests.VariableTests.ReplacementMatrix.replaceMatrix = { "testing is the worst": "testing is great" };
Tests.VariableTests.ReplacementMatrix.expectedResult = "testing is great";
Tests.VariableTests.ReplacementMatrix.result = "";
Tests.VariableTests.ReplacementMatrix.success = false;
Tests.VariableTests.ReplacementMatrix.processingTime = 0;
Tests.VariableTests.ReplacementMatrix.run = function () {
    var startTime = Date.now();
    Tests.VariableTests.ReplacementMatrix.result = TemplateEngine.ParseAndReplace(Tests.VariableTests.ReplacementMatrix.template, Tests.VariableTests.ReplacementMatrix.replaceMatrix);
    Tests.VariableTests.ReplacementMatrix.success = Tests.VariableTests.ReplacementMatrix.expectedResult == Tests.VariableTests.ReplacementMatrix.result;
    Tests.VariableTests.ReplacementMatrix.processingTime = Date.now() - startTime;
    Tests.results.push(Tests.VariableTests.ReplacementMatrix.template + " : " + Tests.VariableTests.ReplacementMatrix.success + " : " + Tests.VariableTests.ReplacementMatrix.processingTime);
};

//Two Way Binding - text
Tests.VariableTests.TwoWayBinding = {};
Tests.VariableTests.TwoWayBinding.template = "<input id='ID_{{id}}' value='{{twobind.bind}}' />";
Tests.VariableTests.TwoWayBinding.expectedResult = "bound";
Tests.VariableTests.TwoWayBinding.expectedResult2 = "rebound";
Tests.VariableTests.TwoWayBinding.result = "";
Tests.VariableTests.TwoWayBinding.success = false;
Tests.VariableTests.TwoWayBinding.processingTime = 0;
Tests.VariableTests.TwoWayBinding.run = function () {
    var startTime = Date.now();
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='twowayTest-text'>" + TemplateEngine.ParseAndReplace(Tests.VariableTests.TwoWayBinding.template, null, scope.long.very, "scope.long.very.") + "</div");
    Tests.VariableTests.TwoWayBinding.processingTime = Date.now() - startTime;

    scope.long.very._twobind = "bound";
    Tests.VariableTests.TwoWayBinding.result = $("#ID_10").val();
    Tests.VariableTests.TwoWayBinding.success = Tests.VariableTests.TwoWayBinding.expectedResult == Tests.VariableTests.TwoWayBinding.result;

    if (Tests.VariableTests.TwoWayBinding.success) {
        $("#ID_10").val("rebound");
        $("#ID_10").change();
        Tests.VariableTests.TwoWayBinding.result = scope.long.very.twobind;
        Tests.VariableTests.TwoWayBinding.success = Tests.VariableTests.TwoWayBinding.expectedResult2 == Tests.VariableTests.TwoWayBinding.result;
    }

    Tests.results.push(Tests.VariableTests.TwoWayBinding.template + " : " + Tests.VariableTests.TwoWayBinding.success + " : " + Tests.VariableTests.TwoWayBinding.processingTime);
};

//Two Way Binding - checkbox
Tests.VariableTests.TwoWayCheckbox = {};
Tests.VariableTests.TwoWayCheckbox.template = "<input id='twoway-checkbox' type='checkbox' value='{{twobind.bind}}' checked='{{checked}}' />";
Tests.VariableTests.TwoWayCheckbox.expectedResult = true;
Tests.VariableTests.TwoWayCheckbox.expectedResult2 = false;
Tests.VariableTests.TwoWayCheckbox.result = "";
Tests.VariableTests.TwoWayCheckbox.success = false;
Tests.VariableTests.TwoWayCheckbox.processingTime = 0;
Tests.VariableTests.TwoWayCheckbox.run = function () {
    var startTime = Date.now();
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;'>" + TemplateEngine.ParseAndReplace(Tests.VariableTests.TwoWayCheckbox.template, null, scope.long.very, "scope.long.very.") + "</div");
    Tests.VariableTests.TwoWayCheckbox.processingTime = Date.now() - startTime;

    scope.long.very._checked = true;
    Tests.VariableTests.TwoWayCheckbox.result = $("#twoway-checkbox").prop("checked");
    Tests.VariableTests.TwoWayCheckbox.success = Tests.VariableTests.TwoWayCheckbox.expectedResult == Tests.VariableTests.TwoWayCheckbox.result;

    if (Tests.VariableTests.TwoWayCheckbox.success) {
        $("#twoway-checkbox").prop("checked", false);
        $("#twoway-checkbox").change();
        Tests.VariableTests.TwoWayCheckbox.result = scope.long.very.checked;
        Tests.VariableTests.TwoWayCheckbox.success = Tests.VariableTests.TwoWayCheckbox.expectedResult2 == Tests.VariableTests.TwoWayCheckbox.result;
    }

    Tests.results.push(Tests.VariableTests.TwoWayCheckbox.template + " : " + Tests.VariableTests.TwoWayCheckbox.success + " : " + Tests.VariableTests.TwoWayCheckbox.processingTime);
};