var TemplateEngine = {};
TemplateEngine.settings = {};

//Set this to wherever your html templates are that will be loaded relative to your root directory, include a leading slash and no trailing slash. Leave empty if loading from root directory.
TemplateEngine.settings.VIEWS_FOLDER = "/views";

//Set this to a css class name which includes the property "display: hidden;"
TemplateEngine.settings.HIDDEN_CLASS = "hidden";

//Auto parse document
TemplateEngine.settings.AUTOLOAD = true;

//Enable one-way binding where changes to the javascript variable are reflected to the HTML template (Alpha feature, may experience bugs. Disabled by default)
TemplateEngine.settings.BINDING = false;

//Enable debug output to js console (WARNGING - TRUE MAY CAUSE PERFOMANCE SLOW DOWN FOR LARGE LOADS)
TemplateEngine.settings.DEBUG = true;




//Template Engine start point
TemplateEngine.Start = function () {
    if (TemplateEngine.settings.AUTOLOAD)
        $(document.getElementsByTagName("body")[0]).html(TemplateEngine.ParseAndReplace($(document.getElementsByTagName("body")[0]).html()));
};

document.addEventListener('DOMContentLoaded', TemplateEngine.Start, false);

//ParseAndReplace executes a regex search for curly braces in the provided html text and parses their inner content, looking for variable names, template load requests, and repeating logic
//Accepted html syntax are:
//{{variableName}} - outputs variable content
//{{scope.variableName}} - outputs variable content
//{{variableName.json}} - outputs variable as stringified json
//{{variableName.todate}} - outputs variable as ISO datetime
//{{variableName.local}} - outputs variable as local machine datetime
//{{this}} - outputs the local scope, useful in templates called with "foreach"
//{{loadtemplate template.html at htmlElementId}} - loads an html document and insert it into htmlElementId
//{{loadtemplate template.html at htmlElementId with variableName}} - loads an html document and inserts it into htlmElementId using variableName to populate the template
//{{foreach iterableVariable loadtemplate template.html at htmlElementId}} - loads a template and iterates over an object or array. The template is loaded as many times as the iterableVariable is iterable, with theiterableVariable being passed as the local context for another round of ParsAndReplace on the loaded template.

//ParseAndreplace also accepts a replaceMatrix which can be used to define for more sohpisticated templating needs. In the example below the html {{email_subscription}} is replaced by the word "CHECKED" which checks a checkbox if the user is subscribed to email newsletters.
// $("#userProfileBody").html(ParseAndReplace(sessionStorage["userProfileBody.html"], {
//"{{email_subscrption}}": user.preferences.email_subscription ? "CHECKED" : ""
//}));

