let t = Tree.randomTree('manual', [1, 0, 1]);
// let h = t.height;
let radius = 2;
let levelDiff;
let g = 1000;
let k = 0.1;
let gamma = 0.04;
let padding = 30;
let maxNodeCount = 150;

let canvas;
let isFullScreen = false;
let resizeButton;
let treeButton;

let testert = new Tree(
    new Tree(
        new Tree(), new Tree(), new Tree()
    ),
    new Tree(
        new Tree(
            new Tree(),
            new Tree(
                new Tree(), new Tree(), new Tree()
            )
        ),
        new Tree(
            new Tree(),
            new Tree(
                new Tree(), new Tree(), new Tree()
            )
        )
    ) // new Tree() is a single node 
);
let h = testert.height;
testert.setMultiplicities();

t = testert;

let positions = new Map();

function initializeMap(root, x, y, w) {
    if (root.children.length == 0) {
        positions.set(root, { x, y, vx: 0, vy: 0, ax: 0, ay: 0 });
    } else {
        let rArray = root.children.map(u => u.size / (u.height + 1));
        let rSum = rArray.reduce((a, b) => a + b);
        let wArray = rArray.map(r => w * r / rSum);
        wArray.reduce((acc, cur, k) => {
            initializeMap(root.children[k], x - w / 2 + acc + cur / 2 + random(0.01), y + levelDiff, cur);
            return acc + cur;
        }, 0);
        positions.set(root, {
            x,
            y,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
        });
    }
}

// console.log('tester tree height', testert.height, 'size', testert.size, 'left subtree height', testert.children[0].height, 'size', testert.children[0].size)

function newTree() {
    t = Tree.randomTree('manual', [8, 12, 6, 1]);
    // t = Tree.randomTree('manual', [1, 0, 1]);
    h = t.height;
    if (t.size <= maxNodeCount) {
        t.setMultiplicities();
        // let u = testert.children[0];
        // testert = testert.changeRoot(u);
        // testert.setMultiplicities();
        levelDiff = (height - 20) / h;
        positions = new Map();
        initializeMap(t, width / 2, 10, width);
        redraw();
        console.log('height', t.height, 'size', t.size);
        if (t.left != null) {
            console.log('left subtree height', t.left.height, 'size', t.left.size);
        }
    } else {
        newTree();
    }
}

function toggleFullScreen() {
    if (!isFullScreen) {
        resizeCanvas(window.innerWidth, window.innerHeight);
        resizeButton.html('<i class = "fa fa-compress"> </i>');
    } else {
        resizeCanvas(Math.floor(window.innerWidth * 3 / 4), Math.floor(window.innerHeight * 3 / 4));
        resizeButton.html('<i class = "fa fa-expand"> </i>');
    }
    isFullScreen = !isFullScreen;
    document.body.classList.toggle('fullscreen');
}

function windowResized() { // p5: runs when window is resized
    if (isFullScreen) {
        resizeCanvas(window.innerWidth, window.innerHeight);
    } else {
        resizeCanvas(Math.floor(window.innerWidth * 3 / 4), Math.floor(window.innerHeight * 3 / 4));
    }
}

// function repositionButtons() {
//     let pos = canvas.position();
//     let buttonSize = resizeButton.size();
//     resizeButton.position(pos.x + width - buttonSize.width, pos.y + height - buttonSize.height);
//     treeButton.position(pos.x, pos.y);
// }

function drawTree(root, x, y, w) {
    if (root.children.length == 0) {
        fill(0, 255 / (root.multiplicity), 255 - 255 / (root.multiplicity));
        circle(x, y, 2 * radius);
        text(root.multiplicity, x + 4, y + 2)
    } else {
        let rArray = root.children.map(u => u.size / (u.height + 1));
        let rSum = rArray.reduce((a, b) => a + b);
        let wArray = rArray.map(r => w * r / rSum);
        wArray.reduce((acc, cur, k) => {
            line(x, y, x - w / 2 + acc + cur / 2, y + levelDiff, cur)
            drawTree(root.children[k], x - w / 2 + acc + cur / 2, y + levelDiff, cur);
            return acc + cur;
        }, 0);
        fill(0, 255 / (root.multiplicity), 255 - 255 / (root.multiplicity));
        circle(x, y, 2 * radius);
        text(root.multiplicity, x + 4, y + 2)
    }
}

