importScripts('tree.js');

self.addEventListener('message', message => {
    let distribution = message.data.distribution;
    let name;
    let params;
    if (distribution == 'geometric' || distribution == 'poisson') {
        name = distribution;
    }
    else {
        name = 'manual';
        if (distribution == 'man2') {
            params = [1, 2, 1];
        }
        if (distribution == 'man3') {
            params = [8, 12, 6, 1];
        }
        if (distribution == 'man4') {
            params = [81, 108, 54, 12, 1];
        }
    }
    if (message.data.type == 'bigtree') {
        self.postMessage({ tree: newTree((n) => (n > maxNodeCount / 3), name, params) });
    }
    else {
        self.postMessage({ tree: newTree((n) => (true), name, params), name, params });
    }
});

function newTree(p, name, params) { // predicate
    // t = Tree.randomTree('manual', [8, 12, 6, 1]);
    t = null; 
    while (t == null || !p(t.size)) {
        try {
            treeSize = 0;
            t = Tree.randomTree(name, params);
        } catch (e) {
            if (e instanceof TreeError) {
                console.log('too big tree - trying again');
                t = null; 
            } else {
                throw e;  // re-throw the error unchanged
            }
        }    
    }
    t.setMultiplicities();
    return t; 
}
