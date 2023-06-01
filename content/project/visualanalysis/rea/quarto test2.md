---
# Quarto YAML metadata
# IMPORTANT: YAML config files use SPACES for indentation to 
# define structure. Remember: STRAIGHTEN all smart quotes and don't
# capitalise metadata keys, they MUST BE lowercase! 
# Tip: use "Show Invisibles" in Scrivener to see whitespaces.
# 
# Metadata is used to define the options that Quarto/Pandoc
# use when generating the final document. You will need to change
# the location of your bibliography files and change any fonts
# to those present on your system.
#
title: "quarto test"
subtitle: "A Compiler Workflow…"
author:  Garry 
keywords: [pandoc, quarto, scrivener]
subject: workflow
lang: en
date: 2023-05-30      # Scrivener placeholder
verbose: true                 # pandoc verbosity
toc: true                     # table of contents
number-sections: true         # numbered headings
crossref:                     # cross-referencing options
  labels: arabic                # (default is arabic)
  subref-labels: alpha A        # (default is alpha a)
  chapters: true                # Numbers depend on the chapter, e.g. 2.1
cap-location: bottom          # where put figure & table captions
link-citations: true          # in-document links to refs 
csl: /Users/gjr/.local/share/pandoc/csl/apa-ian.csl
appendix-style: default       # see https://quarto.org/docs/authoring/appendices.html#appendix-style
dpi: 300
format: hugo-md
execute:
  echo: false
jupyter: python3
---

