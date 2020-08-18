importScripts('tree.js');
let maxNodeCount = 150;

self.addEventListener('message', message => {
    self.postMessage({tree: newTree()}); 
}); 

function newTree() {
    t = Tree.randomTree('manual', [8, 12, 6, 1]);
    // t = Tree.randomTree('manual', [1, 0, 1]);
    // h = t.height;
    // console.log('height', t.height, 'size', t.size);
    if (t.size <= maxNodeCount) {
        t.setMultiplicities();
        return t; 
        // levelDiff = (height - 20) / h;
        // positions = new Map();
        // initializeMap(t, width / 2, 10, width);
        // redraw();
    } else {
        return newTree();
    }
}
