var setCookie = function(name, value)
{
    document.cookie = name + "=" + value + ";path=/";
};

var getCookie = function(name)
{
    name += "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var splits = decodedCookie.split(";");
    for(var index = 0; index < splits.length; index++) 
    {
        var part = splits[index];
        while (part.charAt(0) == " ") 
        {
            part = part.substring(1);
        }
        if (part.indexOf(name) == 0) 
        {
            return part.substring(name.length, part.length);
        }
    }
    return "";
};

var f1 = function()
{
    setCookie("trip", "f1");
    document.getElementById("F2").style.backgroundColor = "white";
    document.getElementById("F3").style.backgroundColor = "#efefef";
    this.style.backgroundColor = "#6dffa5";
    document.getElementById("pay").href = url;
    console.log(getCookie("trip"));
};

var f2 = function()
{
    setCookie("trip", "f2");
    document.getElementById("F1").style.backgroundColor = "#efefef";
    document.getElementById("F3").style.backgroundColor = "#efefef";
    this.style.backgroundColor = "#6dffa5";
    document.getElementById("pay").href = url;
};

var f3 = function()
{
    setCookie("trip", "f3");
    document.getElementById("F2").style.backgroundColor = "white";
    document.getElementById("F1").style.backgroundColor = "#efefef";
    this.style.backgroundColor = "#6dffa5";
    document.getElementById("pay").href = url;
};

//Remove old cookies
if(getCookie("trip"))
{
    setCookie("trip", "");
}

var url = document.getElementById("pay").href;
document.getElementById("pay").href = "#flights";

document.getElementById("F1").addEventListener("click", f1);
document.getElementById("F2").addEventListener("click", f2);
document.getElementById("F3").addEventListener("click", f3);