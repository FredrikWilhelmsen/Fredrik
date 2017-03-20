//Canvas element, used for drawing
var canvas = document.getElementById("canvas").getContext("2d");

//Edit stroke width
canvas.lineWidth = 2;

//Set width and height of border around the canvas
document.getElementById("border").style.width = document.getElementById("canvas").width + "px";
document.getElementById("border").style.height = document.getElementById("canvas").height + "px";

//Defines globalvariables
var ScreenHeight = document.getElementById("canvas").height;
var ScreenWidth = document.getElementById("canvas").width;
var MouseX = 0;
var MouseY = 0;

//Custom rgb function, creates the necessary string and returns it
var rgb = function(r, g, b, a=100){
    return "rgba(" + r + ", " + g + ", " + b + ", " + ( a / 100 ) + ")";
};

//Game variables
var game = {
    scene : "menu",
    fieldHeight : ScreenHeight / 5 * 3,
    bglh : ScreenHeight / 20,
    ballSpeed : ScreenWidth / 165,
    ballSize : ScreenWidth / 50,
    ballAcceleration : 1.0002,
    paddleSpeed : ScreenWidth / 165,
    paddleSize : ScreenWidth / 7,
    scoreToWin : 5,
    aiSpeed : ScreenWidth / 300,
    p1Score : 0,
    p2Score : 0,
    p1Up : "ArrowUp",
    p1UpPressed : false,
    p1UpEdit : false,
    p1Down : "ArrowDown",
    p1DownPressed : false,
    p1DownEdit : false,
    p2Up : "w",
    p2UpPressed : false,
    p2UpEdit : false,
    p2Down : "s",
    p2DownPressed : false,
    p2DownEdit : false,
    winner : "",
};

game.checkBalls = function(){
    for(var index = 0; index < balls.length; index++){
        if(balls[index].getState()){
            return false;
        }
    }
    return true;
};

game.updatePoints = function(player){
    if(player === 1){
        this.p1Score++;
    }
    else{
        this.p2Score++;
    }
    
    if(this.p1Score === this.scoreToWin){
        game.winner = "Player 1 Wins!";
        game.scene = "end";
    }
    else if(this.p2Score === this.scoreToWin){
        game.winner = "Player 2 Wins!";
        game.scene = "end";
    }
    else if(this.checkBalls()){
        for(var index = 0; index < balls.length; index++){
            balls[index].spawn();
        }
    }
};

//Canvas functions, simplifies drawing later
var setColor = function(color){
    canvas.fillStyle = color;
    canvas.strokeStyle = color;
};

var rect = function(x, y, width, height){
    canvas.fillRect(x, y, width, height);
};

var textAlign = function(align){
    canvas.textAlign = align;
};

var text = function(x, y, text){
    canvas.fillText(text, x, y);
};

var font = function(textSize, font){
    canvas.font = textSize + "px " + font;
};

var border = function(x, y, width, height){
    canvas.strokeRect(x, y, width, height);
};

//Converts degrees to radians
var rotate = function(v){
    canvas.rotate(v * Math.PI / 180);
};

var translate = function(x, y){
    canvas.translate(x, y);
};

var line = function(x1, y1, x2, y2){
    canvas.beginPath();
    canvas.moveTo(x1, y1);
    canvas.lineTo(x2, y2);
    canvas.stroke();
};

var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000/60) };

//Slider class
class Slider {
    //Creates the necessary variables to track the slider with x and y as the center
    constructor(x, y, length, width, height, color, min, max, name, textSize, font, scene, id, def=null){
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        this.height = height;
        this.color = color;
        this.min = min;
        this.max = max;
        this.name = name;
        this.textSize = textSize;
        this.font = font;
        this.scene = scene;
        this.selected = false;
        this.value = min;
        this.sliderX = x - length / 2;
        this.id = id;
        
        if(def !== null && def >= this.min && def <= this.max){
            this.value = def;
            this.sliderX = ( ( this.value - this.max ) * this.length ) / ( this.max - this.min ) + this.x + this.length / 2
        }
    }
    
