for(var index = 0; index < document.querySelectorAll("li a").length; index++){
    document.querySelectorAll("li a")[index].addEventListener("click", function(){
       for(var index = 0; index < document.querySelectorAll("li a").length; index++){
           if(document.querySelectorAll("li a")[index].className === "navHeader" || document.querySelectorAll("li a")[index].className === "activeNavHeader"){
               document.querySelectorAll("li a")[index].className = "navHeader";
           }
           else {
               document.querySelectorAll("li a")[index].className = "";
           }
        }
        
        if(this.className === "navHeader" || this.className === "activeNavHeader"){
            this.className = "activeNavHeader";
        }
        else {
            this.className = "active";
        }
    });
}

document.getElementById("navbtn").addEventListener("click", function(){
    if(document.getElementById("bar").className === "hide"){
        document.getElementById("bar").className = "show";
        document.getElementById("navbtn").className = "resetMargin";
        document.getElementById("block").className = "resetMargin2";
    }
    else {
        document.getElementById("bar").className = "hide";
        document.getElementById("navbtn").className = "removeMargin";
        document.getElementById("block").className = "removeMargin2";
    }
});