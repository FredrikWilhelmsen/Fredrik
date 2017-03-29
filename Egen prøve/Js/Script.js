//Variable declarations

//Array that holds all the tasks in the document
var tasks = document.getElementsByClassName("task");
//Error object, shows if you answered wrong or not
var error = document.getElementById("error");
//Keeps track of what task you're on
var stage = 0;
//Array that holds the answers
var answers = [];

//Function declarations

//Takes a task object and a solution from the answers array as parameters. Finds the correct question type, then tests the answer
var testAnswer = function(task, solution)
{   
    var ans = task.querySelector(".answer");
    if(ans.id === "number")
    {
        if(task.querySelector(".answer input").value === solution)
        {
            return true;
        }
        return false;
    }
    else if(ans.id === "dropdown")
    {
        if(task.querySelector("#dropdown").value === solution)
        {
            return true;
        }
        return false;
    }
    else if(ans.id === "text")
    {
        if(task.querySelector(".answer input").value.toLowerCase() === solution.toLowerCase())
        {
            return true;
        }
        return false;
    }
    else if(task.querySelector(".answer").id === "radio")
    {
        if(task.querySelectorAll(".answer input")[Number(solution) - 1].checked)
        {
            return true;
        }
        return false;
    }
    else if(task.querySelector(".answer").id === "checkbox")
    {
        var answer = task.querySelectorAll(".answer input");
        for(var index = 0; index < task.querySelectorAll(".answer input").length; index++)
        {
            if(((answer[index].checked && solution[index] === "false") || 
                (answer[index].checked && solution[index] === "true")  || 
               (!answer[index].checked && solution[index] === "true")) && 
               !(answer[index].checked && solution[index] === "true"))
            {
                return false;
            }
        }
        return true;
    }
};

//Updates the current question display on the site. Changes size depending on the length of the string
var updateTaskDisplay = function()
{
    var currentTask = document.getElementById("currentTask");
    if(stage < tasks.length)
    {
        currentTask.innerHTML = stage + 1 + "/" + tasks.length;
        currentTask.style.width = 30 * currentTask.innerHTML.length + "px";
    }
    else
    {
        currentTask.innerHTML = "Done";
        currentTask.style.width = 30 * currentTask.innerHTML.length + "px";
    }
}

//Button declarations

//Declares the back arrow, allows the user to go back to the previous question
document.getElementById("back").onclick = function()
{
    if(stage === tasks.length)
    {
        document.getElementById("lastPage").style.display = "none";
        stage--;
        tasks[stage].style.display = "initial";
        updateTaskDisplay();
    }
    else if(stage > 0)
    {
        error.style.backgroundColor = "#4CAF50";
        tasks[stage].style.display = "none";
        stage--;
        tasks[stage].style.display = "initial";
        updateTaskDisplay();
    }
}

//Declares the forward arrow, allows the user to go to the next question if they have answered correctly
document.getElementById("forward").onclick = function()
{
    if(stage < tasks.length - 1)
    {
        if(testAnswer(tasks[stage], answers[stage]))
        {
            error.style.backgroundColor = "#4CAF50";
            tasks[stage].style.display = "none";
            stage++;
            tasks[stage].style.display = "initial";
            updateTaskDisplay();
        }
        else
        {
            error.style.backgroundColor = "#f73131";
        }
    }
    else if(stage === tasks.length - 1)
    {
        if(testAnswer(tasks[stage], answers[stage]))
        {
            error.style.backgroundColor = "#4CAF50";
            tasks[stage].style.display = "none";
            stage++;
            document.getElementById("lastPage").style.display = "initial";
            updateTaskDisplay();
        }
        else
        {
            error.style.backgroundColor = "#f73131";
        }
    }
}

//Fills the answers array. Deletes the answers from the HTML code.
for(var index = 0; index < tasks.length; index++)
{
    if(tasks[index].querySelector(".answer").id === "checkbox")
    {
        var array = [];
        for(var iii = 0; iii < tasks[index].querySelectorAll(".solution p").length; iii++)
        {
            array.push(tasks[index].querySelectorAll(".solution p")[iii].innerHTML);
            tasks[index].querySelectorAll(".solution p")[iii].innerHTML = "";
        }
        answers.push(array);
    }
    else
    {
        answers.push(tasks[index].querySelector(".solution p").innerHTML);
        tasks[index].querySelector(".solution p").innerHTML = "";
    }
}

//Displays the first task
tasks[0].style.display = "initial";
//Updates the current task display
updateTaskDisplay();