---
## Configure page content in wide column
title: "" # leave blank to exclude
number_featured: 1 # pulling from mainSections in configxx	.toml
layout: single
use_featured: false # if false, use most recent by date
number_categories: 3 # set to zero to exclude
show_intro: true
intro: |
  
show_outro: true
outro: |
  <i class="fas fa-glass-cheers pr2"></i>Sincere thanks to [Maëlle Salmon](https://masalmon.eu/) for her help naming this Hugo theme!
---
 
  I  am trained in __computer science__ and __neuroscience__. <br>
  I have worked as a  software engineer, programmer ,  IT manager, and researcher.  
Drawing on a core set of skills in lab science,  
 
analysis, modelling, informatics, and programming, I have had adventures in many disciplines.

 {{< figure src="yabbwy.png#floatright" alt="A sample 4:3 ratio image" caption="This is an image caption provided through a figure shortcode using figcaption." >}}

### Currently, I am thinking about  
 <img align="right" width="100" height="100" src="http://www.fillmurray.com/100/100">


|  <i class="fas fa-bug pr2"></i> <i class="fas fa-bug pr2"></i>   |   |
|  |   |
   |  |   |
  how to measure changes in insect  abundance to determine whether there is long term **insect decline**  
	
 
 <i class="fas fa-code-branch pr2"></i>   how to estimate **phylogenetic diversity** for clades

 
 <i class="fas fa-brain"></i><i class="fas fa-code-branch pr2"></i>	using    **comparative neuroanatomy** of selected crustaceans to study the evolution of brains

<i class="fas fa-edit"></i> writing about natural processes and the anthropocene

 
 ## Rendering mathematical equations

Examples from the [mathjax demo](https://www.mathjax.org/#demo).
But they work with `katex` as well.

### Rmarkdown

In `.Rmarkdown` documents, you can use either

```
$a \ne 0$
```

to get inline math: `\(a \ne 0\)`.
There is no conflict with using dollar symbols regularly, because `knitr` automatically escapes freestanding dollar symbols.

And you can use

```
$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```

to get a math paragraph:

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

### md

In `.md` documents, you can **not** use the single dollar syntax.
The double dollar syntax still gives you a math paragraph.

```
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$

In order to get inline equations, use:

```
`\(a \ne 0\)`
or
\\(a \ne 0\\)
```

to get: `\(a \ne 0\)`.

Courtesy of panelset.js by Garrick Aden-Buie, from his xaringanExtra package: https://pkg.garrickadenbuie.com/xaringanExtra/#/panelset

For example, this panelset:

{{< panelset class="greetings" >}}
{{< panel name="Hello! :wave:" >}}
  hello
{{< /panel >}}
{{< panel name="Goodbye :dash:" >}}
  goodbye
{{< /panel >}}
{{< /panelset  >}}

Was created by combining this theme's `panelset` and `panel` shortcodes:

```go
{{</* panelset class="greetings" */>}}
{{</* panel name="Hello! :wave:" */>}}
  hello
{{</* /panel */>}}
{{</* panel name="Goodbye :dash:" */>}}
  goodbye
{{</* /panel */>}}
{{</* /panelset */>}}
```


You could also revert to HTML as well. For example, this panelset:


<div class="panelset">
  <div class="panel">
    <div class="panel-name">Question</div>
    <!-- Panel content -->
    <p>Which came first: the :chicken: or the :egg:?</p>
  </div>
  <div class="panel">
    <div class="panel-name">Answer :hatching_chick:</div>
    <!-- Panel content -->
    <p>Team :egg: FTW!</p>
  </div>
</div>

Was created with this HTML code:

```html
<div class="panelset">
  <div class="panel">
    <div class="panel-name">Question</div>
    <!-- Panel content -->
    <p>Which came first: the :chicken: or the :egg:?</p>
  </div>
  <div class="panel">
    <div class="panel-name">Answer :hatching_chick:</div>
    <!-- Panel content -->
    <p>Team :egg: FTW!</p>
  </div>
</div>
```	
 
 