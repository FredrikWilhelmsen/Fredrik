//Variable declarations
var numButtons = document.getElementsByClassName("numButton");
var operators = document.getElementsByClassName("operator");
var funcs = document.getElementsByClassName("func");
var display = document.getElementById("text");
var plusMinusImg = document.getElementById("+-");
var sqrtImg = document.getElementById("sqrt");
//Keeps the information about the sign
var numState = [true, true, true];
var num = ["0", "0"];
var stage = 0;
var operator = "";
var operatorChosen = false;
var previousAnswer = 0;

//Clear screen
display.innerHTML = "0";

//Funciton declarations

//Divison function
var divide = function(a, b)
{
    return a / b;
};

//Multiplication function
var multiply = function(a, b)
{
    return a * b;
};

//Subtraction function
var subtract = function(a, b)
{
    return a - b;
};

//Addition function
var add = function(a, b)
{
    return a + b;
};

//Factorial function
var factorial = function(num1)
{
    var num2 = 1;
    for(var index = 1; index <= num1; index++)
    {
        num2 = multiply(num2, index);
    }
    return num2;
}

//Refresh the display
var updateDisplay = function()
{
    if (stage === 0)
    {
        if(numState[0])
        {
            display.innerHTML = num[0];
        }
        else
        {
            display.innerHTML = "-" + num[0];
        }        
    }
    else if(stage === 1)
    {
        if(numState[0])
        {
            display.innerHTML = num[0] + " ";
        }
        else
        {
            display.innerHTML = "-" + num[0] + " ";
        }  
        if(numState[1])
        {
            display.innerHTML += operator + " " + num[1];
        }
        else
        {
            display.innerHTML += operator + " " + "(-" + num[1] + ")";
        }
    }
};

//Clear everything except the previous answer
var clearE = function()
{
    numState[0] = true;
    numState[1] = true;
    num = ["0", "0"];
    stage = 0;
    operator = "";
    operatorChosen = false;
    display.innerHTML = "0";
};

//Checks a string to see wether or not it contains a "." returns a boolean
var isFloat = function(num)
{
    for(var index = 0; index < num.length; index++)
    {
        if (num[index] === ".")
        {
            return true;
        }
    }
    return false;
};

//Does the calculation based on the chosen operator
var calculate = function()
{
    if(stage === 1)
    {
        var answer;
        
        var num1 = Number(num[0]);
        var num2 = Number(num[1]);
        
        if(!numState[0])
        {
            num1 *= -1;
        }
        
        if(!numState[1])
        {
            num2 *= -1;
        }
        
        if(operator === "+")
        {
            answer = add(num1, num2);
        }
        else if(operator === "-")
        {
            answer = subtract(num1, num2);
        }
        else if(operator === "*")
        {
            answer = multiply(num1, num2);
        }
        else if(operator === "^")
        {
            answer = Math.pow(num1, num2);
        }
        else if(operator === "/")
        {
            if(num2 !== 0)
            {
                answer = divide(num1, num2);
            }
            else
            {
                answer = "ERROR CANNOT DIVIDE BY 0";
                clearE();
                stage = 3;
            }
        }
        
        display.innerHTML = answer;
        
        if(stage !== 3)
        {
            stage = 2;
        }
        
        if(answer < 0)
        {
            answer *= -1;
            numState[2] = false;
        }
        
        previousAnswer = answer;
    }
    else if(stage === 0 && operatorChosen)
    {
        display.innerHTML = num[0]
        stage = 2;
        previousAnswer = num[0];
    }
    else if(stage === 0 && !operatorChosen)
    {
        stage = 2;
        previousAnswer = num[0];
        numState[2] = numState[0];
    }
}

