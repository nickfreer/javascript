function addnumbers(){
    var x=parseInt(document.getElementById("firstNumber").value);
    var y=parseInt(document.getElementById("secondtNumber").value);
    var sum = x + y;
    document.getElementById('answer').innerHTML = sum;
}