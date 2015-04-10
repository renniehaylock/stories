
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {

  console.log('statusChangeCallback');
  console.log(response);

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {

    // Logged into your app and Facebook
    // Get the user data to update UI...
    FB.api('/me', function(response) {
      console.log(response);
      console.log('Successful login for: ' + response.id);
      $("._fbloginbutton").html(response.name);
      $("._fbloginbutton").attr("ng-click", "goHome()");
      $("._fbloginbutton").prepend("<img class='profile-pic' src='http://graph.facebook.com/v2.3/" + response.id + "/picture'>");
      $("._fblogoutbutton").show();


      // For the home page, get current year's stories
      if (window.location.pathname.indexOf('home') > -1) {
        angular.element(document.body).scope().init();
      } else {
        window.location.assign("/home");
      };

    });

  } else if (response.status === 'not_authorized') {
    if (window.location.pathname.indexOf('home') > -1) {
      window.location.assign("/");
    }
    console.log("not authorized");
    // The person is logged into Facebook, but not your app.
    $("._fbloginbutton").html('Login With <b>Facebook</b>');
    $("._fblogoutbutton").hide();

  } else {
    if (window.location.pathname.indexOf('home') > -1) {
      window.location.assign("/");
    }

    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    $("._fbloginbutton").html('Login With <b>Facebook</b>');
    $("._fblogoutbutton").hide();

  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// When window loads, check for the Facebook login status
// ======================================================

window.fbAsyncInit = function() {
  
  FB.init({
    appId      : '810916359002701',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.3' // use version 2.3
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.
  $("._fbloginbutton").prepend('<div class="loader">Loading...</div>');
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