TemplateEngine.ParseAndReplace = function (html, replaceMatrix, localScope, fullScope, cb) {
    if (!fullScope)
        fullScope = "";

    if (!localScope)
        localScope = window;

    var requiresRecursion = false;

    if (replaceMatrix) {
        for (var key in replaceMatrix) {
            var re = new RegExp(key, "g");
            html = html.replace(re, replaceMatrix[key]);
            if (TemplateEngine.settings.DEBUG) console.log(key + " = " + replaceMatrix[key]);
        }
    }

    //find and replace variable names
    var matchNames = html.match(/{{*[^\s}]*}}/g);
    if (matchNames) {
        for (var i = 0; i < matchNames.length; i++) {
            var namesArr = TemplateEngine.ClearBraceTags(matchNames[i]);
            var variableDictionary = {};
            for (var n = 0; n < namesArr.length; n++) {
                var variableValue;
                var binding = TemplateEngine.settings.BINDING;

                if (namesArr[n].match(/\.unbind/g)) {
                    binding = false;
                    namesArr[n].replace(/\.unbind/g, "");
                }
                else
                    if (namesArr[n].match(/\.bind/g)) {
                        binding = true;
                        namesArr[n].replace(/\.bind/g, "");
                    }

                if (variableDictionary[namesArr[n]])
                    variableValue = variableDictionary[namesArr[n]];
                else {
                    variableValue = TemplateEngine.GetObjFromString(namesArr[n], localScope);
                    variableDictionary[namesArr[n]] = variableValue;
                    if (TemplateEngine.settings.DEBUG) console.log("setting value " + namesArr[n] + " = " + variableValue);
                }

                //add binding hooks
                if (binding) {
                    variableValue = "<span class='binding_hook_" + fullScope + namesArr[n] + "'>" + variableValue + "</span>";
                    var parentScope = TemplateEngine.GetObjFromString(namesArr[n], localScope, true);
                    var lastTerm = TemplateEngine.GetLastPathTerm(namesArr[n], localScope);

                    if (parentScope && lastTerm) {
                        var setFunc = function (val) {
                            if (TemplateEngine.settings.DEBUG) console.log("Searching for binding hook: binding_hook_" + fullScope + this.prop);

                            var elements = document.getElementsByClassName("binding_hook_" + fullScope + this.prop);
                            for (var index = 0; index < elements.length; index++) {
                                elements[index].innerHTML = val;
                            }
                            parentScope[lastTerm] = val;
                        };

                        if (TemplateEngine.settings.DEBUG) console.log("Setting up binding hook on: " + JSON.stringify(parentScope));

                        var boundSetFunc = setFunc.bind({ prop: namesArr[n], parentScope: parentScope, lastTerm: lastTerm, fullScope: fullScope });

                        parentScope.__defineSetter__("_" + lastTerm, boundSetFunc);


                    }
                    else
                        if (TemplateEngine.settings.DEBUG) console.log("Unable to perform binding, variable undefined");

                }

                var re = new RegExp("{{" + namesArr[n] + "}}", "g");
                html = html.replace(re, variableValue);
            }
        }

    }

    
    //find foreach
    var match = html.match(/{{foreach.*}}/g);
    if (match) {
        requiresRecursion = true;
        for (var i = 0; i < match.length; i++) {

            if (TemplateEngine.settings.DEBUG) console.log("Executing: " + match[i]);

            //Trim tags
            var matchArr = TemplateEngine.ClearBraceTags(match[i]);
            var lastMatch = matchArr[matchArr.length - 1];

            //Get foreach object
            var foreachArr = localScope ? TemplateEngine.GetObjFromString(matchArr[1], localScope) : TemplateEngine.GetObjFromString(matchArr[1]);
            if (TemplateEngine.settings.DEBUG) console.log("foreach length: " + foreachArr.length);

            //look for keywords
            var loadtemplate = matchArr.indexOf("loadtemplate");
            var preDivIndex = matchArr.indexOf("at");
            var divId = matchArr[preDivIndex + 1];

            if (loadtemplate != -1 && preDivIndex != -1) {
                var templateName = matchArr[loadtemplate + 1];
                //Do template binding
                var callback = function (ret, divId) {

                    //foreach through template
                    for (var x = 0; x < foreachArr.length; x++) {
                        $(document.getElementById(divId)).append(TemplateEngine.ParseAndReplace(ret, {}, this.foreachArr[x], this.arrPath + "[" + x + "]."));
                    }
                    if (cb)
                        cb();
                    $(document.getElementById(divId)).removeClass(TemplateEngine.settings.HIDDEN_CLASS);
                    return true;
                };

                var boundCallback = callback.bind({ arrPath: matchArr[1], foreachArr: foreachArr, cb: cb });

                //load template
                TemplateEngine.LoadTemplate(matchArr[loadtemplate + 1], boundCallback, divId);

            }
            else
                if (TemplateEngine.settings.DEBUG) console.log("Foreach failed due to no loadtemplate command or no divId");

            //Clear foreach content
            html = html.replace(/{{foreach.*}}/g, "");
        }

    }


    //find loadtemplate
    match = html.match(/{{loadtemplate.*}}/g);
    if (match) {
        requiresRecursion = true;
        for (var x = 0; x < match.length; x++) {

            if (TemplateEngine.settings.DEBUG) console.log("Executing " + match[x]);

            //Trim tags
            var matchArr = TemplateEngine.ClearBraceTags(match[x]);
            var templateName = matchArr[1];
            var preDivIndex = matchArr.indexOf("at");
            var divId = matchArr[preDivIndex + 1];
            var withIndex = matchArr.indexOf("with");
            var varName = matchArr[withIndex + 1];


            if (preDivIndex == -1) {
                if (TemplateEngine.settings.DEBUG) console.log("unable to load without 'at' keyword. Include 'at div_id' in your code referencing the location you wish to populate with a template on statement: " + match[x]);
                return;
            }

            if (!templateName) {
                if (TemplateEngine.settings.DEBUG) console.log("Could not retrieve template name from: " + match[x]);
                return;
            }

            var scopeVariable = localScope ? TemplateEngine.GetObjFromString(varName, localScope) : TemplateEngine.GetObjFromString(varName);

            var callback = function (ret, divId) {
                if (TemplateEngine.settings.DEBUG) console.log("Executing template callback " + divId);
                $(document.getElementById(divId)).html(TemplateEngine.ParseAndReplace(ret, {}, scopeVariable)); //document.getElementById(divId).innerHTML = TemplateEngine.ParseAndReplace(ret, {}, scopeVariable);
                $(document.getElementById(divId)).removeClass(TemplateEngine.settings.HIDDEN_CLASS);
                if (cb)
                    cb();
            };

            var boundCallback = callback.bind({ cb: cb });

            TemplateEngine.LoadTemplate(templateName, boundCallback, divId);
        }
    }

    if (!requiresRecursion && cb)
        cb();

    return html;
};


