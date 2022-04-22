let pagePath='';
function main() {
    url=document.URL;
    console.log(url);
    var basePath=document.URL.split(/[a-z]*\.html/)[0];
    console.log("PATHS",basePath);
    basePath=basePath.split("?")[0];
    console.log("PATHS",basePath);
    window.localStorage.setItem("basePath",basePath);

    // basePath=basePath.substring(0,basePath.length-1);
    // basePath=basePath.split("/")[0];
    pagePath=document.URL.split("?")[1];
    // console.log("PATHS",basePath,pagePath);
    menu();

    if (url != basePath && url!=`${basePath}index.html`) {
        console.log("SETUP",url,basePath);
        setup();
    }
    
}

function showpic(e) {
    document.querySelector(".activethumb").setAttribute("onclick","showpic(event)");
    document.querySelector(".activethumb").classList="thumb";
    console.log(e.target.src);
    if(e.target.src.includes("/thumbs/") ) {
        srcBits=e.target.src.split("/");
        imagename=srcBits[srcBits.length-1];
        document.querySelector("img.pic").src=`${pagePath}/images/${imagename}`;
    } else {
        document.querySelector("img.pic").src=e.target.src;
    }
    titleRef=document.querySelector("h3.pic");
    titleRef.innerText=e.target.alt;
    e.target.classList="activethumb";
    e.target.setAttribute("onclick","");
}

 function setup() {
    console.log("SETUP",pagePath);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
            imagelist=xhr.responseText.split("\n");
            titleRef=document.querySelector("h2.pic");
            titleRef.innerText=imagelist[0];
            let line = imagelist[1].split("\t");
            if(line[0].includes("http://") || line[0].includes("https://" )) {
                document.querySelector("img.pic").src=`${line[0]}`;
            } else {
                document.querySelector("img.pic").src=`${pagePath}/images/${line[0]}`;
            }
            document.querySelector("h3.pic").innerText=`${line[1]}`;

            let columns='';
            count=0
            for (let i = 1; i < imagelist.length; i++){
                if(imagelist[i].includes("#"))  {continue;}
                let line = imagelist[i].split("\t");
                if(line[1]==undefined) {continue;}
                console.log(line[0],line[1]);
                if(line[0].includes("http://") || line[0].includes("https://" )) {
                    columns+=`<input id="row${i}" type="image" class="thumb" src="${line[0]}" alt="${line[1]}" onclick="showpic(event)">`;
                } else{
                    columns+=`<input id="row${i}" type="image" class="thumb" src="${pagePath}/thumbs/${line[0]}" alt="${line[1]}" onclick="showpic(event)">`;
                }

                count++;
            }
            
            document.querySelector("ul.thumb").innerHTML=columns;
            document.querySelector("#row1").classList="activethumb";
            document.querySelector("#row1").setAttribute("onclick","");
            // console.log(document.querySelector("ul.thumb"));
            // console.log(getComputedStyle(document.querySelector("ul.thumb")));
            document.querySelector("ul.thumb").style["columnCount"]=Math.ceil(count/5);
            console.log(Math.ceil(count/5));
        }
    };
    xhr.open("GET",`${pagePath}/itemlist.txt`); //assuming kgr.bss is plaintext
    xhr.send();

    // menu();
 }

 