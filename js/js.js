function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

document.getElementById("red").addEventListener("input", function(){
    var farge = rgbToHex(Number(document.getElementById("red").value), Number(document.getElementById("green").value), Number(document.getElementById("blue").value));
    document.getElementById("title").innerHTML = "farge : " + farge;
    document.getElementById("body").style.backgroundColor = farge;
});

document.getElementById("green").addEventListener("input", function(){
    var farge = rgbToHex(Number(document.getElementById("red").value), Number(document.getElementById("green").value), Number(document.getElementById("blue").value));
    document.getElementById("title").innerHTML = "farge : " + farge;
    document.getElementById("body").style.backgroundColor = farge;
});

document.getElementById("blue").addEventListener("input", function(){
    var farge = rgbToHex(Number(document.getElementById("red").value), Number(document.getElementById("green").value), Number(document.getElementById("blue").value));
    document.getElementById("title").innerHTML = "farge : " + farge;
    document.getElementById("body").style.backgroundColor = farge;
});