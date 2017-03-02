var popup = function(message)
{
    document.getElementById("msg").innerHTML = message;
    document.getElementById("site").style.display = "none";
    document.getElementById("pop").style.display = "inherit";
};

var popdown = function()
{
    document.getElementById("site").style.display = "initial";
    document.getElementById("pop").style.display = "none";
};

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

console.log(getCookie("trip"));
//Initialize page
if(getCookie("trip") !== "")
{
    document.getElementById(getCookie("trip")).style.display = "initial";
    document.getElementById("orderButton").style.display = "initial";
}

var f = function()
{
    var input = document.querySelectorAll("#" + getCookie("trip") + " input");
    var tickets = [];
    var sumTickets = 0;
    
    for(var index = 0; index < input.length; index++)
    {
        tickets.push(Number(input[index].value));
        sumTickets += tickets[index];
    }
    
    if(sumTickets > 0 && sumTickets < 21)
    {
        document.getElementById("block").style.display = "none";
        
        var d = new Date();
        var wDay = d.getDay();
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var dateString = "";
        var price = 0;
        
        if(getCookie("trip") === "f1")
        {
            var ticketPrice = 700;
            
            document.getElementById("location").innerHTML = "Flytur til Reykjavik";
            
            if(wDay == 4)
            {
                dateString = (day + 7) + "." + month + "." + year;
            }
            else if(wDay < 4)
            {
                dateString = (day + 4 - wDay) + "." + month + "." + year;
            }
            else if(wDay > 4)
            {
                dateString = (day + 11 - wDay) + "." + month + "." + year;
            }    
            
            price += ticketPrice * tickets[1] * ( 1 / 2 );
            price += ticketPrice * tickets[2] * ( 3 / 4 );
            price += ticketPrice * tickets[3];
        }
        else
        {
            var ticketPrice = 500;
            
            document.getElementById("location").innerHTML = "Flytur til Edinburgh";
            
            if(wDay == 2)
            {
                dateString = (day + 7) + "." + month + "." + year;
            }
            else if(wDay < 2)
            {
                dateString = (day + 2 - wDay) + "." + month + "." + year;
            }
            else if(wDay > 2)
            {
                dateString = (day + 9 - wDay) + "." + month + "." + year;
            }
            
            price += ticketPrice * tickets[1] * ( 1 / 2 );
            price += ticketPrice * tickets[2] * ( 3 / 4 );
            price += ticketPrice * tickets[3];
        }
        
        document.getElementById("date1").innerHTML = dateString;
        
        document.getElementById("price1").innerHTML = price + ",-";

        for(var index = 0; index < document.getElementsByClassName("outputTickets").length; index++)
        {
            document.getElementsByClassName("outputTickets")[index].innerHTML = tickets[index];
        }

        document.getElementById("sumTickets").innerHTML = sumTickets;

        document.getElementById("pay1").style.display = "initial";
        document.getElementById("pay").style.display = "initial";
    }
    else if(sumTickets < 1)
    {
        popup("Du må ha minst én billett!");
    }
    else
    {
        popup("Du kan ha maks 20 billetter!");
    }
};

var f3 = function()
{
    var tickets = document.getElementById("ticketsInput").value;

    if(tickets > 0 && tickets < 21)
    {
        document.getElementById("block").style.display = "none";
        
        document.getElementById("destination").innerHTML = document.getElementById("destinationInput").value;
        
        document.getElementById("tickets").innerHTML = tickets;
        
        var sDay = Number(document.getElementById("day").value);
        
        var d = new Date();
        var wDay = d.getDay();
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var dateString = "";
        
        if(wDay == sDay)
        {
            dateString = (day + 7) + "." + month + "." + year;
        }
        else if(wDay < sDay)
        {
            dateString = (day + sDay - wDay) + "." + month + "." + year;
        }
        else if(wDay > sDay)
        {
            dateString = (day + sDay + 7 - wDay) + "." + month + "." + year;
        }
        
        var inputs = document.querySelectorAll("#L input");
        
        if(inputs[0].checked)
        {
            document.getElementById("price2").innerHTML = "20'000,-";
        }
        else if(inputs[1].checked || inputs[2].checked)
        {
            document.getElementById("price2").innerHTML = "25'0000,-";
        }
        else if(inputs[3].checked)
        {
            document.getElementById("price2").innerHTML = "27'000,-";
        }
        
        document.getElementById("date2").innerHTML = dateString;
        
        document.getElementById("pay2").style.display = "initial";
        document.getElementById("pay").style.display = "initial";
    }
    else if(tickets < 1)
    {
        popup("Du må ha minst én billett!");
    }
    else
    {
        popup("Du kan ha maks 20 billetter!");
    }
};

var order = function()
{    
    switch(getCookie("trip"))
    {
        case "f1":
        case "f2":
            f();
            break;
        case "f3":
            f3();
            break;
    }
}

var confirm = function()
{
    popup("Bestilling fullført");
}

document.getElementById("orderButton").addEventListener("click", order);
document.getElementById("confirmButton").addEventListener("click", confirm);
document.getElementById("button").addEventListener("click", popdown)