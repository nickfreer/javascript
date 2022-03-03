let eventList=[];
let popOffTime=setTimeout(function(event) { popoff(event);},10);

function main(){
    readEvents();
    // calendar();
    // applyEvents();
}

// Read list of Events from file
function readEvents() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && eventList.length==0) {   // stop it reading the file over and over
            events=xhr.responseText.split("\n");
            for (let i = 0; i < events.length; i++) {
                if(events[i].includes("#"))  {continue;}
                if(! events[i].includes("\t"))  {continue;}
                eventList.push(events[i]);
            }
            let called=0    //Stop repeats
            if( eventList.length > 0 && called==0) {
                console.log("GO",eventList);
                calendar();
                called=1;
            }
        }
    };
    xhr.open("GET",`eventlist.txt`);
    a=xhr.send();
}

// Draw the calender
function calendar(month,year){
    console.log("==================================")
    console.log("MONTH:",month,"YEAR:",year);
    // const startDay="MON";
    const startDay=document.querySelector("#startDay").textContent;   // first day on calendar, changable
    // const days=[ "Sunday", "Monday", "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"  ];
    const days=[ "SUN", "MON", "TUES" , "WED" , "THURS" , "FRI" , "SAT" ];
    const months=[ "January", "Febuary", "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December" ];
    const now = new Date();
    const nowDay=now.getDate();
    const nowMnth = now.getMonth();
    const nowYr = parseInt(now.getFullYear());

    const startIdx=days.findIndex(day => {return day==startDay;});  // build top row from middle of days array
    table='<tr>';
    for (let i = startIdx; i < days.length; i++) {    //first half of row
        const element = days[i];
        table += `
            <th class="cal"><input class="cal" type="button" value="${days[i]}" onclick="startDay(event)"></th>`;
    }
    for (let i = 0; i < startIdx; i++) {      // second half of row
        const element = days[i];
        table += `
            <th class="cal"><input class="cal" type="button" value="${days[i]}" onclick="startDay(event)"></th>`;
    }
    table+='</tr>';
    

    if ((year==undefined && month==undefined) || (year=="TODAY" && month=="TODAY")){  // onload or from toady button
        month=nowMnth;
        year=nowYr;
        console.log(month,year);
    }
    console.log(month,year);

    document.querySelector("#monNum").textContent=month; //save so we can increment or decrement
    document.querySelector("#mon").textContent=months[month];  // display the month
    document.querySelector("#year").textContent=year;   // display the year

    calDate=new Date(year, month,1,1,0,0,0);  // date for 1st of the month we are drawing
    console.log(calDate);
    day1=calDate.getDay();  // get day number for 1st of the month
    console.log("DAY1",day1,calDate.getMonth());
    target=day1-startIdx;   // factor in the start day on the calendar to find where to put the 1st of the month
    if(target<0) {target+=7};
    console.log("TARGET:",target);
    dom=1;
    table+='</tr>';
    for (let i = 0; i < target; i++) { // blank days before the 1st
        table+=`
            <td class="blank"></td>`;
    }
    

    let idx=target-1;   // start from the last blank square
    console.log("DAY1",day1,calDate.getMonth());
    console.log(calDate);
    // Keep adding a day until day goes past end then month increases
    // {e.g Date(2022,1,32,....) shows as 1/2/2022 }
    while(calDate.getMonth() == month) {   
        idx++;
        if(idx >=7) {    // new row
            table+='</tr><tr>';
            idx=0;
        }
        if(year==nowYr && month==nowMnth && nowDay==dom){  //mark today
            table+=`
            <td id="day${dom}" class="today">${dom}</td>`;    
        } else {
            table+=`
            <td id="day${dom}" class="number">${dom}</td>`;
        }
        dom++;
        calDate=new Date(year, month,dom,1,0,0,0);
    }
    for (let i = idx+1; i<7; i++) {  // blank days at the end
        table+=`
        <td class="blank"></td>`;        
    }
    table+='</tr>';
    // console.log(table);
    document.querySelector("table.cal").innerHTML=table;   //show the calender
    applyEvents();
}


// increment or decrement the calender by month or year
function nextDate(monPlus,yearPlus){
    mon=parseInt(document.querySelector("#monNum").textContent);
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
function startDay(e) {
    document.querySelector("#startDay").textContent=e.target.value;  //set the new startday
    mon=parseInt(document.querySelector("#monNum").textContent);     // get the displayed month
    yr= parseInt(document.querySelector("#year").textContent);       // get the disaplyed year
    calendar(mon,yr);    // redraw the calender
}


// find days in the dispalyed calendar the match events in the events file add an input to that box
function applyEvents() {
    pageYr=parseInt(document.querySelector("#year").textContent);
    pageMon=parseInt(document.querySelector("#monNum").textContent);
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
            theDay.innerHTML=`<input id="event${i}"class="event" type="button" value="${day}" onclick="eventer(event)">`;
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
    document.querySelector("div.popper").style['left']=e.pageX;     // get X coord of mouse and set for the popup box
    document.querySelector("div.popper").style['top']=e.pageY;      // get Y coord of mouse and set for the popup box
    eventNo=e.target.id;                                // input id is eventN
    row=parseInt(eventNo.substring(5,eventNo.length));  // get the N part as an int
    console.log("ROW:",row);
    eventTxt=eventList[row].split(":");                 // split date and text
    message=`<div>DATE: ${eventTxt[0]}</div> <hr><div>EVENT: ${eventTxt[1]}</div>`;   // set the message as html
    document.querySelector("div.popper").innerHTML=message;                           // add message to box
    document.querySelector("div.popper").style['display']="initial";                  // show the box
    popOffTime=setTimeout(function(event) { popoff(event);},6000);                    // set timer for auto close
}

// hide popup if it is clicked on
function popoff(e) {
    clearTimeout(popOffTime);
    console.log("POPOFF");
    document.querySelector("div.popper").style['display']="none";
}
