const listsAll = document.querySelectorAll("#bookmarksSeeAllEntSection ul li");
var friendsLists = {};

Array.from(listsAll).forEach(function(item){
	var listId = item.getAttribute("id").replace("navItem_","");
	friendsLists[listId] = item.innerText;
});

chrome.storage.local.set({key: friendsLists}, function() {
		console.log("Saved!");
    });