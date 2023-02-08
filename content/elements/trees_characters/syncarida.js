    function init() {

        phylogenyExplorer_init({
        	codeBase:'../..',
            width: 600,
            height:600,        
        	alignName:true,
        	lateralise:false, 
       		levelsToShow:5,
        	branchMultiplier:0.5,
            presentClade: function (clade) {
            var tmpl = st.config.tmpl, nodeList = [], node,  split, SpatialPortal;
  
              var html = '', names = [], formattedNames = [], output = [], header = [' ','links',' ',' ', ' ', ' '], temp, link;
              
              output.push ( header );
				  
                for (var i = 0; ((i < clade.length) & (i < 30)); i++) {
             		  (function  ( index ) {
                                 var node = clade[i], sampleid, result, rel, LSID, genus,  species, genus_plus_species;

                                 temp = [];  
                                 Taxon = node.name.match(/[^\d]*/); 
                                 genus_plus_species = Taxon[0].replace(/\s+/g,'+');
                                
                                                  
                            	$.ajax({type: 'GET',
					 			url:'http://bie.ala.org.au/ws/guid/'+genus_plus_species ,
								 		success:  function(data) {   LSID = data[0].identifier;   } }  );  
                                
                                 // ALA Spatial portal 
                                 result = Taxon ?  '<a class="thumbImage1" rel="' +Taxon[0]+i+ '"' +
                                 		  'title= "ALA LSID density map (given sufficient samples)"' + 
                                          ' href= "http://biocache.ala.org.au/ws/density/map?q=' + LSID + '"' +
                                          ' "rel="' +Taxon[0]+i+ '" ' + 'class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a>': ' ';
                                     
                                temp.push ( result ); 
                   				
                   				// image 
                   				result = Taxon ?  '<a class="thumbImage1" rel="' +Taxon[0]+i+ '"' +
                                 		  'title= "Image (if present)"' + 
                                          ' href= "http://bie.ala.org.au/ws/species/image/small/' + LSID + '"' +
                                          ' "rel="' +Taxon[0]+i+ '" ' + 'class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a>': ' ';
                                     
                                temp.push ( result ); 
                   				
                   
                                // bie species page
                                  result = Taxon ? '<a class="thumbImage1" rel="' +Taxon[0]+i+ '"' +
                                        'title="ALA page"' + 
                                        ' href="http://bie.ala.org.au/species/' + genus_plus_species + '">' +Taxon[0]+'</a>': ' ';
                                 temp.push ( result ); 
								 
					
                                 // NSL - australian national species list
                                  result = Taxon ?  '<a class="thumbImage1" rel="' +Taxon[0]+i+ '"' +
                                 		  'title= "NSL nomenclator "' + 
                                          ' href="http://biodiversity.org.au/name/' +genus_plus_species+ '"' +
                                          ' "rel="' +Taxon[0]+i+ '" ' + 'class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a>': ' ';
                        
                                 temp.push ( result ); 
      											   
							 output.push ( temp );
                               })( i );    

                 			}  //for
  				result = '';
                result = '<tr><th>' + output[0].join ( '</th><th>' ) + '</th></tr>';
                    for ( i = 1; i < output.length ; i++ ) {
                               result += '<tr><td>' + output[i].join ( '</td><td>' ) + '</td></tr>';
                             }
                // send taxa to the ALA spatial portal           
                SpatialPortal = '<a  title="ALA page" href="http://spatial.ala.org.au/?';
    
                var Colours= new Array( "0x109618","0x316395","0x329262","0x651067","0x990099","0x994499","0x3366CC",
										"0xDC3912","0xFF9900","0x0099C6","0xDD4477","0x66AA00","0xB82E2E","0x22AA99","0x6633CC","0x8B0707","0x5574A6","0x3B3EAC","0xB77322","0x16D620","0xB91383","0xF43595","0x9C5935");
			 for (var j = 0; ((j < clade.length) & (j < 15)); j++) 
			 	  { var nd = clade[j];
			 	    var Tx = nd.name; 
			 	    var ix = j + 1;
			 	  if (j > 0) { SpatialPortal = SpatialPortal + "&"; }; 
			 	  SpatialPortal = SpatialPortal + 'ly.'+ ix + '=' + Tx + '&ly.' + ix +'.s=' + Colours[j] + '&ly.' + ix + '.q=' + Tx;
			 	  };
			SpatialPortal = SpatialPortal + '">view in ALA Spatial portal</a>';
       
                return '<table>'+result+'</table>' + '>>' + SpatialPortal + '<<';
                
            }, //presentClade 
            
            onPresentClade:function ( ) {
                		  $('.thumbImage1').colorbox({iframe:true,width:'70%',height:'70%'});
           			},  // onPresentClade
          
          	 Tips:{
			enable:true,
			onShow:function( div, node){
			var url ='',   key, i , char,
				html ='',name ='', maptitle='',  index;
				if (!!node.name) {     
                                               
					url = url + '<img class="tipImage" src="http://biocache.ala.org.au/ws/density/map?q='+ node.name.replace(' ','+')+'"/>';
					maptitle = '<br/>ALA <strong>reported</strong> occurrences';
					name = '<i>'+node.name + '</i>';
					  }
				else { name = '  unnamed clade ';
					 }
				name = name + '<strong> click</strong> for ';
			if ( node.data.leaf ) { // end taxon
				  name = name + 'for linked data'; 	  
			} else { //clade 		    
				  name = 'Part of ' + name; 
				   if (node.length < 30) {
						   name = name + 'clade members'; }
					  else {
						   name = name + '30 clade members'; }
					}  
				name =  '<h3>'+ name + '</h3>';
				// display all characters
				var result = [] ;
				for ( index in st.config.selectedCharacters ) {
					key = st.config.selectedCharacters [ index ];
					char = node.data.character [ key ];
					html = '<strong>' + key + '</strong>: ';
					if ( typeof char === 'undefined' || char.length === 0 || typeof char[0] === 'undefined' ){
					  html += '&mdash;';
					} else if ( typeof char[0] !== 'number') {
					  html += char.join ( ',<br/>....' );
					} else {
					  html += char[0].toFixed ( 4 );
					}
					result.push ( html );
				}
				div.innerHTML = name + result.join ( '<br/>' ) + maptitle + url ;
			  }
			}, //tips 
		 
		 
           
          tree: '(((((Psammaspididae)unclassified_Psammaspididae)Psammaspididae,(Paranaspides,Anaspides,Allanaspides)Anaspididae)Anaspidacea,((Billibathynella,(Parabathynellidae,Parabathynellidae)Parabathynellidae_unclassified,Iberobathynella,Parabathynellidae,Atopobathynella,Brevisomabathynella)Parabathynellidae)Bathynellacea)Syncarida);',

            character: { }
        });
        //testcase();
    } 
 
	