    //Draws slider if the current scene is the same as the scene for the slider
    draw(){
        if(this.scene === game.scene){
            //Draws the lines
            setColor(rgb(0, 0, 0));
            line(this.x - this.length / 2, this.y, this.x + this.length / 2, this.y);
            line(this.x - this.length / 2, this.y - ScreenHeight / 200, this.x - this.length / 2, this.y + ScreenHeight / 200);
            line(this.x, this.y - ScreenHeight / 200, this.x, this.y + ScreenHeight / 200);
            line(this.x + this.length / 2, this.y - ScreenHeight / 200, this.x + this.length / 2, this.y + ScreenHeight / 200);
            //Draws the slider box
            setColor(this.color);
            rect(this.sliderX - this.width / 2, this.y - this.height / 2, this.width, this.height);
            //Draws the name of the slider as well as the value
            setColor(rgb(0, 0, 0));
            font(this.textSize, this.font);
            textAlign("center");
            text(this.x, this.y - this.height, this.name + " : " + this.value);
        }
    }
    
    //Handles the main value logic for the slider
    logic(){
        //If the slider is held down and the current scene is the same as the slider's scene
        if(this.selected && game.scene === this.scene){
            //If the cursor is within the bounds of the slider, move the slider
            if(MouseX > this.x - this.length / 2 && MouseX < this.x + this.length / 2){
                this.sliderX = MouseX;
                this.value = Math.round(this.max + ( this.sliderX - this.x - this.length / 2 ) / this.length * ( this.max - this.min ));
            }
            //If the cursor is outside the bounds of the slider, lock the slider on the far end
            else if(MouseX < this.x - this.length / 2){
                this.sliderX = this.x - this.length / 2;
                this.value = this.min;
            }
            else if(MouseX > this.x + this.length / 2){
                this.sliderX = this.x + this.length / 2;
                this.value = this.max;
            }
        }
    }
    
    //If the mouse is released, unselect the slider
    release(){
        this.selected = false;
    }
    
    //If the slider is clicked, select the slider
    onclick(){
        if(this.isInside()){
            this.selected = true;
        }
    }
    
    //Check to see if the cursor is within the bounds of the slider box
    isInside(){
        return  this.sliderX - this.width / 2 < MouseX && this.sliderX + this.width / 2 > MouseX && 
                this.y - this.height / 2 < MouseY && this.y + this.height / 2 > MouseY;
    }
}

//Button class
class Button {
    //Create the variables necessary to track the button
    constructor(x, y, width, height, color1, color2, borderColor1, borderColor2, text, textColor1, textColor2, textSize, font, scene, fnct){
        this.x = x - width / 2;
        this.y = y - height / 2;
        this.width = width;
        this.height = height;
        this.color1 = color1;
        this.color2 = color2;
        this.borderColor1 = borderColor1;
        this.borderColor2 = borderColor2;
        this.text = text;
        this.textColor1 = textColor1;
        this.textColor2 = textColor2;
        this.textSize = textSize;
        this.font = font;
        this.scene = scene;
        this.fnct = fnct;
    }
    
    //Draws the button if the current scene is the same as the button's scene
    draw(){
        if(this.scene === game.scene){
            //If the mouse is inside the bounds of the button, use the first color, else use the second color
            if(this.isInside()){
                //Draw the background of the button
                setColor(this.color1);
                rect(this.x, this.y, this.width, this.height);
                //Draw the border of the button
                setColor(this.borderColor1);
                border(this.x, this.y, this.width, this.height);
                //Draw the text on the button
                setColor(this.textColor1);
                textAlign("center");
                font(this.textSize, this.font);
                text(this.x + this.width / 2, this.y + this.height / 2 + this.textSize / 3, this.text);
            }
            else {
                setColor(this.color2);
                rect(this.x, this.y, this.width, this.height);
                setColor(this.borderColor2);
                border(this.x, this.y, this.width, this.height);
                setColor(this.textColor2);
                textAlign("center");
                font(this.textSize, this.font);
                text(this.x + this.width / 2, this.y + this.height / 2 + this.textSize / 3, this.text);
            }
        }
    }
    
