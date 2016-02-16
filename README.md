# regex_template_engine
A simple javascript templating engine using regex

#Setup
The Regex Templating Engine (RTE) can be used to load HTML templates and insert javascript content into them before display on the page. It is used by calling the TemplateEngine.ParseAndReplace() function on templated HTML content, though calling the method explicitly is unnecessary as TemplateEngine.ParseAndReplace() will be automatically called on any html content after the DOM loads.

To begin using RTE users must first specify the path to their HTML templates by setting the variable:

    TemplateEngine.VIEWS_FOLDER = "/views";
    
Users may also wish to turn off console logging of the library by setting the debug variable to false.

    TemplateEngine.debug = false;
    
Users should also employ a CSS class "hidden" so as to hide the templating work from users before templates are loaded. RTE is configured to remove the "hidden" class from templated regions on load.

Template logic is denoted by double curly brackets bracing templating keywords, such as:

    {{loadtemplate contact_card.html at contact_card_div}}

which will load contact_card.html from the local domain using the folder path described by TemplateEngine.VIEWS_FOLDER and insert that content into the HTML element IDed as "contact_card_div".

#Keywords and Examples

    {{variableName}}
Outputs variable content

    {{scope.variableName}}
Outputs variable content

    {{variableName.json}}
Outputs variable as stringified json

    {{variableName.todate}}
Outputs variable as ISO datetime

    {{variableName.local}}
Outputs variable as local machine datetime

    {{this}}
Outputs the local scope, useful in templates called with "foreach"

    {{this.variableName}}
Outputs a variable within the local scope, useful in templates with "foreach"

    {{loadtemplate template.html at htmlElementId}}
Loads an html document and insert it into htmlElementId

    {{loadtemplate template.html at htmlElementId with scope.variable}}
Loads an html document and insert it into htmlElementId using scope.variable to populate the template

    {{foreach iterableVariable loadtemplate template.html at htmlElementId}}
Loads a template and iterates over an object or array. The template is loaded as many times as the iterableVariable is iterable, with the iterableVariable being passed as the local context for another round of templating on the loaded template.

#Advanced Templating

Users may wish to perform more significant templating logic, for which they may use a replacement matrix which will define keywords to look for and logic to execute in replacing those keywords.

TemplateEngine.ParseAndReplace accepts a replaceMatrix which can be used to define more sohpisticated templating needs. In the example below the html {{email_subscription}} is replaced by the word "CHECKED" which checks a checkbox if the user is subscribed to email newsletters.

    var callback = function(htmlTemplate, divId) {
        document.getElementById(divId).innerHTML = ParseAndReplace(htmlTemplate, {
            "{{email_subscrption}}": user.preferences.email_subscription ? "CHECKED" : ""
        });
    }
    TemplateEngine.LoadTemplate("user_email.html", callback, "email_div");
    
