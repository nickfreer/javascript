function menu() {
    const pages=[":HOME","pictures.html?teasets:Tea Services","pictures.html?archive:Archive","pictures.html?figures:figures","events"];
    const menuEle=document.querySelector("div.menu");
    basePath=window.localStorage.getItem("basePath");
    console.log("BASEPATH",basePath);
    pages.forEach(page => {
        [link,title]=page.split(":");
        title = (title==undefined) ? link : title;
            // title=link.replace("?","");
            // link=link.toLowerCase();
        
        console.log("PAGE:",link,title);
        const teasets=document.createElement("a");
        teasets.setAttribute("href",`${basePath}${link}`);
        teasets.innerText=title;
        menuEle.appendChild(teasets);
    });
}
