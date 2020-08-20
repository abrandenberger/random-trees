<!-- latex: \\(tex\\) or $$ tex $$ -->
<span style='font-variant:small-caps'> What is a random tree?</span> 
Different things come to mind when one thinks of such a concept - programmers might think of binary search trees, while mathematicians might think of a tree chosen uniformly at random from some class of trees (e.g., complete binary trees on \\(n\\) nodes). These two will look very different. To analyse the second type of tree, we can look at what are known as *Galton-Watson trees*. 

Galton-Watson processes were introduced in 1845 by I.-J. Bienaymé and in 1874 by F. Galton and H. W. Watson to model the spread and disappearance of family names in a population. They studied a mathematical model of reproduction, where each individual has an independent random number of children, each of which continue to have an identically distributed random number of children, and so on. This family tree structure starting at one root ancestor is known as a Galton-Watson tree, and the distribution according to which each individual reproduces is denoted the *offspring distribution* \\(\xi\\). We denote \\(p_i = \mathbf{P}\{\xi = i\}\\). 

A classical result about the extinction of Galton-Watson trees is as follows. 

**Theorem 1.** Let \\(q\\) be the probability that a Galton-Watson tree with offspring distribution \\(\xi\\) goes extinct. We exclude the case of the degenerate tree with \\(p_1 = 1\\) and all other \\(p_i = 0\\), where the variance \\(\mathbf{V}(\xi)\\) is zero. Then \\(q = 1\\) if and only if \\(\mathbf{E}(\xi) \leq 1\\).

*Critical* Galton-Watson trees are those with \\(\mathbf{E}(\xi) = 1\\). They are interesting in that they go extinct with probability one, but have infinite expected size 

This project illustrates several definitions introduced in the paper [*Root Estimation in Galton-Watson Trees*](https://arxiv.org/abs/2007.05681) by [Anna Brandenberger](https://abrandenberger.github.io), [Marcel Goh](https://marcelgoh.github.io/) and [Luc Devroye](http://luc.devroye.org/). 


### References

<span class="references">

<u> Bienaymé, I.-J. (1845).</u> **De la loi de multiplication et de la durée des familles**. _Société Philomathique de Paris Extraits_, **5**:37–39. 

<u> Brandenberger, A., Goh, M. K. and Devroye, L. (2020).</u> **Root Estimation in Galton-Watson Trees**. arXiv preprint
arXiv:2007.05681.

<u> Galton, F. and Watson, H. W. (1875).</u>  **On the probability of the extinction of families**. _Journal of the Royal Anthropological Institute_, **4**:138–144.

<u>Reddad, T. (2019).</u>  **Some Conditioned Galton-Watson Trees Never Grow**. [Blog post](https://reddad.ca/2019/06/26/conditioned-gw-trees/).


</span>