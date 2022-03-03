
console.log("weee");
function main() {
    url=document.URL;
    console.log(url);
    list=document.URL.split("?")[1];
    console.log(list);
    setup();
}

function showpic(e) {
    document.querySelector(".activethumb").setAttribute("onclick","showpic(event)");
    document.querySelector(".activethumb").classList="thumb";
    srcBits=e.target.src.split("/");
    imagename=srcBits[srcBits.length-1];
    document.querySelector("img.big").src=`k_images/${imagename}`;
    titleRef=document.querySelector("h3.pic");
    titleRef.innerText=e.target.alt;
    e.target.classList="activethumb";
    e.target.setAttribute("onclick","");
}

 function setup() {
    file="teasets/itemlist.txt";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
            imagelist=xhr.responseText.split("\n");
            titleRef=document.querySelector("h2.pic");
            titleRef.innerText=imagelist[0];
            let columns='';
            for (let i = 1; i < imagelist.length; i++){
                if ((i-1)%5 == 0) {
                    columns+=`
        <td class="thumb">
            <h2 class="thumb"></h2>
            <ul>`;
                }

                let line = imagelist[i].split("\t");
                console.log(line[0]);
                columns+=`<input id="row${i}" type="image" class="thumb" src="k_thumbs/${line[0]}" alt="${line[1]}" onclick="showpic(event)">`;

                if (i%5 == 0) {
                    columns+=`
            </ul>
            <h3 class="thumb"></h3>
        </td>`;
                }

            }
            line = imagelist[1].split("\t");
            columns+=`
        <td class="pic">
            <h2 class="pic">${imagelist[0]}</h2>
            <img class="big" src="k_images/${line[0]}" alt="${line[1]}">
            <h3 class="pic">${line[1]}</h1>
        </td>`
            document.querySelector("tr.thumb").innerHTML=columns;
            document.querySelector("#row1").classList="activethumb";
            document.querySelector("#row1").setAttribute("onclick","");

            
        }
    };
    xhr.open("GET","teasets/itemlist.txt"); //assuming kgr.bss is plaintext
    xhr.send();

 }