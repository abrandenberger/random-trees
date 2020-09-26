function timedvisibility(thing) {
    setTimeout(function() {
        thing.classList.toggle('notvisible');
    }, 500);
}

function toggle() {
    let help = document.getElementById("helptext");
    help.classList.toggle('openheight');
    let helpbutton = document.getElementById("helpbutton");
    helpbutton.classList.toggle('buttonon');
    let helptext = document.getElementById("helptextcontent");
    if (helptext.classList.contains('notvisible')) {
        timedvisibility(helptext);
    }
    else {
        helptext.classList.toggle('notvisible');
    }
}