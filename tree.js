class Tree {
  constructor(...children) {
    this.children = children;
    this.parent = null;
    this.children.forEach(c => c.parent = this);
    this.multiplicity = null;
    this.nodeDistances = new Map();
    this.computeProperties();
    this.getDepth(0);
    // this.getNodeDistances();
  }

  static randomTree(name, params) {
    // implement check if mean is <= 1
    let t;
    let numChildren; 
    if (name == 'manual') {
      let sum = params.reduce((a, b) => a + b);
      // console.log(sum);
      params = params.map(x => x / sum);
      // console.log(params);
      let mean = params.map((x, i) => x * i).reduce((a, b) => a + b);
      if (mean > 1) {
        throw new rangeError('Mean is greater than 1: infinite tree');
      }
      let cdf = params.reduce((arr, cur) => arr.concat([arr[arr.length - 1] + cur]), [0]).slice(1); //get rid of zero
      let dice = Math.random();
      numChildren = cdf.findIndex(p => p > dice);
    }

    else if (name == 'geometric') { // geometric(p = 1/2)
      numChildren = Math.floor(Math.log(Math.random()) / Math.log(.5));
    }
    
    else if (name == 'poisson') {

    }
    let children = new Array(numChildren).fill(0).map(_ => Tree.randomTree(name, params));
    t = new Tree(...children);
    children.forEach(c => c.parent = t);
    return t
  }

  computeProperties() { // O(n)
    if (this.children.length == 0) {
      this.height = 0;
      this.size = 1;
    }
    else {
      this.height = 1 + Math.max(...this.children.map(p => p == null ? 0 : p.height));
      this.size = 1 + this.children.map(p => p.size).reduce((a, b) => a + b);
    }
  }

  getDepth(depth) {
    this.depth = depth;
    this.children.forEach(c => c.getDepth(depth + 1));
  }

  recomputeProperties() { // O(n) called once
    if (this.children.length == 0) {
      this.height = 0;
      this.size = 1;
    }
    else {
      this.children.forEach(c => c.recomputeProperties());
      this.height = 1 + Math.max(...this.children.map(p => p == null ? 0 : p.height));
      this.size = 1 + this.children.map(p => p.size).reduce((a, b) => a + b);
    }
  }

  recomputeAllProperties() { // resets height, sizes and depths
    this.recomputeProperties();
    this.getDepth(0);
  }

  LCA(a, b) {
    if (a == b) { 
      return a; 
    } 
    else if (a.depth > b.depth) {
      return this.LCA(a.parent, b);
    } 
    else if (b.depth > a.depth) {
      return this.LCA(a, b.parent);
    }
    else {
      return this.LCA(a.parent, b.parent);
    }
  }

  getNodeDistances() {
    let nodeList = this.getAllNodes();
    nodeList.forEach(a => { // for each start node 
      let aNodeDistances = new Map();  // each node gets mapped to a Map
      nodeList.forEach(b => { // each node it could then connect to
          aNodeDistances.set(b, a.depth + b.depth - 2*this.LCA(a, b).depth);
      });  
      this.nodeDistances.set(a, aNodeDistances); 
    });
  }

  deepCopy() {
    if (this.children.length == 0) {
      return new Tree();
    }
    else {
      return new Tree(...this.children.map(c => c.deepCopy()));
    }
  }

  changeRoot(newRoot) {
    let t = newRoot.deepCopy();
    let curOrigNode = newRoot;  // in the original tree
    let curNewNode = t; // in the copied tree
    while (curOrigNode.parent != null) {
      let parChildren = curOrigNode.parent.children.filter(c => c != curOrigNode);
      let childCopies = parChildren.map(c => c.deepCopy());
      let parentCopy = new Tree(...childCopies);
      curNewNode.children.push(parentCopy);
      parentCopy.parent = curNewNode;
      curNewNode = parentCopy; // go down in the copied tree
      curOrigNode = curOrigNode.parent; // go up in the original tree
    }
    t.recomputeProperties();
    t.getDepth(0);
    return t;
  }

  isomorphicTo(tree) {
    if (this.children.length != tree.children.length) {
      // print('fails at children length check')
      return false;
    }
    if (this.size != tree.size) {
      // print('fails at children size check')
      return false;
    }
    if (this.children.length == 0) {
      // then tree also has 0 children cf check 1
      return true;
    }

    let taken = new Set();
    for (let c of this.children) {
      let foundMatch = false;
      for (let d of tree.children) {
        if (!taken.has(d)) {
          if (c.isomorphicTo(d)) {
            foundMatch = true;
            taken.add(d);
            break;
          }
        }
      }
      if (!foundMatch) {
        // print('fails at finding match')
        return false;
      }
    }
    return true;
  }

  getAllNodes() {
    return this.children.reduce((acc, cur) => acc.concat(cur.getAllNodes()), [this]);
  }

  getEquivClasses() {
    let equivClasses = [];
    let nodeSet = new Set(this.getAllNodes());
    let taken = new Set();
    for (let node of nodeSet) {
      if (!taken.has(node)) {
        taken.add(node);
        let currentClass = [node];
        for (let other of nodeSet) {
          if (!taken.has(other) && this.changeRoot(node).isomorphicTo(this.changeRoot(other))) {
            taken.add(other);
            currentClass.push(other);
          }
        }
        equivClasses.push(currentClass);
      }
    }
    return equivClasses;
  }

  setMultiplicities() {
    let equiv = this.getEquivClasses();
    for (let currentClass of equiv) {
      let mul = currentClass.length;
      for (let node of currentClass) {
        node.multiplicity = mul;
      }
    }
  }

  areNeighbours(u, v) {
    return v == u.parent || u == v.parent;
  }

  getNeighbours(u) {
    return u.children.concat([u.parent]);
  }

  setMultiplicitiesDistances() {
    this.setMultiplicities(); 
    this.getNodeDistances();
  }

  static serialize(dumbTree) {
    if (dumbTree.children.length != 0) {
      let tree = new Tree(...dumbTree.children.map(c => Tree.serialize(c)));
      tree.multiplicity = dumbTree.multiplicity;
      return tree; 
    }
    else {
      let tree = new Tree(); 
      tree.multiplicity = dumbTree.multiplicity;
      return tree;
    }
  }

  static serializeAndGetDistances(dumbTree) {
    let tree = Tree.serialize(dumbTree); 
    tree.getNodeDistances(); 
    return tree; 
  }
}
