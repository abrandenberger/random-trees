let root = document.documentElement;

function toggle() {
    let help = document.getElementById("helptext");
    var height = help.scrollHeight;
    let maxH = height + 20;
    if (!help.classList.contains('openheight')) {
        // console.log(maxH.toString() + "px");
        root.style.setProperty('--maxHelpHeight', maxH.toString() + "px");
    }
    help.classList.toggle('closedheight');
    help.classList.toggle('openheight');
}

// window.onload = () => {
//     var l = help.offsetLeft;
//     var t = help.offsetTop;
//     print(l, t);
//     root.style.setProperty('--helpOffSetLeft', l.toString() + "px");
//     root.style.setProperty('--helpOffSetRight', t.toString() + 'px');
// }