let radius = 2;
let levelDiff;
let g = 1000;
let k = 0.05;
let gamma = 0.04;
let padding = 30;
// let maxNodeCount = 150; // in  worker.js 
let spinner;
let clickRadius = 10;

let scalings = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
}

let canvas;
let isFullScreen = false;
let resizeButton;
let treeButton;
let radio;
let mode = 'physics'; // type Mode = physics | drawing :( 
let drawModeStartNode = null; // type DrawMode = Maybe Node :)

let clickedNode = null;

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
let t = testert;
let h = testert.height;
t.setMultiplicitiesDistances();

let initialValues = {vx: 0, vy: 0, ax: 0, ay: 0};

let positions = new Map();

function initializeMap(root, x, y, w) {
    /*Initialize the positions for a given tree rooted at 'root', where the map
    has tree nodes as keys, mapped to {x, y, vx, vy, ax, ay}. Here the tree is 
    drawn as a regular Tree. 
    */
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
            ...initialValues
        });
    }
}

// testing depth, LCA, and nodeDistances 
// console.log('tester tree height', testert.height, 'size', testert.size, 'left subtree height', testert.children[0].height, 'size', testert.children[0].size)
// console.log('tester tree depth', testert.depth, 'child depth', testert.children[1].depth, 'grandchild', testert.children[1].children[0].depth);
// console.log('LCA root', testert.LCA(testert.children[0], testert.children[1]) == testert, 'LCA right child',
    // testert.LCA(testert.children[1].children[0], testert.children[1].children[1]) == testert.children[1]);

function windowSize() {
    /* Get the default non-full-screen canvas size. */
    return [min(800, Math.floor(window.innerWidth * 3 / 4)), Math.floor(window.innerHeight * 3 / 4)]
}

function toggleFullScreen() {
    if (!isFullScreen) {
        resizeCanvas(window.innerWidth, window.innerHeight);
        resizeButton.html('<i class = "fa fa-compress"> </i>');
    } else {
        resizeCanvas(...windowSize());
        resizeButton.html('<i class = "fa fa-expand"> </i>');
    }
    isFullScreen = !isFullScreen;
    document.body.classList.toggle('fullscreen');
}

function windowResized() { // p5: runs when window is resized
    if (isFullScreen) {
        resizeCanvas(window.innerWidth, window.innerHeight);
    } else {
        resizeCanvas(...windowSize());
    }
}

