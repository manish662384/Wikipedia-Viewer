
/* Clears the DOM with previously populated data */
function resetDOM(){
	var emptySearch = document.getElementById("emptySearch");	
	if(emptySearch){
		emptySearch.parentNode.removeChild(emptySearch);
	}

	var mainDiv = document.getElementById("mainDiv");
	while(mainDiv.firstChild){
		mainDiv.removeChild(mainDiv.firstChild);
	}

	var maxArticles = document.getElementsByClassName("maxArticles");
	if(maxArticles[0]){
		maxArticles[0].parentNode.removeChild(maxArticles[0]);
	}

	var buttonDiv = document.getElementById("buttonDiv");
	if(buttonDiv)
		buttonDiv.parentNode.removeChild(buttonDiv);
}

/*-------- In case of search with empty/garbage string ---------*/
function emptySearchMsg(){
	var div = document.createElement('div');
		div.setAttribute("id", "emptySearch");
		var header = document.createElement('h4');		
		var text = document.createTextNode("Nothing found!! Try another query or use Random button to get a random Wikipedia page.");
		header.appendChild(text);
		div.appendChild(header);
		var section = document.getElementsByTagName("section")[0];
		section.insertBefore(div, section.childNodes[0]);
}

/*-----  -----*/
document.querySelector("button").addEventListener('dblclick', function(e){
	e.preventDefault();
	console.log("dblclick");
});

var button = document.querySelector("button");
button.addEventListener('click', function(e){
	
	button.disabled = true;
	e.preventDefault();

	// To clear the DOM with previously populated data.
	resetDOM();

	var searchString = document.forms["searchForm"]["search"].value;
	if(searchString == ""){
		emptySearchMsg();
	}
	else{
		headerTabMediaQueries(); // To create a header tab with media queries when searched with any string
		mainFunc(searchString);	// based on the string some action to happen
	}

	setTimeout(function(){button.disabled = false}, 1000);
});


/* added '&origin=*' at the end of the url to avoid CORS issue. Source: http://lupecamacho.com/wikipedia-viewer-wikipedia-api-cross-origin-request-issues/  */
function mainFunc(searchString){
	/* making wikipedia API call for 40 articles */
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch='+ searchString +'&gsrnamespace=0&gsrlimit=40&prop=info|description|extracts|pageimages&inprop=url&exchars=200&exlimit=max&explaintext=true&exintro=true&origin=*', true);

	xhr.onload = function(){
		if(this.status == 200){
			var outputMsg = JSON.parse(this.responseText);
			
			if(outputMsg.query == null)
				emptySearchMsg();	/* To display error msg in case when searching with garbage string. Some strings returns response without any articles. */
			else
				articleFunc(outputMsg);	// method with real action when searching with non empty string
		}
	}
	xhr.send();
}		

