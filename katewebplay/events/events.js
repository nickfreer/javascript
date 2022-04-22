let eventList=[];
let popOffTime=setTimeout(function(event) { popoff(event);},10);
let theEventTime="";
const now = new Date();
const nowDay=now.getDate();
const nowMnth = now.getMonth();
const nowYr = parseInt(now.getFullYear());

function main() {
    setup();
    readEvents();
    calendar();
    menu();
}

function setup () {
    localStorage.startDay="MON";
}

// Read list of Events from file
function readEvents() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && eventList.length==0) {   // stop it reading the file over and over
            console.log("STATUS:",xhr.status);
            events=xhr.responseText.split("\n");
            for (let i = 0; i < events.length; i++) {
                if(events[i].includes("#"))  {continue;}
                if(! events[i].includes("\t"))  {continue;}
                eventList.push(events[i]);
            }
            let called=0    //Stop repeats
            if( eventList.length > 0 && called==0) {
                called=1;
                eventList.sort((a,b)=>{
                    console.log("A",a);
                    console.log("B",b);
                    const linea=a.split(":");
                    const lineb=b.split(":");
                    console.log("LINEA",linea);
                    console.log("LINEB",lineb);
                    const datea=linea[0].split("/");
                    const dateb=lineb[0].split("/");
                    console.log("DATES",datea,dateb);
                    result=datea[2]-dateb[2];
                    if (result==0) {
                        result=datea[1]-dateb[1];
                    }
                    if (result==0) {
                        result=datea[0]-dateb[0];
                    }
                    console.log("RESULT",result);
                    return result;
                });
                console.log("GO",eventList);
                applyEvents();  // Apply 1st time now the data is available
                listOfEvents();
            }
        }
    };
    xhr.open("GET",`eventlist.txt`);
    a=xhr.send();
}

function calendar(month,year){
    // console.log("MONTH:",month,"YEAR:",year);
    // const startDay="MON";
    const startDay=localStorage.startDay;
    // const days=[ "Sunday", "Monday", "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"  ];
    const days=[ "SUN", "MON", "TUES" , "WED" , "THURS" , "FRI" , "SAT" ];
    const months=[ "January", "Febuary", "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December" ];
 
    if ((year==undefined && month==undefined) || (year=="TODAY" && month=="TODAY")){  // onload or from toady button
        month=nowMnth;
        year=nowYr;
    }
    localStorage.setItem("monNum",month);
    document.querySelector("#mon").textContent=months[month];  // display the month
    document.querySelector("#year").textContent=year;   // display the year
    setControls(year,nowYr,month,nowMnth);
    const startIdx=days.findIndex(day => {return day==startDay;});  // build top row from middle of days array
    let calDate=new Date(year, month,1,1,0,0,0);  // date for 1st of the month we are drawing
    let target=calDate.getDay()-startIdx;   // day number for 1st of the month, then factor in the start day to find where to put the 1st of the month
    if(target<0) {target+=7};
    // console.log("TARGET:",target);
    let dom=1;

    // make an empty table
    const calDiv=document.querySelector("div.cal");
    calDiv.removeChild(document.querySelector("table.cal"));
    const calTable=document.createElement("table");
    calTable.setAttribute("class","cal");
    calDiv.appendChild(calTable);

    // const calTable=document.querySelector("table.cal");
    // calTable.innerHTML = "";
    calTable.addEventListener("click",e =>{
        e.stopPropagation();
        if (e.target.tagName=="TH") {setStartDay(e.target.textContent);}
        if (e.target.tagName=="TD" && e.target.classList.contains("event")) {eventScroll(e);}
        if (e.target.tagName=="TABLE") {console.log("table");}
    });

    // Header Row
    let calRow=document.createElement("tr");
    calTable.appendChild(calRow);
    for (let idx = startIdx; idx < startIdx+7; idx++) {
        let calBox=document.createElement("th");
        idx>=7 ? i=idx-7 : i=idx;
        calBox.textContent=days[i];
        calRow.appendChild(calBox);
    }

    // numbers rows
    let idx=6;
    while(! (idx >= 6 && calDate.getMonth() != month)) {
        idx++;
        if(idx >=7 && calDate.getMonth() == month) {    // new row
            // console.log("NEW ROW");
            calRow=document.createElement("tr");
            calTable.appendChild(calRow);
            idx=0;
        }
        let calCell=document.createElement('td');
        if ((dom <=1 && idx < target) || calDate.getMonth() != month) { //blannks on 1st and last row
            calCell.setAttribute("class","blank");
        } else {
            if(year==nowYr && month==nowMnth && nowDay==dom){  //mark today
                calCell.setAttribute("class","today");
            } else {
                calCell.setAttribute("class","number");  // regular day
            } 
            calCell.textContent=dom;
            calCell.id=`day${dom}`;
            dom++;
        }
        calRow.appendChild(calCell);
        calDate=new Date(year, month,dom,1,0,0,0);

    }
    applyEvents();
}

// increment or decrement the calender by month or year
function nextDate(monPlus,yearPlus){
    // mon=parseInt(document.querySelector("#monNum").textContent);
    mon=parseInt(localStorage.getItem("monNum"));
    yr=parseInt(document.querySelector("#year").textContent);
    // console.log(mon,yr);
    // console.log(monPlus,yearPlus);
    mon+=monPlus;
    if (mon>11){
        yr++;
        mon=0;
    } else if(mon < 0) {
        yr--;
        mon=11;
    }
    yr+=yearPlus;
    // console.log(mon,yr);
    calendar(mon,yr);
}