    //Onclick function for the button. If the current scene is the same as the button's scene and if the cursor is within the bounds of the button the function is called. If it is successfull return true, else false
    onclick(){
        if(this.isInside() && this.scene === game.scene){
            this.fnct();
            return true;
        }
        return false;
    }
    
    //Returns true if the cursor is within the bounds of the button
    isInside(){
        return  this.x < MouseX && this.x + this.width > MouseX && 
                this.y < MouseY && this.y + this.height > MouseY;
    }
}

//Box class
class TextBox {
    //Create the variables necessary to track the box
    constructor(x, y, width, height, color, borderColor, text, textColor, textSize, font, scene){
        this.x = x - width / 2;
        this.y = y - height / 2;
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderColor = borderColor;
        this.text = text;
        this.textColor = textColor;
        this.textSize = textSize;
        this.font = font;
        this.scene = scene;
    }
    
    //Draws the box if the current scene is the same as the box's scene
    draw(){
        if(this.scene === game.scene){
            //Draw the background of the box
            setColor(this.color);
            rect(this.x, this.y, this.width, this.height);
            //Draw the border of the box
            setColor(this.borderColor);
            border(this.x, this.y, this.width, this.height);
            //Draw the text on the box
            setColor(this.textColor);
            textAlign("center");
            font(this.textSize, this.font);
            text(this.x + this.width / 2, this.y + this.height / 2 + this.textSize / 3, this.text());
        }
    }
}

class Paddle {
    constructor(side, size, color, speed, ai){
        this.y = ScreenHeight / 2 - size / 2;
        this.width = ScreenWidth / 30;
        this.side = side;
        
        if(side === "left"){
            this.x = this.width * 2 - this.width / 2;
        }
        else {
            this.x = ScreenWidth - this.width * 2 + this.width / 2 - this.width;
        }
        
        this.height = size;
        this.color = color;
        this.speed = speed;
        this.ai = ai;
        this.scene = "game";
    }
    
    getX(){
        return this.x;
    }
    
    getY(){
        return this.y;
    }
    
    getWidth(){
        return this.width;
    }
    
    getHeight(){
        return this.height;
    }
    
    draw(){
        if(this.scene === game.scene){
            setColor(this.color);
            rect(this.x, this.y, this.width, this.height);
        }
    }
    
    up(){
        if(this.y - this.speed >= ScreenHeight / 2 - game.fieldHeight / 2){
            this.y -= this.speed;
        }
    }
    
    down(){
        if(this.y + this.speed + this.height <= ScreenHeight / 2 + game.fieldHeight / 2){
            this.y += this.speed;
        }
    }
    
    logic(){
        if(this.scene === game.scene){
            if(this.ai){
                //Find closest ball
                var ball = balls[0];
                for(var index = 0; index < balls.length; index++){
                    if(balls[index].getState() && balls[index].getX() < ball.getX()){
                        ball = balls[index];
                    }
                }
                
                if(ball.getY() + ball.getSize() / 2 < this.y + this.height / 2 - this.speed){
                    this.up();
                }
                else if(ball.getY() + ball.getSize() / 2 > this.y + this.height / 2 + this.speed){
                    this.down();
                }
            }
            else {
                if(this.side === "right"){
                    if(game.p1UpPressed){
                        this.up();
                    }
                    if(game.p1DownPressed){
                        this.down();
                    }
                }
                else if(this.side === "left"){
                    if(game.p2UpPressed){
                        this.up();
                    }
                    if(game.p2DownPressed){
                        this.down();
                    }
                }
            }
        }
    }
    
}

