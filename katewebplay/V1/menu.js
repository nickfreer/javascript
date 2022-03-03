    function yellow(id) {
        //alert(id);
        var name = parent.frames["leftFrame"].document.getElementById(id).innerHTML
        var last = parent.frames["leftFrame"].document.getElementById('last').innerHTML
        if (id == last) {return;}
        var lastVal = parent.frames["leftFrame"].document.getElementById('lastval').innerHTML
        //alert("ID:"+id+"\nNAME:"+name+"\nLAST:"+last+"\nLASTVAL:"+lastVal);
        //parent.frames["leftFrame"].location.reload();
        var newVal="<font color=\"#FFFFFFa\">" + name + "</font>";
        if (last) {parent.frames["leftFrame"].document.getElementById(last).innerHTML = lastVal;}
        parent.frames["leftFrame"].document.getElementById(id).innerHTML = newVal;
        parent.frames["leftFrame"].document.getElementById('last').innerHTML = id;
        parent.frames["leftFrame"].document.getElementById('lastval').innerHTML  = name;
    }

