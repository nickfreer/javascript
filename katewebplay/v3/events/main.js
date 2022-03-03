let eventList=[];
let popOffTime=setTimeout(function(event) { popoff(event);},10);
function main() {
    setup();
    readEvents();
    calendar();
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
                console.log("GO",eventList);
                applyEvents();  // Apply 1st time now the data is available
                called=1;
            }
        }
    };
    xhr.open("GET",`eventlist.txt`);
    a=xhr.send();
}

function calendar(month,year){
    console.log("==================================")
    console.log("MONTH:",month,"YEAR:",year);
    // const startDay="MON";
    // const startDay=document.querySelector("#startDay").textContent;   // first day on calendar, changable
    const startDay=localStorage.startDay;
    // const days=[ "Sunday", "Monday", "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"  ];
    const days=[ "SUN", "MON", "TUES" , "WED" , "THURS" , "FRI" , "SAT" ];
    const months=[ "January", "Febuary", "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December" ];
    const now = new Date();
    const nowDay=now.getDate();
    const nowMnth = now.getMonth();
    const nowYr = parseInt(now.getFullYear());
    if ((year==undefined && month==undefined) || (year=="TODAY" && month=="TODAY")){  // onload or from toady button
        month=nowMnth;
        year=nowYr;
        console.log(month,year);
    }
    // document.querySelector("#monNum").textContent=month; //save so we can increment or decrement
    localStorage.setItem("monNum",month);
    document.querySelector("#mon").textContent=months[month];  // display the month
    document.querySelector("#year").textContent=year;   // display the year
    const startIdx=days.findIndex(day => {return day==startDay;});  // build top row from middle of days array
    let calDate=new Date(year, month,1,1,0,0,0);  // date for 1st of the month we are drawing
    let target=calDate.getDay()-startIdx;   // day number for 1st of the month, then factor in the start day to find where to put the 1st of the month
    if(target<0) {target+=7};
    console.log("TARGET:",target);
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
        if (e.target.tagName=="TH") {
            console.log("TH");
            setStartDay(e.target.textContent); 
        }
        // if (e.taerget="TD") {
        if (e.target.tagName=="TD" && e.target.classList.contains("event")) {
            console.log("TD event");
            eventer(e);
        }
        
        if (e.target.tagName=="TABLE") {
            console.log("table");
        }
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
        console.log(calDate.getMonth(),month,idx,dom );
        idx++;
        if(idx >=7 && calDate.getMonth() == month) {    // new row
            console.log("NEW ROW");
            calRow=document.createElement("tr");
            calTable.appendChild(calRow);
            idx=0;
        }
        let calCell=document.createElement('td');
        if ((dom <=1 && idx < target) || calDate.getMonth() != month) { //blannks on 1st and last row
            console.log("BLANK:",dom,idx,target,calDate.getMonth(), month)
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
    console.log(mon,yr);
    console.log(monPlus,yearPlus);
    mon+=monPlus;
    if (mon>11){
        yr++;
        mon=0;
    } else if(mon < 0) {
        yr--;
        mon=11;
    }
    yr+=yearPlus;
    console.log(mon,yr);
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
        console.log(line[0]);
        [day,month,year]=line[0].split("/");
        console.log(day,month,year,"EQUALS?",pageMon,pageYr);
        if(month-1==pageMon && year==pageYr){
            // find the day 
            console.log("YEEEEEAH");
            theDay=document.querySelector(`#day${day}`);
            console.log(theDay);
            theDay.setAttribute("class","event");
            theDay.id=`event${i}`;
            theDay.addEventListener("mouseover",e =>{
                e.stopPropagation();
                console.log("TD event",e,e.type);
                eventer(e);        
            });
            theDay.addEventListener("mouseout",e =>{
                e.stopPropagation();
                console.log("TD event",e,e.type);
                popoff(e);        
            });
        }
    }
}

// popup window showing the relevent event from the file
function eventer(e) {
    clearTimeout(popOffTime);  // clear any timeout from previous popup
    // console.log("pageX: ",e.pageX, 
    // "pageY: ", e.pageY, 
    // "clientX: ", e.clientX, 
    // "clientY:", e.clientY)
    const pop=document.createElement("div");
    pop.style.left=e.pageX;
    pop.style.top=e.pageY;
    document.querySelector("div.popper").style['left']=e.pageX;     // get X coord of mouse and set for the popup box
    document.querySelector("div.popper").style['top']=e.pageY;      // get Y coord of mouse and set for the popup box
    eventNo=e.target.id;  
    console.log("eventno:",eventNo)                              // input id is eventN
    row=parseInt(eventNo.substring(5,eventNo.length));  // get the N part as an int
    console.log("ROW:",row);
    eventTxt=eventList[row].split(":");                 // split date and text
    message=`<div>DATE: ${eventTxt[0]}</div> <hr><div>EVENT: ${eventTxt[1]}</div>`;   // set the message as html
    document.querySelector("div.popper").innerHTML=message;                           // add message to box
    document.querySelector("div.popper").style['display']="initial";                  // show the box
    if (e.type == "click") {popOffTime=setTimeout(function(event) { popoff(event);},6000);}   // set timer for auto close
}

function popoff(e) {
    clearTimeout(popOffTime);
    console.log("POPOFF");
    document.querySelector("div.popper").style['display']="none";
}