class Ball {
    constructor(size, color, speed, acc){
        this.size = size;
        this.color = color;
        this.acc = acc;
        this.startSpeed = speed;
        this.speed = speed;
        this.scene = "game";
        this.x;
        this.y;
        this.vector;
        this.in;
        this.spawn();
    }
    
    spawn(){
        //Reset speed
        this.speed = this.startSpeed;
        //Create and rotate vector by a random angle
        var max = 60;
        var min = 0;
        var angle = Math.floor( Math.random() * ( max - min + 1 ) + min );
        //Calculate radian
        var s = this.speed;
        angle = angle * Math.PI / 180;
        var vec = {
            x : s * Math.cos(angle).toFixed(2),
            y : s * Math.sin(angle).toFixed(2),
        }
        
        switch(Math.round(Math.floor( Math.random() * ( 5 - 1 ) + 1 ))){
            case 2:
                vec.x *= -1;
                break;
            case 3:
                vec.y *= -1;
                break;
            case 4:
                vec.x *= -1;
                vec.y *= -1;
                break;
        }
        this.x = ScreenWidth / 2 - this.size / 2;
        this.y = ScreenHeight / 2 - this.size / 2;
        this.vector = vec;
        this.in = true;
    }
    
    getX(){
        return this.x;
    }
    
    getY(){
        return this.y;
    }
    
    getSize(){
        return this.size;
    }
    
    getState(){
        return this.in;
    }
    
    draw(){
        if(this.scene === game.scene && this.in){
            setColor(this.color);
            rect(this.x, this.y, this.size, this.size);
        }
    }
    
    hit(index){     
        return  this.x < paddles[index].getX() + paddles[index].getWidth() && 
                this.x + this.size > paddles[index].getX() && 
                this.y < paddles[index].getY() + paddles[index].getHeight() && 
                this.size + this.y > paddles[index].getY();
    }
    
    logic(){
        if(this.scene === game.scene && this.in){
            //Turn direction upon impact with a wall
            if(this.y + this.vector.y + this.size > ScreenHeight / 2 + game.fieldHeight / 2 || this.y + this.vector.y <= ScreenHeight / 2 - game.fieldHeight / 2){
                this.vector.y *= -1;
            }
            
            //Turn direction upon impact with a paddle
            for(var index = 0; index < paddles.length; index++){
                if(this.hit(index)){
                    if(this.x + this.size < paddles[index].getX() + this.vector.x * 2 || this.x > paddles[index].getX() + paddles[index].getWidth() + this.vector.x * 2){
                        //Collides with the side of a paddle
                        var ballY = this.y + this.size / 2;
                        var paddleY = paddles[index].getY() + paddles[index].getHeight() / 2;
                        var angle = -(paddleY - ballY) / paddles[index].getHeight() * 50;
                        //Calculate radian
                        var s = this.speed;
                        angle = angle * Math.PI / 180;
                        var vec = {
                            x : s * Math.cos(angle).toFixed(2),
                            y : s * Math.sin(angle).toFixed(2),
                        }
                        if(this.vector.x > 0){
                            vec.x *= -1;
                        }
                        this.vector = vec;
                    }
                    else if(this.y + this.size < paddles[index].getY() + this.vector.y * 2 || this.y > paddles[index].getY() + paddles[index].getHeight() + this.vector.y * 2){
                        //Collides with the top of bottom of a paddle
                        this.vector.y *= -1;
                    }
                }
            }
            //Move the ball
            this.y += this.vector.y;
            this.x += this.vector.x;
            
            this.vector.x *= this.acc;
            this.vector.y *= this.acc;
            this.speed *= this.acc;
            
            //Check to see if the ball is outside the bounds of the field
            if(this.x > ScreenWidth){
                this.in = false;
                game.updatePoints(2);
            }
            else if(this.x + this.size < 0){
                this.in = false;
                game.updatePoints(1);
            }
        }  
    }
}

