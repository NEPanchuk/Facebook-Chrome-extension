'use strict';

const profileBlocks = document.getElementsByClassName('uiProfileBlockContent');
var friendsListsName = new Array();
var friendsListsId = new Array();

chrome.storage.local.get(['key'], function(friendsLists) {
  for(var k in friendsLists.key) {
    friendsListsName.push(friendsLists.key[k]);
    friendsListsId.push(k);
  }
  
  Array.from(profileBlocks).forEach(function(profileBlock){
	var userId;
    var json = JSON.parse(profileBlock.firstElementChild.children[1].firstElementChild.firstElementChild.getAttribute("data-gt"));
	if (json) {
	  userId = json.engagement.eng_tid;
	}

	var divFriendsLists = document.createElement('div');
	var ulFriendsLists = document.createElement('ul');
	
	divFriendsLists.setAttribute('id', 'userId' + userId);

	profileBlock.appendChild(divFriendsLists);
	divFriendsLists.appendChild(ulFriendsLists);

	var btnAddToLists = document.createElement('div');
	btnAddToLists.innerHTML += '<input type="button" value="' + 'Добавить в выбранные списки' + '">';
	btnAddToLists.onclick = function() {
	  addUserToSelectedLists(userId);
    } 
	btnAddToLists.onmouseover = function() {
      this.style.cursor = "pointer";
	}
	divFriendsLists.appendChild(btnAddToLists);

	for (var i = 0; i < friendsListsName.length; i++) {
      var liFriendsLists = document.createElement('li');
	  ulFriendsLists.appendChild(liFriendsLists);
	  liFriendsLists.setAttribute('id', 'groupId' + friendsListsId[i]);
	  liFriendsLists.innerHTML += '<input type="checkbox" name="flid" value="'
	    + friendsListsId[i]+ '">' + '<div">' + friendsListsName[i] + '</div>';
	  liFriendsLists.onclick = changedCheck;
	  liFriendsLists.onmouseover = function() {
        this.style.cursor = "pointer";
	  }
	}
  });
});
		
function changedCheck(event) {
  const inputFriendsLists = event.target.previousElementSibling;
  if(inputFriendsLists != null) {
    if(inputFriendsLists.checked == false) {
      inputFriendsLists.checked = true;
    } else {
      inputFriendsLists.checked = false;
    }
  }
}

function addUserToSelectedLists(userId) {
  const selectFriendsLists = document.querySelectorAll('#userId' + userId + ' ul li input');
  Array.from(selectFriendsLists).forEach(function(selectFriendsList){
    if(selectFriendsList.checked == true) {
	  addFriendLists(userId, selectFriendsList.value);
	}
  });
  location.reload(true);
}

function addFriendLists(friendId, friendlistsId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://www.facebook.com/ajax/add_friend/action/?action=add_list&to_friend='
    + friendId + '&friendlists[0]=' + friendlistsId + '&source=profile_browser&accept_tag_education=false');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', '*/*');
  var fbDtsg = document.getElementsByName('fb_dtsg')[0].value;
  var userId = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1])[0];
  var body = '__user=' + encodeURIComponent(userId) + '&__a=&__dyn=&__csr=&__req=&__beoa=&__pc=&dpr=&__rev=&__s=&__hsi=&__comet_req=&fb_dtsg='
    + encodeURIComponent(fbDtsg) + '&jazoest=&__spin_r=&__spin_b=&__spin_t=';
  xhr.send(body);
}