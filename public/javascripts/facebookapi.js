function getRecentStories() {
	console.log("Getting stories")
  FB.api('/me/feed', function(response) {
    console.log(response);
    document.getElementById('_fbloginbutton').innerHTML =
      response.data[0].id;
  });
}

function getUserInfo() {
	console.log("Getting stories")
  FB.api('/me', function(response) {
  	return response
  });
}