function timedvisibility(thing) {
  setTimeout(function () {
    thing.classList.toggle("notvisible");
  }, 500);
}

function toggle() {
  let help = document.getElementById("helptext");
  help.classList.toggle("openheight");
  let helpbutton = document.getElementById("helpbutton");
  helpbutton.classList.toggle("buttonon");
  let helptext = document.getElementById("helptextcontent");
  if (helptext.classList.contains("notvisible")) {
    timedvisibility(helptext);
  } else {
    helptext.classList.toggle("notvisible");
  }
}

function resizeUnderCanvas() {
  let innerHeight = document.getElementById("radiodiv").clientHeight;
  document
    .getElementById("undercanvas")
    .setAttribute("style", "min-height:" + innerHeight.toString() + "px");
}

const katexOptions = {
  delimeters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
};
// window stuff
document.addEventListener("DOMContentLoaded", () => {
  fetch("description.md")
    .then((res) => res.text())
    .then((s) => {
      document.getElementById("description").innerHTML = marked.parse(s);
      renderMathInElement(document.body, (options = katexOptions));
      resizeUnderCanvas();
    });
  spinner = document.getElementById("spinnericon");
});
window.addEventListener("resize", resizeUnderCanvas, true);

window.addEventListener("p5SetupComplete", () => {
  console.log("p5 setup complete");
  // radioDiv = document.getElementById("radiodiv");
  // renderMathInElement(radioDiv, (options = katexOptions));
  // resizeUnderCanvas();
});
