function main(){
    console.log(1);
    console.log(2);

    setTimeout(() => {
        console.log("asyncness");
    }, 2000);

    console.log(3);
    console.log(4);

    getFile(myDisplayer);

    // V1 of a promise
    const doit = () => {
        console.log("promising");
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                // resolve('finished');
                reject('failed');
            }, 5000); 
    })};

    doit().then(
        (resolve) => {    console.log(resolve);},
        // (reject)=> {     console.log(reject); }
    ).catch( reject => {console.log(reject); }
    );


    // V2 of a promise
    const doit2 = new Promise( (resolve,reject) =>{
            console.log("promising again");
            setTimeout(() => {
                // resolve('finished');
                reject('failed');
            }, 4000); 
    });
 
    // doit2.then(
    //     (resolve) => {    console.log(resolve);},
    //     (reject)=> {     console.log(reject); }
    // );
    doit2.then(
        (resolve) => {    console.log(resolve);},
        
    ).catch( reject => { console.log(reject); }
    );
}



function myDisplayer(some) {
    document.querySelector(".demo").innerHTML = some;
  }
  
  function getFile(myCallback) {
    let req = new XMLHttpRequest();
    req.open('GET', "mycar.html");
    req.onload = function() {
      if (req.status == 200) {
        myCallback(this.responseText);
      } else {
        myCallback("Error: " + req.status);
      }
    }
    req.send();
  }
  
  getFile(myDisplayer);
  
  