// set the startday 
function setStartDay(day) {
    console.log("STARTDAY:",day);
    // document.querySelector("#startDay").textContent=day;  //set the new startday
    localStorage.startDay=day;
    // mon=parseInt(document.querySelector("#monNum").textContent);     // get the displayed month
    mon=parseInt(localStorage.monNum);
    yr= parseInt(document.querySelector("#year").textContent);       // get the disaplyed year
    calendar(mon,yr);    // redraw the calender
}

// find days in the dispalyed calendar the match events in the events file add an input to that box
function applyEvents() {
    pageYr=parseInt(document.querySelector("#year").textContent);
    pageMon=parseInt(localStorage.monNum);
    // pageMon=parseInt(document.querySelector("#monNum").textContent);
    for (let i = 0; i < eventList.length; i++) {
        line=eventList[i].split(":");
        [day,month,year]=line[0].split("/");
        
        // Add to the calender if we are in the right month and year
        if(month-1==pageMon && year==pageYr){
            // find the day 
            theDay=document.querySelector(`#day${day}`);
            theDay.setAttribute("class","event");
            theDay.id=`event${i}`;
            theDay.addEventListener("mouseover",e =>{
                e.stopPropagation();
                // console.log("TD event",e,e.type);
                eventer(e);        
            });
            theDay.addEventListener("mouseout",e =>{
                e.stopPropagation();
                // console.log("MOUSEOUT event",e,e.type);
                popoff(e);        
            });
        }
    }
}

function listOfEvents() {
    for (let i = 0; i < eventList.length; i++) {
        line=eventList[i].split(":");
        [day,month,year]=line[0].split("/");
        if (year>nowYr || (year==nowYr && month > nowMnth) || (year==nowYr && month == nowMnth && day >= nowDay )) {
            // add to the events at the bottom of the page
            const eventDiv=document.querySelector(".eventsList");
            const eventBox=document.createElement("div");
            eventBox.setAttribute("id",`evt${i}`)
            const eventDate=document.createElement("h2");
            const eventLine=document.createElement("p");
            const sepLine=document.createElement("hr");
            eventDate.textContent=line[0];
            eventLine.textContent=line[1];
            eventDiv.appendChild(eventBox);
            eventBox.appendChild(eventDate);
            eventBox.appendChild(eventLine);
            eventBox.appendChild(sepLine);
        }
    }
}

// popup window showing the relevent event from the file
function eventer(e) {
    clearTimeout(popOffTime);  // clear any timeout from previous popup
    const pop=document.createElement("div");
    var box=e.target.getBoundingClientRect();
    document.querySelector("div.popper").style['left']=box.right+window.scrollX;     // get X coord of mouse and set for the popup box
    document.querySelector("div.popper").style['top']=box.top+(box.height/2)+window.scrollY;      // get Y coord of mouse and set for the popup box
    // backOne(year,nowYear,month)  // set the back month and year controls
    eventNo=e.target.id;  
    row=parseInt(eventNo.substring(5,eventNo.length));  // get the N part as an int
    eventTxt=eventList[row].split(":");                 // split date and text
    message=`<div>DATE: ${eventTxt[0]}</div> <hr><div>EVENT: ${eventTxt[1]}</div>`;   // set the message as html
    document.querySelector("div.popper").innerHTML=message;                           // add message to box
    document.querySelector("div.popper").style['display']="initial";                  // show the box
    if (e.type == "click") {popOffTime=setTimeout(function(event) { popoff(event);},6000);}   // set timer for auto close
}

function eventScroll(e){
    lastEvent=localStorage.getItem("lastEvent");
    if (lastEvent != null) {
        clearTimeout(theEventTime);
        lastBox=document.querySelector(lastEvent);
        lastBox.setAttribute("class","");
    }
    eventNo=e.target.id;  
    row=parseInt(eventNo.substring(5,eventNo.length));
    eventBox=document.querySelector(`#evt${row}`);
    eventBox.scrollIntoView();
    eventBox.setAttribute("class","theEvent");
    theEventTime=setTimeout((e)=> { eventBox.setAttribute("class","");},2000);
    localStorage.setItem("lastEvent",`#evt${row}`);
}


function popoff(e) {
    clearTimeout(popOffTime);
    // console.log("POPOFF");
    document.querySelector("div.popper").style['display']="none";
}

function setControls(year,nowYr,month,nowMnth) {
    const today="calendar()";
    const backYear="nextDate(0,-1)";
    const backMon="nextDate(-1,0)";
    const forYear="nextDate(1,0)";
    const forMon="nextDate(0,1)";
    
    const controlList=[`today:${today}`,`backYear:${backYear}`,`backMon:${backMon}`,`forYear:${forYear}`,`forMon:${forMon}`];
    controlList.forEach(control=>{
        [element,setting]=control.split(":");
        document.querySelector(`#${element}`).setAttribute("class","");
        document.querySelector(`#${element}`).setAttribute("onclick",`${setting}`);
    })
    if (year==nowYr && month==nowMnth) {
        document.querySelector("#today").setAttribute("class","nogo");
        document.querySelector("#today").setAttribute("onclick","");
    } 
    if (year<nowYr) {
        document.querySelector("#backYear").setAttribute("class","nogo");
        document.querySelector("#backYear").setAttribute("onclick","");
        if (month == 0) {
            document.querySelector("#backMon").setAttribute("class","nogo");
            document.querySelector("#backMon").setAttribute("onclick","");
        }
    }
}