function drawTreeFromMap(root, positions, scalings) {
    let p = positions.get(root);
    let x;
    let y;
    if (scalings.minX === scalings.maxX && scalings.minY === scalings.maxY) {
        x = width / 2;
        y = height / 2;
    } else {
        x = map(p.x, scalings.minX, scalings.maxX, padding, width - padding);
        y = map(p.y, scalings.minY, scalings.maxY, padding, height - padding);
    }
    if (root.children.length == 0) {
        fill(255 - 255 / (root.multiplicity), 0, 255 / (root.multiplicity));
        circle(x, y, 2 * radius);
        text(root.multiplicity, x + 4, y + 2)
    } else {
        root.children.forEach(c => {
            q = positions.get(c);
            let x_ = map(q.x, scalings.minX, scalings.maxX, padding, width - padding);
            let y_ = map(q.y, scalings.minY, scalings.maxY, padding, height - padding);
            line(x, y, x_, y_);
            drawTreeFromMap(c, positions, scalings);
        })
        fill(255 - 255 / (root.multiplicity), 0, 255 / (root.multiplicity));
        circle(x, y, 2 * radius);
        text(root.multiplicity, x + 4, y + 2)
    }
}

function setup() {
    canvas = createCanvas(Math.floor(window.innerWidth * 3 / 4), Math.floor(window.innerHeight * 3 / 4));
    canvas.parent('canvas');
    stroke(0, 125);
    levelDiff = (height - 20) / h;
    textSize(8);
    // noLoop();
    initializeMap(t, width / 2, 10, width);
    resizeButton = createButton('Full Screen');
    resizeButton.html('<i class = "fa fa-expand"> </i>');
    resizeButton.mouseClicked(toggleFullScreen);
    resizeButton.addClass('bottomright'); 
    resizeButton.parent('canvas');

    treeButton = createButton('New Tree');
    treeButton.mouseClicked(newTree);
    
    treeButton.addClass('topleft');
    treeButton.parent('canvas');
}

function draw() {
    background(240);
    let scaleValue = min(width, height);
    let scalings = {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        }
        // update accelerations then velocities then positions
    positions.forEach((p, nodep) => {
        p.ax = 0;
        p.ay = 0;
        positions.forEach((q, nodeq) => {
            if (p != q) {
                let d = dist(p.x, p.y, q.x, q.y);
                let sx = (q.x - p.x) / d; // unit vector
                let sy = (q.y - p.y) / d;
                // repelling force between all nodes 
                p.ax += -g * sx / (d + 1) ** 2;
                p.ay += -g * sy / (d + 1) ** 2;
                if (t.areNeighbours(nodep, nodeq)) {
                    // attractive force 
                    // p.ax += g * sx / (d + 1) ** 2;
                    // p.ay += g * sy / (d + 1) ** 2;
                    // spring force 
                    p.ax += k * sx * (d - 100);
                    p.ay += k * sy * (d - 100);
                }
            }
        })
    })

    positions.forEach((p, node) => {
        p.vx += p.ax - gamma * p.vx;
        p.vy += p.ay - gamma * p.vy;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= scalings.minX) { scalings.minX = p.x; }
        if (p.x >= scalings.maxX) { scalings.maxX = p.x; }
        if (p.y <= scalings.minY) { scalings.minY = p.y; }
        if (p.y >= scalings.maxY) { scalings.maxY = p.y; }
    })

    drawTreeFromMap(t, positions, scalings);
}

// window stuff
window.onload = () => {
    fetch('description.txt')
        .then(res => res.text())
        .then(s => {
            document.getElementById('description').innerHTML = s;
        });
}