/*---- Action taken when searched with non-emptry/non-garbage string ----*/
function articleFunc(outputMsg){
				
			var article = outputMsg.query.pages;

			var articleArray = [];

			try{
				for(let i = 0; i < Object.entries(article).length; i++){				
					articleArray.push(Object.entries(article)[i]); /* storing the articles in an array for easier access */
				}
			}
			catch(err){console.log(err.message);}
			/*sorting the articles based on their index value as returned from the API. Every article contains unique index no.*/
			articleArray.sort((a,b) => parseFloat(a[1].index) - parseFloat(b[1].index));

			/* With count and countcopy we can count the no of articles displayed on the UI. So, at a time only 10 articles will be displayed. So, initially when searched with a string, only 10 articles will be displayed. Then onClick of the button on the bottom, 10 more articles will be displayed till 40, that I chose.   */
			var count = 0;
			var countCopy ;
			/* This method is used to display the articles on the UI and keeping the count of articles that are displayed */
			countCopy = outputDisplay(articleArray, count);
			console.log(countCopy);					
			
			/*-------- "Show More Articles" Button -------*/
			var div = document.createElement('div');
			div.setAttribute("id", "buttonDiv");

			var button = document.createElement('button');
			button.setAttribute("type", "button");
			button.setAttribute("id", "buttonMaxArticles");
			button.setAttribute("class", "btn btn-primary");

			div.appendChild(button);

			var text = document.createTextNode("Show More Articles");
			button.appendChild(text);

			document.getElementsByTagName("section")[0].appendChild(div);

			document.getElementById("buttonMaxArticles").onclick = function(){

				countCopy = outputDisplay(articleArray, countCopy);
			};
}
/* This method is used to display the articles on the UI and keeping the count of articles that are displayed */
function outputDisplay(articleArray, count){
	// After pressing the Button if the max Article is reached then this error msg will appear.
	if(count == articleArray.length){
		var maxArticles = document.getElementsByClassName("maxArticles");

		if(maxArticles.length == 0){
			document.getElementById("mainDiv").insertAdjacentHTML('afterend', '<div class="maxArticles"><h4>You seem Confused!! Try different Keywords!!</h4></div>');		
		}						
	}
	/*---- Start displaying articles on the UI ----*/
	var output = '';
		
		for(var i = count; i < articleArray.length; i++){
			output +=
				'<div id="article">' +					
				'<a href="'+ articleArray[i][1].fullurl +'" target="_blank">'	+					
				'<h3 id="title">'+ articleArray[i][1].title +'</h3>' +
				'</a>' ;

				if(articleArray[i][1].description != null){
					output +=
					'<h5 id="description">'+ articleArray[i][1].description +'</h5>' ;
				} else{
					output +=
					'<h5 id="description">'+ 'Description:' +'</h5>' ;
				}				

				if(articleArray[i][1].thumbnail != null){
					output +=
					'<img src="'+ articleArray[i][1].thumbnail.source +'" alt="article image">' ;
				}

				if(articleArray[i][1].extract != null){
					output +=
					'<h5 id="article-extract">'+ articleArray[i][1].extract +'</h5>' ;			
				} else{
					output +=
					'<h5 id="article-extract">'+ 'Click on the link above to find more details' +'</h5>' ;
				}

				output +=
					'</div>' ;

				count++;
				if (count % 10 == 0)
					break;				
		}

		//console.log(count);

		//document.getElementById("mainDiv").innerHTML = output;
		document.getElementById("mainDiv").insertAdjacentHTML('beforeend', output);
		return count;
}

/*---- Media Queries only for the header tab when it moves to the top ----*/
function headerTabMediaQueries(){
	var body = document.querySelector("body");
	var header = document.querySelector("header");
	var span = document.querySelector("span");
	var headerImage = document.querySelector("img");
	var inputSearch = document.getElementsByClassName("search")[0];
	var headerText = document.querySelector("h1");

	function mediaFunc(){
		
		if(window.matchMedia("(max-width: 1030px)").matches){
			header.style.display = "flex";
			header.style.flexWrap = "wrap";
			header.style.flexDirection = "column";
			headerImage.style.marginLeft = "0px";
			inputSearch.style.marginLeft = "8px";
			inputSearch.style.marginTop = "10px";

		}
		else{
			body.style.paddingTop = "0px";
			body.style.backgroundColor = "#F1F1F1";
			header.style.display = "block";
			header.style.borderBottom = "1px solid #000";
			header.style.paddingTop = "20px";
			header.style.paddingBottom = "20px";
			header.style.backgroundColor = "#5488BD";
			span.style.float = "left";
			headerImage.style.marginLeft = "20px";
			headerImage.style.width = "60px";
			headerImage.style.height = "60px";
			headerText.style.color = "#ffffff";
			headerText.style.fontSize = "23px";
			headerText.style.marginLeft = "20px";
			headerText.style.marginTop = "10px";
			headerText.style.display = "inline-block";
			inputSearch.style.marginLeft = "-20%";
			inputSearch.style.marginTop = "0px";

		}
	}

	mediaFunc();
	window.matchMedia("(min-width: 1031px)").addListener(mediaFunc);
	window.matchMedia("(max-width: 1030px)").addListener(mediaFunc);
}


/*---- media queries only for the input field to keep it's width in check ----*/
function inputFieldWidthMediaQueries(){
	var inputText = document.getElementsByTagName("input")[0];

	function mediaFunc2(){
		if(window.matchMedia("(max-width: 555px)").matches){
			
			window.addEventListener('click', function(e){
				if (document.getElementsByTagName('form')[0].contains(e.target)){
			  	
					inputText.style.width = "260px";
				}
				else{
				  	inputText.style.width = "160px";
				}
			});
		}		
		else if(window.matchMedia("(min-width: 556px)").matches){
			
			window.addEventListener('click', function(e){
				if (document.getElementsByTagName('form')[0].contains(e.target)){
			  	
					inputText.style.width = "450px";
				} 
				else{
					 inputText.style.width = "250px";
				}
			});
		}
	}	

	mediaFunc2();
	window.matchMedia("(max-width: 555px)").addListener(mediaFunc2);
	window.matchMedia("(min-width: 556px)").addListener(mediaFunc2);
}

inputFieldWidthMediaQueries();