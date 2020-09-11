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
    // t = Tree.randomTree('manual', [8, 12, 6, 1]);
    t = Tree.randomTree('geometric');
    if (t.size <= maxNodeCount && p(t.size)) {
        t.setMultiplicities();
        // t.getNodeDistances(); // works
        return t; 
    } else {
        return newTree(p);
    }
}