//Draws the specified scene
var drawMenu = function(){
    //Set Background
    setColor(rgb(86, 151, 255));
    rect(0, 0, ScreenWidth, ScreenHeight);
    //Draw stripes at a 45 degree angle
    rotate(45);
    setColor(rgb(0, 0, 0, 50));
    for(var index = -ScreenHeight; index < ScreenHeight; index += game.bglh * 2){
        rect(0, index, ScreenWidth * 2, game.bglh);
    }
    rotate(-45);
};

var drawSettings = function(){
    //Set Background
    setColor(rgb(86, 151, 255));
    rect(0, 0, ScreenWidth, ScreenHeight);
};

var drawControls = function(){
    //Set Background
    setColor(rgb(86, 151, 255));
    rect(0, 0, ScreenWidth, ScreenHeight);    
};

var drawHelp = function(){
    //Set Background
    setColor(rgb(86, 151, 255));
    rect(0, 0, ScreenWidth, ScreenHeight);
};

var drawGame = function(){
    //Set background
    setColor(rgb(50, 50, 50));
    rect(0, 0, ScreenWidth, ScreenHeight);
    
    //Draw field background
    setColor(rgb(0, 0, 0));
    rect(0, ScreenHeight / 2 - game.fieldHeight / 2, ScreenWidth, game.fieldHeight);
    
    //Draw borders of the playingfield
    setColor(rgb(255, 255, 255));
    border(0, ScreenHeight / 2 - game.fieldHeight / 2, ScreenWidth, game.fieldHeight);
};

var drawEnd = function(){
    //Set Background
    setColor(rgb(86, 151, 255));
    rect(0, 0, ScreenWidth, ScreenHeight);
};

//Calls the drawing function for the current scene as well as the buttons, textboxes, ball, paddles, and sliders
var draw = function(){
    switch(game.scene){
        case "menu":
            drawMenu();
            break;
        case "settingsp1":
        case "settingsp2":
        case "settingsp3":
        case "settingsp4":
        case "settingsp5":
        case "settingsp6":
            drawSettings();
            break;
        case "help":
            drawHelp();
            break;
        case "ctrl":
            drawControls();
            break;
        case "game":
            drawGame();
            break;
        case "end":
            drawEnd();
            break;
    }  
    
    for(var index = 0; index < buttons.length; index++){
        buttons[index].draw();
    }
    
    for(var index = 0; index < sliders.length; index++){
        sliders[index].draw();
    }
    
    for(var index = 0; index < textBoxes.length; index++){
        textBoxes[index].draw();
    }
    
    for(var index = 0; index < paddles.length; index++){
        paddles[index].draw();
    }
    
    for(var index = 0; index < balls.length; index++){
        balls[index].draw();
    }
    animate(draw);
};

var findId = function(id){
    for(var index = 0; index < sliders.length; index++){
        if(sliders[index].id === id){
            return index;
        }
    }
};

var initialize = function(code){
    balls = [];
    paddles = [];
    game.p1Score = 0;
    game.p2Score = 0;
    
    game.scoreToWin = sliders[findId("score")].value;
    paddles.push(new Paddle("right", game.paddleSize * sliders[findId("paddlesize")].value / 100, rgb(sliders[findId("paddlered")].value, sliders[findId("paddlegreen")].value, sliders[findId("paddleblue")].value), game.paddleSpeed * sliders[findId("paddlespeed")].value / 100, false));
    
    if(code === "ai"){
        paddles.push(new Paddle("left", game.paddleSize * sliders[findId("paddlesize")].value / 100, rgb(sliders[findId("paddlered")].value, sliders[findId("paddlegreen")].value, sliders[findId("paddleblue")].value), game.aiSpeed * sliders[findId("ai")].value / 100, true));
    }
    else {
        paddles.push(new Paddle("left", game.paddleSize * sliders[findId("paddlesize")].value / 100, rgb(sliders[findId("paddlered")].value, sliders[findId("paddlegreen")].value, sliders[findId("paddleblue")].value), game.paddleSpeed * sliders[findId("paddlespeed")].value / 100, false));
    }
    
    //Add one ball to the game, will add setting to add more balls
    for(var index = 0; index < sliders[findId("balls")].value; index++){
        balls.push(new Ball(game.ballSize * sliders[findId("ballsize")].value / 100, rgb(sliders[findId("ballred")].value, sliders[findId("ballgreen")].value, sliders[findId("ballblue")].value), game.ballSpeed * sliders[findId("ballspeed")].value / 100, game.ballAcceleration * sliders[findId("ballacc")].value / 100));
    }
};

