var findReplace = function(string, char, newChar)
{
    var x;
    var y;
    
    while(string.search(char) >= 0)
    {
        x = string.slice(0, string.search(char));
        y = string.slice(string.search(char) + 1, string.length);
        string = x + newChar + y;
    }
    return string;
};

var makeComment = function()
{
    var date = new Date();    
    var oldComments = document.getElementById("commentSection").innerHTML;
    var comment = "<div class=\"comment\">" + "<div class=\"name\">" + "- ";
    var name;
    var text;
    
    if(document.getElementById("name").value === "")
    {
        comment += "anon";
    }
    else
    {
        name = document.getElementById("name").value;
    }
    
    if(document.getElementById("input").value === "")
    {
        alert("Enter a comment");
    }
    else
    {
        name = findReplace(name, "<", "&lt");
        name = findReplace(name, ">", "&gt");
        comment += name;

        comment += "</div>" + "<div class=\"text\">"; 

        text = document.getElementById("input").value;
        
        text = findReplace(text, "<", "&lt");
        text = findReplace(text, ">", "&gt");
        comment += text;

        comment += "</div>" + "<div class=\"timestamp\">" + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " / " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</div>" + "</div>";

        document.getElementById("commentSection").innerHTML = comment + oldComments;
    }
};

document.getElementById("post").addEventListener("click", makeComment);