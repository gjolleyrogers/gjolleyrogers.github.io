    function init() {

        phylogenyExplorer_init({
        
        
// params
        	
        	
//  Tree and Characters 
       			    	
            
            
// tmpl provides a template into which simple name based searches placed
        	
        	tmpl :  '<table style="border: none"><tbody><tr><th></th><th>links</th><th> </th><th> </th><th> </th><th> </th></tr>' + 
            '<% _.each(nodeList , function( value ) {' +
            ' %> <tr>'+ 
            	'<td><a href="http://www.environment.gov.au/biodiversity/abrs/online-resources/fauna/afd/taxa/<%= value.name %>" title="<%= value.name %> in the AFD" rel="<%= value.rel %>" class="thumbImage1"><%= value.name %></a></td>' + 
           		'<td><a href="http://bie.ala.org.au/species/<%= value.name %>" title="about <%= value.name %> ALA species page " rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a></td>' + 
            	'<td><a href="http://biodiversity.org.au/name/<%= value.name %>" title="about <%= value.name %> in NSL nomenclator " rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a></td>' + 
            	'<td><a href="http://www.discoverlife.org/mp/20q?search=<%= value.name %>+<%= value.species %>" title="images and info from Discover Life on <%= value.name %>" rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a>' + 
            	'<td><a href="http://biocache.ala.org.au/ws/density/map?q=<%= value.name %>" title="<%= value.name %> Aus density Map (if sufficient samples)" rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div></id="thumb1"></a></td></td>' +
            	'<td><a href="http://eol.org/search/show?q=<%= value.name %>&amp;type[]=taxon_concept&amp;type[]=image&amp;commit=Filter" title="images of <%= value.name %> in EOL" rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a></td></tr> <% }); ' + 
            '%></tbody></table></div>'   
       
// alternative functions which  define actions on hover and click on nodes and clades
               	 
        }); 
    } 