document.querySelector("button").addEventListener('dblclick', function(e){
	e.preventDefault();
	console.log("dblclick");
});

var button = document.querySelector("button");
button.addEventListener('click', function(e){
	e.preventDefault();
	resetDOM();
	var searchString = document.forms["searchForm"]["search"].value;
	console.log(searchString);
	if(searchString == ""){
		var div = document.createElement('div');
		div.setAttribute("id", "emptySearch");
		var header = document.createElement('h4');		
		var text = document.createTextNode("Nothing found. Try another query or use Random button to get a random Wikipedia page.");
		header.appendChild(text);
		div.appendChild(header);
		var section = document.getElementsByTagName("section")[0];
		section.insertBefore(div, section.childNodes[0]);
	}
	else{
		headerTab();
		mainFunc(searchString);
	}
});


/* added '&origin=*' at the end of the url to avoid CORS issue. Source: http://lupecamacho.com/wikipedia-viewer-wikipedia-api-cross-origin-request-issues/  */
function mainFunc(searchString){

	console.log(searchString);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch='+ searchString +'&gsrnamespace=0&gsrlimit=40&prop=info|description|extracts|pageimages&inprop=url&exchars=200&exlimit=max&explaintext=true&exintro=true&origin=*', true);

	xhr.onload = function(){
		if(this.status == 200){
			var outputMsg = JSON.parse(this.responseText);
			console.log(outputMsg);
			var article = outputMsg.query.pages;
			console.log(article);
			
			var articleArray = [];

			for(let i = 0; i < Object.entries(article).length; i++){				
				articleArray.push(Object.entries(article)[i]);
			}

			articleArray.sort((a,b) => parseFloat(a[1].index) - parseFloat(b[1].index));

			console.log(articleArray);


			var count = 0;
			var countCopy ;
			countCopy = outputDisplay(articleArray, count);
			console.log(countCopy);					
			

			var div = document.createElement('div');
			div.setAttribute("id", "buttonDiv");

			var button = document.createElement('button');
			button.setAttribute("type", "button");
			button.setAttribute("id", "button");

			div.appendChild(button);

			var text = document.createTextNode("Show More Articles");
			button.appendChild(text);

			document.getElementsByTagName("section")[0].appendChild(div);
			document.getElementById("button").onclick = function(){

				countCopy = outputDisplay(articleArray, countCopy);
			};
		}
	}
	xhr.send();
}

function outputDisplay(articleArray, count){
	//var i = count;
	// After pressing the Button if the max Article is reached then this msg will appear.
	if(count == articleArray.length){
		console.log("Max articles Reached");
		document.getElementById("mainDiv").insertAdjacentHTML('afterend', '<div id="maxArticles"><h4>You seem Confused!!</h4></div>');
	}


	console.log(count);
	
	var output = '';
		//console.log(Object.keys(article).length);
		
		//for(key in article)
		for(var i = count; i < articleArray.length; i++){
			//console.log(articleArray[i]);
			output +=
				'<div id="article">' +					
				'<a href="'+ articleArray[i][1].fullurl +'" target="_blank">'	+					
				'<h3 id="title">'+ articleArray[i][1].title +'</h3>' +
				'</a>' +
				'<h5 id="description">'+ articleArray[i][1].description +'</h5>' ;					

				if(articleArray[i][1].thumbnail != null){
					output +=
					'<img src="'+ articleArray[i][1].thumbnail.source +'" alt="article image">' ;
				}
				output +=
				'<h5 id="article-extract">'+ articleArray[i][1].extract +'</h5>' +				
				'</div>' ;

				//console.log(articleArray[i][1].title);

				count++;
				if (count % 10 == 0)
					break;
				
		}


		console.log(count);


		//document.getElementById("mainDiv").innerHTML = output;
		document.getElementById("mainDiv").insertAdjacentHTML('beforeend', output);
		return count;
}

function resetDOM(){
	var emptySearch = document.getElementById("emptySearch");	
	if(emptySearch)
		emptySearch.parentNode.removeChild(emptySearch);

	var mainDiv = document.getElementById("mainDiv");

	if(mainDiv.firstChild)
		console.log(mainDiv.childElementCount);

	while(mainDiv.firstChild){
		mainDiv.removeChild(mainDiv.firstChild);
	}

	var buttonDiv = document.getElementById("buttonDiv");
	if(buttonDiv){
		//for (var i = 0; i < buttonDiv.length; i++) {
			buttonDiv.parentNode.removeChild(buttonDiv);
		//}
	}
}


function headerTab(){
	var body = document.querySelector("body");
	body.style.paddingTop = "20px";

	var header = document.querySelector("header");
	header.style.borderBottom = "1px solid #000";
	header.style.paddingBottom = "20px";

	var headerImage = document.querySelector("img");
	headerImage.style.width = "60px";
	headerImage.style.height = "60px";
	headerImage.style.marginLeft = "20px";
	headerImage.style.float = "left";

	var headerText = document.querySelector("h1");
	headerText.style.fontSize = "20px"
	headerText.style.marginLeft = "20px";
	headerText.style.marginTop = "10px";
	headerText.style.float = "left";

	var inputSearch = document.getElementsByClassName("search")[0];
	inputSearch.style.marginTop = "0px";

}


window.addEventListener('click', function(e){
	var inputText = document.getElementsByTagName("input")[0];
	if (document.getElementsByTagName('form')[0].contains(e.target)){
  	
	inputText.style.width = "500px";
	inputText.style.outline = "none";
	inputText.style.boxShadow = "0 0 5px rgba(109,207,246,.5)";
	inputText.style.borderColor = "#66CC75";
  } else{
  	inputText.style.width = "250px";
	//inputText.style.outline = "none";
	inputText.style.boxShadow = "none";
	inputText.style.borderColor = "#000";
  }
});