---
title: "Phylogeny Visualisation"
weight: 1
subtitle: "syn"
excerpt: "syndicated"
weight: 5 
date: 2023-04-15
author: "Garry Jolley-Rogers"
draft: false
---

## Phylojive


  {{<rawhtml >}}
<!-- Test CSS -->
<link type="text/css" href="resources/base.css" rel="stylesheet" />
<link type="text/css" href="resources/PhyloJive.css" rel="stylesheet" />

<script language="javascript" type="text/javascript" src="resources/PhylogenyExplorer.js"></script>
<script language="javascript" type="text/javascript" src="resources/jit.js"></script>
</head>

<body onload="init();">
<div id="container">
    <div id="left-container">


<div class="text">
<h4>
Bird phylogeny - for Australian Endemic Species   
</h4> 
This is from the bird tree  <a href="http://birdtree.org">project</a>, which aims to give a phylogeny of extant  species. We have further chosen to show only those species endemic to Australiasia.  <br/><br/>
It is a beta version. The linkouts are yet to be adapted to point to relevant avifaunal sources. The tree is too deep and the zoom is yet to be adjusted. <br/><br/>
    	 <ul>
			<li>Click the top button to get the navigation aid</li>
			<li>try choosing 2nd &amp 3rd characters to plot on the tree;</li>
			<li>align-names feature; search; set-root; rotate, etc.</li>
		</UL>       
</div>

<div id="id-list"></div>

    </div>
    <div id="center-container">
        <div id="infovis"></div>    
    </div>
    <div id="right-container">

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
   <script type="text/javascript" src="javascripts/jquery.colorbox-min.js"></script>
        <!--- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script> -->
        <script type="text/javascript" src="javascripts/jsphylosvg-min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js"></script> 
<script type="text/javascript" src="trees_characters/bird3365InitPhyloJIVE.js"></script>  

<script language="javascript" type="text/javascript" src="resources/jit.js"></script>
 
    </div>
<div id="log"></div>
</div>
</body>


  {{</rawhtml >}}