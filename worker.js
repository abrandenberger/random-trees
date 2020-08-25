importScripts('tree.js');
let maxNodeCount = 200;

self.addEventListener('message', message => {
    if (message.data.type == 'bigtree') {
        self.postMessage({tree: newTree((n) => (n > maxNodeCount/3))}); 
    }
    else {
        self.postMessage({tree: newTree((n) => (true))}); 
    }
}); 

function newTree(p) { // predicate
    t = Tree.randomTree('manual', [8, 12, 6, 1]);
    // t = Tree.randomTree('manual', [1, 0, 1]);
    // h = t.height;
    // console.log('height', t.height, 'size', t.size);
    if (t.size <= maxNodeCount && p(t.size)) {
        t.setMultiplicities();
        // t.getNodeDistances(); // works
        return t; 
        // levelDiff = (height - 20) / h;
        // positions = new Map();
        // initializeMap(t, width / 2, 10, width);
        // redraw();
    } else {
        return newTree(p);
    }
}