//Looping function. Handles logic for the game and the sliders
var logic = function(){
    for(var index = 0; index < sliders.length; index++){
        sliders[index].logic();
    }
    
    for(var index = 0; index < paddles.length; index++){
        paddles[index].logic();
    }
    
    for(var index = 0; index < balls.length; index++){
        balls[index].logic();
    }
    animate(logic);
};

//Updates the mouse coordinates when the mouse is moved over the canvas
var setMousePos = function(event) {
    var rect = document.getElementById("canvas").getBoundingClientRect();
    MouseX = event.clientX - rect.left;
    if(Math.round(event.clientY - rect.top) >= 0){
        MouseY = Math.round(event.clientY - rect.top);
    }
};

var used = function(key, code){
    if(game.p1Up === key && code !== 1){
        return true;
    }
    else if(game.p1Down === key && code !== 2){
        return true;
    }
    else if(game.p2Up === key && code !== 3){
        return true;
    }
    else if(game.p2Down === key && code !== 4){
        return true;
    }
    return false;
};

var pressKey = function(key){
    if(key === game.p1Up){
        game.p1UpPressed = true;
    }
    else if(key === game.p1Down){
        game.p1DownPressed = true;
    }
    else if(key === game.p2Up){
        game.p2UpPressed = true;
    }
    else if(key === game.p2Down){
        game.p2DownPressed = true;
    }
    
    if(game.p1UpEdit && !used(key, 1)){
        game.p1Up = key;
        game.p1UpEdit = false;
    }
    else if(game.p1DownEdit && !used(key, 2)){
        game.p1Down = key;
        game.p1DownEdit = false;
    }
    else if(game.p2UpEdit && !used(key, 3)){
        game.p2Up = key;
        game.p2UpEdit = false;
    }
    else if(game.p2DownEdit && !used(key, 4)){
        game.p2Down = key;
        game.p2DownEdit = false;
    }
};

var releaseKey = function(key){
    if(key === game.p1Up){
        game.p1UpPressed = false;
    }
    else if(key === game.p1Down){
        game.p1DownPressed = false;
    }
    else if(key === game.p2Up){
        game.p2UpPressed = false;
    }
    else if(key === game.p2Down){
        game.p2DownPressed = false;
    }
};

//Function for mouse press
var click = function(){
    for(var index = 0; index < buttons.length; index++){
        if(buttons[index].onclick()){
            break;
        }
    }
    
    for(var index = 0; index < sliders.length; index++){
        sliders[index].onclick();
    }
};

//Function for mouse release
var release = function(){
    for(var index = 0; index < sliders.length; index++){
        sliders[index].release();
    }
};

//Variable storing the balls
var balls = [];

//Array storing all (both) paddles
var paddles = [];

