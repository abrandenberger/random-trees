<!-- latex: \\(tex\\) or $$ tex $$ -->
<span style='font-variant:small-caps'> What is a random tree?</span> 
Different things come to mind when one thinks of such a concept - programmers might think of binary search trees, while mathematicians might think of a tree chosen uniformly at random from some class of trees (e.g., complete binary trees on \\(n\\) nodes). These two will look very different. To analyse the second type of tree, we can look at what are known as *Galton-Watson trees*. 

Galton-Watson processes were introduced in 1845 by I.-J. Bienaymé and in 1874 by F. Galton and H. W. Watson to model the spread and disappearance of family names in a population. They studied a mathematical model of reproduction, where each individual has an independent random number of children, each of which continue to have an identically distributed random number of children, and so on. This family tree structure starting at one root ancestor is known as a Galton-Watson tree, and the distribution according to which each individual reproduces is denoted the *offspring distribution* \\(\xi\\). We denote \\(p_i = \mathbf{P}\\{\xi = i\\}\\). 

A classical result about the extinction of Galton-Watson trees is as follows. 

**Theorem 1.** Let \\(q\\) be the probability that a Galton-Watson tree with offspring distribution \\(\xi\\) goes extinct. We exclude the case of the degenerate tree with \\(p_1 = 1\\) and all other \\(p_i = 0\\), where the variance \\(\mathbf{V}\xi\\) is zero. Then \\(q = 1\\) if and only if \\(\mathbf{E}\xi \leq 1\\).

We can also show that the expected number of nodes on level \\(n\\) is \\((\mathbf{E}\xi)^n\\). There are thus three regimes: 
1. *subcritical* trees with \\(\mathbf{E}\xi < 1\\),
2. *supercritical* trees with \\(\mathbf{E}\xi > 1\\) which have a positive probability of being infinite, and
3. *critical* trees with \\(\mathbf{E}\xi = 1\\) which go extinct with probability one, but have infinite expected size. These are the ones we will be looking at here, for reasons we will mention below. 

When Galton-Watson trees are conditioned on size \\(|T| = n\\), where \\(|T|\\) is the number of nodes in the tree, they begin to look very different from normal unconditional trees. Indeed, H. Kesten found that as \\(n \to \infty\\), their structure begins to look like a long spine with many hanging finite unconditional trees. A key correspondance also shown between these conditional trees and the random uniformly selected trees we talked about at the very beginning! Indeed, Meir and Moon showed that picking a node uniformly at random from certain _simply generated_ families of trees is equivalent to generating a conditional Galton-Watson tree of a certain offspring distribution \\(\xi\\). For example, 

1. \\(k\\)-ary trees correspond to \\(\xi = \mathrm{Bin}(k, 1/k)\\),
2. Cayley trees correspond to \\(\xi =\mathrm{Poisson}(1) \\), 
3. Motzkin trees (where every node has \\(\leq 2\\) children whose order is significant) correspond to the distribution \\(p_0 = p_1 = p_2 = 1/3\\),
4. Planted plane trees correspond to \\(\xi = \mathrm{Geometric}(1/2)\\).

This project illustrates several definitions introduced in the paper [*Root Estimation in Galton-Watson Trees*](https://arxiv.org/abs/2007.05681) by [Anna Brandenberger](https://abrandenberger.github.io), [Marcel Goh](https://marcelgoh.github.io/) and [Luc Devroye](http://luc.devroye.org/), which determines the maximum-likelihood estimator for the root of a free tree when the underlying tree is a conditional Galton-Watson tree. 

A _free tree_ is simply a connected acyclic graph. A normal rooted tree, in which all the edges have a parent-child direction, can be converted to a free tree by forgetting all these directions. 

> The animation shows the free tree structure of a randomly generated Galton-Watson tree, with nodes coloured and numbered according to their _multiplicities_. To define the multiplicity, we first need the notion of an automorphism of a tree.

**Definition** (Tree Automorphism)**.** An automorphism of a free tree \\(T_n\\) is a graph-isomorphism from \\(T_n\\) to itself, i.e., a bijection from \\(V(T_n)\\) to \\(V(T_n)\\) that preserves the adjacency structure, where \\(V(T_n)\\) is the vertex set of the free tree \\(T_n\\). 

The multiplicity of a node is essentially the number of nodes in the free tree that look identical to it. The notion can be formalized as follows, but it is very intuitive and can be understood easily just by looking at a few examples.

**Definition** (Multiplicity)**.** We define the multiplicity \\(M(v)\\) of a node \\(v\\) to be the number of nodes that are isomorphic to \\(v\\), that is, nodes to which \\(v\\) can possibly be sent by an automorphism. Note that  \\(M(v) \geq 1\\) because a node can always be sent to itself.

### References

<span class="references">

<u> Bienaymé, I.-J. (1845).</u> **De la loi de multiplication et de la durée des familles**. _Société Philomathique de Paris Extraits_, **5**:37–39. 

<u> Brandenberger, A., Goh, M. K. and Devroye, L. (2020).</u> **Root Estimation in Galton-Watson Trees**. arXiv preprint
arXiv:2007.05681.

<u> Galton, F. and Watson, H. W. (1875).</u>  **On the probability of the extinction of families**. _Journal of the Royal Anthropological Institute_, **4**:138–144.

<u> Kesten, H. (1986). </u> **Subdiffusive behavior of a random walk on a random cluster**. _Annales de l’Institut Henri Poincaré Probability and Statistics_, **22**:425–487.

<u> Meir, A. and Moon, J. W. (1978). </u> **On the altitude of nodes in random trees**. _Canadian Journal of Mathematics_, **30**(5):997–1015.

<u>Reddad, T. (2019).</u>  **Some Conditioned Galton-Watson Trees Never Grow**. [Blog post](https://reddad.ca/2019/06/26/conditioned-gw-trees/).


</span>