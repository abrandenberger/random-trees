let t = Tree.randomTree('manual', [1, 0, 1]);
// let h = t.height;
let radius = 2;
let levelDiff;
let g = 1000;
let k = 0.1;
let gamma = 0.04;
let padding = 20;
let maxNodeCount = 150;

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

console.log('tester tree height', testert.height, 'size', testert.size, 'left subtree height', testert.children[0].height, 'size', testert.children[0].size)

function mouseClicked() {
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
        mouseClicked();
    }
}

function drawBinaryTree(root, x, y, w, drawlabels = false, label = 1) { //input t
    if (root.left == null && root.right == null) {
        // draw single node 
        fill(255, 0, 0, 125);
        circle(x, y, 2 * radius);
    } else if (root.right == null) { //left child only
        fill(0, 0, 255, 125);
        line(x, y, x, y + levelDiff);
        circle(x, y, 2 * radius);
        drawBinaryTree(root.left, x, y + levelDiff, w);
    } else { //left and right children 
        let r_l = root.left.size / (root.left.height + 1);
        let r_r = root.right.size / (root.right.height + 1);
        let w_l = Math.max(2 * radius, w * r_l / (r_r + r_l));
        let w_r = Math.max(2 * radius, w * r_r / (r_r + r_l));
        if (w_l <= 2 * radius && w_r <= w * radius) {
            line(x, y, x - w_l / 2, y + levelDiff);
            line(x, y, x + w_r / 2, y + levelDiff);
            drawBinaryTree(root.left, x - w_l / 2, y + levelDiff, w_l);
            drawBinaryTree(root.right, x + w_r / 2, y + levelDiff, w_r);
        } else {
            line(x, y, x - w / 2 + w_l / 2, y + levelDiff);
            // line(x, y, x + w / 2 - w_r / 2, y + levelDiff);
            line(x, y, x - w / 2 + w_l + w_r / 2, y + levelDiff);
            drawBinaryTree(root.left, x - w / 2 + w_l / 2, y + levelDiff, w_l);
            drawBinaryTree(root.right, x - w / 2 + w_l + w_r / 2, y + levelDiff, w_r);
        }
        fill(0, 255, 0, 125);
        circle(x, y, 2 * radius);
    }
}

function drawTree(root, x, y, w) {
    if (root.children.length == 0) {
        fill(255, 0, 0, 125);
        circle(x, y, 2 * radius);
        if (root.multiplicity != null) {
            text(root.multiplicity, x + 4, y + 2)
        }
    } else {
        let rArray = root.children.map(u => u.size / (u.height + 1));
        let rSum = rArray.reduce((a, b) => a + b);
        let wArray = rArray.map(r => w * r / rSum);
        wArray.reduce((acc, cur, k) => {
            line(x, y, x - w / 2 + acc + cur / 2, y + levelDiff, cur)
            drawTree(root.children[k], x - w / 2 + acc + cur / 2, y + levelDiff, cur);
            return acc + cur;
        }, 0);
        fill(0, 255 / (root.children.length), 255 - 255 / (root.children.length));
        circle(x, y, 2 * radius);
        if (root.multiplicity != null) {
            text(root.multiplicity, x + 4, y + 2)
        }
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
        fill(255, 0, 0, 125);
        circle(x, y, 2 * radius);
        if (root.multiplicity != null) {
            text(root.multiplicity, x + 4, y + 2)
        }
    } else {
        root.children.forEach(c => {
            q = positions.get(c);
            let x_ = map(q.x, scalings.minX, scalings.maxX, padding, width - padding);
            let y_ = map(q.y, scalings.minY, scalings.maxY, padding, height - padding);
            line(x, y, x_, y_);
            drawTreeFromMap(c, positions, scalings);
        })
        fill(0, 255 / (root.children.length), 255 - 255 / (root.children.length));
        circle(x, y, 2 * radius);
        if (root.multiplicity != null) {
            text(root.multiplicity, x + 4, y + 2)
        }
    }
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    stroke(0, 125);
    levelDiff = (height - 20) / h;
    textSize(8);
    // noLoop();
    initializeMap(t, width / 2, 10, width)
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

    // drawTree(testert, width / 2, 10, width);

    // let tree1 = new Tree(
    //   new Tree(
    //     new Tree()
    //   ),
    //   new Tree(
    //     new Tree()
    //   )
    // );
    // let equiv1 = tree1.getEquivClasses();
    // print(equiv1.length);
    // print(equiv1.map(l => l.length));

    // print(testert.getEquivClasses().map(l => l.length));

    // let tree2 = new Tree(
    //   new Tree(
    //     new Tree(), new Tree()
    //   ),
    //   new Tree()
    // );
    // print(tree2.getEquivClasses().map(l => l.length));

    // let largetree = new Tree(
    //   new Tree(),
    //   new Tree(
    //     new Tree(),
    //     new Tree(
    //       new Tree(),
    //       new Tree(
    //         new Tree(),
    //         new Tree(
    //           new Tree(),
    //           new Tree()
    //         )
    //       ),
    //       new Tree()
    //     )
    //   ),
    //   new Tree()
    // );
    // print(largetree.getEquivClasses().map(l => l.length));
    // print((new Tree()).getEquivClasses().map(l => l.length));

    // print(testert.children[0].deepCopy());
    // print(testert.children[0]);
}