function drawTreeFromMap(root, positions, scalings) {
    /* Draw the tree given the current position map of the tree. */
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

function newWorkerTree(type, distribution) {
    /* Create a new web worker that uses 'worker.js' and have it call  */
    spinner.style.visibility = 'visible';
    noLoop();
    clear();
    background(200);
    let worker = new Worker('worker.js');
    worker.addEventListener('message', (message) => {
        t = Tree.serializeAndGetDistances(message.data.tree);
        h = t.height;
        console.log('height', t.height, 'size', t.size);
        levelDiff = (height - 20) / h;
        positions = new Map();
        initializeMap(t, width / 2, 10, width);
        spinner.style.visibility = 'hidden';
        // redraw();
        loop();
    }, false);
    worker.postMessage({ type, distribution });
}

function setup() {
    canvas = createCanvas(...windowSize());
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
    treeButton.mouseClicked(() => {
        newWorkerTree('regular', radio.selected());
        mode = 'physics';
    });
    treeButton.addClass('topleft');
    treeButton.parent('canvas');

    bigButton = createButton('Big Tree');
    bigButton.mouseClicked(() => {
        newWorkerTree('bigtree', radio.selected());
        mode = 'physics';
    });
    bigButton.addClass('topright');
    bigButton.parent('canvas');

    customButton = createButton('Draw Tree');
    customButton.mouseClicked(() => {
        if (mode == 'drawing') {
            mode = 'physics';
            customButton.html('Draw Tree');
            treeButton.removeClass('hidden');
            bigButton.removeClass('hidden');
        } else if (mode == 'physics') {
            mode = 'drawing';
            t = new Tree();
            positions = new Map();
            positions.set(t, {
                x: width / 2,
                y: height / 8,
                ...initialValues
            });
            h = testert.height;
            t.setMultiplicitiesDistances();
            customButton.html('Done');
            treeButton.addClass('hidden');
            bigButton.addClass('hidden');
        }
    });
    customButton.addClass('bottomleft');
    customButton.parent('canvas');

    radio = createRadio(); 
    radio.option('\\(\\mathrm{Bin}(2, 1/2)\\)', 'man2');
    radio.option('\\(\\mathrm{Bin}(3, 1/3) \\)', 'man3'); 
    radio.option('\\(\\mathrm{Bin}(4, 1/4) \\)', 'man4'); 
    radio.option('\\(\\mathrm{Geom}(1/2)\\)', 'geometric'); //made 
    radio.option('\\(\\mathrm{Poisson}(1)\\)', 'poisson');
    radio.selected('man3');
    radio.addClass('radio');
    radio.parent('radiodiv');
}


function physToCanvas(scalings, x, y) {
    return [map(x, scalings.minX, scalings.maxX, padding, width - padding), map(y, scalings.minY, scalings.maxY, padding, height - padding)];
}

function canvasToPhys(scalings, x, y) {
    return [map(x, padding, width - padding, scalings.minX, scalings.maxX), map(y, padding, height - padding, scalings.minY, scalings.maxY)];
}

function mousePressed() {
    let nodeList = t.getAllNodes();
    clickedNode = null;
    nodeList.forEach(n => {
        let [nodeX, nodeY] = physToCanvas(scalings, positions.get(n).x, positions.get(n).y);
        if (dist(nodeX, nodeY, mouseX, mouseY) < clickRadius) {
            clickedNode = n;
            cursor('grab');
        }
    });
}

function mouseReleased() {
    clickedNode = null;
    cursor(ARROW);
}

function mousedOver(scalings, positions, mouseX, mouseY) {
    let ret = null;
    positions.forEach((p, node) => {
        let [nodeX, nodeY] = physToCanvas(scalings, p.x, p.y);
        if (dist(nodeX, nodeY, mouseX, mouseY) < clickRadius) {
            ret = node;
        }
    });
    return ret; 
}

function draw() {
    background(240);

    if (mode == 'physics') {
        update();
        if (mousedOver(scalings, positions, mouseX, mouseY) != null) {
            cursor('grab');
        } else {
            cursor(ARROW);
        }
    }

    if (mode == 'drawing') {
        scalings = {
            minX: padding,
            minY: padding,
            maxX: width - padding,
            maxY: height - padding
        }
        
        if (drawModeStartNode != null) {
            noCursor();
            fill('black');
            circle(mouseX, mouseY, 2 * radius);
            let pos = positions.get(drawModeStartNode);
            let startX = pos.x;
            let startY = pos.y;
            line(startX, startY, mouseX, mouseY);
        } else {
            if (mousedOver(scalings, positions, mouseX, mouseY) != null) {
                cursor(CROSS);
            } else {
                cursor(ARROW);
            }
        }
    }

    drawTreeFromMap(t, positions, scalings);
}

function mouseClicked() {
    if (mode == 'drawing') {
        if (drawModeStartNode == null) {
            drawModeStartNode = mousedOver(scalings, positions, mouseX, mouseY);
        } else {
            let newNode = new Tree();
            newNode.parent = drawModeStartNode;
            drawModeStartNode.children.push(newNode);
            let [x, y] = canvasToPhys(scalings, mouseX, mouseY);
            positions.set(newNode, {
                x,
                y,
                ...initialValues
            });
            t.recomputeAllProperties();
            t.setMultiplicitiesDistances();
            h = testert.height;
            drawModeStartNode = null;
        }
    }
}

function update() {
    scalings = {
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
                let graphdist = t.nodeDistances.get(nodep).get(nodeq);
                let sx = (q.x - p.x) / d; // unit vector
                let sy = (q.y - p.y) / d;
                // if (t.areNeighbours(nodep, nodeq)) {
                if (graphdist <= 3) {
                    // attractive force 
                    // p.ax += g * sx / (d + 1) ** 2;
                    // p.ay += g * sy / (d + 1) ** 2;
                    // spring force 
                    // p.ax += k * sx * (d - 100 * graphdist) / (graphdist);
                    // p.ay += k * sy * (d - 100 * graphdist) / (graphdist);
                    p.ax += (2/graphdist) * sx * log(d/(100*graphdist));
                    p.ay += (2/graphdist)* sy * log(d/(100*graphdist));
                    // q.ax -= .5* sx;
                    // q.ay -= .5* sy;
                }
                if (!t.areNeighbours(nodep, nodeq)) {
                    // repelling force between all non-adjacent nodes 
                    p.ax += -g * (sqrt(graphdist)) * sx / (d + 2) ** 2;
                    p.ay += -g * (sqrt(graphdist)) * sy / (d + 2) ** 2;
                }
            }
        })
    });

    positions.forEach((p, node) => {
        p.vx += p.ax - gamma * p.vx;
        p.vy += p.ay - gamma * p.vy;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= scalings.minX) { scalings.minX = p.x; }
        if (p.x >= scalings.maxX) { scalings.maxX = p.x; }
        if (p.y <= scalings.minY) { scalings.minY = p.y; }
        if (p.y >= scalings.maxY) { scalings.maxY = p.y; }
    });

    //cursor

    if (clickedNode != null) {
        let [x, y] = canvasToPhys(scalings, mouseX, mouseY);
        [x,y] = [min(x, scalings.maxX), min(y, scalings.maxY)];
        [x,y] = [max(x, scalings.minX), max(y, scalings.minY)];
        positions.set(clickedNode, { x, y, vx: 0, vy: 0, ax: 0, ay: 0 });
    }

}

// window.addEventListener('load', () => {
//     setTimeout(() => {
//         but = document.getElementsByClassName('topright')[0];
//         but.click();            
//     }, 100);
// }, true);