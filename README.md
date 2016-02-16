# regex_template_engine
A simple javascript templating engine using regex

#Setup
The Regex Templating Engine (RTE) can be used to load HTML templates and insert javascript content into them before display on the page. It is used by calling the TemplateEngine.ParseAndReplace() function on templated HTML content, though calling the method explicitly is unnecessary as TemplateEngine.ParseAndReplace() will be automatically called on any html content after the DOM loads.

To begin using RTE users must first specify the path to their HTML templates by setting the variable:

    TemplateEngine.VIEWS_FOLDER = "/views";
    
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

    {{loadtemplate template.html at htmlElementId}}
Loads an html document and insert it into htmlElementId

    {{foreach iterableVariable loadtemplate template.html at htmlElementId}}
Loads a template and iterates over an object or array. The template is loaded as many times as the iterableVariable is iterable, with the iterableVariable being passed as the local context for another round of templating on the loaded template.