//Load template creates a request to load additional content, stores it to session storage if a load is successful, and calls the HandleResponse call back.
TemplateEngine.LoadTemplate = function (filename, callback, divId) {

    var fileDir = "";
    if (!filename.match(/http.*:\/\//)) {
        fileDir = TemplateEngine.settings.VIEWS_FOLDER + "/";
    }

    var r = new XMLHttpRequest();
    r.open("GET", fileDir + filename, true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        callback(r.responseText, divId);
    };
    r.send(null);
};

//GetObjectFromString attempts to search through the scope provided for a defined variable in the typical javascript format, for example "TemplateEngine.settings.DEBUG"
//Accepts keywords such as "this", ".json" (which provides the JSON.stringify-ied version of the variable), ".todate" (Converts variable to ISO date), ".local" (Converts to local machine date and time)
TemplateEngine.GetObjFromString = function (objectPath, localScope, getLocalScope) {

    if (localScope == undefined)
        localScope = window;

    //Do all pre-object serach template parsing

    //Avoid digging through path if already parsed down
    if (getLocalScope) {
        if (objectPath.length == 1)
            return localScope;
    }

    //Remove binding
    objectPath = objectPath.replace(/\.bind/g, "");
    objectPath = objectPath.replace(/\.unbind/g, "");

    var json = false;
    if (objectPath.match(/\.json/)) {
        json = true;
        objectPath = objectPath.replace(/\.json/g, "");
    }

    //I don't need this.
    if (objectPath.match("this")) {
        objectPath = objectPath.replace(/this\./g, "");
        if (objectPath == "this")
            return localScope;
    }
        

    var todate = false;
    var local = false;
    if (objectPath.match(/\.todate/)) {
        todate = true;
        objectPath = objectPath.replace(/\.todate/g, "");

        if (objectPath.match(/\.local/)) {
            local = true;
            objectPath = objectPath.replace(/\.local/g, "");
        }
    }

    var replaceWhite = false;
    var replaceWith = "";
    if (objectPath.match(/\.replace-whitespace/)) {
        replaceWhite = true;
        var re = new RegExp("(?:\.replace-whitespace\.)(.[^.\n]*)", "g");
        replaceWith = re.exec(objectPath)[1];
        objectPath = objectPath.replace(/\.replace-whitespace\..[^.\n]*/g, "");
    }


    //Start object search
    objectPath = objectPath.split(".");
    var foundVariable;
    var n = 0;
    var tmp = localScope;
    if (objectPath.length == 0)
        foundVariable = localScope;
    else
        while (!foundVariable && tmp != undefined) {
            tmp = tmp[objectPath[n]];

            if (n == objectPath.length - 1) {
                foundVariable = tmp;
                break;
            }

            if ((getLocalScope && n == objectPath.length - 2))
                return tmp;
            n++;
        }

    //Apply object templating and return values
    if (foundVariable == undefined || foundVariable == "NaN")
        foundVariable = "";

    if (todate && foundVariable != "") {

        var date;
        if (local) {
            date = new Date(foundVariable);
            foundVariable = date.toLocaleString();
        }

        else {
            date = new Date(parseInt(foundVariable));
            foundVariable = date.toISOString().substr(0, 10);
        }

    }

    if (replaceWhite) {
        var re = new RegExp(" ", "g");
        foundVariable = foundVariable.replace(re, replaceWith);
    }


    if (json)
        foundVariable = JSON.stringify(foundVariable);

    return foundVariable;
};


//ClearBraceTags is a function designed to remove curly braces from the outside of a string so the contents may be cleanly parsed
TemplateEngine.ClearBraceTags = function (arr) {

    arr = arr.toString().replace(/{{/g, "");
    arr = arr.replace(/}}/g, "");
    return arr.split(" ");
};

//Used for getting the last term of a path for binding purposes
TemplateEngine.GetLastPathTerm = function (objectPath, localScope) {
    objectPath = objectPath.split(".");
    var suffixs = { "this": true, "json": true, "todate": true, "local": true, "unbind": true, "bind": true, "replace-whitespace": true };
    while (suffixs[objectPath[objectPath.length - 1]])
        objectPath = objectPath.slice(0, objectPath.length - 1);
    if (objectPath.length == 0)
        return localScope;
    else 
        return objectPath[objectPath.length - 1];
    
};
