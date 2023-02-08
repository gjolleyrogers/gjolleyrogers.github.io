    function init() {

        phylogenyExplorer_init({

			codeBase:'../..',
            width: 800,
            height:3000,        
        	alignName:true,
        	lateralise:false, 
       		levelsToShow:10,
        	branchMultiplier:5,

            presentClade: function (clade) {
            var tmpl = st.config.tmpl, nodeList = [], node,  split, SpatialPortal;
  
              var html = '', names = [], formattedNames = [], output = [], header = ['image','map','bie ','NSL ',' ', ' '], temp, link;
              
              output.push ( header );
				  
                for (var i = 0; ((i < clade.length) & (i < 30)); i++) {
             		  (function  ( index ) {
                                 var node = clade[i], sampleid, result, rel, LSID, genus,  species, genus_plus_species;

                                 temp = [];  
                                 Taxon = node.name.match(/[^\d]*/); 
                                 genus_plus_species = Taxon[0].replace(/\s+/g,'+');
                                  // Aust. Plant image index
                        	 ApIIgenus_plus_species = 'genus=' + Taxon[0].replace(/\s+/g,'&species=');   
                                result = Taxon ?  '<a class="thumbImage1" rel="' +Taxon[0]+i+ '"' +
                                 		  'title= "Aust. Plant image index"' + 
                                           ' href= "http://www.anbg.gov.au/cgi-bin/apiiGenus?' + ApIIgenus_plus_species + '"' +
                                          ' "rel="' +Taxon[0]+i+ '" ' + 'class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a>': ' ';                                         
                                 temp.push ( result );    
                                                  
                            	$.ajax({type: 'GET',
					 			url:'http://bie.ala.org.au/ws/guid/'+genus_plus_species ,
								 		success:  function(data) {   LSID = data[0].identifier;   } }  );  
                                
                                 // ALA Spatial portal 
                                 result = Taxon ?  '<a class="thumbImage1" rel="' +Taxon[0]+i+ '"' +
                                 		  'title= "ALA LSID density map (given sufficient samples)"' + 
                                          ' href= "http://biocache.ala.org.au/ws/density/map?q=' + LSID + '"' +
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
			} //tips 
		 ,
//  Tree and Characters
 character: {
"Abelmoschus moschatus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Abrophyllum ornans" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Abrus precatorius" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Abutilon auritum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Abutilon indicum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Abutilon oxycarpum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Acacia aulacocarpa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Acacia auriculiformis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia celsa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia cincinnata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia crassicarpa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia fasciculifera" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia flavescens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia holosericea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia hylonoma" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia lamprocarpa" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Acacia leptocarpa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia mangium" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia melanoxylon" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia midgleyi" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia oraria" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia polystachya" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia shirleyi" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acacia spirorbis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Acacia ulicifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acanthospermum hispidum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Aceratium ferrugineum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Achyranthes aspera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Acmenosperma claviflorum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Acronychia acidula" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Acronychia acronychioides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Acronychia crassipetala" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Acronychia imperforata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Acronychia laevis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Acrothamnus spathaceus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Acsmithia davidsonii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Actephila latifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Actephila sessilifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Adansonia gregorii" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Adenanthera pavonina" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Adenia heterophylla" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Adenostemma lavenia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Adenostemma macrophyllum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aeschynomene americana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Agathis atropurpurea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Agathis microstachya" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Agathis robusta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ageratum conyzoides" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aglaia argentea" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aglaia australiensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Aglaia brassii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aglaia brownii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Aglaia cooperae" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aglaia elaeagnoidea" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aglaia euryanthera" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aglaia meridionalis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Aglaia sapindina" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aglaia silvestris" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Aglaia spectabilis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Aglaia tomentosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "?"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Aidia racemosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ailanthus integrifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ailanthus triphysa" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alangium sp Claudie River" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Alangium villosum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Albizia lebbeck" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Albizia procera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Albizia sp Windsor Tableland" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alchornea thozetiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alectryon connatus" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alectryon kimberleyanus" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Alectryon semicinereus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alectryon tomentosus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Aleurites moluccanus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aleurites rockinghamensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Allamanda cathartica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Allocasuarina torulosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Allophylus cobbe" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Allosyncarpia ternata" : {
	"Area":  [ "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Alloxylon flammeum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alloxylon wickhamii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alocasia brisbanensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alphitonia excelsa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alphitonia petriei" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alphitonia whitei" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alpinia arctiflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alpinia caerulea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alpinia modesta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Alstonia actinophylla" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alstonia muelleriana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alstonia scholaris" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Alyxia grandis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Alyxia ilicifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Alyxia oblongata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Alyxia ruscifolia" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "?"]  },
"Alyxia spicata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Amaranthus hybridus" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Amaranthus spinosus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Amomum dallachyi" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Amomum queenslandicum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Amorphophallus galbra" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Amorphophallus paeoniifolius" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Amyema congener" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Amyema glabra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Amyema queenslandica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Amyema villiflora subsp tomentilla" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Amylotheca dictyophleba" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Anacolosa papuana" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Ancistrachne uncinulata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Anisomeles malabarica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Annona glabra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Annona squamosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Anredera cordifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Anthocarapa nitidula" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "?"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Antiaris toxicaria" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Antidesma bunius" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Antidesma erostre" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Antirhea sp Mt Lewis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Antirhea tenuiflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Aphananthe philippinensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Apodytes brachystylis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Araucaria bidwillii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Araucaria cunninghamii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Archidendron grandiflorum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Archidendron hirsutum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Archidendron kanisii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Archidendron ramiflorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Archidendron vaillantii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Archidendron whitei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Archidendropsis xanthoxylon" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Archirhodomyrtus beckleri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Archontophoenix alexandrae" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Archontophoenix purpurea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Ardisia brevipedata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ardisia crenata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Ardisia elliptica" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ardisia pachyrrhachis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Arenga australasica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Arenga microcarpa" : {
	"Area":  [ "NT"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Argophyllum cryptophlebum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Argyreia nervosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Argyrodendron peralatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Argyrodendron polyandrum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Argyrodendron sp Boonjee" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Argyrodendron trifoliolatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Aristida superpendens" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Aristolochia acuminata" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aristolochia elegans" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aristolochia indica" : {
	"Area":  [ "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aristolochia pubera" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Aristolochia thozetii" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Artanema fimbriatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Arthrostylis aphylla" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Artocarpus glaucus" : {
	"Area":  [ "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Artocarpus heterophyllus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Arundinella nepalensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Arytera divaricata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Arytera pauciflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Asclepias curassavica" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Asparagus plumosus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Asparagus racemosus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Asteromyrtus brassii" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Atalaya angustifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Atalaya salicifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Atalaya sericopetala" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Athertonia diversifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Atractocarpus fitzalanii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Atractocarpus hirtus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Atractocarpus merikin" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Auranticarpa edentata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Auranticarpa ilicifolia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "hypogeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Auranticarpa papyracea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Austrobaileya scandens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Austrobuxus megacarpus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Austromatthaea elegans" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Austromuellera trinervia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "dry"]  },
"Austrosteenisia blackii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Axonopus compressus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Axonopus fissifolius" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Backhousia angustifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Backhousia bancroftii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Backhousia enata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Backhousia hughesii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Baileyoxylon lanceolatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Balanops australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal"], "Fruit type":  [ "fleshy"]  },
"Baloghia inophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Baloghia parviflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Banksia aquilonia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Barleria cristata" : {
	"Area":  [ "Cape York"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Barongia lophandra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Barringtonia acutangula" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Barringtonia asiatica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Barringtonia calyptrata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Barringtonia racemosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Basilicum polystachyon" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Bauhinia binata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Bauhinia hookeri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Bauhinia monandra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Beilschmiedia bancroftii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Beilschmiedia brunnea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Beilschmiedia collina" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Beilschmiedia obtusifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Beilschmiedia recurva" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Beilschmiedia volckii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Berrya javanica" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Bidens alba" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Bidens pilosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Bischofia javanica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Blepharocarya involucrigera" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Blumea riparia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Bobea myrtoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Boea hygroscopica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Boea kinneari" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Boehmeria nivea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Boerhavia dominii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Bombax ceiba" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Bosistoa medicinalis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Bothriochloa pertusa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Bowenia serrulata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Bowenia spectabilis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Brachychiton acerifolius" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Brachychiton australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Brackenridgea australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Breynia cernua" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Breynia oblongifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Breynia stipitata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Bridelia insulana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Bridelia leichhardtii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Bridelia tomentosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Brillantaisia lamium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Brombya platynema" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Brucea javanica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Bubbia queenslandiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Bubbia queenslandiana subsp australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Bubbia semecarpoides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Buchanania arborescens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Buckinghamia celsissima" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Buckinghamia ferruginiflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Bulbostylis barbata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Bursaria incana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Bursaria spinosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Caesalpinia bonduc" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Caesalpinia crista" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Caesalpinia decapetala" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Caesalpinia traceyi" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Calamus aruensis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Palm or pandan or cycad", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Calamus caryotoides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Calamus moti" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Calanthe triplicata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Callerya pilipes" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Callicarpa candicans" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Callicarpa longifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Callicarpa pedunculata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Callitris intratropica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Callitris macleayana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Calophyllum inophyllum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Calophyllum sil" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Calophyllum soulattri" : {
	"Area":  [ "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Calopogonium mucunoides" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Calotropis procera" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Calyptocarpus vialis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Camellia sinensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Cananga odorata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Canarium acutifolium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Canarium australasicum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Canarium muelleri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Canarium vitiense" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Canavalia cathartica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Canavalia papuana" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Canavalia rosea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Canna indica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Canscora diffusa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cansjera leptostachya" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Canthium lamprophyllum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Capparis arborea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Capparis lucida" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Capparis sepiaria" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Capsicum annuum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Carallia brachiata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cardamine flexuosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cardiospermum grandiflorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cardiospermum halicacabum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cardwellia sublimis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Carex brunnea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Carex horsfieldii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Carissa ovata" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Carnarvonia araliifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Carnarvonia araliifolia var montana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Carpentaria acuminata" : {
	"Area":  [ "NT"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Carronia protensa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cascabela thevetia" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Casearia costulata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cassia queenslandica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cassinia subtropica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cassytha capillaris" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Cassytha filiformis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Castanospermum australe" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Castanospora alphandii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Castilla elastica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Casuarina equisetifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Catalepidia heyana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Catharanthus roseus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cathormion umbellatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cayratia japonica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cayratia saponaria" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Cayratia trifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cecarria obtusifolia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Cecropia peltata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Celastrus subspicatus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Celtis paniculata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Celtis timorensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cenchrus echinatus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Centella asiatica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Centotheca lappacea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Centratherum punctatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Centrosema pubescens" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Cephalaralia cephalobotrys" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ceratopetalum hylandii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ceratopetalum macrophyllum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ceratopetalum succirubrum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Cerbera floribunda" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cerbera inflata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cerbera manghas" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Ceropegia cumingiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cestrum nocturnum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Chionanthus axillaris" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Chionanthus ramiflorus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Chisocheton longistipitatus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Choriceras tricorne" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Chromolaena odorata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Chrysophyllum roxburghii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Chukrasia tabularis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cinnamomum camphora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cinnamomum laubatii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cirsium vulgare" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cissampelos pareira" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cissus hastata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cissus hypoglauca" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cissus penninervis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cissus reniformis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cissus repens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Citronella moorei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Citronella smythii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Citrus garrawayi" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Citrus inodora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Citrus reticulata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Citrus sinensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Claoxylon tenerifolium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Clausena brevistyla" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cleidion javanicum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cleistanthus apodus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "dry"]  },
"Cleistanthus hylandii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "dry"]  },
"Cleistanthus myrianthus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "dry"]  },
"Cleistanthus semiopacus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "dry"]  },
"Clematis pickeringii" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cleome aculeata" : {
	"Area":  [ "?"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Cleome viscosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Clerodendrum floribundum var ovatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Clerodendrum inerme" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Clerodendrum longiflorum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Clerodendrum paniculatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Clerodendrum tracyanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Clitoria ternatea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cnesmocarpon dasyantha" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Cochlospermum gillivraei" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cocos nucifera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Codiaeum variegatum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Codonocarpus attenuatus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Coelospermum dasylobum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Coelospermum purpureum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Coffea arabica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Coffea brassii" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Coffea liberica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Colocasia esculenta" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Colubrina asiatica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Commelina ensifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Commersonia bartramia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Connarus conchocarpus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Conyza canadensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Conyza sumatrensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Corchorus aestuans" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cordia dichotoma" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cordia myxa" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cordyline cannifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cordyline fruticosa" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Corymbia intermedia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Corymbia tessellaris" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Corymbia torelliana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Corymborkis veratrifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Corynocarpus cribbianus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Corypha utan" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Cosmos caudatus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Costus potierae" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Crassocephalum crepidioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Crateva religiosa" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Crinum pedunculatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Crispiloba disperma" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Crotalaria lanceolata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Crotalaria pallida" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Croton acronychioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Croton caudatus" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Croton insularis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Croton triacros" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cryptocarya angulata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya bellendenkerana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya clarksoniana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya cocosoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya corrugata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya cunninghamii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya densiflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya grandis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya hypospodia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya laevigata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya leucophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya lividula" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya mackinnoniana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya melanocarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya murrayi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya oblata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya putida" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya saccharata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya triplinervis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptocarya vulgaris" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Cryptostegia grandiflora" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cucumis maderaspatanus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Cupaniopsis anacardioides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Cupaniopsis diploglottoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Cupaniopsis flagelliformis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Cupaniopsis fleckeri" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cupaniopsis foveolata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Curcuma australasica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Curcuma longa" : {
	"Area":  [ "Cape York"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyanthillium cinereum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cyathostemma glabrum" : {
	"Area":  [ "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Cyathostemma micranthum" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Cyathula prostrata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cycas media" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Cyclophyllum multiflorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cynanchum ovalifolium" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Cynodon dactylon" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyperus brevifolius" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyperus decompositus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Cyperus gracilis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyperus haspan" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyperus involucratus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyperus pilosus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyrtandra baileyi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Cyrtococcum accrescens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyrtococcum oxyphyllum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Cyrtococcum patens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dactyliophora novae guineae" : {
	"Area":  [ "Cape York"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Dactyloctenium aegyptium" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dalbergia candenatensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dansiea elliptica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Daphnandra repandula" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Darlingia darlingiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Darlingia ferruginea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Davidsonia pruriens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Decaisnina brittenii" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Decaisnina congesta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Decaisnina signata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Decaspermum humile" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Deeringia amaranthoides" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Delarbrea michieana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Delonix regia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dendrocnide photinophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dendromyza reinwardtiana" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Dendrophthoe curvata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Dendrophthoe vitellina" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Dendrotrophe varians" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Denhamia obscura" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Denhamia oleaster" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Denhamia pittosporoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Denhamia viridissima" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Deplanchea tetraphylla" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Derris koolgibberah" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Derris trifoliata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Desmodium gangeticum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Desmodium heterocarpon" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Desmodium intortum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Desmodium tortuosum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Desmos goezeanus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Desmos polycarpus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Desmos wardianus" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Dianella atraxis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Dichapetalum papuanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dictyoneura obtusa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dillenia alata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dimocarpus australianus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dimocarpus longan" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Dimorphocalyx australiensis" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dinosperma erythrococcum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "?"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dinosperma melanophloia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dinosperma stipitatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dioclea hexandra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Dioscorea alata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Dioscorea bulbifera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Diospyros australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Diospyros compacta" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros cupulosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros fasciculosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros hebecarpa" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros pentamera" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros sp Baird" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Diospyros sp Milla Milla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros sp Mt Lewis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diospyros sp Mt White" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diplatia furcata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Diplocyclos palmatus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Diploglottis diphyllostegia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Diploglottis harpullioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Diploglottis pedleyi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Diploglottis smithii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dischidia nummularia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dissiliaria surculosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dissotis rotundifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Dodonaea lanceolata" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dodonaea platyptera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dodonaea polyandra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dodonaea triquetra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dodonaea viscosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Dolichandra unguis cati" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Doryphora aromatica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Drosera adelae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "Carnivorous"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Drosera prolifera" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "Carnivorous"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Dryadodaphne trachyphloia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Drymaria cordata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Drypetes acuminata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Drypetes deplanchei" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Duboisia myoporoides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Duranta erecta" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Dysoxylum alliaceum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum arborescens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum gaudichaudianum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum klanderi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum latifolium" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum mollissimum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum oppositifolium" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum papuanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum pettigrewianum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Dysoxylum rufum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Eclipta prostrata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ehretia acuminata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ehretia laevis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ehretia membranifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Eidothea zoexylocarya" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Elaeagnus triflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus arnhemicus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus bancroftii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus carolinae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus grahamii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus largiflorens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus sericopetalus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Elaeocarpus sp Windsor Tableland" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Elaeodendron australe" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Elaeodendron melanocarpum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Elatostema reticulatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Elattostachys megalantha" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Elattostachys microcarpa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Elephantopus scaber" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Embelia australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Emilia sonchifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Emmenosperma alphitonioides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Emmenosperma cunninghamii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Endiandra acuminata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra cowleyana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra dichrophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra impressicosta" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra insignis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra jonesii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra leptodendron" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra longipedicellata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra microneura" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra monothyra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra montana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra palmerstonii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Endiandra phaeocarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endiandra wolfei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Endospermum myrmecophilum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Endressia wardellii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Entada phaseoloides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Entada rheedei" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Epipogium roseum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "Saprophytic"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Epipremnum pinnatum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Eranthemum pulchellum" : {
	"Area":  [ "NE Qld", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Erechtites valerianifolius" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eriachne pallescens" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Erycibe coccinea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Erythrina variegata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Erythrophleum chlorostachys" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Erythroxylum ecarinatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Etlingera australasica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Eucalyptus crebra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "?"]  },
"Eucalyptus grandis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eucalyptus houseana" : {
	"Area":  [ "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eucalyptus macta" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eucalyptus pellita" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eucalyptus tereticornis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eugenia reinwardtiana" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Eulophia zollingeri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "Saprophytic"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Euodia hylandii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Euodia pubifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Euonymus australiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Euonymus globularis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Euphorbia coghlanii" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Euphorbia cyathophora" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Euphorbia plumerioides" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Herb", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Euphorbia tannensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Eupomatia laurina" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Euroschinus falcatus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Eustrephus latifolius" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Everistia vacciniifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Excoecaria agallocha" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Exocarpos latifolius" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Exocarya scleroides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Fagraea cambagei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Fagraea fagraeacea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Fagraea racemosa" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Faradaya splendida" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Fatoua villosa" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Ficus adenosperma" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus albipila" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus benjamina" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus brachypoda" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus congesta" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus copiosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus crassipes" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus destruens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus drupacea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus hispida" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ficus leptoclada" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus melinocarpa" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus microcarpa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus mollior" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus nodosa" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus obliqua" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus opposita" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus pantoniana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus platypoda" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus pleurocarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus racemosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus rubiginosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus septica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus tinctoria" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus triradiata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus variegata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus virens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus virgata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ficus watkinsiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Fimbristylis dichotoma" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Fimbristylis microcarya" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Fimbristylis pauciflora" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Fioria vitifolia" : {
	"Area":  [ "NE Qld", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Firmiana papuana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Fitzalania heteropetala" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Flacourtia jangomas" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Flacourtia sp Shiptons Flat" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Flagellaria indica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Flindersia bourjotiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Flindersia brayleyana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Flindersia ifflaiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Flindersia laevicarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Flindersia pimenteliana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Flindersia schottiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Floscopa scandens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Flueggea leucopyrus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Flueggea virosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Flueggea virosa subsp melanthesioides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Fontainea picrosperma" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Franciscodendron laurifolium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Freycinetia excelsa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Freycinetia marginata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Freycinetia scandens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Fuirena ciliaris" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Fuirena umbellata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Gahnia aspera" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Galbulimima baccata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ganophyllum falcatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Garcinia dulcis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Garcinia gibbsiae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Garcinia sp Davies Creek" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Garcinia warrenii" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Gardenia ovularis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Garnotia stricta" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Garuga floribunda" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gastonia spectabilis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Geijera salicifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Geissois biagiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Geitonoplesium cymosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Geniostoma rupestre" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Geniostoma rupestre var australiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Geophila repens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gevuina bleasdalei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Gillbeea adenopetala" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glinus oppositifolius" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Glochidion benthamianum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion disparipes" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion harveyanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion hylandii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion lobocarpum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Glochidion philippicum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Glochidion pungens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Glochidion sessiliflorum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion sessiliflorum var pedicellatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion sumatranum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Glochidion xerocarpum" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Glossocarya hemiderma" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Glycine cyrtoloba" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Glycosmis trifoliata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Gmelina fasciculiflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gomphandra australiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gomphocarpus physocarpus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Goniothalamus australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Gonocarpus acanthocarpus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Gossia floribunda" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gossia grayi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Gossia hillii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gossia lewisensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gossia lucida" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gossia macilwraithensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Gossia retusa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gossia shepherdii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Gouania australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Graptophyllum excelsum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Graptophyllum spinigerum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Grevillea baileyana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Grevillea pteridifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Grevillea robusta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Grewia papuana" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Guettarda speciosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Guilfoylia monostylis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Guioa acutifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Guioa lasioneura" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Gunnessia pepo" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Gymnanthera oblonga" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Gymnosporia inermis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Gymnostachys anceps" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Gymnostoma australianum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Gynochthodes oresbia" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Gynochthodes sessilis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Gyrocarpus americanus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Halfordia kendack" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Haplostichanthus fruticosus" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Haplostichanthus ramiflorus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Haplostichanthus rufescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Haplostichanthus submontanus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Hardenbergia violacea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Harpullia arborea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Harpullia pendula" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Harpullia ramiflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Harpullia rhyticarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Harrisonia brownii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Harungana madagascariensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Hedraianthera porphyropetala" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hedycarya loxocarya" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Hedychium coronarium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Hedyotis auricularia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hedyotis novoguineensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Helicia australasica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Helicia lamingtoniana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Helicteres isora" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Helmholtzia acorifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Hemigraphis alternata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Hemmantia webbii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Heritiera littoralis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Hernandia albiflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Hernandia nymphaeifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Heteropogon contortus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Heterostemma acuminatum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hexaspora pubescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hibbertia banksii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibbertia scandens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibiscus heterophyllus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibiscus macilwraithensis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibiscus meraukensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibiscus normanii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibiscus peralbus" : {
	"Area":  [ "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hibiscus tiliaceus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hibiscus tozerensis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hicksbeachia pilosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Hippocratea barbata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hiptage benghalensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Hodgkinsonia frutescens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Hollandaea riparia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Hollandaea sayeriana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Homalanthus novoguineensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Homalanthus nutans" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Homalium circumpinnatum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hornstedtia scottiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Horsfieldia australiana" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Hovea longipes" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Hoya anulata" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hoya australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hoya australis subsp tenuipes" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hoya macgillivrayi" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hoya pottsii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hugonia jenkinsii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Hybanthus enneaspermus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Hydriastele wendlandiana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Hylandia dockrillii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Hymenosporum flavum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hypericum gramineum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hypoestes floribunda" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hypolytrum nemorum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Hypserpa decumbens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Hypserpa laurina" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Hypserpa smilacifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Hypsophila dielsiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Hypsophila halleyana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Hyptis capitata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hyptis pectinata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Hyptis suaveolens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ichnocarpus frutescens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal", "durian"], "Fruit type":  [ "dry"]  },
"Idiospermum australiense" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ilex arnhemensis" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ilex sp Gadgarra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Impatiens walleriana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Indigofera colutea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Indigofera suffruticosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Intsia bijuga" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea cairica" : {
	"Area":  [ "?"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea eriocarpa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea gracilis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Ipomoea hederifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea indica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Ipomoea mauritiana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea muelleri" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Ipomoea nil" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea pes caprae" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea plebeia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea quamoclit" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ipomoea triloba" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ipomoea velutina" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Irvingbaileya australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Isolepis humillima" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Ixora biflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ixora oreogena" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ixora timorensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Jagera pseudorhus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Jasminum simplicifolium" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Kailarsenia ochreata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Kennedia rubicunda" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Kleinhovia hospita" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Kopsia arborea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Korthalsella grayi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Korthalsella japonica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Korthalsella papuana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Korthalsella rubra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Kuntheria pedunculata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Laccospadix australasicus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Lagerstroemia archeriana" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Lantana camara" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Laportea interrupta" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Lasianthus cyanocarpus" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Lasianthus strigosus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Lasjia claudiensis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Lasjia grandis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Lasjia whelanii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Leea indica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Leea rubra" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Legnephora moorei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Leionema ellipticum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Lenbrassia australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Lenwebbia lasioclada" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Leonotis nepetifolia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Lepiderema hirsuta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Lepiderema largiflorens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Lepidopetalum fructoglabrum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Lepidozamia hopei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Lepisanthes rubiginosa" : {
	"Area":  [ "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Lepisanthes senegalensis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Leptaspis banksii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Leptospermum wooroonooran" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Lethedon setosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Leucaena leucocephala" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Leucopogon malayanus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Leucopogon ruscifolius" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Leucopogon yorkensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Levieria acuminata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Licuala ramsayi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Ligustrum australianum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ligustrum lucidum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ligustrum sinense" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Lindera queenslandica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Lindernia crustacea" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Lindsayomyrtus racemoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Lithomyrtus obtusa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Litsea bindoniana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Litsea breviumbellata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Litsea connorsii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Litsea fawcettiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Litsea glutinosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Litsea granitica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Litsea leefeana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Livistona australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Livistona benthamii" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Livistona concinna" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Livistona muelleri" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Livistona rigida" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Livistona victoriae" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Lomandra longifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Lomatia fraxinifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Lophatherum gracile" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Lophopetalum arnhemicum" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal", "durian"], "Fruit type":  [ "dry"]  },
"Lophostemon confertus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Lophostemon lactifluus" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Lophostemon suaveolens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ludwigia hyssopifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ludwigia octovalvis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Luffa aegyptiaca" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Lunasia amara" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Lycianthes shanesii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Lysiana maritima" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Macaranga inamoena" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Macaranga involucrata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Macaranga subdentata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Macaranga tanarius" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Macfadyena unguis cati" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Mackinlaya confusa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Maclura cochinchinensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Macropteranthes montana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Macroptilium atropurpureum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal"], "Fruit type":  [ "dry"]  },
"Macrotyloma axillare" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Macrotyloma uniflorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Maesa dependens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Mallotus claoxyloides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Mallotus dispersus" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mallotus mollissimus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mallotus paniculatus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mallotus philippensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mallotus polyadenos" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mallotus repandus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Mallotus resinosus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Malvastrum americanum" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mammea touriga" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Mangifera indica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Manihot glaziovii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Manilkara kauki" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Maniltoa lenticellata" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Maranthes corymbosa" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Margaritaria indica" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Marsdenia longipedicellata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Marsdenia pleiadenia" : {
	"Area":  [ "NE Qld", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Martynia annua" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Maytenus cunninghamii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Maytenus disperma" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mecardonia procumbens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Medicosma fareana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Medicosma glandulosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Medicosma sessiliflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Megahertzia amplexicaulis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Meiogyne cylindrocarpa" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Meiogyne cylindrocarpa subsp trichocarpa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Meiogyne hirsuta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Meiogyne verrucosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Melaleuca argentea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melaleuca dealbata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melaleuca leucadendra" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melaleuca viminalis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melaleuca viridiflora" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melanthera biflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melastoma cyanoides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Melastoma malabathricum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Melia azedarach" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Melicope bonwickii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melicope broadbentiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Melicope elleryana" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melicope jonesii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melicope peninsularis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Melicope rubra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Melicope vitiflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melicope xanthoxyloides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Melochia umbellata" : {
	"Area":  [ "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Melodinus australis" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Melodinus baccellianus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Melodorum crassipetalum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Melodorum leichhardtii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Melodorum scabridulum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Melodorum uhrii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Melodorum unguiculatum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Memecylon pauciflorum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Merremia dissecta" : {
	"Area":  [ "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Merremia peltata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Merremia tuberosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Merremia umbellata" : {
	"Area":  [ "NE Qld", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Mesua sp Boonjee" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Miconia calvescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Miconia nervosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Micromelum minutum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Microstachys chamaelea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mikania micrantha" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Miliusa brahei" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Miliusa horsfieldii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Miliusa traceyi" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Millettia pinnata" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Mimusops elengi" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Mirabilis jalapa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mischarytera lautereriana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mischarytera macrobotrys" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mischarytera megaphylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mischocarpus exangulatus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mischocarpus grandissimus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mischocarpus pyriformis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mischocarpus stipitatus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Mitrantia bilocularis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Mitrasacme oasena" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Mitrasacme polymorpha" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Mitrasacme pygmaea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Mitrephora diversifolia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Molineria capitulata" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Momordica charantia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Momordica cochinchinensis" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Morinda citrifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Morinda jasminoides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Morinda podistra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Morinda reticulata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Morinda umbellata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Moringa oleifera" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Motherwellia haplosciadea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Mucuna gigantea" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Muehlenbeckia zippelii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Muellerargia timorensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Mullerochloa moreheadiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Murraya paniculata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Musa banksii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Musa jackeyi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Musgravea heterophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "dry"]  },
"Myoporum montanum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Myristica globosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Myristica globosa subsp muelleri" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Myristica insipida" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Myrsine achradifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Myrsine porosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Myrsine subsessilis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Myrsine variabilis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Nauclea orientalis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Neisosperma poweri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Neoachmandra cunninghamii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Neoalsomitra capricornica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Neoalsomitra clavigera" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Neolamarckia cadamba" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Neolitsea brassii" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Neolitsea dealbata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Neololeba atra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Neonauclea glabra" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Neonotonia wightii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Neorites kevedianus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Neostrearia fleckeri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Nepenthes mirabilis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Vine"], "Nutritional strategy":  [ "Carnivorous"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Nicandra physalodes" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Nicotiana tabacum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Niemeyera antiloga" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Niemeyera prunifera" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Noahdendron nicholasii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Normanbya normanbyi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Notelaea microcarpa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Nothorites megacarpus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Notothixos leiophyllus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Notothixos subaureus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Ochna serrulata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Ochrosia elliptica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Odontonema tubaeforme" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Oldenlandia biflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oldenlandia galioides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Olea paniculata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Olearia canescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Omphalea papuana" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Omphalea queenslandiae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ophiorrhiza australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Opilia amentacea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Opisthiolepis heterophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Oplismenus aemulus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oplismenus burmannii" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oplismenus compositus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oplismenus hirtellus" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oplismenus undulatifolius" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oraniopsis appendiculata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Ormosia ormondii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "dry"]  },
"Ostrearia australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ottochloa nodosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Oxalis corniculata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Ozothamnus cassinioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pachygone ovata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pachyrhizus erosus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Palaquium galactoxylum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Palmeria scandens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pandanus conicus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pandanus cookii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Pandanus gemmifer" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Pandanus lauterbachii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Pandanus monticola" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pandanus oblatus" : {
	"Area":  [ "Cape York"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Pandanus tectorius" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Pandanus zea" : {
	"Area":  [ "Cape York"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pandorea pandorana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Panicum trichoides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Paphia meiniana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Parapachygone longifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pararchidendron pruinosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Pararistolochia australopithecurus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pararistolochia deltantha" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pararistolochia praevenosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Pararistolochia sparusifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Paraserianthes toona" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Parkinsonia aculeata" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Parsonsia ferruginea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Parsonsia lanceolata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Parsonsia velutina" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Paspalum conjugatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Paspalum dilatatum" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Paspalum paniculatum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Paspalum scrobiculatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Passiflora aurantia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Passiflora aurantioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Passiflora edulis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Passiflora foetida" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Passiflora herbertiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Passiflora kuranda" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Passiflora suberosa" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Peltophorum pterocarpum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pemphis acidula" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Pennantia cunninghamii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Peperomia blanda" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Peperomia enervis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Peperomia hunteriana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Peperomia pellucida" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Peperomia tetraphylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Peripentadenia phelpsii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Perotis rara" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Perrottetia arborescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Persea americana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Persicaria hydropiper" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Persicaria orientalis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Petraeovitex multiflora" : {
	"Area":  [ "Cape York"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Phaius tancarvilleae" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Phaleria biflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Phaleria chermsideana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Phaleria clerodendron" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Phaleria octandra" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Philydrum lanuginosum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Phyllanthera grayi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Phyllanthus clamboides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Phyllanthus cuscutiflorus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Phyllanthus gunnii" : {
	"Area":  [ "?"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Phyllanthus hypospodius" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Phyllanthus lamprophyllus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Phyllanthus tenellus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Physalis minima" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Physalis peruviana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pilidiostigma papuanum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pilidiostigma tropicum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pimelodendron amboinicum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Piper caninum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Piper macropiper" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Piper umbellatum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pipturus argenteus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pisonia aculeata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pisonia grandis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pisonia umbellifera" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pitaviaster haplophyllus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pittosporum ferrugineum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pittosporum moluccanum" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pittosporum revolutum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pittosporum rubiginosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pittosporum spinescens" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pittosporum trilobum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pittosporum venulosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pittosporum wingii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pityrodia salviifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Placospermum coriaceum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Planchonella asterocarpon" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonella chartacea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonella cotinifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Planchonella euphlebia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonella myrsinodendron" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonella obovata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonella pohlmaniana" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonella pubescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Planchonella sp Mt Lewis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Planchonella xylocarpa" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Planchonia careya" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Plantago lanceolata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Plantago major" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Plectranthus amicorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Pleiogynium timoriense" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pleomele angustifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pleurostylia opposita" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Plumbago zeylanica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Podocarpus dispermus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Podocarpus elatus" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Podocarpus grayae" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Podocarpus smithii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Pogonatherum crinitum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Polyalthia australis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Polyalthia michaelii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Polyalthia nitidissima" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyalthia patinata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Polygala paniculata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Polyosma alangiacea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyosma hirsuta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyosma rhytophloia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyosma rigidiuscula" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy", "dry"]  },
"Polyscias australiana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias bellendenkerensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias elegans" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias macgillivrayi" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias mollis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias murrayi" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias nodosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias purpurea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Polyscias willmottii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Poranthera microphylla" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Portulaca pilosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Pothos longipes" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pouteria papyracea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pouteria pearsoniorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pouteria queenslandica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Pouteria singuliflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pouzolzia zeylanica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Praxelis clematidea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Premna odorata" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Premna serratifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Procris pedunculata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Proiphys amboinensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Prumnopitys ladei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Prunus brachystachya" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Prunus turneriana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pseudelephantopus spicatus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pseuderanthemum variabile" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Pseudovanilla foliata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "Saprophytic"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Pseudoweinmannia lachnocarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pseuduvaria froggattii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pseuduvaria hylandii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Pseuduvaria mulgraveana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Pseuduvaria villosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Psidium cattleyanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psidium guajava" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria coelospermum" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria dallachiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria fitzalanii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria loniceroides" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria poliostemma" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria sp Danbulla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psychotria submontana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psydrax laxiflorens" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psydrax montigena" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psydrax odorata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Psydrax tropica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Pternandra coerulescens" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Ptychosperma elegans" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Ptychosperma macarthurii" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Palm or pandan or cycad", "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Pueraria montana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Pueraria phaseoloides" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Pullea stutzeri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Pycnarrhena novoguineensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Quassia amara" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Queenslandiella hyalina" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Quintinia quatrefagesii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Quisqualis indica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Randia audasii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Randia tuberculosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rapanea achradifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Remusatia vivipara" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Rhamnella vitiensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhaphidospora cavernarum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Rhodamnia australis" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodamnia blairiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodamnia costata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodamnia longisepala" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Rhodamnia sessiliflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodamnia sharpeana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodamnia spongiosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhododendron lochiae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Rhodomyrtus canescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodomyrtus effusa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodomyrtus macrocarpa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodomyrtus pervagata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhodomyrtus sericea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rhus taitensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Rhynchosia minima" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Rhynchospora corymbosa" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Rhysotoechia florulenta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Rhysotoechia mortoniana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Rhysotoechia robertsonii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Richardia brasiliensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Rinorea bengalensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ripogonum album" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Ripogonum elseyanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Ristantia gouldii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Rivina humilis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Rockinghamia angustifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Rockinghamia brevipes" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Romnalda ophiopogonoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Rourea brachyandra" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Rubus queenslandicus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ruellia tuberosa" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ryparosa kurrangii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Ryssopterys timoriensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Salacia chinensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Salacia disepala" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Salacia erythrocarpa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Salvia plebeia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Samadera baileyana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal", "semi-hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Samadera sp Barong" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Samanea saman" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sambucus canadensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sanchezia parvibracteata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Sankowskya stipularis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Santalum lanceolatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sarcomelicope simplicifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sarcopetalum harveyanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sarcopteryx martyana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sarcopteryx montana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sarcopteryx reticulata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sarcostemma viminale" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Sarcotoechia cuneata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Sarcotoechia lanceolata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sarcotoechia protracta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sarcotoechia serrata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sarcotoechia villosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Saurauia andreana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sauropus albiflorus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sauropus macranthus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sauropus sphenophyllus" : {
	"Area":  [ "Cape York"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Scaevola enantophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Scaevola taccada" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Schefflera actinophylla" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Schefflera bractescens" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Schefflera elliptica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Schelhammera multiflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Schistocarpaea johnsonii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Schizomeria whitei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Schoutenia ovata" : {
	"Area":  [ "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Scirpodendron ghaeri" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Scleria brownii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Scleria lithosperma" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Scolopia braunii" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Scoparia dulcis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Secamone elliptica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Semecarpus australiensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Senna coronilloides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna gaudichaudii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna hirsuta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna obtusifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna occidentalis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna pendula" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna septemtrionalis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna siamea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Senna timorensis" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Senna tora" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sersalisia sericea" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Sersalisia sessiliflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Sesbania cannabina" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sesbania formosa" : {
	"Area":  [ "Cape York", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Setaria palmifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Sicyos australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Sida acuta" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sida cordifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sida rhombifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sida spinosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Sigesbeckia orientalis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Siphonodon australis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Siphonodon membranaceus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Sisyrinchium micranthum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Sloanea australis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sloanea australis subsp parviflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sloanea langii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sloanea macbrydei" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Smilax australis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Smilax blumei" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Smilax glyciphylla" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Solanum americanum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Solanum aviculare" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum betaceum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum capsicoides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum cookii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum dimorphispinum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum discolor" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum ellipticum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum lasiocarpum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Solanum macoorai" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum mauritianum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum nigrum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum pseudocapsicum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum seaforthianum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum torvum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Solanum viridifolium" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sophora tomentosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Spathodea campanulata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Spermacoce remota" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Sphaerantia chartacea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sphaerantia discolor" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sphagneticola trilobata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Sphalmium racemosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sphenostemon lobosporus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Stachytarpheta cayennensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Stachytarpheta jamaicensis" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Stachytarpheta mutabilis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Steganthera australiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Steganthera cooperorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Steganthera laxiflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Steganthera macooraia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Stenocarpus davallioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Stenocarpus reticulatus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Stenocarpus sinuatus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Stenocarpus verticis" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Stephania japonica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Sterculia quadrifida" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal"], "Fruit type":  [ "dry"]  },
"Sterculia shillinglawii" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Stockwellia quadrifida" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Storckiella australiensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Streblus glaber" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Streblus glaber var australianus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Streblus pendulinus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Strychnos lucida" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Strychnos minor" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Strychnos psilosperma" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Stylosanthes scabra" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Sundacarpus amarus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Suregada glomerulata" : {
	"Area":  [ "Cape York", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Suriana maritima" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Symplocos ampulliformis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos cochinchinensis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos cochinchinensis var gittonsii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos cochinchinensis var glaberrima" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos graniticola" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos hayesii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Symplocos hylandii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos paucistaminea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Symplocos sp N Mary" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Symplocos stawellii var montana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Syncarpia glomulifera" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Synedrella nodiflora" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Syngonium podophyllum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Synima cordierorum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Synima macrophylla" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Synima reynoldsiae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Synoum glandulosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Synoum glandulosum subsp paniculosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Syzygium alatoramulum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium alliiligneum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium angophoroides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium apodophyllum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium aqueum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium argyropedicum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium armstrongii" : {
	"Area":  [ "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium australe" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium bamagense" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium banksii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium boonjee" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium branderhorstii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium buettnerianum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium bungadinnia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium canicortex" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium claviflorum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium cormiflorum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium corynanthum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium cryptophlebium" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium dansiei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium divaricatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Syzygium endophloium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium erythrocalyx" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium fibrosum" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium forte" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium glenum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Syzygium graveolens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Syzygium gustavioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Syzygium hedraiophyllum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium johnsonii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium kuranda" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium luehmannii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "durian"], "Fruit type":  [ "fleshy"]  },
"Syzygium macilwraithianum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium mackinnonianum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Syzygium malaccense" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium maraca" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium minutuliflorum" : {
	"Area":  [ "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium monimioides" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium mulgraveanum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium nervosum" : {
	"Area":  [ "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium oleosum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium papyraceum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium pseudofastigiatum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium puberulum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium resa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium sayeri" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium smithii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium suborbiculare" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium tierneyanum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium trachyphloium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium unipunctata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium unipunctatum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium velarum" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium wesa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium wilsonii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Syzygium xerampelinum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Tabernaemontana orientalis" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Tabernaemontana pandacaqui" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Tacca leontopetaloides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Tagetes minuta" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Tamarindus indica" : {
	"Area":  [ "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Tapeinochilos ananassae" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal", "semi-hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Tapeinosperma pallidum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Tarenna dallachiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tarenna monticola" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tasmannia insipida" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tasmannia membranea" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tecomanthe sp Roaring Meg" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Tephrosia purpurea" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Terminalia catappa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Terminalia complanata" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Terminalia muelleri" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Terminalia sericocarpa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Ternstroemia cherryi" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tetracera daemeliana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Tetracera nordtiana" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Tetrameles nudiflora" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Thaleropia queenslandica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Thespesia populneoides" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Thunbergia alata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Thunbergia grandiflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Thunbergia laurifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Thunbergia mysorensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Tiliacora australiana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Timonius singularis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Timonius timon" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tinospora esiangkara" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Tinospora smilacina" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tithonia diversifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Toechima daemelianum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Toechima erythrocarpum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Toechima pterocarpum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Toona ciliata" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Tradescantia zebrina" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Grass/sedge/rush/similar", "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Trema aspera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Trema cannabina" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Trema orientalis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Trema tomentosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Trema tomentosa var aspera" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Trichosanthes cucumerina" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Trichosanthes holtzei" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Trichosanthes ovigera" : {
	"Area":  [ "Cape York", "NE Qld", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "semi-hypogeal", "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Trichosanthes pentaphylla" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Trichospermum pleiostigma" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Tridax procumbens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual", "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Triplaris cumingiana" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Tristaniopsis exiliflora" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Tristellateia australasiae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Tristemma mauritianum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Tristiropsis acutangula" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Trochocarpa bellendenkerensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Trophis scandens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Turbina corymbosa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Turraea pubescens" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Tylophora grandiflora" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Tylophora williamsii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Typhonium alismifolium" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Typhonium brownii" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Typhonium flagelliforme" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Typhonium wilbertii" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Uncaria cordata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Uncaria lanosa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Urena lobata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Urochloa subquadripara" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Grass/sedge/rush/similar"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Uromyrtus metrosideros" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Urtica incisa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Utricularia uliginosa" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Uvaria concava" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Uvaria rufa" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Vandasina retusa" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Vanroyena castanosperma" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Vavaea amicorum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Ventilago viminalis" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Verbena bonariensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Verbena officinalis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Veronica plebeia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Vigna marina" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "dry"]  },
"Viscum articulatum" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Mistletoe"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Vitex acuminata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Vitex lignum vitae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Vitex rotundifolia" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Vitex trifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Viticipremna queenslandica" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Voacanga grandifolia" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Waltheria indica" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Welchiodendron longivalve" : {
	"Area":  [ "Cape York"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Wendlandia inclusa" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Wetria australiensis" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Wikstroemia indica" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea angustifolia" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea cordata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea hylandii" : {
	"Area":  [ "Cape York"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea pubescens" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea rigidifolia" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea smithii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  },
"Wilkiea sp palmerstonii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Wilkiea sp Russell Gorge" : {
	"Area":  [ "?"], "Habit":  [ "?"], "Nutritional strategy":  [ "?"], "Weed":  [ "?"], "Undersurface domatia":  [ "?"], "Glands on leaf or stem":  [ "?"], "Flower sexuality":  [ "?"], "Tree copicing":  [ "?"], "Germination type":  [ "?"], "Fruit type":  [ "?"]  },
"Wodyetia bifurcata" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Palm or pandan or cycad", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "monoecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy"]  },
"Wrightia laevis" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Wrightia laevis subsp milligar" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Wrightia versicolor" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Xanthophyllum octandrum" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "Yes"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Xanthostemon chrysanthus" : {
	"Area":  [ "Cape York", "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Xanthostemon verticillatus" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Xanthostemon whitei" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Xenostegia tridentata" : {
	"Area":  [ "Cape York", "NE Qld", "NT", "WA"], "Habit":  [ "Herb", "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Ximenia americana" : {
	"Area":  [ "Cape York", "NE Qld", "NT"], "Habit":  [ "Shrub", "Vine"], "Nutritional strategy":  [ "Parasitic total/partial"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "hypogeal"], "Fruit type":  [ "fleshy"]  },
"Xylopia maccreae" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "durian"], "Fruit type":  [ "fleshy"]  },
"Youngia japonica" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Zanthoxylum brachyacanthum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Zanthoxylum nitidum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Vine"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Zanthoxylum ovalifolium" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "dioecious"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Zanthoxylum veneficum" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "Yes"], "Flower sexuality":  [ "monoecious", "dioecious"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy", "dry"]  },
"Zieria madida" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "dry"]  },
"Zieria smithii" : {
	"Area":  [ "NE Qld"], "Habit":  [ "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "No"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "epigeal"], "Fruit type":  [ "dry"]  },
"Zingiber zerumbet" : {
	"Area":  [ "Cape York"], "Habit":  [ "Grass/sedge/rush/similar", "Herb", "Shrub"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "No"], "Germination type":  [ "?"], "Fruit type":  [ "fleshy", "dry"]  },
"Ziziphus mauritiana" : {
	"Area":  [ "NE Qld", "NT", "WA"], "Habit":  [ "Shrub", "Tree"], "Nutritional strategy":  [ "normal"], "Weed":  [ "Yes"], "Undersurface domatia":  [ "No"], "Glands on leaf or stem":  [ "No"], "Flower sexuality":  [ "bisexual"], "Tree copicing":  [ "Yes"], "Germination type":  [ "epigeal"], "Fruit type":  [ "fleshy"]  }
},      	 
        	tree:  '(((Cycas_media:0.14014615706460276,(Lepidozamia_hopei:0.1314123148792643,(Bowenia_spectabilis:0.002275084779525649,Bowenia_serrulata:0.0022202190764895047):0.033645094560858624):0.03523484107598618):0.11692032036237987,((Callitris_macleayana:0.022668762981020274,Callitris_intratropica:0.016491328939224115):0.2927814900979122,((Araucaria_bidwillii:0.21733231515642903,(Araucaria_cunninghamii:0.038239668639868274,(Agathis_robusta:0.0068099628641720145,(Agathis_microstachya:0.0011813430322196172,Agathis_atropurpurea:0.0012151838696272677):0.002015564443203832):0.03136470348698306):0.09181400718121902):0.11046245239057395,((Prumnopitys_ladei:0.050784239606169734,Sundacarpus_amarus:0.05365176602233612):0.02668643052082298,(Podocarpus_smithii:0.02343634119753535,(Podocarpus_dispermus:0.02483862403103343,(Podocarpus_elatus:0.01379353236130143,Podocarpus_grayae:0.005747790711383871):0.005067376163429893):0.03376838330169951):0.094986371812259):0.16600334936740135):0.059175948961547986):0.09487524018750437):0.2308268565985718,(Austrobaileya_scandens:0.16530636960896827,((((((Bubbia_queenslandiana_subsp_australis:1.3374472107585689E-6,(Bubbia_semecarpoides:1.3374472107585689E-6,Bubbia_queenslandiana:0.008558162182660367):0.006609096723379393):0.028968132435424843,(Tasmannia_insipida:0.001495743888419998,(Tasmannia_membranea:0.017399679529633838,Pararistolochia_deltantha:0.0031191040427692718):1.3374472107585689E-6):0.023151184461389196):0.16342141078337824,(((Pararistolochia_australopithecurus:0.010445388005397849,Pararistolochia_sparusifolia:0.02274759066515053):0.039363242462224335,(Aristolochia_elegans:0.032854672617618985,(Aristolochia_thozetii:0.033590670486356666,(Aristolochia_pubera:0.011750349027026208,(Aristolochia_indica:0.0061330580248324384,Aristolochia_acuminata:0.0018145193869745224):0.003285969644764908):0.001362295312372086):0.035517111910436716):0.0034807657516081614):0.18362530598626503,((Piper_umbellatum:0.059409841719523904,(Piper_macropiper:0.03262753722876344,Piper_caninum:0.020257159740157182):0.01848643579559639):0.03997445959996182,(Peperomia_pellucida:0.07419334156683177,(Peperomia_tetraphylla:0.05331967742808241,(Peperomia_blanda:0.016814602294981773,(Peperomia_hunteriana:1.3374472107585689E-6,Peperomia_enervis:1.3374472107585689E-6):0.005554573402302365):0.026327984255926973):0.023368208058678785):0.11318075831415131):0.2860724003948456):0.03194463587012608):0.0059258185309185585,(((Horsfieldia_australiana:0.004799056276030833,(Myristica_globosa:1.3374472107585689E-6,(Myristica_insipida:0.0022819497544017686,Myristica_globosa_subsp_muelleri:1.3374472107585689E-6):1.3374472107585689E-6):0.015494227162645258):0.12524753645616382,(Galbulimima_baccata:0.0933595790177747,(Eupomatia_laurina:0.08151502573077318,((Cananga_odorata:0.07122613763246255,(Xylopia_maccreae:0.0776990491417614,((Goniothalamus_australis:0.05723667286072931,(Annona_glabra:0.025952607945788686,Annona_squamosa:0.023399562970811028):0.060974256800029436):0.03015365992710939,((Desmos_goezeanus:0.008491799857122118,(Desmos_wardianus:0.005933621143348944,Desmos_polycarpus:1.3374472107585689E-6):0.002926695877277674):0.021035804642177913,((Uvaria_rufa:0.01785417447636306,(Cyathostemma_micranthum:0.011500937528671984,Cyathostemma_glabrum:0.004722538504365548):0.004629534311904049):0.006177643813686795,(Uvaria_concava:0.007946617578405757,((Melodorum_scabridulum:0.004744973532047503,Melodorum_unguiculatum:0.0031635787147028527):0.0014808425931536195,(Melodorum_leichhardtii:0.00939323648298529,(Melodorum_crassipetalum:0.007960179321057526,Melodorum_uhrii:0.00952436536600143):1.3374472107585689E-6):0.001584513068024429):0.007998267833427164):7.057391601763552E-4):0.031168996016562867):0.08276921429594497):0.036541809804632286):0.015842601087850516):0.007864031949602057,(Mitrephora_diversifolia:0.010841198638078198,((Polyalthia_nitidissima:0.021063590876823635,(Miliusa_horsfieldii:0.003479284933292859,(Miliusa_brahei:0.009933415081373687,Miliusa_traceyi:0.004899711802859752):0.005793911218397452):0.01011784155437856):0.002642144492519538,(((Polyalthia_australis:0.004149467353268599,(Polyalthia_patinata:0.014887067576113133,Polyalthia_michaelii:0.00954102825832348):0.009243010710974331):0.02176754868002284,(Haplostichanthus_ramiflorus:0.002124694911134317,(Haplostichanthus_rufescens:0.0021469209614990437,(Haplostichanthus_submontanus:0.008459386336795993,Haplostichanthus_fruticosus:1.3374472107585689E-6):0.0021086988736779277):1.3374472107585689E-6):0.026037664804387628):0.007434122997672432,(((Pseuduvaria_villosa:1.3374472107585689E-6,Pseuduvaria_mulgraveana:0.0015198923718822144):0.00626408015009694,(Pseuduvaria_hylandii:0.0015231699923339281,Pseuduvaria_froggattii:1.3374472107585689E-6):0.004570521158555163):0.010432453820213627,(Meiogyne_cylindrocarpa:0.0019507375245302327,((Meiogyne_verrucosa:0.0024550895650008453,Meiogyne_cylindrocarpa_subsp_trichocarpa:0.00552240246285407):0.004666437333652018,(Meiogyne_hirsuta:0.004658992156524988,Fitzalania_heteropetala:0.0033650203637276555):0.0018576807634089754):0.001321132094561639):0.004905410405407928):0.0011604639405450312):1.3374472107585689E-6):0.0020941750694972727):0.03268253007950794):0.05417922587546875):0.011011286418613708):0.01243918999806759):0.022368262661879523,(Idiospermum_australiense:0.13588603469635185,((Daphnandra_repandula:0.030809619807458,(Doryphora_aromatica:0.02060816472942628,Dryadodaphne_trachyphloia:1.3374472107585689E-6):0.006145740510121622):0.050487146423079055,((Gyrocarpus_americanus:0.0827002596689097,(Hernandia_albiflora:0.014970793012152872,Hernandia_nymphaeifolia:0.019954154859218587):0.0925543718697095):0.04758067584080372,((Palmeria_scandens:0.0512656994444437,(Hedycarya_loxocarya:0.006274316989362205,((Wilkiea_sp_palmerstonii:1.3374472107585689E-6,(Wilkiea_smithii:5.511424547254284E-4,Wilkiea_hylandii:1.3374472107585689E-6):0.004518009641004794):0.004774708986448384,((Wilkiea_angustifolia:0.0016865074528473745,Wilkiea_rigidifolia:0.00341543376436948):0.010533401455583014,(Levieria_acuminata:0.00778035018278711,((Austromatthaea_elegans:1.3374472107585689E-6,Hemmantia_webbii:0.004774957714577255):0.0055250552617079896,(Steganthera_cooperorum:0.0038693105702213293,(Endressia_wardellii:1.3374472107585689E-6,(Steganthera_macooraia:0.001374519360802906,((Steganthera_australiana:8.116917375757815E-4,Steganthera_laxiflora:0.0022330075838725705):0.0027044016168557006,(Wilkiea_cordata:0.002037293242073468,(Wilkiea_sp_Russell_Gorge:0.014035586653368903,Wilkiea_pubescens:9.263646676531678E-4):1.3374472107585689E-6):0.0019996664013720578):1.3374472107585689E-6):0.0014214340031535322):2.644512745753058E-5):0.0047633499218023845):0.001876909245906666):0.002199775009255167):0.00493064769562912):0.0025118213019595936):0.04331319154206037):0.07138528407545142,((Cassytha_capillaris:0.029125705220891085,Cassytha_filiformis:0.010144773377104288):0.16730970912595688,(((Cinnamomum_laubatii:0.002034503933039833,Cinnamomum_camphora:0.027572388914276824):0.019195347164361665,(Persea_americana:0.010416669286084312,(Litsea_glutinosa:0.011502569594083134,((Neolitsea_brassii:0.012185579533813051,Neolitsea_dealbata:0.0032535221968665873):0.008083019098147237,(Litsea_bindoniana:0.0020262000172266426,(Lindera_queenslandica:1.3374472107585689E-6,(Litsea_fawcettiana:1.3374472107585689E-6,(Litsea_breviumbellata:0.0042342161038023685,(Litsea_granitica:1.3374472107585689E-6,(Litsea_connorsii:1.3374472107585689E-6,Litsea_leefeana:0.002099575177625823):0.006294924377920785):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.00804933468640845):0.0020842482285933217):0.0042000757849689485):0.00974058341240791):0.06027224724407498,((Cryptocarya_oblata:0.04548894330908937,(((Cryptocarya_saccharata:1.3374472107585689E-6,Cryptocarya_corrugata:1.3374472107585689E-6):0.0021746576709781307,(Cryptocarya_angulata:1.3374472107585689E-6,Cryptocarya_densiflora:1.3374472107585689E-6):0.002174332180312155):1.3374472107585689E-6,(Cryptocarya_laevigata:0.0021315829695114363,((Cryptocarya_triplinervis:0.004602294163503551,Cryptocarya_clarksoniana:1.3374472107585689E-6):0.007696354896736701,(Cryptocarya_cocosoides:0.020686261452719124,(Cryptocarya_melanocarpa:1.3374472107585689E-6,(Cryptocarya_lividula:1.3374472107585689E-6,(Cryptocarya_cunninghamii:1.3374472107585689E-6,((Cryptocarya_hypospodia:1.3374472107585689E-6,Cryptocarya_bellendenkerana:1.3374472107585689E-6):1.3374472107585689E-6,(Cryptocarya_vulgaris:0.0022339601805250187,(Cryptocarya_mackinnoniana:0.002401066914591743,(Cryptocarya_murrayi:1.3374472107585689E-6,(Cryptocarya_leucophylla:1.3374472107585689E-6,Cryptocarya_putida:1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.0037991652259300457):0.007531214429315258):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.0036167454244998565):0.003973194891732423):0.006503848167732196):0.0034757767633699643):0.021745641129935822):0.007448924683294611,(((Endiandra_palmerstonii:1.3374472107585689E-6,Endiandra_longipedicellata:1.3374472107585689E-6):0.006289744489239912,(Beilschmiedia_brunnea:0.007387804533377396,((Beilschmiedia_obtusifolia:0.006557104497594279,Beilschmiedia_collina:0.002214980564276603):0.0021653726802255413,(Beilschmiedia_bancroftii:0.00673605481195283,(Beilschmiedia_recurva:0.0020761673968021643,(Beilschmiedia_volckii:1.3374472107585689E-6,Endiandra_jonesii:0.008204807246297685):0.0020946474689406136):0.0020533325392132484):0.002042350888061928):0.002028681001386645):0.002421849481777927):1.3374472107585689E-6,(Endiandra_insignis:0.0022178253906457446,((Endiandra_wolfei:0.004095905905630026,(Endiandra_phaeocarpa:1.3374472107585689E-6,(Endiandra_acuminata:0.001995081099040563,Cryptocarya_grandis:1.3374472107585689E-6):1.3374472107585689E-6):0.0069576072385629795):8.530062309819453E-5,(Endiandra_impressicosta:0.001633533497074624,((Endiandra_cowleyana:1.3374472107585689E-6,Endiandra_dichrophylla:1.3374472107585689E-6):0.0021471973517431797,(Endiandra_monothyra:1.3374472107585689E-6,(Endiandra_microneura:0.0022162125136092614,(Endiandra_leptodendron:1.3374472107585689E-6,Endiandra_montana:0.006512422605443602):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.0016009518290640568):0.004810320106745758):0.0023939209818709672):0.015932056075645407):0.03334010163940748):0.004765730317466299):0.01440326392255964):0.0024840206201248716):0.016700336638763247):0.006363693182215302):0.03042569557442132):0.0038092212762914635):0.009594661243954139,((Gymnostachys_anceps:0.05496808594447944,((Pothos_longipes:0.08790943334547974,Epipremnum_pinnatum:0.04647847435464014):0.013921713852156237,((Syngonium_podophyllum:0.03677956511057223,(Amorphophallus_paeoniifolius:0.01965413455732612,Amorphophallus_galbra:0.011039220010444328):0.030655480948739933):0.004189563647956085,(Typhonium_flagelliforme:0.03458163867061814,((Remusatia_vivipara:0.009383646204330742,Colocasia_esculenta:0.0064431979663667205):0.01658906754507694,(Alocasia_brisbanensis:0.013799941050989695,(Typhonium_brownii:0.004069240232897342,(Typhonium_wilbertii:0.014736092525235889,Typhonium_alismifolium:0.0024292151027437425):0.002333895696142063):0.009773607049481603):0.016367852314802978):0.0014145944135151023):0.02606872209263822):0.02822343587082743):0.08831659805099246):0.06532002803449855,(((Tacca_leontopetaloides:0.1795101319838195,(Dioscorea_bulbifera:0.021087181451240555,Dioscorea_alata:0.03329448787522493):0.13165977397103523):0.06746483174926543,((Freycinetia_excelsa:0.012957973231595532,(Pandanus_oblatus:0.0193899375968698,(Freycinetia_marginata:0.005825635025618947,Freycinetia_scandens:0.010100898740548203):0.005158801303665639):0.005860803819180527):0.008481865441528957,(Pandanus_monticola:0.01990163152998592,((Pandanus_lauterbachii:0.03353725247145112,(Pandanus_tectorius:1.3374472107585689E-6,Pandanus_zea:0.01110289287887778):0.0034058602042527086):0.0033788482470068493,(Pandanus_conicus:0.016278577486091628,(Pandanus_cookii:1.3374472107585689E-6,Pandanus_gemmifer:0.007852274545617766):0.004935531779582947):0.010050409072473787):0.013097231397205977):0.005774381854392274):0.12851822687375114):0.011844227127156826,(((Schelhammera_multiflora:0.16625509763549162,Kuntheria_pedunculata:0.08731211854783494):0.09009223585351456,((Ripogonum_elseyanum:0.003713791732467442,Ripogonum_album:0.0011159740875302804):0.016082628289645684,(Smilax_glyciphylla:0.0029197375872386244,(Smilax_blumei:0.004802459265851433,Smilax_australis:0.0033600267215296853):0.0039338301807797516):0.06741620687709582):0.06259820432593355):0.02814352025599587,(((Epipogium_roseum:0.22501662362000296,(Pseudovanilla_foliata:0.21322943439151565,(Eulophia_zollingeri:0.07574431991053465,(Corymborkis_veratrifolia:0.05539319004110799,(Calanthe_triplicata:0.026545975153263734,Phaius_tancarvilleae:0.02706317428457794):0.02916251487734811):0.016511140660451895):0.026988124192457885):0.008567371898678622):0.1586390864760684,(Molineria_capitulata:0.13569491991735616,(Sisyrinchium_micranthum:0.2218391193483381,((Geitonoplesium_cymosum:0.03408691722457602,Dianella_atraxis:0.0706506921647505):0.06243672607937423,((Crinum_pedunculatum:0.10180334554838566,Proiphys_amboinensis:0.027893514598237745):0.045653833569445745,((Asparagus_racemosus:0.0066697041274720315,Asparagus_plumosus:0.01675317077833882):0.08050126100565158,(Pleomele_angustifolia:0.09994376045601805,((Lomandra_longifolia:0.02753955379743711,Romnalda_ophiopogonoides:0.028867042978064972):0.09703143096187938,(Eustrephus_latifolius:0.07312322255652193,(Cordyline_fruticosa:0.009686281287046405,Cordyline_cannifolia:0.008829594681071917):0.022055391522412204):0.01354870732577984):0.008248468737198977):0.003095453866057696):0.01257433211162906):0.010096643592335308):0.03414162118998809):0.038395826380734355):0.01250034631480934):0.018495296792808036,((((Helmholtzia_acorifolia:0.016926435303002862,Philydrum_lanuginosum:0.04745258086352466):0.1073908583179557,((Musa_jackeyi:0.021475358924284538,Musa_banksii:0.01813755855712207):0.09499905429102606,((Canna_indica:0.09020656628883428,(Costus_potierae:0.009234731339127333,Tapeinochilos_ananassae:1.3374472107585689E-6):0.03990426398714031):0.005156505778109888,(Curcuma_australasica:0.018813522566722307,((Hedychium_coronarium:0.016651081645395527,Curcuma_longa:0.021284122361918234):0.0011931601856828289,(Zingiber_zerumbet:0.020172694536741087,(Amomum_queenslandicum:0.025048139282836,(Amomum_dallachyi:0.009315441276272929,(Hornstedtia_scottiana:0.002762293497404311,(Etlingera_australasica:0.008739387289105949,(Alpinia_arctiflora:0.011581428820838124,(Alpinia_caerulea:0.0011510521950131025,Alpinia_modesta:0.001939474866600066):0.006657851632708378):0.00826433107356106):0.0038466893808429825):0.011235944061403713):0.0245999953195688):0.019325035074460373):0.003570733244180224):0.04543071865061121):0.14234669400845712):0.011114117806483637):0.04378402247379243):0.031214254707532474,((Calamus_aruensis:0.0023007618122060647,Calamus_caryotoides:0.003287388736739394):0.05194923042700361,(((Arenga_microcarpa:1.3374472107585689E-6,Arenga_australasica:1.3374472107585689E-6):0.026383779925092332,((Livistona_concinna:0.0022900717888092448,Licuala_ramsayi:0.00799792692145862):0.0035112700908146444,(Livistona_australis:7.741522712865212E-4,(Livistona_rigida:0.0038345713960665773,(Livistona_muelleri:1.3374472107585689E-6,(Livistona_victoriae:0.0016135457028993994,Livistona_benthamii:9.529254200388859E-4):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.0016844245168929906):0.01625749754141448):0.003288600751594206,(Corypha_utan:0.0321423545433035,(Oraniopsis_appendiculata:0.014475113383828897,(Calamus_moti:0.03793105573997013,(Cocos_nucifera:0.01949365462326136,(Hydriastele_wendlandiana:0.009544012489697495,((Ptychosperma_elegans:0.009192153445383155,Ptychosperma_macarthurii:1.3374472107585689E-6):0.006128310468728415,((Archontophoenix_purpurea:1.3374472107585689E-6,Archontophoenix_alexandrae:9.828551193603596E-4):0.0018876119408620662,(Laccospadix_australasicus:0.004356467048746926,(Wodyetia_bifurcata:1.3374472107585689E-6,(Carpentaria_acuminata:8.67931316548054E-4,Normanbya_normanbyi:1.3374472107585689E-6):1.3374472107585689E-6):0.0034808633678614642):0.0017405988335067457):6.054688666347063E-4):0.0011521517021583216):0.004641632132185491):0.002931043907415165):0.002883212618673192):0.002684681896047203):0.004702247265081949):0.03208530621643757):0.07527536900934895):0.004652694214461683,((Tradescantia_zebrina:0.15416976475215738,(Floscopa_scandens:0.15542419589390744,Commelina_ensifolia:0.11678228072261043):0.051779831175949864):0.18135846288502944,((Scirpodendron_ghaeri:0.11635975248332997,((Hypolytrum_nemorum:0.0225939316991004,(Exocarya_scleroides:0.037976239122408106,Rhynchospora_corymbosa:0.029916524586611426):0.017713840827079275):0.03159686726670574,((Scleria_lithosperma:0.08802687981755652,Scleria_brownii:0.06153610870548132):0.17281794639112213,(Gahnia_aspera:0.0783455712176011,(Carex_brunnea:0.05283317155891909,((Cyperus_decompositus:1.3374472107585689E-6,Cyperus_gracilis:1.3374472107585689E-6):0.0793041237937192,(Carex_horsfieldii:0.05474866225438646,((Arthrostylis_aphylla:0.05236851942595444,(Bulbostylis_barbata:0.05607722048566277,(Fimbristylis_pauciflora:0.016315450121703323,(Fimbristylis_dichotoma:0.01569397588941035,Fimbristylis_microcarya:0.016188393473659524):0.011017901645271388):0.035867331818451476):0.015357565356452607):0.04547902425156569,((Fuirena_ciliaris:0.012737397370653936,Fuirena_umbellata:0.020164913146767383):0.0713669069030265,(Isolepis_humillima:0.1099160910722976,((Cyperus_haspan:0.0419444460048386,Cyperus_involucratus:0.029016722008086804):0.010854380665374253,(Queenslandiella_hyalina:0.012613836052738137,(Cyperus_pilosus:0.021039260995449283,Cyperus_brevifolius:0.017241779400080315):0.00136508568846061):0.04163998353847953):0.029878338590553):0.012313300487047263):0.01714826284142723):0.021080220258351767):0.022475365491222754):1.3374472107585689E-6):0.05650944947953096):0.011760640845790649):0.029430691552992383):0.04436205706350771):0.18694394189680663,(Flagellaria_indica:0.07982153650408685,(Leptaspis_banksii:0.09376923633567547,((Mullerochloa_moreheadiana:0.004289212644067009,Neololeba_atra:0.003714842788906103):0.036359383842143655,((Cynodon_dactylon:0.04884910455992886,(Perotis_rara:0.048859760284987175,Dactyloctenium_aegyptium:0.037725006377020476):0.008008385091315073):0.04652216528815001,((Lophatherum_gracile:0.045196663133468595,(Eriachne_pallescens:0.043744084915862236,Centotheca_lappacea:0.04000708588541635):0.021106499508037335):0.0016693652936313752,(((Garnotia_stricta:0.07781203314777962,(Bothriochloa_pertusa:0.012477206691346998,(Arundinella_nepalensis:0.04078595957182962,(Pogonatherum_crinitum:0.022776620597666275,Heteropogon_contortus:0.01803990468579242):0.005231817541787143):0.005629025354290329):0.010490815410799659):0.01135908275864439,(Aristida_superpendens:0.06039613977541736,((Axonopus_fissifolius:0.006274211606809743,Axonopus_compressus:0.006813877901996612):0.028252457489664096,(Paspalum_conjugatum:0.010561800836190738,(Paspalum_scrobiculatum:0.017900041428154267,(Paspalum_paniculatum:0.004413669151917654,Paspalum_dilatatum:1.3374472107585689E-6):0.0035840312365333915):0.0030268912335496):0.02374984872585917):0.026166008040197974):0.0019671509802180465):0.004747152220528683,((Urochloa_subquadripara:0.028554218478061832,(Cenchrus_echinatus:0.018982130871689318,Setaria_palmifolia:0.02029274414683835):0.009991626954147792):0.009064569789526522,(Panicum_trichoides:0.018299559994012227,(Ancistrachne_uncinulata:0.016185480627646687,(Ottochloa_nodosa:0.026605114355072068,((Cyrtococcum_oxyphyllum:1.3374472107585689E-6,(Cyrtococcum_accrescens:1.3374472107585689E-6,Cyrtococcum_patens:0.003477297034893745):2.124850752149854E-5):0.016858959489983283,(Oplismenus_burmannii:0.004895858609879511,(Oplismenus_aemulus:0.001845128868296575,(Oplismenus_hirtellus:0.001626356973791765,(Oplismenus_compositus:0.0019330303599764953,Oplismenus_undulatifolius:0.00333402807589267):0.0016418978094121517):0.002846248936150708):0.0034199668199181854):0.021185937369485153):0.008731044230330332):0.003972607448486931):8.950637453201127E-4):7.984044663043033E-4):0.009509766179859547):0.009612007734384642):0.009813947283457414):0.029647984628155433):0.00902747817594296):0.22023654012149418):0.05145374952347659):0.039248859156196136):0.016100355318043436):0.019887130722005986):0.0047360945475385385):0.005183895406769223):0.05628003461588127):0.07849780575282272):0.00495974185182213,((Clematis_pickeringii:0.2688274876947411,((Tinospora_esiangkara:1.3374472107585689E-6,Tinospora_smilacina:0.007190130102898484):0.07420435360426214,((Sarcopetalum_harveyanum:0.03376988300893735,(Legnephora_moorei:0.01240290000718658,(Parapachygone_longifolia:0.011107070234093297,(Hypserpa_smilacifolia:0.024733548609431333,(Hypserpa_decumbens:0.002596448092034853,Hypserpa_laurina:1.3374472107585689E-6):5.87254880304422E-4):0.004087423951511737):0.017363371670042427):0.005993338517224389):0.018610670125090545,((Stephania_japonica:0.051872706888733244,Cissampelos_pareira:0.0521063028358405):0.045157904287498996,(Pachygone_ovata:0.02384995635897258,(Tiliacora_australiana:0.012364682736102584,(Carronia_protensa:0.008930163502664845,Pycnarrhena_novoguineensis:0.017913995426748652):7.113683002252236E-4):0.00889548767953885):0.0025127790507607495):0.01991786682449237):0.01913766676142903):0.0745577066461971):0.069624749523031,(((Eidothea_zoexylocarya:0.034501192067197706,Placospermum_coriaceum:0.10648417462540027):0.004791804824840873,((Carnarvonia_araliifolia:0.005299358247458197,Carnarvonia_araliifolia_var_montana:0.002158494895313612):0.05301640666365515,(((Alloxylon_wickhamii:1.3374472107585689E-6,Alloxylon_flammeum:1.3374472107585689E-6):0.03587316772223115,((Lomatia_fraxinifolia:0.11889692617580805,(Stenocarpus_reticulatus:0.028771943829091207,(Stenocarpus_sinuatus:1.3374472107585689E-6,(Stenocarpus_davallioides:0.009419897817443235,Stenocarpus_verticis:1.3374472107585689E-6):0.009446680626219783):0.022447615854571112):0.007968274318264856):0.006878165171193107,(Opisthiolepis_heterophylla:0.028765614868396017,((Buckinghamia_ferruginiflora:1.3374472107585689E-6,Buckinghamia_celsissima:0.0029822646455033297):0.023382324293369283,(Grevillea_baileyana:0.008937503538601232,(Grevillea_robusta:0.011894530478886,Grevillea_pteridifolia:0.012830928016123622):1.3374472107585689E-6):0.04320663879318187):0.008725192328600806):0.010412737890272417):0.003599502483743189):0.010828018607929257,(((Cardwellia_sublimis:0.035567215664328855,(Hicksbeachia_pilosa:0.013986902015863167,Gevuina_bleasdalei:0.014672574247390657):0.008377860490742628):0.017236823985667282,((Athertonia_diversifolia:0.02972228160740331,Catalepidia_heyana:0.02578159747043296):0.004950748798890792,((Lasjia_whelanii:0.02997366579280536,Nothorites_megacarpus:0.02322671186844305):0.003033874016607818,(Lasjia_claudiensis:0.01666174962167266,Lasjia_grandis:0.01122243375780907):0.017361761930046016):0.030382681099108688):0.002008164238215593):0.0045001644852099565,(((Musgravea_heterophylla:0.007908444534424852,Austromuellera_trinervia:0.009035427570131205):0.026834578713518242,(Sphalmium_racemosum:0.03455909701454607,(Banksia_aquilonia:0.02271286167266784,Neorites_kevedianus:0.03761816713120325):0.02400305618963472):0.0053707536867120265):0.0187429058311408,((Darlingia_ferruginea:0.012984964643241281,Darlingia_darlingiana:0.0037481955886996543):0.041914585005606186,(Megahertzia_amplexicaulis:0.049833399143073054,(Hollandaea_riparia:0.0018463529071965912,(Hollandaea_sayeriana:1.3374472107585689E-6,(Helicia_australasica:1.3374472107585689E-6,Helicia_lamingtoniana:0.008398249280035186):0.002803720695022327):0.002776752466476018):0.05068802042892717):0.003507082336334788):0.006661693514476763):0.006991616987964133):0.0025805303362179677):0.004772024235303318):0.03173692923322469):0.09029180894884192,(((Tetracera_daemeliana:1.3374472107585689E-6,Tetracera_nordtiana:1.3374472107585689E-6):0.04710989005776356,(Dillenia_alata:0.047958556560121046,(Hibbertia_scandens:0.047263845575024166,Hibbertia_banksii:0.06280559459283985):0.029896014365221935):0.017195008935701583):0.17383885125284526,(((((Korthalsella_papuana:0.03434710668908858,(Korthalsella_rubra:0.02133190574089272,Korthalsella_japonica:0.022820216428489082):0.021723371593498464):0.1862900488583208,(Anacolosa_papuana:0.15060062839601351,(Amyema_villiflora_subsp_tomentilla:0.06705866791589266,Ximenia_americana:0.03887243201160939):0.1339100933510795):1.3374472107585689E-6):0.012390948877316177,(((Santalum_lanceolatum:0.09119129698952921,Exocarpos_latifolius:0.13452215280332946):0.06699840689061842,((Opilia_amentacea:0.06311185185959578,Cansjera_leptostachya:0.07493295014491763):0.11590743746406729,((Dendromyza_reinwardtiana:0.07068650550897482,Dendrotrophe_varians:0.050501332807058374):0.05139266078107252,(Korthalsella_grayi:0.11325366881343868,(Viscum_articulatum:0.15038487680163692,(Notothixos_subaureus:0.061049712775927745,Notothixos_leiophyllus:0.01376843960200913):0.0833930748165882):0.016128479099696613):0.12043942812386754):0.030082129410442193):0.012155545433247372):0.019410484583041843,(Amylotheca_dictyophleba:0.03126578736810892,((Lysiana_maritima:0.05960140087449717,(Decaisnina_signata:0.0013657060831829826,(Decaisnina_congesta:0.00395904512319778,Decaisnina_brittenii:0.005745105578087273):0.001892108276017379):0.08727208504885975):0.023363526346170005,(Cecarria_obtusifolia:0.1180228758657621,(Amyema_congener:0.023092731827895174,(Dendrophthoe_curvata:0.06144089472722858,((Dendrophthoe_vitellina:0.08948593755038614,Amyema_queenslandica:0.027063168844282615):0.01564367643753073,(Dactyliophora_novae_guineae:0.022086195393437813,(Amyema_glabra:0.019348828448716104,Diplatia_furcata:0.028368150962569727):0.05185202496643149):0.004268962325435055):0.005172380150609501):0.008652197067750889):0.044669601468633635):0.05251608993115686):0.008488517105418203):0.16765599665661945):0.03788308930520712):0.04320913545901561,((((Nepenthes_mirabilis:0.16631563952672557,(Drosera_adelae:0.011689042523929105,Drosera_prolifera:0.009762268732282253):0.34134452001087234):0.019404644258844694,(Plumbago_zeylanica:0.2429907560443888,(Muehlenbeckia_zippelii:0.13556900469746558,(Triplaris_cumingiana:0.05618740648588927,(Persicaria_orientalis:0.006892995263310775,Persicaria_hydropiper:0.011950847931734954):0.139668607969052):0.06538465034048946):0.00485251411606602):0.081076519405606):0.010718963367597922,(Boerhavia_dominii:0.1336578578300317,((Drymaria_cordata:0.1963822586412307,((Cyathula_prostrata:0.04224077356687728,Achyranthes_aspera:0.008336030999408495):0.11619094424215248,(Deeringia_amaranthoides:0.0540671853983824,(Amaranthus_spinosus:0.008236671578565224,Amaranthus_hybridus:0.0016303950860727667):0.0858495077329624):0.024775399755475602):0.07234137602905322):0.01435252664582598,((Glinus_oppositifolius:0.0938919422574902,(Anredera_cordifolia:0.05142082111729185,Portulaca_pilosa:0.0693281333674195):0.05980249028995188):0.017657915453028528,(Rivina_humilis:0.09926217385169323,(Mirabilis_jalapa:0.10363753693656308,(Pisonia_umbellifera:0.028561109094043413,(Pisonia_grandis:0.016434570296796847,Pisonia_aculeata:0.0146793924390336):0.008880471063851259):0.014405231615696068):0.025288287529305675):0.0567997483101641):0.01783936192381219):0.04698996989301296):0.04158396556449717):0.06786384554343883,(((Alangium_villosum:0.008214689094020455,Alangium_sp_Claudie_River:0.01725998603495238):0.11514360979784721,((Saurauia_andreana:0.15846331043539952,(Impatiens_walleriana:0.24307660286518784,((Rhododendron_lochiae:0.04643715232928047,Paphia_meiniana:0.0407898147973631):0.05601379238331805,((Leucopogon_yorkensis:0.027840247465346413,Leucopogon_ruscifolius:0.009739830751506195):0.025082493131972528,(Acrothamnus_spathaceus:0.028723253024827256,(Trochocarpa_bellendenkerensis:0.047601831565027064,Leucopogon_malayanus:0.02987029459228019):0.01151266158622466):0.00400649804269293):0.12551963484292084):0.09330771369666035):1.3374472107585689E-6):0.03697201929775118,(((Symplocos_cochinchinensis:1.3374472107585689E-6,(Symplocos_cochinchinensis_var_gittonsii:1.3374472107585689E-6,Symplocos_hayesii:0.011724233312236487):1.3374472107585689E-6):1.3374472107585689E-6,((Symplocos_sp_N_Mary:1.3374472107585689E-6,Symplocos_ampulliformis:0.0022767514325807703):1.3374472107585689E-6,(Symplocos_cochinchinensis_var_glaberrima:1.3374472107585689E-6,(Symplocos_stawellii_var_montana:1.3374472107585689E-6,(Symplocos_graniticola:0.002107220654047115,(Symplocos_paucistaminea:0.00618648054643911,Symplocos_hylandii:0.0027327104392564916):1.3374472107585689E-6):0.00529300586222714):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.10706956131673295,((Planchonia_careya:0.022477852164007883,((Barringtonia_acutangula:0.006665765838439919,Barringtonia_racemosa:0.002773269053881755):0.004047613412915374,(Barringtonia_calyptrata:0.007143003914828472,Barringtonia_asiatica:0.006809921470220082):0.007229147801222191):0.011584930300478025):0.10374144320102974,(Ternstroemia_cherryi:0.03399141998140531,(Camellia_sinensis:0.11021972490841592,((((Diospyros_australis:0.019624806773116843,Diospyros_pentamera:0.009816392586297407):0.006926918988361286,(Diospyros_hebecarpa:0.015139296175300965,Diospyros_fasciculosa:0.013486789396671028):0.004662278979174039):0.006263296066381985,(Diospyros_sp_Baird:0.004326056428072711,(Diospyros_sp_Mt_White:0.002202337932906806,(Diospyros_sp_Milla_Milla:1.3374472107585689E-6,(Diospyros_sp_Mt_Lewis:1.3374472107585689E-6,(Diospyros_cupulosa:1.3374472107585689E-6,Diospyros_compacta:1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.009153120058775555):0.018051965179514462):0.058140896449023205,((Maesa_dependens:0.047857377515926,((Ardisia_brevipedata:1.3374472107585689E-6,Ardisia_pachyrrhachis:0.01844362388120402):0.008566771227192183,(((Embelia_australiana:0.03706461757053292,Tapeinosperma_pallidum:0.021062735926754228):1.3374472107585689E-6,(Ardisia_crenata:0.004426160061399176,Ardisia_elliptica:0.019624757603264542):0.003653081236297817):0.014256381483095604,(Myrsine_subsessilis:1.3374472107585689E-6,((Myrsine_achradifolia:1.3374472107585689E-6,Rapanea_achradifolia:1.3374472107585689E-6):0.01671949963203745,(Myrsine_variabilis:1.3374472107585689E-6,Myrsine_porosa:1.3374472107585689E-6):1.3374472107585689E-6):0.0027921273451253503):0.009394939555791515):0.004912555580958822):0.0860818493156581):0.06721430096353642,((Palaquium_galactoxylum:0.002210873797727886,(Manilkara_kauki:0.01908621879065142,Mimusops_elengi:0.017147198157820842):0.0038434870567144452):0.00985155258926862,(Chrysophyllum_roxburghii:0.020808894823283075,((Pouteria_singuliflora:0.0016324959099058844,Pouteria_queenslandica:0.0012096410589479412):0.008576590996659528,(Sersalisia_sessiliflora:0.011931442700829908,((Planchonella_sp_Mt_Lewis:0.004195784605440789,(Niemeyera_antiloga:0.012464422207568937,Vanroyena_castanosperma:0.017356056412820897):1.3374472107585689E-6):0.0022762563141499603,(Sersalisia_sericea:0.008072455033532822,((Niemeyera_prunifera:0.006416438743301112,(Pouteria_papyracea:1.3374472107585689E-6,Pouteria_pearsoniorum:1.3374472107585689E-6):1.3374472107585689E-6):0.00661313524309326,((Planchonella_obovata:0.006346987653585878,(Planchonella_myrsinodendron:1.3374472107585689E-6,(Planchonella_pubescens:1.3374472107585689E-6,Planchonella_euphlebia:1.3374472107585689E-6):1.3374472107585689E-6):0.004865528536051378):0.0038594603758453916,(Planchonella_chartacea:0.00874574541336326,(Planchonella_xylocarpa:0.01027777358914328,(Planchonella_asterocarpon:0.0011714268072318124,(Planchonella_cotinifolia:0.0022098298617462264,Planchonella_pohlmaniana:1.3374472107585689E-6):9.463418957746939E-4):0.004332217773803881):8.664143552659098E-4):0.003148983126600724):0.0015098567925322381):5.919515270069731E-6):6.569540886178782E-4):0.001460090233434519):6.706742405661048E-4):0.0020738554535542075):0.009807284608386535):0.07727264874320317):0.0033223072099783924):0.003976544110681379):1.3374472107585689E-6):0.003801653346970024):0.003327392133792406):0.00817767296884453):0.0399432469250367):0.0028320568950663816,((((Ilex_arnhemensis:0.01701648845924919,Ilex_sp_Gadgarra:0.010079320191769714):0.11428204884064164,(Citronella_smythii:0.07562460517101743,(Citronella_moorei:0.057774416115746074,(Gomphandra_australiana:0.01869989598780497,Irvingbaileya_australis:1.3374472107585689E-6):0.15302940438208146):1.3374472107585689E-6):0.015228612070895542):0.0213953601157173,((Abrophyllum_ornans:0.12138365780426397,((Argophyllum_cryptophlebum:0.10348590471621633,Crispiloba_disperma:0.13359423462436937):0.005402685649009253,((Scaevola_enantophylla:0.011677959186486397,Scaevola_taccada:0.02023976636346314):0.1342726742433491,((Cirsium_vulgare:0.0637876083945016,(Youngia_japonica:0.0652418333071847,(Blumea_riparia:0.08907001098686718,(Cyanthillium_cinereum:0.1766580350274457,(Centratherum_punctatum:0.03393066776627773,(Elephantopus_scaber:0.026989400927285634,Pseudelephantopus_spicatus:0.02944183456991567):0.03052868398629982):0.02231250156396447):0.013196910204470336):0.0038348591768392337):0.006111479125800456):0.012906794824295686,(((Emilia_sonchifolia:0.13078115575691085,(Erechtites_valerianifolius:0.008536394365075695,Crassocephalum_crepidioides:0.0036329451678690505):0.040897074829158275):0.03657136543297779,((Ozothamnus_cassinioides:0.004414290240403851,Cassinia_subtropica:0.008628109829633912):0.06898692626483804,(Olearia_canescens:0.019205881918565204,(Conyza_sumatrensis:0.009228187421346123,Conyza_canadensis:0.009138539912360022):0.03723026447079203):0.04434010138684641):0.007749630936735752):0.005424267694731699,((Cosmos_caudatus:0.03394837816355967,(Bidens_pilosa:0.0025957770291520355,Bidens_alba:0.0021133979248968426):0.029953628061275217):0.01748801913952247,((Tithonia_diversifolia:0.04192770486933939,((Synedrella_nodiflora:0.01921795973399676,Calyptocarpus_vialis:0.016696615083518385):0.014132077566701096,((Melanthera_biflora:0.019152253087332816,Sphagneticola_trilobata:0.02730497951146793):0.0032485352848220517,(Adenostemma_macrophyllum:1.3374472107585689E-6,Eclipta_prostrata:1.3374472107585689E-6):0.021160483482768666):0.011120492186333708):0.00571924872226004):0.0032899822448869687,((Tridax_procumbens:0.042204931274308244,(Acanthospermum_hispidum:0.08881345789583606,Sigesbeckia_orientalis:0.025427745949140212):0.006300310548640109):0.013357955813208422,(Tagetes_minuta:0.058367501017000945,(Mikania_micrantha:0.17167049229573872,(Adenostemma_lavenia:0.025504273725212245,(Ageratum_conyzoides:0.031041909147737745,(Praxelis_clematidea:0.03636733648899282,Chromolaena_odorata:0.01653109807889863):0.028038221108337757):1.3374472107585689E-6):0.02641176409216417):0.008470399427845776):0.008821309168690838):0.003625957599926788):0.00578453704836146):0.024591564221373874):0.011067002739455933):0.043281630888249545):0.05958664554340565):0.015552395380864836):0.03893948984025952,((Polyosma_rhytophloia:1.3374472107585689E-6,(Polyosma_alangiacea:0.002178033775322996,(Polyosma_hirsuta:0.0022281510925395986,Polyosma_rigidiuscula:0.002245067486457031):1.3374472107585689E-6):0.015681302105956862):0.11623315886914543,((Quintinia_quatrefagesii:0.06160346010671791,Sphenostemon_lobosporus:0.0300854339992781):0.008968813203011461,(Sambucus_canadensis:0.07313317262888752,(Pennantia_cunninghamii:0.08345475704858951,(((Hymenosporum_flavum:0.022625942332233473,(Auranticarpa_ilicifolia:0.0024544149575864704,(Bursaria_incana:0.01213427542396217,Bursaria_spinosa:0.007706733148654332):0.003788771329946483):0.007100950468559075):0.0017094462199156446,((Auranticarpa_papyracea:0.0077697737636450714,Auranticarpa_edentata:0.001359190438770419):0.006074748223149351,((Pittosporum_rubiginosum:4.89646551404932E-4,Pittosporum_trilobum:0.0021607750016769955):0.013649650651773482,((Pittosporum_moluccanum:0.027955047896880525,Pittosporum_spinescens:0.01741465730476055):0.0015267674123654595,(Pittosporum_wingii:0.011068679333831266,(Pittosporum_ferrugineum:0.010003136543226376,(Pittosporum_revolutum:0.009647360418753581,Pittosporum_venulosum:0.009659793817130113):0.00410540772583845):0.004464647992091342):0.0030032230272364346):0.0020729739873286412):0.009870028180277934):0.001909481151831316):0.0672156799790441,((Mackinlaya_confusa:0.08857756209686474,Delarbrea_michieana:0.07774094151346944):0.026378979794492108,(Centella_asiatica:0.09076715957198789,(Cephalaralia_cephalobotrys:0.01853571920149555,(Motherwellia_haplosciadea:0.012370594475034968,((Schefflera_elliptica:0.00876089184968376,(Schefflera_actinophylla:0.004205416446687482,Schefflera_bractescens:0.004360072639537527):0.0015343421157889559):0.010553327863680906,(Polyscias_purpurea:0.01245278367619207,(Polyscias_murrayi:0.004980231143582037,(Polyscias_macgillivrayi:0.017702626132758637,((Polyscias_elegans:0.0125683672611836,(Polyscias_nodosa:0.01929067514943139,(Pararistolochia_praevenosa:0.015850196212162326,Gastonia_spectabilis:0.011444674134093114):0.007736982950434013):1.3137323633827247E-4):0.008029763016484504,(Polyscias_mollis:0.007063660074843492,(Polyscias_willmottii:0.007213701786572879,(Polyscias_australiana:0.0037172830045378857,Polyscias_bellendenkerensis:0.004213770856868804):0.003055966295892998):0.006296858726665522):9.849578891454325E-4):8.006400492742705E-4):5.991461442252932E-4):1.3374472107585689E-6):0.003568303494408731):0.0020345740184775085):9.115031204860458E-4):0.02059113013092828):0.016434747592875554):0.004136975459889558):0.03950878109933842):0.011570325609318921):1.7981408780798347E-4):0.004483891019332997):0.0031887343130716506):0.01599780437250975):0.008699112073006221,(Apodytes_brachystylis:0.07572892095935901,(((Erycibe_coccinea:0.0598008419667978,(Xenostegia_tridentata:0.010836321767296764,(Merremia_umbellata:0.026876802730297578,((Merremia_dissecta:0.013906007176064383,(Merremia_peltata:0.023285459097581507,Merremia_tuberosa:1.3374472107585689E-6):0.011554914084753842):0.007788317530565303,((Argyreia_nervosa:1.3374472107585689E-6,(Ipomoea_velutina:0.02843018112578244,Turbina_corymbosa:1.3374472107585689E-6):0.034826705058362495):0.011240434990692716,((Ipomoea_mauritiana:0.007401485222963355,(Ipomoea_eriocarpa:0.020631601240078457,Ipomoea_plebeia:0.011801205374391888):0.010056243192342995):1.3374472107585689E-6,(((Ipomoea_hederifolia:0.012702689847716386,Ipomoea_quamoclit:0.017150092490584523):0.012759509325028229,(Ipomoea_nil:6.234348238900456E-4,Ipomoea_indica:0.002238650292983202):0.01750064802056983):0.004105212781776335,(Ipomoea_triloba:0.02641923562981452,(Ipomoea_cairica:0.01636357560842927,(Ipomoea_pes_caprae:0.02258818251432948,(Ipomoea_gracilis:0.005454582102526695,Ipomoea_muelleri:0.007576139212050803):0.004065113703934364):0.024558305471464537):0.0018254598009204148):0.0038658892756618934):0.008360512405799492):0.005872090936705376):0.014232533760747068):6.739027194950786E-4):0.0032828138792397876):0.02898340568391078):0.15425825626992873,(Cestrum_nocturnum:0.07596226572360931,((Nicotiana_tabacum:0.015648259302627476,Duboisia_myoporoides:0.02486038883123598):0.0020260091675433634,(Nicandra_physalodes:0.022099195296452656,((Capsicum_annuum:0.13738702913631695,(Physalis_peruviana:0.0061438276468621655,Physalis_minima:0.014148026802536684):0.030881924030491947):0.004039187049197146,(Lycianthes_shanesii:0.025042914726922993,((Solanum_aviculare:0.02279608379687348,(Solanum_seaforthianum:0.029180269393018432,(Solanum_americanum:0.0013840425471897122,Solanum_nigrum:0.008032487350367545):0.009262214259658674):0.0039146340384235145):0.002158248468329016,(Solanum_mauritianum:0.021943743389890136,((Solanum_betaceum:0.016078939874667464,Solanum_pseudocapsicum:0.02114464709259578):0.0021777567811758214,((Solanum_capsicoides:0.02165632500144654,Solanum_lasiocarpum:0.01718877566665178):0.0010131658425679424,(Solanum_torvum:0.013045292758212867,(Solanum_cookii:0.0046735739151385625,(Solanum_ellipticum:0.00994854299179504,((Solanum_macoorai:0.0026026692883027724,Solanum_discolor:0.0014308263832072399):0.0016315933587240927,(Solanum_dimorphispinum:0.003605929697478416,Solanum_viridifolium:0.00964088281579345):6.225318398028756E-4):0.0014970774520095542):0.003534420595649568):0.008196873456345677):0.00718138990421735):0.011601547284889047):0.0014103972615227):0.004888033688624227):0.013008888543586505):0.0019422675224606278):0.004968691099049183):0.005866157264847849):0.02434645820698278):0.06664097842762695):0.03492461034356942,((((Cordia_myxa:0.004630129282428119,Cordia_dichotoma:0.001409856711653723):0.06944028778626077,(Ehretia_laevis:0.11065390730047153,(Ehretia_acuminata:0.006412068196296805,Ehretia_membranifolia:0.033560669904976415):0.0015484495971787027):0.02432612389387323):0.07011988312850415,((Jasminum_simplicifolium:0.12052239917834129,((Notelaea_microcarpa:0.020308036817533792,(Chionanthus_ramiflorus:0.03662212092464412,Olea_paniculata:0.04021305821428478):0.008271072096179277):0.016431888115130855,(Chionanthus_axillaris:0.005783581718772801,(Ligustrum_lucidum:0.005400239412842178,(Ligustrum_australianum:0.005963710227621988,Ligustrum_sinense:0.0039322265564412096):0.001716574125658954):0.020504758666952783):0.011866860599834883):0.03039290181224119):0.04484987552321584,(((Cyrtandra_baileyi:0.08077684481947811,Boea_kinneari:0.05972167879858237):0.043753341248562894,(Lenbrassia_australiana:0.04897295955535752,Boea_hygroscopica:0.17317971709143765):1.3374472107585689E-6):0.05980434104439514,(((Mecardonia_procumbens:0.029659126476541675,Scoparia_dulcis:0.07015828011764225):0.05733233406929017,(Veronica_plebeia:0.03941551296805712,(Plantago_major:0.01990898163793986,Plantago_lanceolata:0.06703111626451608):0.08510021300450099):0.12701416036460744):0.01381403833304562,((Myoporum_montanum:0.06703844527850478,(Lindernia_crustacea:0.0427574671157267,Artanema_fimbriatum:0.02431672874673574):0.0994486618835313):0.005319526227266613,((Utricularia_uliginosa:0.398886821824611,((Sanchezia_parvibracteata:0.13571319073739974,(Thunbergia_alata:0.04360372244009958,(Thunbergia_mysorensis:0.01456716843781758,(Thunbergia_grandiflora:0.0038605985153549183,Thunbergia_laurifolia:0.0029523717829055274):1.3374472107585689E-6):0.04890142713119727):0.021664849892292004):0.06452172126057631,((Ruellia_tuberosa:0.08191563685117687,(Eranthemum_pulchellum:0.07413209556922917,(Brillantaisia_lamium:0.07099401928816595,Hemigraphis_alternata:0.036995832796426154):0.031175672478791605):0.06203552573764615):0.02970279604578485,(Barleria_cristata:0.11061395063137613,((Rhaphidospora_cavernarum:0.06972571315821441,Hypoestes_floribunda:0.08254382424366524):0.04471440050028419,(Odontonema_tubaeforme:0.005091110221763007,(Graptophyllum_excelsum:1.3374472107585689E-6,(Graptophyllum_spinigerum:0.0027206510350676893,Pseuderanthemum_variabile:0.030351561605872712):1.3374472107585689E-6):0.007964241081751866):0.007042170928126756):0.05122169656611697):0.018768728989348227):0.02202676662730174):0.015905368516059837):0.009303385725801694,(((Lantana_camara:0.06155690221298016,(Verbena_bonariensis:0.012802031575332551,Verbena_officinalis:0.006127456524829378):0.05521810081453882):0.03710027939091043,(Duranta_erecta:0.04639830480678331,(Stachytarpheta_jamaicensis:0.0024637887402327863,(Stachytarpheta_mutabilis:0.003106562379878053,Stachytarpheta_cayennensis:0.0033990916239543534):0.004614114331107921):0.05099772634995625):0.010039236669467932):0.011500587781324345,(Martynia_annua:0.05093086182164497,((Dolichandra_unguis_cati:0.05138793393127916,(Macfadyena_unguis_cati:0.05922265177239272,(Spathodea_campanulata:0.07817380303577448,(Deplanchea_tetraphylla:0.03399600878369469,(Tecomanthe_sp_Roaring_Meg:0.008880430467828382,Pandorea_pandorana:0.018005215340005543):0.0196721796108843):0.01830056363546828):0.0023744336235372865):0.008613602396637887):0.018655847929851532,((Salvia_plebeia:0.06474530995470218,((Basilicum_polystachyon:0.03872220844024221,Plectranthus_amicorum:0.01084483841403272):0.009287283941534996,(Hyptis_capitata:0.026041387912326797,(Hyptis_suaveolens:0.0261127180627323,Hyptis_pectinata:0.02241110772928845):0.007687673779188886):0.041707011076597245):0.013090366910081697):0.04640165151110731,(((Pityrodia_salviifolia:0.04987647091391412,(Callicarpa_candicans:0.008234926638310713,(Callicarpa_pedunculata:0.017146919943264227,Callicarpa_longifolia:0.011142024038955811):1.3374472107585689E-6):0.010953370786431882):0.007681229904514364,(Vitex_lignum_vitae:0.01963864088963385,(Vitex_acuminata:0.00974936199406562,(Viticipremna_queenslandica:0.029324949113939125,(Vitex_trifolia:0.0020484374575435726,Vitex_rotundifolia:1.3374472107585689E-6):0.011380388417262965):0.01551322281931855):0.004429376415054254):0.024729264769058457):0.0037099590922397008,(((Gmelina_fasciculiflora:0.038679915429227996,(Premna_serratifolia:0.02844428736670923,Premna_odorata:1.3374472107585689E-6):0.06822413547971051):0.010756086223505212,(Petraeovitex_multiflora:0.04775088298453445,(Anisomeles_malabarica:0.05397353220485923,Leonotis_nepetifolia:0.11263918886295965):0.0247065062137094):0.02154681912398637):0.004365152234667824,(Glossocarya_hemiderma:0.04390792457762682,(Faradaya_splendida:0.03582080617352623,((Clerodendrum_longiflorum:0.024720232510544005,Clerodendrum_paniculatum:0.0218212487093834):0.01789801550321901,(Clerodendrum_tracyanum:0.028009338829968478,(Clerodendrum_floribundum_var_ovatum:1.3374472107585689E-6,Clerodendrum_inerme:1.3374472107585689E-6):0.01877776136200493):0.009905845680039715):0.025901219250898833):0.03567275201295983):0.012716890250652146):0.006846868223375657):0.0060476857383168214):0.02502308129427877):0.001236430770807928):0.0021159362824236805):0.002159257336648346):0.005279956276487585):0.008304231783896165):0.006993101178388472):0.036547227792799286):0.04049158983898482):0.005853394925422473,(((Ophiorrhiza_australiana:0.09008140814570809,((Lasianthus_cyanocarpus:0.035439074656412495,Lasianthus_strigosus:0.01974810768901325):0.13846656560256854,(((Hedyotis_novoguineensis:0.07374666441607691,(Richardia_brasiliensis:0.012219560900679327,Spermacoce_remota:0.03453936858612339):0.05052146359366505):0.014646672506712366,(Hedyotis_auricularia:0.03056836400615881,(Oldenlandia_galioides:0.03252458530329361,Oldenlandia_biflora:0.03571116052560808):0.006049837281263848):0.008048077054507052):0.0960941313046757,((Morinda_citrifolia:0.03635299435856221,((Gynochthodes_sessilis:0.005525087801252826,Gynochthodes_oresbia:0.0025343770483096106):0.004534601823297346,(Coelospermum_purpureum:0.008769666484327865,((Morinda_podistra:0.009647780735446365,Morinda_umbellata:0.0052748205811405935):0.008843578624437964,(Morinda_jasminoides:0.014286256990084234,(Coelospermum_dasylobum:0.00863893359005008,Morinda_reticulata:0.010769442014075148):0.008918537719823316):0.001562749886380943):0.001960333058482977):0.0035348979772933387):0.007161324476449016):0.0132321241151091,((Hodgkinsonia_frutescens:0.03672906140748733,(Cyclophyllum_multiflorum:0.03750447714521632,Geophila_repens:0.011342887700294346):0.01724852904119001):0.02122968957375382,(Psychotria_coelospermum:0.00842490661737294,(Psychotria_submontana:0.006554409020266272,((Psychotria_dallachiana:0.0051502546217148115,Psychotria_sp_Danbulla:0.00884495313564193):0.0016264887062971134,(Psychotria_loniceroides:0.005354237469206824,(Psychotria_fitzalanii:0.004552540761202373,Psychotria_poliostemma:0.0027584349044688095):0.0012933727718024146):0.00419147202452419):0.0012519595642420667):0.002667525729182052):0.038534581539720225):0.02914882020888243):0.01175069807047191):0.05345391017200851):0.005426149885354947):0.04140580257841997,(((Neonauclea_glabra:0.012727975225748978,((Nauclea_orientalis:0.006967364616816685,Neolamarckia_cadamba:0.014760169507294751):0.007707976438301345,(Uncaria_lanosa:0.004259666154694974,Uncaria_cordata:0.009285511050190598):0.009450018216841771):0.005815848586786854):0.055213601212684704,(Wendlandia_inclusa:0.019014208732871518,(Guettarda_speciosa:0.012167167374756982,(Timonius_timon:0.003041160232377771,(Bobea_myrtoides:0.002201130426518705,(Timonius_singularis:0.008548666509705427,(Antirhea_sp_Mt_Lewis:0.009697786891438964,Antirhea_tenuiflora:1.3374472107585689E-6):1.3374472107585689E-6):0.001141186210429801):1.3374472107585689E-6):0.008385152803702889):0.03159570362206354):1.3374472107585689E-6):0.02445774802307943,(((Ixora_timorensis:0.011317494539365147,(Ixora_oreogena:0.004268125275305734,Ixora_biflora:0.0023209805446238185):0.011325902796249565):0.03133410604980491,((Psydrax_odorata:1.3374472107585689E-6,Everistia_vacciniifolia:0.0021818979223383606):1.3374472107585689E-6,(Psydrax_tropica:1.3374472107585689E-6,(Canthium_lamprophyllum:0.0024766543623828685,(Psydrax_laxiflorens:1.3374472107585689E-6,Psydrax_montigena:1.3374472107585689E-6):0.002282829096253991):1.3374472107585689E-6):0.013393484867289751):0.049996195182972936):0.012551344962547728,((Tarenna_monticola:1.3374472107585689E-6,Tarenna_dallachiana:1.3374472107585689E-6):0.03833079012543439,(((Kailarsenia_ochreata:0.01073860710733876,Gardenia_ovularis:0.014268880380215343):0.008293777173069228,(Coffea_brassii:0.009161967024485795,(Coffea_liberica:0.00618540339099749,Coffea_arabica:0.005454799127814991):0.019201670035909113):0.010937432475548348):0.002668466402034997,((Atractocarpus_merikin:0.0022610545889095723,(Atractocarpus_fitzalanii:0.002534718024546856,Atractocarpus_hirtus:0.0022485309307386236):0.002531648158629163):0.010270600499695193,(Aidia_racemosa:0.015537703067193709,(Randia_tuberculosa:0.010601622137310307,Randia_audasii:0.002390048728703187):0.013771332771916778):0.005828052652939064):0.004469853308150418):5.075841276503956E-4):0.017410223699817262):0.05011344609317914):0.009637532827875495):0.03933018474875394,((Canscora_diffusa:0.16731955455292502,(Fagraea_racemosa:0.025783269076217752,(Fagraea_fagraeacea:0.009344546348048599,Fagraea_cambagei:1.3374472107585689E-6):0.01600415378867115):0.12409276500045163):0.039836596158796644,(((Strychnos_lucida:0.022712356941776757,(Strychnos_psilosperma:0.021947563629357125,Strychnos_minor:0.030345796715424145):0.0012515918746045518):0.030563848755891132,((Geniostoma_rupestre:0.010829358933578503,Geniostoma_rupestre_var_australiana:0.016944289370101062):0.026575381292261113,(Mitrasacme_oasena:0.018593795783018674,(Mitrasacme_pygmaea:0.026755615490418938,Mitrasacme_polymorpha:0.011162332331696057):0.010035365150064313):0.10899219892407097):0.0436140402342835):0.04894219285313328,(((Alstonia_actinophylla:0.006484843152562703,Alstonia_scholaris:1.3374472107585689E-6):0.03521681800059673,((Voacanga_grandifolia:0.008352993182811241,(Tabernaemontana_pandacaqui:1.3374472107585689E-6,Tabernaemontana_orientalis:0.009585312400855583):0.014750123131852533):0.040872968369021434,((Alstonia_muelleriana:0.03152260621807801,Catharanthus_roseus:0.12467128420304718):1.3374472107585689E-6,(Neisosperma_poweri:0.007306110527456666,Ochrosia_elliptica:0.021949309758017677):0.007375475397341513):0.03036987100488353):0.014644167613233394):0.016920083469148084,(Kopsia_arborea:0.10134901029717502,(((Alyxia_ruscifolia:0.002636215876518744,(Alyxia_oblongata:0.003602130826640182,(Alyxia_ilicifolia:0.020966391462809875,(Alyxia_spicata:0.005671551710534128,Alyxia_grandis:0.002813095405091337):0.012450183138807192):0.0019515551843961587):0.011045000415690898):0.09073563368458004,(Carissa_ovata:0.027029361729778545,((Melodinus_baccellianus:0.009190396101506404,Melodinus_australis:0.008201335144118693):0.029231113814013776,(Allamanda_cathartica:0.06213043011865793,(Cascabela_thevetia:0.049770318111677536,(Cerbera_inflata:1.3374472107585689E-6,(Cerbera_floribunda:0.02371734800851577,Cerbera_manghas:0.008108664965794876):0.006937983476191789):0.00444738507347664):0.01141302429211144):0.01680920255127427):0.0017978745950641972):0.0014613335885884648):0.0010888699228094323,((Wrightia_laevis_subsp_milligar:1.3374472107585689E-6,(Wrightia_versicolor:1.3374472107585689E-6,Wrightia_laevis:1.3374472107585689E-6):1.3374472107585689E-6):0.043920055205616815,((Parsonsia_lanceolata:0.014963686126628795,(Parsonsia_velutina:0.016845322664607587,Parsonsia_ferruginea:0.0033378531604496553):0.006994517283692492):0.035212817614176606,(Ichnocarpus_frutescens:0.04441318495419089,((Cryptostegia_grandiflora:0.009850551112126404,(Phyllanthera_grayi:0.035331300792941334,(Heterostemma_acuminatum:1.3374472107585689E-6,Gymnanthera_oblonga:1.3374472107585689E-6):0.0296073674505134):0.0025590868361861085):0.04860157915640162,((Ceropegia_cumingiana:0.1857208553915175,Secamone_elliptica:0.021152325615823475):1.3374472107585689E-6,(((Gomphocarpus_physocarpus:0.021672347276975312,(Asclepias_curassavica:0.02748839355782884,Sarcostemma_viminale:0.03024893617348634):8.967635849753686E-4):0.01884579872679215,(Tylophora_williamsii:0.07844811355160353,(Tylophora_grandiflora:0.023633807068561108,(Calotropis_procera:0.06848965850768751,Cynanchum_ovalifolium:0.014101053689543064):0.01840249511724501):0.022827680234806857):1.3374472107585689E-6):0.026395299826505347,((Dischidia_nummularia:0.05750643377987796,Hoya_australis_subsp_tenuipes:0.009559265684235596):0.009452603275621918,((Marsdenia_pleiadenia:0.007495493287488442,Marsdenia_longipedicellata:1.3374472107585689E-6):0.023201018685937824,(Gunnessia_pepo:0.03152428703967747,((Hoya_anulata:0.011819090790077147,Hoya_pottsii:0.02800443085899229):0.002645111811927281,(Hoya_australis:0.0052646567036908065,Hoya_macgillivrayi:0.005909499180427491):0.008981058861620927):0.005773612587073318):0.027308882346192775):1.3374472107585689E-6):0.012530782502611415):0.03631338202704271):0.024080470228962536):0.0020660895406231505):0.0017478395074527198):0.019983035364924295):0.0282686768391619):0.0013640330811308665):0.012761121136470543):0.04018280833044552):0.006856209986766615):0.02010368203085444):0.05152499776836139):0.003343101855778796):0.03385259222779058):0.012109502645450299):0.014314354609743729):0.03752258717011636):0.006620764358882036):0.005300254868425336,(((Gonocarpus_acanthocarpus:0.25374179072375047,(Ostrearia_australiana:0.008334471917633923,(Neostrearia_fleckeri:0.01485620218792838,Noahdendron_nicholasii:0.007122974125120418):0.002513899392441843):0.06910808318654449):0.019393000275714778,((Leea_rubra:0.007069041363029549,Leea_indica:0.004910336316744979):0.07742783330103109,(Cissus_penninervis:0.05186433679981317,(Cissus_hypoglauca:0.018449921748229237,(Cayratia_saponaria:0.06838262841564835,((Cayratia_trifolia:0.057813901979334226,Cayratia_japonica:0.04242372549722484):0.04146501723767726,(Cissus_hastata:0.08982165267782005,(Cissus_reniformis:0.05723766010600262,Cissus_repens:0.10251713510641136):1.3374472107585689E-6):0.07127188806407447):0.0037233270871703805):0.01487469281165299):0.014529446371613797):0.05735128938600775):0.12132218546272577):0.0082065902824211,((((((Lagerstroemia_archeriana:0.08835636658406987,Pemphis_acidula:0.0891660297640342):0.02764317406934924,(Ludwigia_octovalvis:1.3374472107585689E-6,Ludwigia_hyssopifolia:0.012303054149590764):0.17050724551573793):0.04085093770605153,(Macropteranthes_montana:0.04044422799506142,((Terminalia_muelleri:0.040108616121317886,Quisqualis_indica:0.037551464508964294):0.038057689669606654,(Terminalia_catappa:0.018596094365446403,(Terminalia_sericocarpa:0.004465547553977545,Terminalia_complanata:0.06111906602968964):1.3374472107585689E-6):0.04616398968408386):0.01599039404996827):0.09356921930315432):0.008958326140110717,((Memecylon_pauciflorum:0.15188000127882884,(Pternandra_coerulescens:0.10078824629044836,(Miconia_nervosa:0.0735152606824595,(Miconia_calvescens:0.028807644364538865,(Tristemma_mauritianum:0.01742430020315755,(Dissotis_rotundifolia:0.015467572172734423,(Melastoma_cyanoides:0.0024581170258449747,Melastoma_malabathricum:0.007002320875143742):0.011561993991736963):0.007692932819333698):0.04286121639886542):0.01049560254419768):0.0848615705599669):0.09194384892149654):0.07342165248818366,(((Xanthostemon_chrysanthus:0.005912045054564885,(Xanthostemon_verticillatus:1.3374472107585689E-6,Xanthostemon_whitei:1.3374472107585689E-6):0.012150386426160065):0.030389900661354163,(Welchiodendron_longivalve:0.004488376227483881,(Lophostemon_lactifluus:0.0023108717534077172,(Lophostemon_suaveolens:0.027406078962193492,Lophostemon_confertus:0.006758339228277621):0.002722446414828328):0.007555815797697152):0.016149390702713262):0.006608295440014844,(((Backhousia_angustifolia:0.013842462640164976,Backhousia_bancroftii:0.00921922880941084):0.0034428993178903244,(Backhousia_enata:0.011232298549499253,Backhousia_hughesii:0.01168559155038329):0.0010463412845251874):0.016975586574941914,(((Barongia_lophandra:0.02742538337090017,((Sphaerantia_chartacea:0.007300046611801725,Sphaerantia_discolor:0.002120804233237239):0.00692868895000176,(Ristantia_gouldii:0.0047913153290866095,Mitrantia_bilocularis:0.007692221041492919):0.003639659284659258):0.01039226448781827):0.01947851326516359,(Syncarpia_glomulifera:0.039564045574949525,(Allosyncarpia_ternata:0.018528462936938883,((Stockwellia_quadrifida:0.018909018506556574,(Corymbia_intermedia:0.02423025602089346,(Corymbia_tessellaris:0.003212855293626582,Corymbia_torelliana:0.004908282703097733):0.0065541250478600155):0.014196509350471231):0.0032139392269860956,(Eucalyptus_crebra:0.004059204706344133,(Eucalyptus_tereticornis:0.0016633612825076582,(Eucalyptus_macta:0.03203006985780488,(Eucalyptus_houseana:0.0068840781020089725,(Eucalyptus_pellita:0.0024113879194153087,Eucalyptus_grandis:0.002346606244358007):9.807343442646E-4):1.3374472107585689E-6):0.0013582278916386414):0.0018530523858446557):0.015474860727628714):0.0050517785314279084):0.01064761102646794):0.003088857702176817):1.3374472107585689E-6,((Melaleuca_viminalis:0.01760100713092072,(Melaleuca_dealbata:0.0024078145975158227,(Melaleuca_argentea:0.0021590023808389924,(Melaleuca_leucadendra:0.0010232033611784486,Melaleuca_viridiflora:0.0022533354915186266):0.0038040138500911036):0.003197576163343041):0.0312635552265591):0.01471158303930431,((Lindsayomyrtus_racemoides:0.04700703449563104,(Asteromyrtus_brassii:0.041735159736657534,Leptospermum_wooroonooran:0.01634640236375806):0.04548034090600228):0.011399824904421818,((Thaleropia_queenslandica:0.03378690236260251,(Eugenia_reinwardtiana:0.029072339286115634,(((Psidium_cattleyanum:0.004261801178824687,Psidium_guajava:0.09964691446026042):0.012306334697655297,(Decaspermum_humile:0.010350847626056647,(Rhodomyrtus_effusa:0.0016440655481827493,(Rhodomyrtus_pervagata:0.00141924655091763,(Rhodomyrtus_sericea:1.3374472107585689E-6,Rhodomyrtus_canescens:0.004958688585751103):6.982320730879454E-4):0.001182660435796179):0.005541943774598601):0.005474626240479563):0.0020251706233129774,(Uromyrtus_metrosideros:0.01681793640548479,((Gossia_macilwraithensis:0.011244558181527475,((Gossia_floribunda:0.0063023857914024095,(Gossia_hillii:0.007751739058148299,Gossia_shepherdii:0.0021582480688696615):1.3374472107585689E-6):0.007676109101876882,(Gossia_lewisensis:0.0078100207916926845,(Gossia_grayi:0.0022242253638584675,(Gossia_lucida:1.3374472107585689E-6,Gossia_retusa:1.3374472107585689E-6):0.0032672260257267105):0.006580314284808209):1.3374472107585689E-6):0.001960484579015098):0.010515261665280828,((Archirhodomyrtus_beckleri:0.008814746324206313,(Rhodomyrtus_macrocarpa:0.012609207380293364,(Pilidiostigma_papuanum:0.00727659648185075,Pilidiostigma_tropicum:0.014264386119060002):0.006175733946273576):0.0021056132289024587):0.009884760422170569,((Lenwebbia_lasioclada:0.045627503368971256,Rhodamnia_longisepala:1.3374472107585689E-6):0.017920342723935168,(Lithomyrtus_obtusa:0.0764877861854345,((Rhodamnia_sessiliflora:0.0022824069486115928,Rhodamnia_blairiana:1.3374472107585689E-6):0.006454098612506121,((Rhodamnia_australis:0.00227179332370242,Rhodamnia_sharpeana:0.0021924128036210355):0.0011365797849185455,(Rhodamnia_costata:0.0022786693539182945,Rhodamnia_spongiosa:1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.0063206582989701054):1.3374472107585689E-6):0.003969073241405052):0.0011724754800865878):0.0017290281487336578):1.3374472107585689E-6):0.006150460800102842):0.014486879773290662):0.0013859435509946394,(((Syzygium_unipunctata:0.0038356979043292494,Syzygium_wesa:1.3374472107585689E-6):0.005710509707615552,((Syzygium_hedraiophyllum:0.006242351930630052,(Syzygium_glenum:0.014001647758540736,(Syzygium_unipunctatum:0.007104199767743458,Syzygium_mulgraveanum:0.006657156996228819):0.0042201759139675055):0.0018410393142647141):0.0017462873713518512,((Syzygium_gustavioides:0.017954806526038425,Syzygium_monimioides:0.0062918735772530265):7.068150506939208E-4,((Syzygium_resa:0.005617571672066446,Syzygium_smithii:0.004612049984908939):0.0027865002128319993,(Syzygium_graveolens:0.0038971741953082173,(Syzygium_divaricatum:0.0012444582413100314,Syzygium_mackinnonianum:0.003070585472675358):0.0022402126302847325):0.003792185754442068):0.002193880733370124):1.3374472107585689E-6):0.002730764390938667):2.336966868328183E-4,(((Syzygium_wilsonii:0.0027283359496952375,(Syzygium_cryptophlebium:0.006204971827741712,Syzygium_luehmannii:0.0027155362721567045):0.00532777462422751):0.008473074847336726,(Syzygium_claviflorum:0.009030779770692443,(Syzygium_canicortex:0.006707144614856109,(Syzygium_corynanthum:0.003158297263098797,Syzygium_apodophyllum:0.003217473399382609):0.002783250428648465):0.0011201788215096098):0.008421602973912368):5.758722112181314E-4,(((Syzygium_oleosum:0.001942544649568223,(Syzygium_banksii:0.0036002130924714937,Syzygium_australe:0.001556763833735264):5.336128156945286E-4):1.3374472107585689E-6,((Syzygium_angophoroides:0.007936813212524152,(Syzygium_boonjee:7.207094866197306E-4,Syzygium_fibrosum:0.0013023102686842147):0.0019996949657141716):4.1164247214120486E-4,(Syzygium_dansiei:0.004903792953415698,(Syzygium_cormiflorum:0.00416209520060129,((Syzygium_bamagense:0.007107596814205586,Syzygium_trachyphloium:0.0014602010557613898):7.693866249673942E-4,(Acmenosperma_claviflorum:1.3374472107585689E-6,(Syzygium_johnsonii:0.0010982590011519022,Syzygium_erythrocalyx:0.008342065704152413):1.3374472107585689E-6):4.4688194538733406E-4):1.3374472107585689E-6):3.821460879029903E-4):1.3374472107585689E-6):1.3374472107585689E-6):0.0017161201702737827,((Tristaniopsis_exiliflora:0.027770717962021796,(Syzygium_forte:1.3374472107585689E-6,Syzygium_papyraceum:1.3374472107585689E-6):0.0025341209180902435):7.203216313502736E-4,(((Syzygium_sayeri:0.007738905740028557,Syzygium_branderhorstii:0.004528703028338965):0.001749773699159185,(Syzygium_argyropedicum:0.0059268329783641605,(Syzygium_malaccense:0.005124259815068366,(Syzygium_endophloium:0.00385336150823945,(Syzygium_macilwraithianum:0.0018196996239896457,Syzygium_armstrongii:0.009058400359795438):0.0024564973749352514):4.6966649544244454E-4):0.0017198406663383459):5.409849229969232E-4):1.3374472107585689E-6,(Syzygium_nervosum:0.003564797981226331,(((Syzygium_alliiligneum:1.3374472107585689E-6,Syzygium_maraca:1.3374472107585689E-6):0.0019431077763205629,(Syzygium_suborbiculare:0.0029551019124742783,Syzygium_velarum:0.0036775193164996223):7.354243783961323E-4):0.001287011827288742,((Syzygium_bungadinnia:0.002701490123320549,(Syzygium_kuranda:0.0029332332282747675,Syzygium_pseudofastigiatum:0.005586589304790834):4.580167242065336E-4):0.004700543065471852,(Syzygium_puberulum:0.004641872511213285,((Syzygium_alatoramulum:7.102804798975182E-4,Syzygium_minutuliflorum:1.3374472107585689E-6):0.005852978262856023,((Syzygium_xerampelinum:0.005961816492517924,Syzygium_aqueum:0.0011283614606520942):0.0010997838449053887,(Syzygium_tierneyanum:1.3374472107585689E-6,Syzygium_buettnerianum:8.534952533393314E-4):0.004715791242083878):1.3374472107585689E-6):4.1626713665854354E-4):0.0016085176764450981):1.3374472107585689E-6):1.3374472107585689E-6):7.193964837790556E-4):7.719838544018032E-4):1.3374472107585689E-6):0.0064668774718770194):0.0011152090139188164):0.012000845389065873):0.0025695699181673692):9.679216021474257E-4):0.003213092675848239):0.00221192715059626):0.0029460230697653245):0.054040133725566264):0.016452728093948155):0.06603775458380068,((Perrottetia_arborescens:0.13677684107675758,((Moringa_oleifera:0.10618568799734085,(Codonocarpus_attenuatus:0.10631846257938815,((Cardamine_flexuosa:0.13808660885826662,(Cleome_viscosa:0.029693179054259278,Cleome_aculeata:0.06493025495473614):0.035701816788544005):0.007150339942763484,(Crateva_religiosa:0.02890080778994253,(Capparis_sepiaria:0.048440498193018655,(Capparis_arborea:0.009419809754036113,Capparis_lucida:0.004797465468379114):0.01344921801088117):0.03196164811068325):0.006734205228316803):0.07900101772987167):0.06787633368776169):0.04045270337172924,(Cochlospermum_gillivraei:0.14334311189972815,((Lethedon_setosa:0.02352594040326661,(Wikstroemia_indica:0.08254415788840808,(Phaleria_chermsideana:0.01496751627504933,(Phaleria_biflora:0.018310468056070617,(Phaleria_octandra:0.019202026021702068,Phaleria_clerodendron:0.013590204793187732):0.014028696635566051):0.010319953114883873):0.02188248935040793):0.050460184323867674):0.06793881679937952,(Corchorus_aestuans:0.19912136257705448,((Kleinhovia_hospita:0.03747516430674547,((Trichospermum_pleiostigma:0.04488812131529696,Grewia_papuana:0.04705173733112189):0.026750682393369418,(Commersonia_bartramia:0.050754638434942434,(Waltheria_indica:0.03618431492803076,Melochia_umbellata:0.040189275401738334):0.02711076347482977):0.00608036412941293):0.003182185629760692):0.009168689438124655,((Schoutenia_ovata:0.06220913501680214,(Helicteres_isora:0.11930052017392168,(Berrya_javanica:1.3374472107585689E-6,Sterculia_quadrifida:0.004189099489893211):0.012084963311821628):0.006410134072751594):0.0015531346067811924,((Firmiana_papuana:0.020178849916448804,((Sterculia_shillinglawii:0.0452089821945314,Heritiera_littoralis:0.031018259811900872):1.3374472107585689E-6,((Brachychiton_acerifolius:0.005932105686260458,Brachychiton_australis:0.002192374147755194):0.010594912846231264,(Franciscodendron_laurifolium:0.0014509131465436642,(Argyrodendron_polyandrum:1.3374472107585689E-6,(Argyrodendron_peralatum:1.3374472107585689E-6,(Argyrodendron_sp_Boonjee:0.007202770691056237,Argyrodendron_trifoliolatum:1.3374472107585689E-6):0.002396857561592247):1.3374472107585689E-6):0.0038376227665430918):0.006056304216470965):0.0021569436133099806):0.0021662528444368334):0.00926572194513775,((Bombax_ceiba:0.027148087118993525,Adansonia_gregorii:0.023536032150514696):0.03173748387706099,((Malvastrum_americanum:0.022882839316085368,((Abutilon_auritum:0.015302843150746481,(Abutilon_indicum:1.3374472107585689E-6,Abutilon_oxycarpum:1.3374472107585689E-6):0.008986730301161927):0.016895773460628538,(Sida_cordifolia:0.0234603548743737,(Sida_spinosa:0.006097803184242245,(Sida_rhombifolia:0.015211392994904926,Sida_acuta:0.0020288931945580124):9.603801115605215E-4):0.014374146028943935):0.014037842783350296):0.01652689760212067):0.057137453884622325,(Thespesia_populneoides:0.03633911840019999,((Fioria_vitifolia:0.017068546353926184,((Hibiscus_meraukensis:0.0024201844358531233,Hibiscus_heterophyllus:1.3374472107585689E-6):0.016194037040221154,(Hibiscus_tiliaceus:0.006912188148342047,Urena_lobata:0.02739367208096999):0.0040356897356930155):0.006767754066328013):0.006895701218742278,(Abelmoschus_moschatus:0.04818366161010812,((Hibiscus_tozerensis:1.3374472107585689E-6,Hibiscus_macilwraithensis:1.3374472107585689E-6):0.0076657425848465355,(Hibiscus_normanii:0.004386372859551679,Hibiscus_peralbus:0.017155223606927672):1.3374472107585689E-6):0.007565284524431393):0.002768196297747938):0.024741035990263116):0.005015776244172709):0.022839213071555786):0.006476517130943549):0.0017140709013545585):0.02052511601920748):0.04803938045509648):0.012617912946105703):0.005650692527475076):0.03689270783957088):0.010616358957631133):0.005888291269317447,((((Garuga_floribunda:0.040292918044700476,(Canarium_muelleri:0.014593865581751464,(Canarium_australasicum:1.3374472107585689E-6,(Canarium_acutifolium:0.010998730002728219,Canarium_vitiense:0.009556270898177455):0.045384940365407744):0.009612973515392698):0.013349848794785402):0.06002459291887896,((Pleiogynium_timoriense:0.04655378826643508,Buchanania_arborescens:0.0626143930215659):0.018936615387615374,((Semecarpus_australiensis:0.0224245658671256,Mangifera_indica:0.04192159818883501):0.012038350059075054,(Blepharocarya_involucrigera:0.020299287566094337,Euroschinus_falcatus:0.02182348814605728):0.002077079357577949):0.0449134932434172):0.008621841224601967):0.02183239625891975,((Ganophyllum_falcatum:0.07896454203874503,((Harpullia_pendula:0.012449278347058113,(Harpullia_rhyticarpa:0.014119312226543945,(Harpullia_arborea:0.002841328341174787,Harpullia_ramiflora:0.0017988158805865018):0.0023193824989286016):0.010705409001859678):0.003023180777791845,(Dodonaea_polyandra:0.014082197780245331,(Dodonaea_triquetra:0.01550131817750211,(Dodonaea_platyptera:0.02074624513172907,(Dodonaea_lanceolata:0.006400438651024687,Dodonaea_viscosa:0.009878381283621174):0.0012773215514534364):0.002137707977239889):0.0028123107042646867):0.022881656659354932):0.036151259603083186):0.020878490307212783,(((Dimocarpus_longan:0.010905671474765954,Dimocarpus_australianus:0.019067946176236195):0.017580097528054228,(Lepisanthes_senegalensis:0.018051715009902103,(Lepisanthes_rubiginosa:0.01819821783098019,(Atalaya_salicifolia:0.03343146945171449,(Atalaya_angustifolia:1.3374472107585689E-6,Atalaya_sericopetala:0.008679925612314787):0.005885554114359648):1.3374472107585689E-6):0.0025169880767107466):0.010128529640174078):0.0029071298015228564,((Tristiropsis_acutangula:0.002143604277001776,Dictyoneura_obtusa:0.002446104461425125):0.031197268788703436,(((Alectryon_kimberleyanus:0.012709882791328564,Alectryon_tomentosus:1.3374472107585689E-6):0.011950155208046431,(Alectryon_semicinereus:0.025267061395986667,Alectryon_connatus:0.002195616575585646):0.004102158920427423):0.019199812098841362,((Elattostachys_megalantha:0.0012762623618796098,Elattostachys_microcarpa:0.0028304747877956338):0.010781460930987086,((Lepidopetalum_fructoglabrum:0.03337203402709299,(Allophylus_cobbe:0.0626752017390032,(Cardiospermum_grandiflorum:0.034487346355152826,Cardiospermum_halicacabum:1.3374472107585689E-6):0.07842077588152885):0.03366993777474392):0.007969362373934419,(((Sarcotoechia_protracta:0.002215153899779443,(Sarcotoechia_villosa:1.3374472107585689E-6,(Sarcotoechia_lanceolata:1.3374472107585689E-6,Sarcotoechia_cuneata:1.3374472107585689E-6):0.007290203640330395):1.3374472107585689E-6):0.014278273144421538,((Diploglottis_pedleyi:0.005292864145322818,Mischarytera_macrobotrys:0.002834528914468004):0.0017049313439283509,(Mischarytera_lautereriana:0.006579860942133031,Mischarytera_megaphylla:1.3374472107585689E-6):1.3374472107585689E-6):0.0029001218142121754):0.0031342444193454,((Diploglottis_harpullioides:0.006468264009900637,Mischocarpus_stipitatus:1.3374472107585689E-6):0.006474362554108604,(((Lepiderema_largiflorens:0.002498386850911749,Lepiderema_hirsuta:0.012375001478835634):0.007327702651598655,(Rhysotoechia_robertsonii:0.013679486883169112,(Rhysotoechia_florulenta:0.0021358434722666964,Rhysotoechia_mortoniana:1.3374472107585689E-6):0.00592531912234151):0.0029450652673361777):0.001508283062928939,(((Cupaniopsis_flagelliformis:0.007256275328412443,((Cupaniopsis_diploglottoides:1.3374472107585689E-6,Cupaniopsis_fleckeri:0.0028117053550493765):0.005559723883392209,(Cupaniopsis_foveolata:1.3374472107585689E-6,Cupaniopsis_anacardioides:0.001712845930984197):7.476635511418639E-4):0.0014896678873583813):0.005291404340551198,(Sarcotoechia_serrata:0.005408532371381725,(Castanospora_alphandii:0.006238619059371064,((Arytera_pauciflora:0.01030588660433518,Arytera_divaricata:1.3374472107585689E-6):0.004833043408023263,(Synima_cordierorum:0.0024069301461663306,Synima_macrophylla:0.0021310754078055494):0.0033910931693726942):1.3374472107585689E-6):1.3374472107585689E-6):0.002730297675831217):0.004298331723248117,((Cnesmocarpon_dasyantha:0.008594717769493943,(Diploglottis_diphyllostegia:1.3374472107585689E-6,Diploglottis_smithii:0.003681090992138314):0.003290920358875238):0.0015929487158548028,((Toechima_erythrocarpum:0.002451051487822431,(Toechima_daemelianum:0.0014116616445339902,Toechima_pterocarpum:0.018558219446709767):1.3374472107585689E-6):0.011937448924601024,(Synima_reynoldsiae:0.004361213470152392,((Mischocarpus_exangulatus:0.012130017843372087,(Mischocarpus_grandissimus:0.005756620944128765,Mischocarpus_pyriformis:0.0037452615180786353):0.0011618498158874058):0.009151165000738648,((Sarcopteryx_reticulata:0.0012296854239006727,(Sarcopteryx_montana:1.3374472107585689E-6,Sarcopteryx_martyana:0.003541715845334137):2.0242230334144296E-6):0.0018171467149220577,(Jagera_pseudorhus:0.00974777331391008,(Guioa_lasioneura:0.001195925741832582,Guioa_acutifolia:1.3374472107585689E-6):0.0037559065838267403):9.198561816183837E-4):0.00610704266293105):0.0011967189507207099):1.3374472107585689E-6):1.3374472107585689E-6):7.861916260792912E-4):0.0010706025079390002):5.982191359261702E-4):7.50717927155975E-6):0.013671603267962906):0.003576232561773862):6.811341711121521E-4):0.0016496723080126063):0.0027016056505351216):0.0469027331043701):0.05399009190238946):0.0035577405938174156,(((Toona_ciliata:0.026815937456319272,Chukrasia_tabularis:0.04047190959331648):0.020958375112839933,(Melia_azedarach:0.05814826808673723,((Vavaea_amicorum:0.16963269014336657,Synoum_glandulosum:0.013261041301724452):0.007857135546167848,((Anthocarapa_nitidula:0.03633848769317982,(Chisocheton_longistipitatus:0.0022579561214385313,(Dysoxylum_gaudichaudianum:0.006843021573740615,Dysoxylum_klanderi:0.0067663819096450695):0.006696625074762097):0.013116828883209086):0.0038072279399721243,(Dysoxylum_rufum:1.3374472107585689E-6,((Dysoxylum_oppositifolium:1.3374472107585689E-6,(Dysoxylum_alliaceum:1.3374472107585689E-6,Dysoxylum_latifolium:0.002171124668987834):1.3374472107585689E-6):0.0021715527010300884,((Synoum_glandulosum_subsp_paniculosum:0.023922322856321232,(Dysoxylum_papuanum:1.3374472107585689E-6,(Turraea_pubescens:0.06782046223179672,(Dysoxylum_mollissimum:1.3374472107585689E-6,Dysoxylum_arborescens:0.006747938052111158):1.3374472107585689E-6):0.01142499899413929):0.0029425897500579):0.0028773621715492137,((Aglaia_brassii:0.00881856046548224,(Aglaia_spectabilis:0.011134194966188726,(Aglaia_australiensis:0.004272608937264333,Aglaia_meridionalis:0.0019026357156990414):0.003355823406746339):0.004539280991654571):0.012346575537634297,(Aglaia_silvestris:0.00990193425902297,(Aglaia_argentea:0.013906242052610596,((Aglaia_elaeagnoidea:0.012000977894687459,(Aglaia_cooperae:0.004350489776929978,Aglaia_euryanthera:0.005301548252222954):0.0034823131040713218):0.003041570629994994,((Dysoxylum_pettigrewianum:0.008737413756886525,Aglaia_sapindina:0.039377644015604285):0.0013899274198965195,(Aglaia_brownii:0.008840475193229835,Aglaia_tomentosa:0.005516006486104397):3.251137644446622E-4):0.009842675571584025):0.0020895874538332526):8.644864878513125E-4):0.004586017861985647):0.009080989785576143):7.266654353821345E-4):1.3374472107585689E-6):0.0017751655052169468):0.004736812660276035):0.0322235954185599):0.007324871415886447):0.056879117014405844,(((Rhus_taitensis:0.013273708696368347,Brucea_javanica:0.008152484647307445):0.06755847375386748,((Ailanthus_integrifolia:0.020150369541094948,Ailanthus_triphysa:0.01896004248621974):0.01795584274706874,(Quassia_amara:0.04300538578804469,(Samadera_baileyana:0.011577176758360563,Samadera_sp_Barong:0.02384232859296187):0.03561628679828466):0.025861496666436667):0.020881833387750515):0.035663613237181924,(Harrisonia_brownii:0.09306936080893813,((((Glycosmis_trifoliata:0.019207226173550862,Micromelum_minutum:1.3374472107585689E-6):0.06876129629102046,(Clausena_brevistyla:0.009021252024846715,Murraya_paniculata:0.013043903621946074):1.3374472107585689E-6):0.0025078854269520168,((Citrus_inodora:0.0018716129610459875,Citrus_garrawayi:0.04945603156219036):0.007779704116446684,(Citrus_sinensis:0.01284883422943528,Citrus_reticulata:0.003223615064072871):0.0028571261777436963):0.02193023548823847):0.046113647156415416,((Zanthoxylum_ovalifolium:0.017761899931021397,(Zanthoxylum_nitidum:0.015276585920389163,(Zanthoxylum_veneficum:1.3374472107585689E-6,Zanthoxylum_brachyacanthum:0.010489821461882043):0.011642635652697075):0.0066366327955531546):0.020773528781850237,((Bosistoa_medicinalis:0.02957322154789499,((Dinosperma_stipitatum:0.046149570911278026,(Dinosperma_melanophloia:0.026745379988000195,Dinosperma_erythrococcum:0.006421604194095321):0.01679030967375361):1.3374472107585689E-6,(Lunasia_amara:0.03957095736712768,(Geijera_salicifolia:0.038497042871515674,(Flindersia_laevicarpa:0.005295263270959527,(Flindersia_brayleyana:1.3374472107585689E-6,(Flindersia_pimenteliana:1.3374472107585689E-6,(Flindersia_ifflaiana:0.006655480484856757,(Flindersia_bourjotiana:1.3374472107585689E-6,Flindersia_schottiana:1.3374472107585689E-6):0.006344310814561771):0.008449522231352424):0.00267433824993335):0.0015999453381561057):0.015614866731099353):0.0017473587641001487):0.004744552952039793):0.0021772409797906622):0.0016596630385723454,((Halfordia_kendack:0.015885018817360486,Leionema_ellipticum:0.02790158789652497):0.018740992342667018,((Zieria_madida:0.06746790650734191,(Pitaviaster_haplophyllus:0.02748921341158206,(Brombya_platynema:0.013527555705735717,(Euodia_pubifolia:0.01222754882545174,(Zieria_smithii:0.031580238651975345,(Melicope_vitiflora:1.3374472107585689E-6,Melicope_xanthoxyloides:1.3374472107585689E-6):0.013156997725856212):0.0010062390817141553):0.0047481954257106995):0.00184646007719369):0.003344430289239475):0.001969309622466553,((Medicosma_fareana:0.019646740953440545,Medicosma_sessiliflora:0.015900809382071168):1.3374472107585689E-6,((Sarcomelicope_simplicifolia:0.018372986289761695,(Acronychia_crassipetala:0.004308455133771205,(Acronychia_acidula:0.017390574307296403,(Acronychia_laevis:1.3374472107585689E-6,(Acronychia_acronychioides:0.004113577381910316,Acronychia_imperforata:0.009766064735572733):1.3374472107585689E-6):1.3374472107585689E-6):1.3374472107585689E-6):0.01107761064660362):0.0019255776923462475,((Euodia_hylandii:1.3374472107585689E-6,Melicope_broadbentiana:1.3374472107585689E-6):0.008321611406724161,((Medicosma_glandulosa:0.004427362604489393,Melicope_jonesii:1.3374472107585689E-6):1.3374472107585689E-6,((Melicope_elleryana:0.0039350122415785505,Melicope_rubra:0.014286266221264055):1.3374472107585689E-6,(Melicope_bonwickii:0.0020569399107271957,Melicope_peninsularis:1.3374472107585689E-6):1.3374472107585689E-6):0.008352254413666937):1.3374472107585689E-6):0.0041332562553031416):0.007156998337911502):0.01167452580117434):0.029187811938285457):0.032087580922227965):0.006943824396557385):0.010210567825033712):0.033984941489670684):0.019776164662562934):0.005081274996515894):0.027330995785320722):0.07937236207830622):0.019793569657171384):0.0077191215394469825,((((((Celastrus_subspicatus:0.0347636198276684,Euonymus_australiana:0.04688414387378115):0.02021953018459799,((Hippocratea_barbata:0.05742105601282943,(Salacia_disepala:0.007093122208312486,(Salacia_erythrocarpa:0.009507855319477954,Salacia_chinensis:0.007330324012616463):0.004048078873475802):0.052077012214404195):0.01901495579564383,(Gymnosporia_inermis:0.04889857812358178,(Lophopetalum_arnhemicum:0.065665292764306,(Pleurostylia_opposita:0.0477285740431469,(Elaeodendron_melanocarpum:8.303380198797505E-4,Elaeodendron_australe:0.001621091484469983):0.039078156897999206):0.014302303529882154):0.010806466590934649):0.003308823214994705):0.004302773353911382):0.007192333067984169,((Siphonodon_australis:0.007105761440406422,Siphonodon_membranaceus:0.005354440159192508):0.06518271933427144,((Euonymus_globularis:0.03667789646084285,Hexaspora_pubescens:0.053885976979008876):0.001229130749672791,((Hedraianthera_porphyropetala:0.03216294656414598,(Hypsophila_dielsiana:0.00683664872863099,Hypsophila_halleyana:0.005353305037271161):0.03225823363066149):0.014747711242460548,((Maytenus_cunninghamii:0.01511427199103621,Maytenus_disperma:0.010024944248505308):0.016640226493885746,(Denhamia_oleaster:0.011406847088986316,(Denhamia_pittosporoides:0.004741724842105777,(Denhamia_viridissima:0.0015697616639901435,Denhamia_obscura:0.009033349462578388):0.002114821212027107):0.0030624082124284246):0.014701547336509524):0.03173715669555466):0.005400784676284909):0.013417078122264336):0.009112616250377514):0.15684371927304652,((Oxalis_corniculata:0.1707814276695644,(Rourea_brachyandra:0.028906247041951882,Connarus_conchocarpus:0.03047845792173609):0.05008576111908325):0.03392714394998153,((Acsmithia_davidsonii:0.04690002127203119,((Pullea_stutzeri:0.05668784063192889,(Gillbeea_adenopetala:0.03022369041316586,(Geissois_biagiana:0.0032987464677587397,Pseudoweinmannia_lachnocarpa:0.011559040806284893):0.0223072072930961):0.0023633957825697216):0.011396018712729994,((Davidsonia_pruriens:0.04712828751770459,Schizomeria_whitei:0.04859947912943752):0.006087177424294543,(Ceratopetalum_succirubrum:0.0021352880539768915,(Ceratopetalum_macrophyllum:0.006420850971123215,Ceratopetalum_hylandii:1.3374472107585689E-6):1.3374472107585689E-6):0.020951388633734247):1.3374472107585689E-6):0.01942568348273621):0.005133599179754089,(((Sloanea_australis:0.013328163007327198,Sloanea_australis_subsp_parviflora:0.002916050375194823):0.005274299968599738,(Sloanea_langii:0.01212926239528822,Sloanea_macbrydei:0.008980356142925583):0.006678704004321023):0.030237822099858036,(Peripentadenia_phelpsii:0.011546563311259694,(Aceratium_ferrugineum:0.01707061146605804,(Elaeocarpus_arnhemicus:0.039293828229550964,(Elaeocarpus_bancroftii:0.010119269907266415,((Elaeocarpus_grahamii:1.3374472107585689E-6,Elaeocarpus_carolinae:0.004326247833817853):0.007305731556762618,(Elaeocarpus_sp_Windsor_Tableland:0.003416045870517137,(Elaeocarpus_largiflorens:1.3374472107585689E-6,Elaeocarpus_sericopetalus:1.3374472107585689E-6):0.008868830416688955):0.009823580772507556):0.002346614587886431):0.004930474038060906):0.005402014131887567):0.036618675943839385):0.022384995372354277):0.02303414475896437):0.01078158028399323):0.0412795982434806):0.009684523935722167,((Ryssopterys_timoriensis:0.026902504009361894,(Tristellateia_australasiae:0.0364661149197093,Hiptage_benghalensis:0.028656073650926928):0.008208249731071482):0.15070851953756959,((((Suregada_glomerulata:0.07709864267560296,(Endospermum_myrmecophilum:0.05311953741897513,(Omphalea_papuana:1.3374472107585689E-6,Omphalea_queenslandiae:0.00960755117969625):0.047034068444759325):0.047194855024988436):0.00888502016988535,((Croton_acronychioides:0.010124316775148134,(Croton_triacros:0.01946770481018878,(Croton_caudatus:0.01256664582973055,Croton_insularis:0.013745951442413862):1.3374472107585689E-6):0.008475085738138488):0.09584952675418801,((Codiaeum_variegatum:0.07520527145122013,Dimorphocalyx_australiensis:0.027929092411368095):0.014287981439476294,(Hylandia_dockrillii:0.0105836064560354,((Aleurites_moluccanus:1.3374472107585689E-6,Aleurites_rockinghamensis:1.3374472107585689E-6):0.04875349210891833,(Baloghia_inophylla:0.02224986833984488,(Fontainea_picrosperma:0.0173046532715746,Baloghia_parviflora:0.009393718486319758):1.3374472107585689E-6):0.01386950332341752):0.014158817414664737):1.3374472107585689E-6):0.032849769298594955):0.012350994125944315):0.005410169661719255,((Pimelodendron_amboinicum:0.05227433763749367,((Microstachys_chamaelea:0.11080547215832948,(Homalanthus_nutans:0.010300355628371394,Homalanthus_novoguineensis:0.008989466673048119):0.053923058269643165):0.0468249889680612,(Excoecaria_agallocha:0.07749735632384569,(Euphorbia_plumerioides:0.0393477831945801,(Euphorbia_tannensis:0.015842274431286052,(Euphorbia_coghlanii:0.07385554908588132,Euphorbia_cyathophora:0.06078071891190018):0.012122933444512096):0.010249880127916944):0.06785204132022893):0.010566064537345432):0.021803338324900556):0.005443686403977299,(Manihot_glaziovii:0.06947711220487707,((Claoxylon_tenerifolium:0.12152320391750837,(Wetria_australiensis:0.05052462415519998,(Rockinghamia_angustifolia:1.3374472107585689E-6,Rockinghamia_brevipes:0.008136440490671748):0.01668511223847635):0.016385001592430837):0.008364982637181106,((Alchornea_thozetiana:0.09160755123784459,Cleidion_javanicum:0.07321658537414044):0.006177373350220172,(((Macaranga_tanarius:0.0029210192671976776,Macaranga_involucrata:6.564280968015535E-4):0.006072477182899383,(Macaranga_subdentata:0.006619640176273922,Macaranga_inamoena:0.004119549323753802):0.006788999861526701):0.016140315516905646,((Mallotus_claoxyloides:0.024375527314953183,(Mallotus_polyadenos:0.019754167659507105,(Mallotus_dispersus:0.035617912195870516,Mallotus_resinosus:0.026828380175041522):1.3374472107585689E-6):0.0025388735386737693):0.004412583572473205,((Mallotus_paniculatus:0.00348656664715552,Mallotus_mollissimus:0.006212614053086485):0.017805046686852677,(Mallotus_philippensis:0.01670041295454905,Mallotus_repandus:0.01818569663923819):0.008835755887425356):0.00117276725163995):0.007289748077116021):0.045804878341612176):0.001312428703885482):0.029198076665780226):0.0034186518398979793):0.0033083439511054635):0.05505139946508253,((Hugonia_jenkinsii:0.10524683123283796,(Balanops_australiana:0.06412199713518119,(Maranthes_corymbosa:0.18852677700066833,Dichapetalum_papuanum:0.16892852054711094):0.025912136671439212):0.030282073759050787):0.013138338639280267,((Ochna_serrulata:0.18243043247381885,(((Baileyoxylon_lanceolatum:0.021364669230344968,Ryparosa_kurrangii:0.038289107253602905):0.09072588247701441,(Casearia_costulata:0.09999132949528922,(Homalium_circumpinnatum:0.018452811556869175,(Flacourtia_sp_Shiptons_Flat:0.0039022881256391972,(Scolopia_braunii:0.03775339730711336,Flacourtia_jangomas:0.01148400163255281):0.0039504918156303415):1.3374472107585689E-6):0.05577784089017657):0.045381783297844036):0.01011409664227636,((Rinorea_bengalensis:0.07032759371594799,Hybanthus_enneaspermus:0.16677225319300915):0.08065487660393655,((Passiflora_kuranda:0.02596754461260964,Passiflora_aurantioides:0.02570558194736028):0.01752883753295209,((Passiflora_foetida:0.03623195879016927,Passiflora_edulis:0.027094890420998552):0.02663233652822261,(Adenia_heterophylla:0.1067327873403966,(Passiflora_suberosa:0.05515651206777328,(Passiflora_aurantia:0.008986896915920917,Passiflora_herbertiana:0.012967926147001041):0.019437804388671265):0.025034827994866893):0.07230494934925036):0.008091810772337338):0.165672004267437):0.004271725379202618):0.010696435466259091):0.004199390617459553,(((Drypetes_deplanchei:1.3374472107585689E-6,Drypetes_acuminata:1.3374472107585689E-6):0.25924760846092454,((Carallia_brachiata:0.12734071282997528,Erythroxylum_ecarinatum:0.14070456490275263):0.05532358717743313,(((Mesua_sp_Boonjee:0.06624693424743466,Mammea_touriga:0.02986163657104257):0.009006669702617431,(Calophyllum_soulattri:0.007809932312083601,(Calophyllum_inophyllum:0.013946114508429641,Calophyllum_sil:0.00218736137329012):1.3374472107585689E-6):0.026589222360571374):0.08082757407359709,((Hypericum_gramineum:0.08135680922092503,Harungana_madagascariensis:0.24226615343066227):0.05204171594724538,(Garcinia_dulcis:0.029618387830691484,(Garcinia_sp_Davies_Creek:0.051796910665911744,(Garcinia_warrenii:0.009184644539270703,Garcinia_gibbsiae:1.3374472107585689E-6):0.016142853296641113):0.007664633075744387):0.10931835352029506):0.023658787561691597):0.061392245152943614):1.3374472107585689E-6):0.009464710025320011,((Austrobuxus_megacarpus:0.023072198877077676,(Sankowskya_stipularis:0.06823935520464564,(Dissiliaria_surculosa:1.3374472107585689E-6,Choriceras_tricorne:0.018065348426595018):1.3374472107585689E-6):1.3374472107585689E-6):0.12290586016320804,((Bischofia_javanica:0.0801781483557823,(Antidesma_erostre:0.08198941956277117,Antidesma_bunius:0.07086608094614866):0.09276702156967098):0.05062354568821259,(Dansiea_elliptica:0.08901488165048299,(((Poranthera_microphylla:0.2034898905578746,(Actephila_latifolia:0.0043019055303403775,Actephila_sessilifolia:1.3374472107585689E-6):0.07400662086760512):0.04536051145971698,(Cleistanthus_apodus:0.07404376116716471,((Cleistanthus_semiopacus:0.04214221397474083,(Cleistanthus_hylandii:1.3374472107585689E-6,Cleistanthus_myrianthus:1.3374472107585689E-6):1.3374472107585689E-6):0.04182201619635373,(Bridelia_insulana:0.014775207914061395,(Bridelia_tomentosa:0.008100717701864157,Bridelia_leichhardtii:0.011144816557123516):0.007055205796698605):0.04594320205103086):0.013593922853625262):0.08720991364982034):0.02610003082858081,(Margaritaria_indica:0.05613058728595577,((Flueggea_virosa_subsp_melanthesioides:0.011323593342826177,(Flueggea_leucopyrus:0.0031010695018016676,Flueggea_virosa:0.0010113464553708207):0.003595831079432066):0.02268630188475429,(Phyllanthus_lamprophyllus:0.08124348701834627,((Phyllanthus_tenellus:0.0366607186863428,Phyllanthus_gunnii:0.01905229718106627):0.007150735098383487,(Phyllanthus_hypospodius:0.023238148934075165,(((Sauropus_albiflorus:0.012950753907873813,Sauropus_sphenophyllus:0.009289402339762387):0.014239742284102075,((Phyllanthus_clamboides:0.007868038177305303,Phyllanthus_cuscutiflorus:0.015632313299992373):0.023309639977325602,(Sauropus_macranthus:0.007639026750993927,(Breynia_cernua:0.002556732402415385,(Breynia_oblongifolia:0.0023623456726988845,Breynia_stipitata:0.002807470817905555):3.1151643805904516E-4):0.010683977853114035):1.3374472107585689E-6):0.0033768993244747136):0.009347043084818374,(Glochidion_disparipes:0.004266858905343618,(Glochidion_harveyanum:0.001115917487748419,((Glochidion_sessiliflorum:0.001072710518413067,(Glochidion_pungens:6.577017657658502E-4,(Glochidion_philippicum:0.0014180371262298985,Glochidion_sumatranum:6.470663905654428E-4):0.0026481619371704346):1.3374472107585689E-6):0.0010610817689241658,((Glochidion_benthamianum:0.004246111331137725,Glochidion_xerocarpum:0.0014192875872498512):6.995008164986105E-4,(Glochidion_lobocarpum:6.95596357489392E-4,(Glochidion_sessiliflorum_var_pedicellatum:1.3374472107585689E-6,Glochidion_hylandii:0.0027208077792337804):1.3594010148665348E-6):6.816686726881516E-4):1.3374472107585689E-6):5.903573329389955E-4):1.3374472107585689E-6):0.022799878665106688):0.015344243915679234):9.708096410873113E-4):0.02129576741297179):0.01855665962537212):0.010516359913551154):0.06486681907976566):0.018901825445018172):0.016914418626531758):0.017721501158856512):0.02076659096041933):0.0044405025571145895):7.309672255975119E-4):0.0033367037047793424):0.0032771098592443426):0.055041840662841235):0.012598504010082667,(((Gymnostoma_australianum:0.0249771039989799,(Casuarina_equisetifolia:0.02851111295987485,Allocasuarina_torulosa:0.023975373824557167):0.03288522431644014):0.17066141513010846,((Rubus_queenslandicus:0.18825288742471924,(Prunus_brachystachya:0.002243474872569484,Prunus_turneriana:1.3374472107585689E-6):0.10255654181234175):0.06721737324041976,((Ventilago_viminalis:0.10267124914156278,(Rhamnella_vitiensis:0.05111419974609055,((Gouania_australiana:0.09959950057701517,Ziziphus_mauritiana:0.02753278714539764):0.015247293134061923,(Colubrina_asiatica:0.07636549604121967,((Brackenridgea_australiana:0.07309566559771452,Schistocarpaea_johnsonii:0.016969187133887176):0.007876235090486738,((Emmenosperma_cunninghamii:0.004321978125029324,Emmenosperma_alphitonioides:0.006977205914931006):0.007040660962314815,(Alphitonia_whitei:0.033777497987329874,(Alphitonia_petriei:1.3374472107585689E-6,Alphitonia_excelsa:1.3374472107585689E-6):0.01947970594729409):0.015242724863930524):0.003963131345802284):0.004454516905193162):0.008543838008108429):0.024803060101542984):0.027619170799276338):0.021895338536807474,(Elaeagnus_triflora:0.25131178566346846,((Aphananthe_philippinensis:0.09865296750498209,((Celtis_timorensis:0.05886745323028253,Celtis_paniculata:1.3374472107585689E-6):0.07210346554504432,((Trema_orientalis:0.0048919301568366436,Trema_aspera:0.023525780658035345):0.006150304422755881,(Trema_tomentosa_var_aspera:0.029485858708851453,(Trema_tomentosa:0.010708697408640333,Trema_cannabina:0.015580263938604233):0.003353847777386898):0.008586246786544849):0.04102050265991464):0.02651731364943044):0.010141640462064228,(((Cecropia_peltata:0.04785018740086033,(Boehmeria_nivea:0.051116113750912184,(Pipturus_argenteus:0.018288635434302702,Pouzolzia_zeylanica:0.07868836424168746):0.01770449075048164):0.09460074754790038):0.02238723570974044,((Elatostema_reticulatum:0.03746244359831741,Procris_pedunculata:0.027721728308949478):0.046321977212027354,(Laportea_interrupta:0.06516728123142879,(Dendrocnide_photinophylla:0.055328209640459036,Urtica_incisa:0.06273337107405741):1.3374472107585689E-6):0.08061458311977576):0.04701585929817431):0.0540869664825433,(((Artocarpus_heterophyllus:0.011922284939829164,Artocarpus_glaucus:0.01942224108910562):0.04279612837288094,(Streblus_pendulinus:0.007261597136115849,(Streblus_glaber:1.3374472107585689E-6,Streblus_glaber_var_australianus:1.3374472107585689E-6):0.00847899034464028):0.02996827463120111):0.016816049794361687,(Maclura_cochinchinensis:0.026574193232939747,((Fatoua_villosa:0.12755965366876532,Trophis_scandens:0.04344849280563201):0.007511637531767423,((Castilla_elastica:0.030520717872300374,Antiaris_toxicaria:0.037454367439692215):0.025685140184571686,((Ficus_albipila:0.019032654641034763,(Ficus_virens:0.007796774558338604,(Ficus_pantoniana:0.020622786883462307,((Ficus_melinocarpa:0.002472578692394256,(Ficus_leptoclada:1.3374472107585689E-6,Ficus_opposita:0.0024254416175739646):0.0024924209246289797):0.0018010493855669107,(Ficus_copiosa:0.0034103216329417485,(Ficus_virgata:0.0038481142850254058,(Ficus_variegata:1.3374472107585689E-6,Ficus_tinctoria:1.3374472107585689E-6):0.00614906114691216):0.0020718617969948117):4.939428032332271E-4):0.001253224662626784):0.003045702564610897):0.0012944720658617515):0.0010397373244198649,(((Ficus_nodosa:0.004701017298856414,Ficus_racemosa:0.009209503865297952):0.001573166569473483,((Ficus_adenosperma:0.01118600702044048,Ficus_mollior:0.004255932673550178):0.0023492686287110986,(Ficus_hispida:0.005512267444979346,(Ficus_septica:0.0024602972475009643,Ficus_congesta:0.003336275970180158):0.002346910134814917):0.001864450235702253):0.0014752349686912858):0.004292409315851953,(Ficus_brachypoda:0.005659405196388523,((Ficus_drupacea:0.0035318505115258247,(Ficus_benjamina:0.006802628245242914,Ficus_microcarpa:0.004496854477439194):0.001694306994551864):0.004564519895635,(Ficus_destruens:0.0038500587141798714,((Ficus_obliqua:0.005862231997528,Ficus_triradiata:0.003546928499585933):9.725410492815723E-4,(Ficus_crassipes:1.3374472107585689E-6,((Ficus_rubiginosa:1.3374472107585689E-6,Ficus_pleurocarpa:0.002588546828250715):0.0021525248760116966,(Ficus_watkinsiana:1.3374472107585689E-6,Ficus_platypoda:0.003175040149222652):6.251100986525149E-4):5.215753693585956E-4):1.3374472107585689E-6):8.504996851301794E-4):0.0038377644166818214):0.0016721836018529501):0.005105816287954479):2.922513349326028E-4):0.029808998541813514):0.015271923841300605):0.013420721686915549):0.002876874696027709):0.045184251346199966):0.015828544430564584):0.03991740585957504):0.004750669496756732):0.027512369047243412):0.032602184757989594):1.3374472107585689E-6,((Corynocarpus_cribbianus:0.08997710047349705,(Tetrameles_nudiflora:0.09238820972603623,((Neoalsomitra_clavigera:0.016971359861522983,Neoalsomitra_capricornica:0.016815193824045727):0.04997341198851224,((Momordica_cochinchinensis:0.08326710224451228,Momordica_charantia:0.027939554305365877):0.010543723919052672,(((Diplocyclos_palmatus:0.019338239152303704,Neoachmandra_cunninghamii:0.029038805290849456):4.808712467667675E-4,(Cucumis_maderaspatanus:0.0245838913127282,Muellerargia_timorensis:0.02251632112014279):0.005427886872495735):0.019639384122167813,(Luffa_aegyptiaca:0.016159809500986166,(Trichosanthes_ovigera:0.014169065319096341,(Sicyos_australis:0.035037336639837435,(Trichosanthes_pentaphylla:0.014880443550041367,(Trichosanthes_cucumerina:0.006771069912514527,Trichosanthes_holtzei:0.0072610614912440585):0.0046687228665126534):0.0012992414246890682):0.0019276879725285134):0.0026430082017224743):0.008722219502576123):0.013824604665481632):0.032392045620244114):0.06772411889927232):0.009977294219285504):0.06714606643445165,((Polygala_paniculata:0.2116846780867918,Xanthophyllum_octandrum:0.06969349634581423):0.09672774178470367,((Suriana_maritima:0.06000319357312667,Guilfoylia_monostylis:0.05599064983932878):0.08564232746030775,((Intsia_bijuga:0.010217722010136931,(Tamarindus_indica:0.022533396996053057,Maniltoa_lenticellata:0.010433615318765632):0.0034384875834253537):0.128007706917329,((Bauhinia_monandra:0.05107085828470126,(Bauhinia_binata:0.0012091169898150733,Bauhinia_hookeri:1.3374472107585689E-6):0.07965303893160991):0.10706479759719345,(Storckiella_australiensis:0.10079692031894183,((Castanospermum_australe:0.03817327224138678,((Callerya_pilipes:0.14165064960809215,(Stylosanthes_scabra:0.17468539833989039,(Aeschynomene_americana:0.11703774264328648,Dalbergia_candenatensis:0.05398976008326206):0.021793578591623564):0.04007898990183034):0.014675114766175223,((Ormosia_ormondii:0.053831051415346276,(Hovea_longipes:0.05369232102213628,(Sophora_tomentosa:0.08607594711610489,(Crotalaria_pallida:0.013803592048122426,Crotalaria_lanceolata:0.01510833856901217):0.07675840662647537):0.015261801831972677):0.011151421191609168):0.006500942164529899,((Indigofera_colutea:0.059338256358887675,Indigofera_suffruticosa:0.026834982220202752):0.05847355837992463,((Sesbania_cannabina:0.013772198160088345,Sesbania_formosa:0.01876998490353321):0.15411285114242168,((Austrosteenisia_blackii:0.08895170366786243,Clitoria_ternatea:0.21065432070036416):0.009825827640188578,((Centrosema_pubescens:0.10614778268139613,(Abrus_precatorius:0.11547513000221121,((Tephrosia_purpurea:0.08975315143942642,(Derris_trifoliata:0.027936854186411786,(Derris_koolgibberah:0.0558976578207544,Millettia_pinnata:0.02513153653775746):0.004012650758294822):0.004479557227622721):0.06398755176777682,(Dioclea_hexandra:0.009768542956804405,(Canavalia_papuana:1.3374472107585689E-6,(Canavalia_rosea:1.3374472107585689E-6,Canavalia_cathartica:8.494512317983594E-4):1.3374472107585689E-6):0.012402607401261978):0.07752805131774654):0.02784258190605704):0.007270494161887409):0.010622969829691353,((Desmodium_gangeticum:0.01934798154588524,(Desmodium_heterocarpon:0.03548498696144975,(Desmodium_intortum:0.017902296394231465,Desmodium_tortuosum:0.017008284866725787):0.022806266697377064):0.005108986136050042):0.08530983823430804,(Rhynchosia_minima:0.09418453934762938,((Vandasina_retusa:0.009398771157765662,(Hardenbergia_violacea:0.004775222850761263,Kennedia_rubicunda:0.017959141233975462):0.0157255836800555):0.035391223152896334,(Mucuna_gigantea:0.0856258441241261,(Glycine_cyrtoloba:0.04858541561434149,(Erythrina_variegata:0.1497105844692107,((Macroptilium_atropurpureum:0.06555386038046396,(Vigna_marina:0.0400902050140991,(Macrotyloma_uniflorum:0.004273723042523714,Macrotyloma_axillare:0.01046956580250924):0.04942990979721218):0.017298260413916133):0.05686114888467719,((Pueraria_montana:0.038845745207663485,Pueraria_phaseoloides:0.03324166655400773):0.0025608157554816158,(Neonotonia_wightii:0.03518128218104999,(Calopogonium_mucunoides:0.07009430840855257,Pachyrhizus_erosus:0.08277510048678305):0.01029407331186638):0.002465051811919805):0.013564824922553842):0.010994426147975744):3.8840483659807745E-4):0.018507920129797406):0.004390783684918076):0.012358861502077101):0.017373696813432482):0.03349401524870432):0.004525444011818203):0.02939413656331591):0.014331758848441734):0.023950400028950547):0.0037231755960149826):0.014398661424212866):0.053521757761956446,(((Caesalpinia_traceyi:0.009677031595968222,(Cassia_queenslandica:0.03721233683651948,(Caesalpinia_crista:0.022128125871575643,(Caesalpinia_decapetala:0.03836076010550882,Caesalpinia_bonduc:0.026349643485889862):0.0031994917428015412):0.012925966826927038):0.043080553680226896):0.01245586189210146,((Senna_siamea:0.029316082831541634,Senna_timorensis:0.04508148452362637):0.01066125668017992,(Senna_coronilloides:0.04004284793173363,(Senna_pendula:0.01323734390894793,(Senna_hirsuta:0.0019421642060688526,((Senna_septemtrionalis:1.3374472107585689E-6,Senna_gaudichaudii:0.0043569083395005315):1.3374472107585689E-6,(Senna_occidentalis:0.03615319432046338,(Senna_tora:1.3374472107585689E-6,Senna_obtusifolia:6.051987284537708E-4):0.07328547905126448):0.008273713436568908):0.0034927507317343842):0.0188874726115017):0.01265024792388203):0.0030489862435972848):0.04115316739489061):0.013484143283989503,(Erythrophleum_chlorostachys:0.029766706295613954,((Peltophorum_pterocarpum:0.035280630187233486,(Parkinsonia_aculeata:0.03357912344758829,Delonix_regia:0.030237117787954904):0.02882346162009397):0.020385008355345846,(Adenanthera_pavonina:0.021447915235033088,((Entada_rheedei:0.008701515755078604,Entada_phaseoloides:0.006283231018046842):0.03552820597391371,(Leucaena_leucocephala:0.07291831057369258,((Albizia_procera:0.025202206581371178,Albizia_lebbeck:0.011255247995019868):0.011213073623621672,(((Cathormion_umbellatum:0.010585062442516557,(Samanea_saman:0.011448716316222796,(Archidendron_grandiflorum:0.009048229081181969,Archidendropsis_xanthoxylon:0.014773961666343483):1.3374472107585689E-6):0.003764859248611252):0.0059884627342831065,(Albizia_sp_Windsor_Tableland:1.3374472107585689E-6,(Paraserianthes_toona:0.016618558969916375,(Pararchidendron_pruinosum:0.0073768961304852,(Archidendron_hirsutum:0.003437220063884916,((Archidendron_kanisii:1.3374472107585689E-6,Archidendron_whitei:8.945202275223441E-4):0.008764369217222678,(Archidendron_vaillantii:0.012971176417225783,Archidendron_ramiflorum:0.009157447103221639):0.0064757818003498):1.3374472107585689E-6):0.0021233520847746545):0.00380239563280238):0.0026757393463039403):1.3374472107585689E-6):0.0027092089144566955,((Acacia_hylonoma:0.037809172192049045,Acacia_ulicifolia:0.01833962559717972):0.013707738988232188,(Acacia_fasciculifera:0.015289466659656137,(Acacia_melanoxylon:0.007983020438191657,((Acacia_shirleyi:0.0033736839351624637,Acacia_oraria:0.008093017217107312):1.3374472107585689E-6,(Acacia_cincinnata:0.011122295353814815,((Acacia_aulacocarpa:0.003069243846422709,(Acacia_crassicarpa:9.705328278928338E-4,(Acacia_celsa:0.004054908277146607,(Acacia_flavescens:0.02411950654549644,Acacia_midgleyi:0.0028773425079856585):1.3374472107585689E-6):0.0010428061833979152):5.890988341462622E-4):0.005689108289810507,((Acacia_mangium:0.008122440945152132,(Acacia_leptocarpa:0.003214007780678596,Acacia_holosericea:5.763182870601735E-4):9.422432063125319E-4):0.0023778988293454706,(Acacia_spirorbis:7.235793454137829E-4,(Acacia_polystachya:0.0027504367583224276,(Acacia_lamprocarpa:0.0011751065906114855,Acacia_auriculiformis:0.020845040209169108):1.3374472107585689E-6):0.0012736573445558674):2.1592600272457574E-4):0.002894431096567729):4.5246214658412054E-4):5.393912475255558E-4):0.003940013513113905):0.0010124554090361615):0.006325153611779211):0.007457256595022166):0.018635439015824207):0.016364404827511003):0.01854763017587535):0.0036448365655270543):0.030117638043932304):0.0014798431897102837):0.015088863646623096):0.028422574102421327):0.011862591920405396):0.011730735070419662):6.97140556777942E-5):0.02991479977498579):0.003424568224231095):0.05939831463662082):0.0069135355656497754):0.01655290183252789):0.015319632895807178):0.03603557511916189):0.0070863121334407975):0.004128345663606536):0.06664133987091159):0.012160770217576111):0.060820735104090584):0.03529768367168207):0.23082685659857186);',


            
 

        });
        //testcase();
    } 
 
