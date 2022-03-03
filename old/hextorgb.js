function hexStringToRGB(hexString) {
    let rgb=new Map();
    rgb.set(r) = parseInt(hexString.substr(1,2),16);
    rgb.set(g) = parseInt(hexString.substr(1,2),16);
    rgb.set(b) = parseInt(hexString.substr(1,2),16);
    return(rgb);
//   return(v1+' '+i1)+' '+t1+' '+t2+' '+t3;

}

// document.write(hexStringToRGB("#FF9933"));
document.write(hexStringToRGB("#FF9933"));