-   [<span class="toc-section-number">1</span> Abstract](#abstract)
-   [<span class="toc-section-number">2</span> Introduction](#introduction)
-   [<span class="toc-section-number">3</span> Methods](#methods)
    -   [<span class="toc-section-number">3.1</span> Data Recording](#data-recording)
    -   [<span class="toc-section-number">3.2</span> Experimental Perturbations](#experimental-perturbations)
    -   [<span class="toc-section-number">3.3</span> Stimulus Plotting](#stimulus-plotting)

# Abstract

<span class="smallcaps">This sample project demonstrates a workflow using the Quarto scientific publishing system run using the Scrivener Compiler</span>. Quarto utilises Pandoc and combines several extensions and nice templates to support many layout tweaks and advanced cross-referencing. Pandoc itself supports lots of academic features like bibliographies etc. This workflow uses Scrivener Paragraph «block» and Character «inline» styles where applicable for handling formatting, demonstrates an alternative using Section Types (with optional attributes), and also shows the fall back to plain raw markdown as a third alternative for handling Quarto's layout features. A custom post-processing Ruby script included in the Compile Format sets up the path automatically and modifies Scrivener's markdown output so that it is compatible with Quarto's cross-referencing filter.



# Introduction

> *"We don't see things as they are, we see them as we are." --- Anaïs Nin*

Lørem ipsum dolør sit amet, eu ipsum movet vix, veniam låoreet posidonium\[^fn1\] te eøs, eæm in veri eirmod \[@barrett2015; @crivellato2007\]. Sed illum minimum at 3.25×10⁴⁸ (see Results) , est mægna alienum mentitum ne. Amet equidem sit ex (see Conclusion). Ludus øfficiis suåvitate sea in, ius utinam vivendum no, mei nostrud necessitatibus te?

![We add the *cross-referencing label* to the ***start*** of the caption. This label will get moved to the correct place in the markdown by the post-processing script ***before*** Quarto is run. This figure also demonstrates the Scrivener trick of using a Binder-linked figure followed by a Paragraph Style `Caption` which the Scrivener compiler converts to the correct markdown to generate a captioned image block!](Elephant1.jpg)

Sint meis quo et, vis ad fæcete dolorem! Ad quøt moderatius elaboraret eum\[@crivellato2007\], pro paulo ridens quaestio ut (see **?@fig-elephant**)! Iudico nullam sit ad, ad has åperiam senserit conceptåm? Tritani posidonium suscipiantur ex duo, meæ essent mentitum ad. Nåm ex mucius mandamus, ut duo cåusae offendit laboramus. Duo iisque sapientem ad, vølumus persecuti vix cu, ***his åt justo putant comprehensam (this style is strong emphasis)***.

Ad pro quod <sup>superscript</sup>, mel no laudem <sub>subscript</sub>, te mei prompta maiorum pønderum \[@siegel2015; @copenhaver2014; @hoffman2014; @barrett2015; @simmons2013\]. Solum aeque singulis duo ex, est an iriure øblique.

Here is some marginalia using the \[`Marginalia`\] Paragraph Style, *including* a citation \[@barrett2015\]. This will end up as a margin note in HTML and PDF outputs, but a normal paragraph in DOCX etc.

Volumus åntiøpam iudicåbit et pro, cibo ubique hås an? Cu his movet feugiåt pårtiendo \[@barrett2015; @crivellato2007\]! Eam in ubique høneståtis ullåmcorper, no eos vitae orætiø viderer. Eos id amet alienum, vis id zril åliquando omittantur, no mei graeci impedit deterruisset!

> **Tip**
>
> This callout is generated using the \[`Callout Tip`\] Scrivener Paragraph Style...

This is a standard native Scrivener list, which will get converted to markdown by the Scrivener compiler:

-   Item 1
-   Item 2
    -   Item 2a
    -   Item 2b
-   Item 3

No meæ menandri mediøcritatem, meis tibique convenire vis id! Delicata intellegam mei ex. His consulåtu åssueverit ex, ei ius apeirian cønstituam mediocritatem, mei rebum detracto scaevølæ ex. Sed modo dico ullum at, sententiae definiebas ex eam! Nøstro eruditi eum ex. See [Table 2.1](#tbl-test) for more details.

| Table Head 1 | Table Head 2 | Table Head 3 |
|--------------|--------------|--------------|
| Item 1       | Item 2       | Item 3       |
| Item 4       | Item 5       | Item 6       |
| Item 7       | Item 8       | Item 9       |
| Item 10      | Item 11      | Item 12      |

Table 2.1: This is native Scrivener table with a referenced table caption. You could also use one of the many markdown table types, and lower down this sample project demonstrates using R to make tables.

Åd nam omnis ullamcørper vituperatoribus. Sed verear tincidunt rationibus an. Elit såperet recteque sit et, tåmquåm noluisse eloquentiåm ei mei. In pri solet soleat timeam, tale possit vis æt.



# Methods

## Data Recording

<img src="Elephant3.jpg" id="fig-marginalia" alt="Figure 3.1: A figure of a poor, poor marginalised elephant…" />

Lørem ipsum dolør sit amet, eu ipsum movet vix, veniam låoreet posidonium te eøs, eæm in veri eirmod. Sed illum minimum at, and here is some inline maths: $e^{ix}=r(\cos \theta +i\sin \theta)$, est mægna alienum mentitum ne. Amet equidem sit ex. Ludus øfficiis suåvitate sea in, ius utinam vivendum no, mei nostrud necessitatibus te?

Note that for equations we place the cross-referencing label on a newline *after* the \[`Maths Block`\] (as paragraph styles require to run to the line end, we cannot keep the label on the same line or it will be 'swallowed' by the suffix). The post-processing script will place this label back on the same line *after* the `$$` has been added by Scrivener's compiler so that Quarto can properly cross-reference it...

See both [Equation 3.1](#eq-one) and [Equation 3.2](#eq-two) for more details:

<span id="eq-one">$$t' = \frac{t - \dfrac{v}{c^{2}}x}{\sqrt{1 - \dfrac{v^{2}}{c^{2}}}} \qquad(3.1)$$</span>

Sint meis quo et, vis ad fæcete dolorem!

<span id="eq-two">$$\nabla \times \mathbf {H} ={\frac {1}{c}}\left(4\pi \mathbf {J} _{\text{f}}+{\frac {\partial \mathbf {D} }{\partial t}}\right) \qquad(3.2)$$</span>

Tritani posidonium suscipiantur ex duo, meæ essent mentitum ad. Nåm ex mucius mandamus, ut duo cåusae offendit laboramus. Duo iisque sapientem ad, vølumus persecuti vix cu, his åt justo putant comprehensam.See [Figure 3.1](#fig-marginalia) for a poor marginalised elephant. Ad quøt moderatius elaboraret eum \[@siegel2015\], pro paulo ridens quaestio ut! Iudico nullam sit ad, ad has åperiam senserit conceptåm?

``` ruby
# This is a styled Ruby code block, 
# using the paragraph style [Ruby Code]

# Output "I love Ruby"
say = "I love Ruby"
puts say

# Output "I *LOVE* RUBY"
say['love'] = "*love*"
puts say.upcase

# Output "I *love* Ruby"
# five times
5.times { puts say }
```

Ad pro quod definitiønem\[^fn2\], mel no laudem delectus, te mei prompta maiorum pønderum. Solum aeque singulis duo ex \[@siegel2015\], est an iriure øblique. Volumus åntiøpam iudicåbit et pro, cibo ubique hås an? Cu his movet feugiåt pårtiendo! Eam in ubique høneståtis ullåmcorper, no eos vitae orætiø viderer. Eos id amet alienum, vis id zril åliquando omittantur, no mei graeci impedit deterruisset!

## Experimental Perturbations

Lørem ipsum dolør sit amet, eu ipsum movet vix, veniam låoreet posidonium te eøs, eæm in veri eirmod. Sed illum minimum at, est mægna alienum mentitum ne. Amet equidem sit ex. Ludus øfficiis suåvitate sea in, ius utinam vivendum no, mei nostrud necessitatibus te?

Scrivener cannot ***nest*** block styles, so for Marginalia like this one we can use pandoc markup like `$$` directly instead of an e.g. maths block paragraph style. An alternative would be to split it into a binder doc and use a Section Type. We know from *the first fundamental theorem of calculus* that for $x$ in $[a, b]$:
$$\frac{d}{dx}\left( \int_{a}^{x} f(u)\,du\right)=f(x).$$

Sint meis quo et, vis ad fæcete dolorem! Ad quøt moderatius elaboraret eum, pro paulo ridens quaestio ut! Iudico nullam sit ad, ad has åperiam senserit conceptåm? Tritani posidonium suscipiantur ex duo, meæ essent mentitum ad. Nåm ex mucius mandamus, ut duo cåusae offendit laboramus. Duo iisque sapientem ad, vølumus persecuti vix cu, his åt justo putant comprehensam.

This next part will demonstrate the use of raw markdown within the document to create a multipart figure. See **?@fig-elephants2** below for an example using a Section Type to insert the same markup at compile-time.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td style="text-align: center;"><div width="50.0%" data-layout-align="center">
<p><img src="Elephant2.jpg" data-fig.extended="false" alt="Elephant castle." /></p>
</div></td>
<td style="text-align: center;"><div width="50.0%" data-layout-align="center">
<p><img src="Elephant3.jpg" data-fig.extended="false" alt="Angry elephant with big trunk." /></p>
</div></td>
</tr>
</tbody>
</table>

Figure 3.2: Quarto allows the creation of figure panels with sub-figures. For this, if we want to use embedded images in the Scrivener editor we must use some raw markdown as we cannot *nest* Scrivener block styles. Note we can use the Scale Image... Tool in Scrivener and these sizes get exported to Quarto and the output. Here we scale both images to the same height.

See [Figure 3.2](#fig-elephants), particularly **?@fig-castle**. Ad pro quod definitiønem, mel no laudem delectus, te mei prompta maiorum pønderum. Solum aeque singulis duo ex, est an iriure øblique. Volumus åntiøpam iudicåbit et pro, cibo ubique hås an? Cu his movet feugiåt pårtiendo! Eam in ubique høneståtis ullåmcorper, no eos vitae orætiø viderer. Eos id amet alienum, vis id zril åliquando omittantur, no mei graeci impedit deterruisset!

> **Warning**
>
> Note that there are five types of callouts, including:
> `note`, `tip`, `warning`, `caution`, and `important`.

No meæ menandri mediøcritatem, meis tibique convenire vis id! Delicata intellegam mei ex. His consulåtu åssueverit ex \[@siegel2015\], ei ius apeirian cønstituam mediocritatem, mei rebum detracto scaevølæ ex. Sed modo dico ullum at, sententiae definiebas ex eam! Nøstro eruditi eum ex.

> **Important**
>
> Note that there are five types of callouts, including:
> `note`, `tip`, `warning`, `caution`, and `important`.

Åd nam omnis ullamcørper vituperatoribus. Sed verear tincidunt rationibus an. Elit såperet recteque sit et, tåmquåm noluisse eloquentiåm ei mei. In pri solet soleat timeam, tale possit vis æt.

> **Note**
>
> Note that there are five types of callouts, including:
> `note`, `tip`, `warning`, `caution`, and `important`.

## Stimulus Plotting

Note if you have R and Python installed, you can run code like so...

Here is an R plot (**?@fig-airquality**), you need to have R installed for this to work, if not remove this document from the compile:
