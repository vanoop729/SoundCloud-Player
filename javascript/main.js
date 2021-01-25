

var SoundCloudAPI = {};

SoundCloudAPI.init = function() {
 
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });   
}
SoundCloudAPI.init();


SoundCloudAPI.getTrack = function(inputValue) {

    SC.get('/tracks', {
        q: inputValue
      }).then(function(tracks) {
          console.log(tracks);

        // removing existing data
        var searchResult = document.querySelector('.js-search-results');
			searchResult.innerHTML = "";


        SoundCloudAPI.renderTracks(tracks);
      });
}



SoundCloudAPI.renderTracks = function(tracks) {

    tracks.forEach(track => {
        console.log(track);

        
        // To get good quality thumbnail
        SoundCloudAPI.getEmbedForThumbnail = function() {
            SC.oEmbed(track.permalink_url , {
            // auto_play: true
            }).then(function(embed){
            console.log('oEmbed response: ', embed);                
            
            var card = document.createElement("div");
            card.classList.add("card");
            var searchResults = document.querySelector(".js-search-results");
            searchResults.appendChild(card);
    
            var imageDiv = document.createElement("div");
            imageDiv.classList.add("image");
            card.appendChild(imageDiv);
    
            var image_img = document.createElement("img");
            image_img.classList.add("image_img");
            image_img.src = embed.thumbnail_url || "https://picsum.photos/100/100";
            imageDiv.appendChild(image_img);
    
            var content = document.createElement("div");
            content.classList.add("content");
            card.appendChild(content);
    
            var header = document.createElement("div");
            header.classList.add("header");
            header.innerHTML = `<a href="${track.permalink_url}" target="_blank">${track.title}</a>`;
            content.appendChild(header);
    
            var button = document.createElement("div");
            button.classList.add("ui", "bottom", "attached", "button", "js-button");
            card.appendChild(button);
    
            var icon = document.createElement("i");
            icon.classList.add("add", "icon");
            button.appendChild(icon);
    
            var buttonText = document.createElement("span");
            buttonText.innerHTML = 'Add to playlist';
            button.appendChild(buttonText);
    
    
            // Add to playlist button
            button.addEventListener("click", function(){
                if(document.querySelector(".col-left").firstChild.tagName == "P"){
                    document.querySelector(".empty-playlist").remove();
                }
                SoundCloudAPI.getEmbed(track.permalink_url);
            });


            });
        }
        SoundCloudAPI.getEmbedForThumbnail();
        
        // end
        
        

    });

}

SoundCloudAPI.getEmbed = function(trackURL) {
    SC.oEmbed(trackURL, {
    auto_play: true
    }).then(function(embed){
    // console.log('oEmbed response: ', embed);

    var sideBar = document.querySelector(".col-left");
    
    var box = document.createElement("div");
    box.innerHTML = embed.html;
    box.style.marginBottom = '10px';

    sideBar.insertBefore(box, sideBar.firstChild);

    // add to LS
    localStorage.setItem("key", sideBar.innerHTML);

    });
}


// To display LS data on reload
var sideBar = document.querySelector(".col-left");
sideBar.innerHTML = localStorage.getItem("key");



//  Search 

var UI = {};

UI.handleEnterPress = function() {
	document.querySelector(".js-search").addEventListener('keypress', function(e) {
        if(e.which === 13){
            var inputValue = e.target.value;
            SoundCloudAPI.getTrack(inputValue);
        }
    });
}


UI.handleSubmitClick = function() {
    document.querySelector(".js-submit").addEventListener("click", function(e){
        var inputValue = document.querySelector(".js-search").value;

        SoundCloudAPI.getTrack(inputValue);
    });
}

UI.handleEnterPress();
UI.handleSubmitClick();


// To delete All from LS
document.querySelector(".clr-btn").addEventListener("click", function(){
    localStorage.clear();
    var sideBar = document.querySelector(".col-left");
    sideBar.innerHTML = "";

    // empty playlist
    document.querySelector(".col-left").appendChild(p);
});


// For empty playlist
let p = document.createElement("p");
p.classList.add("empty-playlist");
p.innerHTML="Your Playlist is empty";
if(document.querySelector(".col-left").innerHTML == "") {
    document.querySelector(".col-left").appendChild(p);
}