//Array storing all sliders
var sliders = [
    //Sliders for the first settings page
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 2, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 0, 255, "R", ScreenHeight / 25, "Arial", "settingsp1", "ballred", 255),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 3, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 0, 255, "G", ScreenHeight / 25, "Arial", "settingsp1", "ballgreen", 255),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 4, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 0, 255, "B", ScreenHeight / 25, "Arial", "settingsp1", "ballblue", 255),
    
    //Sliders for the second settings page
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 2, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 10, 200, "Speed %", ScreenHeight / 25, "Arial", "settingsp2", "ballspeed", 100),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 4, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 10, 200, "Size %", ScreenHeight / 25, "Arial", "settingsp2", "ballsize", 100),
    
    //Sliders for the third settings page
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 2, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 0, 255, "R", ScreenHeight / 25, "Arial", "settingsp3", "paddlegreen", 255),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 3, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 0, 255, "G", ScreenHeight / 25, "Arial", "settingsp3", "paddlered", 255),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 4, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 0, 255, "B", ScreenHeight / 25, "Arial", "settingsp3", "paddleblue", 255),
    
    //Sliders for the fourth settings page
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 2, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 10, 200, "Speed %", ScreenHeight / 25, "Arial", "settingsp4", "paddlespeed", 100),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 4, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 10, 200, "Size %", ScreenHeight / 25, "Arial", "settingsp4", "paddlesize", 100),
    
    //Sliders for the fifth settings page
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 2, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 1, 10, "Score", ScreenHeight / 25, "Arial", "settingsp5", "score", 5),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 4, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 10, 200, "AI %", ScreenHeight / 25, "Arial", "settingsp5", "ai", 100),
    
    //Sliders for the sixth settings page
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 2, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 1, 10, "Balls", ScreenHeight / 25, "Arial", "settingsp6", "balls", 1),
    new Slider(ScreenWidth / 2, ScreenHeight / 6 * 4, ScreenWidth / 5 * 2, ScreenWidth / 50, ScreenHeight / 25, rgb(200, 200, 200), 10, 200, "Ball Acc %", ScreenHeight / 25, "Arial", "settingsp6", "ballacc", 100),
];