//Handles function presses ...
var handleFunctionPress = function(button)
{
    if(button === "C")
    {
        numState = [true, true, true];
        num = ["0", "0"];
        stage = 0;
        operator = "";
        operatorChosen = false;
        previousAnswer = 0;
        display.innerHTML = "0";
    }
    else if(button === "+-")
    {
        if(stage >= 0 && stage <= 1)
        {
            numState[stage] = !numState[stage];
            updateDisplay();
        }
    }
    else if(button === ".")
    {
        if(stage >= 0 && stage <= 1)
        {
            if(!isFloat(num[stage]))
            {
                num[stage] += ".";
                updateDisplay();
            }
        }
    }
    else if(button === "&lt;") //This is the "<" button
    {
        if(stage === 0)
        {
            if(num[0] !== "0")
            {
                if(num[0].length === 1)
                {
                    num[0] = "0";
                    numState[0] = true;
                }
                else
                {
                    num[0] = num[0].substring(0, num[0].length - 1);
                }
            }
        }
        else if(stage === 1)
        {
            if(num[1] !== "0")
            {
                if(num[1].length === 1)
                {
                    num[1] = "0";
                }
                else
                {
                    num[1] = num[1].substring(0, num[1].length - 1)
                }
            }
            else
            {
                operator = "";
                operatorChosen = false;
                stage = 0;
                numState[1] = true;
            }
        }
        updateDisplay();
    }
    else if(button === "=")
    {
        calculate();
    }
    else if(button === "A")
    {
        if(previousAnswer !== "ERROR")
        {
            if(stage === 0)
            {
                num[0] = previousAnswer.toString();
                numState[0] = numState[2];
                updateDisplay();
            }
            else if(stage === 1)
            {
                num[1] = previousAnswer.toString();
                numState[1] = numState[2];
                updateDisplay();
            }
        }
    }
    else if(button === "!")
    {
        num1 = Number(num[0]);
        
        if(!numState[0])
        {
            num1 *= -1;
        }        
        if(stage === 0 || stage === 2)
        {
            if(num1 === 0)
            {
                display.innerHTML = 1;
                previousAnswer = 1;
            }
            else if(num1 < 0)
            {
                display.innerHTML = "CAN\'T DO ! OF NEGATIVE NUM";
                previousAnswer = "ERROR";
                stage = 3;
            }
            else if(isFloat(num1.toString()))
            {
                display.innerHTML = "UNABLE TO DO ! OF FLOAT";
                previousAnswer = "ERROR";
                stage = 3;
            }
            else
            {
                var answer = factorial(num1);
                display.innerHTML = answer;
                previousAnswer = answer;
            }        

            if(stage !== 3)
            {
                stage = 2;
            }
        }
    }
    else if(button === "CE")
    {
        clearE();
    }
    else if(button === "sqrt")
    {
        var num1 = Number(num[0]);

        if(!numState[0])
        {
            num1 *= -1;
        }

        if(num1 < 0)
        {
            display.innerHTML = "CAN'T DO ROOT OF NEG NUM";
            previousAnswer = "ERROR";
            stage = 3;
        }
        else if (stage === 0)
        {
            var answer = Math.sqrt(num1);
            display.innerHTML = answer;
            previousAnswer = answer;
        }
        else if(stage === 2)
        {
            var answer = Math.sqrt(previousAnswer);
            display.innerHTML = answer;
            previousAnswer = answer;
        }

        if(stage !== 3)
        {
            stage = 2;
        }
    }
};

//Handles operator presses ...
var handleOperatorPress = function(button)
{
    if(stage === 0)
    {
        operator = button;
        operatorChosen = true;
        stage++;
        updateDisplay();
    }
    else if (stage === 1 || stage === 2)
    {
        
        calculate();
        var stage2 = stage;
        clearE();
                
        num[0] = previousAnswer.toString();
        numState[0] = numState[2];
        numState[2] = true;
        
        if(previousAnswer === "ERROR CANNOT DIVIDE BY 0")
        {
            display.innerHTML = previousAnswer;
            previousAnswer = "ERROR";
        }
        
        operator = button;
        operatorChosen = true;
        
        if(stage2 === 3)
        {
            stage = 3;
        }
        else
        {
            stage = 1;
        }
        
        updateDisplay();
    }
};

//Handles num button presses ... writes them to the num for the current stage
var handleNumPress = function(button)
{
    if(stage === 2)
    {
        clearE();
    }
    
    if(stage === 0 || stage === 1)
    {
        if(num[stage].length === 1)
        {
            if(button !== 0)
            {
                if(num[stage] === "0")
                {
                    num[stage] = button.toString();
                    updateDisplay();
                }
                else
                {
                    num[stage] += button.toString();
                    updateDisplay();
                }
            }
            else if(num[stage] !== "0")
            {
                num[stage] += button.toString();
                updateDisplay();
            }
        }
        else if(isFloat(num[stage]))
        {
            if(num[stage].length < 11)
            {
                num[stage] += button;
                updateDisplay();
            }
        }
        else
        {
            if(num[stage].length < 10)
            {
                num[stage] += button;
                updateDisplay();
            }
        }
    }
};

//Set the onclick funciton for all buttons
for(var index = 0; index < numButtons.length; index++)
{
    numButtons[index].onclick = function(){handleNumPress(Number(this.innerHTML))}
}

for(var index = 0; index < operators.length; index++)
{
    operators[index].onclick = function(){handleOperatorPress(this.innerHTML)}
}

for(var index = 0; index < funcs.length; index++)
{
    if(funcs[index].innerHTML === plusMinusImg.innerHTML)
    {
        funcs[index].onclick = function(){handleFunctionPress("+-");}
    }
    else if(funcs[index].innerHTML === sqrtImg.innerHTML)
    {
        funcs[index].onclick = function(){handleFunctionPress("sqrt");}
    }
    else
    {
        funcs[index].onclick = function(){handleFunctionPress(this.innerHTML);}
    }
}