//Array storing all buttons
var buttons = [
    //Menu buttons
    new Button(ScreenWidth / 2, ScreenHeight / 5 * 1, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Player vs Player", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "menu", function(){game.scene = "game"; initialize("pvp");}),
    new Button(ScreenWidth / 2, ScreenHeight / 5 * 2, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Player vs AI", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "menu", function(){game.scene = "game"; initialize("ai");}),
    new Button(ScreenWidth / 2, ScreenHeight / 5 * 3, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Settings", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "menu", function(){game.scene = "settingsp1";}),
    new Button(ScreenWidth / 2, ScreenHeight / 5 * 4, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Controls", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "menu", function(){game.scene = "ctrl";}),
    
    //Settings page 1 buttons
    new Button(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Next", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp1", function(){game.scene = "settingsp2";}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp1", function(){game.scene = "menu";}),
    
    //Settings page 2 buttons
    new Button(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Next", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp2", function(){game.scene = "settingsp3";}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp2", function(){game.scene = "settingsp1";}),
    
    //Settings page 3 buttons
    new Button(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Next", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp3", function(){game.scene = "settingsp4";}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp3", function(){game.scene = "settingsp2";}),
    
    //Settings page 4 buttons
    new Button(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Next", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp4", function(){game.scene = "settingsp5";}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp4", function(){game.scene = "settingsp3";}),
    
    //Settings page 5 buttons
    new Button(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Next", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp5", function(){game.scene = "settingsp6";}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 5, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "Back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp5", function(){game.scene = "settingsp4";}),
    
    //Settings page 6 buttons
    new Button(ScreenWidth / 2, ScreenHeight / 6 * 5, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp6", function(){game.scene = "settingsp5";}),
    
    //Controls page buttons
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 1, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "P1 Up", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 30, "Arial", "ctrl", function(){game.p1UpEdit = true; game.p1DownEdit = false; game.p2UpEdit = false; game.p2DownEdit = false}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 2, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "P1 Down", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 30, "Arial", "ctrl", function(){game.p1UpEdit = false; game.p1DownEdit = true; game.p2UpEdit = false; game.p2DownEdit = false}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 3, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "P2 Up", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 30, "Arial", "ctrl", function(){game.p1UpEdit = false; game.p1DownEdit = false; game.p2UpEdit = true; game.p2DownEdit = false}),
    new Button(ScreenWidth / 2 - ScreenWidth * 2 / 10 + ScreenWidth * 2 / 25, ScreenHeight / 6 * 4, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "P2 Down", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 30, "Arial", "ctrl", function(){game.p1UpEdit = false; game.p1DownEdit = false; game.p2UpEdit = false; game.p2DownEdit = true}),
    new Button(ScreenWidth / 2, ScreenHeight / 6 * 5, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "ctrl", function(){game.scene = "menu"; game.p1UpEdit = false; game.p1DownEdit = false; game.p2UpEdit = false; game.p2DownEdit = false}),
    
    //Game buttons
    new Button(ScreenWidth / 2, ScreenHeight / 10 * 9, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "game", function(){game.scene = "menu";}),
    
    //Game buttons
    new Button(ScreenWidth / 2, ScreenHeight / 10 * 9, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(255, 255, 255, 75), rgb(0, 0, 0, 75), rgb(0, 0, 0), rgb(255, 255, 255), "back", rgb(0, 0, 0), rgb(255, 255, 255), ScreenHeight / 25, "Arial", "end", function(){game.scene = "menu";}),
];

//Array storing all text boxes
var textBoxes = [
    //Settings page 1 text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 6, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Ball Color";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp1"),
    
    //Settings page 2 text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 6, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Ball Speed";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp2"),
    new TextBox(ScreenWidth / 2, ScreenHeight / 6 * 3, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Ball Size";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp2"),
    
    //Settings page 3 text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 6, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Paddle Color";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp3"),
    
    //Settings page 4 text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 6, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Paddle Speed";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp4"),
    new TextBox(ScreenWidth / 2, ScreenHeight / 6 * 3, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Paddle Size";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp4"),
    
    //Settings page 5 text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 6, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Score Limit";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp5"),
    new TextBox(ScreenWidth / 2, ScreenHeight / 6 * 3, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "AI Difficulty";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp5"),
    
    //Settings page 6 text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 6, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Number of balls";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp6"),
    new TextBox(ScreenWidth / 2, ScreenHeight / 6 * 3, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return "Ball Acceleration";}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "settingsp6"),
    
    //Game text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 10, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return game.p2Score + " : " + game.p1Score;}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "game"),
    
    //End text boxes
    new TextBox(ScreenWidth / 2, ScreenHeight / 2, ScreenWidth / 5 * 2, ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){return game.winner;}, rgb(255, 255, 255), ScreenHeight / 25, "Arial", "end"),
    
    //Controls page text boxes
    new TextBox(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 1, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){if(game.p1UpEdit){return "-"}else{return game.p1Up}}, rgb(255, 255, 255), ScreenHeight / 35, "Arial", "ctrl"),
    new TextBox(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 2, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){if(game.p1DownEdit){return "-"}else{return game.p1Down}}, rgb(255, 255, 255), ScreenHeight / 35, "Arial", "ctrl"),
    new TextBox(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 3, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){if(game.p2UpEdit){return "-"}else{return game.p2Up}}, rgb(255, 255, 255), ScreenHeight / 35, "Arial", "ctrl"),
    new TextBox(ScreenWidth / 2 + ScreenWidth * 2 / 10 - ScreenWidth * 2 / 25, ScreenHeight / 6 * 4, (ScreenWidth * 4 / 25), ScreenHeight / 10, rgb(0, 0, 0, 75), rgb(255, 255, 255), function(){if(game.p2DownEdit){return "-"}else{return game.p2Down}}, rgb(255, 255, 255), ScreenHeight / 35, "Arial", "ctrl"),
];

//Set eventlisteners on the canvas and tie them to their respective function
document.getElementById("canvas").addEventListener("mousemove", function(event) {setMousePos(event);}, false);
document.getElementById("canvas").addEventListener("mousedown", click);
document.getElementById("canvas").addEventListener("mouseup", release);
window.addEventListener("keydown", function(event){pressKey(event.key)});
window.addEventListener("keyup", function(event){releaseKey(event.key)});
//Disable selection of canvas
document.getElementById("canvas").onselectstart = function(){return false;};

//Start loops
animate(logic);
animate(draw);