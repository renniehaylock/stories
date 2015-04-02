var storiesApp = angular.module('storiesApp', [])
.filter('facebookUrl', function() {
  return function(input) {
    return 'https://www.facebook.com/' + input;
  };
})

storiesApp.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/members')
        .success(function(data) {
            $scope.members = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // REMEMBER That filters do not change the sorting of the stories
    // they just loop and decide what to show and what not to
    // Same thing with yearly filters... they do not change the order of the boxes... 
    
    $scope.sortStoriesByDate = function() {
        sortStoriesByDate();
        $scope.stories = tileStories($scope.stories);
    };

    $scope.sortStoriesByLikes = function() {
        sortStoriesByLikes();
        $scope.stories = tileStories($scope.stories);
    };

    $scope.sortStoriesByComments = function() {
        sortStoriesByDate();
        $scope.stories = tileStories($scope.stories);
    };


    $scope.filterPhotos = function(status) {
        if (status == 'active') {
            // If toggling off
            toggleStories(false, 'photo');
            $scope.filters.photos.status = 'inactive';
        } else if (status == 'inactive') {
            // If toggling on
            toggleStories(true, 'photo');
            $scope.filters.photos.status = 'active';
        }
    };

    $scope.filterPhotoStories = function(status) {
        if (status == 'active') {
            // If toggling off
            toggleStories(false, 'added_photos');
            $scope.filters.photostories.status = 'inactive';
        } else if (status == 'inactive') {
            // If toggling on
            toggleStories(true, 'added_photos');
            $scope.filters.photostories.status = 'active';
        }
    };


    $scope.filterLinks = function(status) {
        if (status == 'active') {
            // If toggling off
            toggleStories(false, 'shared_story');
            $scope.filters.links.status = 'inactive';
        } else if (status == 'inactive') {
            // If toggling on
            toggleStories(true, 'shared_story');
            $scope.filters.links.status = 'active';
        }
    };

    $scope.filterLocationTags = function(status) {
        if (status == 'active') {
            // If toggling off
            toggleStories(false, 'location_tags');
            $scope.filters.locationtags.status = 'inactive';
        } else if (status == 'inactive') {
            // If toggling on
            toggleStories(true, 'location_tags');
            $scope.filters.locationtags.status = 'active';
        }
    };

    $scope.filterStatusUpdates = function(status) {
        if (status == 'active') {
            // If toggling off
            toggleStories(false, 'mobile_status_update');
            $scope.filters.statusupdates.status = 'inactive';
        } else if (status == 'inactive') {
            // If toggling on
            toggleStories(true, 'mobile_status_update');
            $scope.filters.statusupdates.status = 'active';
        }
    };

    $scope.filterWallPosts = function(status) {
        if (status == 'active') {
            // If toggling off
            toggleStories(false, 'wall_post');
            $scope.filters.wallposts.status = 'inactive';
        } else if (status == 'inactive') {
            // If toggling on
            toggleStories(true,  'wall_post');
            $scope.filters.wallposts.status = 'active';
        }
    };

    $scope.showMoreStoriesOnScroll = function() {
        // Check that the last displayed story is still in the selected year....
        // If not, then just skip to the next 
    }
    $scope.getStoriesForYear = function(year) {
        // First check if the current story pool has enough pictures to display...
        // IF IT DOES

        // toggleYear(year);
        // if ($scope.stories has enough stories for timestamp) {
        //     applyFilters();
        // } else {
        //     timestamp = year.timestamp
        //     getFeedWithTimestamp(timestamp);
        //     getPhotosWithTimestamp(timestamp);
        // }
        console.log("Checking year");
        console.log(year.timestamp);

        timestamp = year.timestamp;
        getFeedWithTimestamp(timestamp);
        getPhotosWithTimestamp(timestamp);
        toggleYear(year);
        $scope.sortStoriesByDate(); // since we're adding new data into the story pool, we need to make sure its sorted

    }

    function getFeedWithTimestamp(timestamp) {
        FB.api('/me/feed?limit=240&until=' + timestamp, function(response) {
            console.log('Getting Text Posts');
            console.log(response);
            response.data.forEach(function(story) {
                if (!contains($scope.stories,story) && (story.message || story.story)) {

                    var date = new Date(story.created_time);
                    story.created_date_string = date.toDateString();
                    story.timestamp = date.getTime();
                    switch(story.type) {
                        case 'status':
                            story.display = true;
                            story.blocktype = 'text';
                            story.color = chooseColor();
                            story.size = 'small';
                            if (story.message == null) { story.message = story.story};
                            if (story.to != null && story.from != null & story.status_type == null) {
                                story.status_type = 'wall_post';
                            };
                            $scope.stories.push(story);
                            break;
                        case 'link':
                            story.display = true;
                            story.blocktype = 'text';
                            story.color = chooseColor();
                            story.size = 'small';
                            if (story.message == null) { story.message = story.story};
                            if (story.status_type == "published_story") { story.status_type = "mobile_status_update"};
                            $scope.stories.push(story);
                            break;
                        case 'photo':
                            if (story.description != null) {
                                story.message = story.description;
                            } else if (story.story != null) {
                                story.message = story.story;
                            }
                            ;
                            story.display = true;
                            story.blocktype = 'text';
                            story.color = chooseColor();
                            story.size = 'medium';
                            $scope.stories.push(story);
                            break;
                    };
                };
            });
            applyFilters();
            $scope.stories = tileStories($scope.stories);
            $scope.$apply();
            console.log($scope.stories);
        });
    };

    function getPhotosWithTimestamp(timestamp) {
        FB.api('/me/photos?limit=240&until=' + timestamp, function(response) {

            console.log('Getting Photos');
            console.log(response);
            response.data.forEach(function(story) {

                // Only add the story if its not already in our storyPool
                if (!contains($scope.stories,story)) {

                    var date = new Date(story.created_time);
                    story.created_date_string = date.toDateString();
                    story.timestamp = date.getTime();
                    story.display = true;
                    story.blocktype = 'photo';
                    story.status_type = 'photo';
                    story.size = 'large';
                    story.imageUrl = story.images[1].source;
                    $scope.stories.push(story);
                }

            });

            applyFilters();
            $scope.stories = tileStories($scope.stories);
            $scope.$apply();
            console.log($scope.stories);
        });
    }

    // Mock Data for stories
    $scope.getRecentStories = function() {
        FB.api('/me/feed?limit=240', function(response) {

            console.log('Getting Text Posts');
            console.log(response);

            response.data.forEach(function(story) {

                if (!contains($scope.stories,story) && (story.message || story.story)) {

                    var date = new Date(story.created_time);
                    story.created_date_string = date.toDateString();

                    switch(story.type) {
                        case 'status':
                            story.display = true;
                            story.blocktype = 'text';
                            story.color = chooseColor();
                            story.size = 'small';
                            $scope.stories.push(story);
                            break;
                        case 'link':
                            story.display = true;
                            story.blocktype = 'text';
                            story.color = chooseColor();
                            story.size = 'small';
                            $scope.stories.push(story);
                            break;
                        case 'photo':
                            story.message = story.story;
                            story.display = true;
                            story.blocktype = 'text';
                            story.color = chooseColor();
                            story.size = 'medium';
                            $scope.stories.push(story);
                            break;
                    };
                };
            });
            applyFilters();
            $scope.stories = shuffle($scope.stories);
            $scope.stories = tileStories($scope.stories);
            $scope.$apply();
            console.log($scope.stories);
        });

        FB.api('/me/photos?limit=240', function(response) {
            console.log('Getting Photos');
            console.log(response);
            response.data.forEach(function(story) {
                if (!contains($scope.stories,story)) {
                    var date = new Date(story.created_time);
                    story.created_date_string = date.toDateString();
                    story.display = true;
                    story.blocktype = 'photo';
                    story.status_type = 'photo';
                    story.size = 'large';
                    story.imageUrl = story.images[1].source;
                    $scope.stories.push(story);
                }
            });
            applyFilters();
            $scope.stories = shuffle($scope.stories);
            $scope.stories = tileStories($scope.stories);
            $scope.$apply();
            console.log($scope.stories);
        });
    };

    // Logout from FB
    $scope.logoutMember = function() {
        $("._fbloginbutton").prepend('<div class="loader">Loading...</div>');
        FB.logout(function(response) {
            // Update login state
            checkLoginState();
            console.log("User logged out");
            console.log(response);
        });
    };

    // when submitting the add form, send the member info to the node API
    $scope.createMember = function() {
        $("._fbloginbutton").prepend('<div class="loader">Loading...</div>');
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', function(response) {
                    // Update login state
                    checkLoginState();
                    // Not a lot of massaging data here, since our Member object shadows the fbApi fields
                    var memberData = response;
                    memberData['fbid'] = response.id;

                    $http.post('/members', memberData)
                    .success(function(data) {
                        if (data) $scope.loggedmember = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });

               });
            } else {
                checkLoginState();
                console.log('User cancelled login or did not fully authorize.');
            }
        },{scope: 'public_profile,user_friends,email,user_about_me,user_posts,user_birthday,user_photos,user_relationships,user_status,user_tagged_places'});
    };

    // delete a todo after checking it
    $scope.deleteMember = function(id) {
        $http.delete('/members/' + id)
            .success(function(data) {
                $scope.members = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // DATA
    // =========================================

    $scope.selectedYear = '2015';

    $scope.loggedmember;
    
    $scope.stories = [];

    $scope.seeing = {
        type : 'photos',
        location : 'Miami',
        age : '23'
    };

    // Default active filters shown here
    $scope.filters = {
        photos :        { name: 'Photos',           status : 'active',      identifier : 'photo' },
        statusupdates : { name: 'Status Updates',   status : 'inactive',    identifier : 'mobile_status_update' },
        wallposts :     { name: 'Wall Posts',       status : 'inactive',    identifier : 'wall_post'  },
        links :         { name: 'Links',            status : 'inactive',    identifier : 'shared_story'  },
        photostories :  { name: 'Photo Stories',    status : 'inactive',    identifier : 'added_photos'  },
        locationtags :  { name: 'Location Tags',    status : 'inactive' },
    };

    $scope.years = [
        { name : '2015' , status: 'active', timestamp: '1451563199', sincetimestamp: '1420027200'}, // timestamp for Dec 31, 11:59PM of the year
        { name : '2014' , status: 'inactive', timestamp: '1420027199', sincetimestamp: '1388491200'},
        { name : '2013' , status: 'inactive', timestamp: '1388491199', sincetimestamp: '1356955200'},
        { name : '2012' , status: 'inactive', timestamp: '1356955199', sincetimestamp: '1325332800'},
        { name : '2011' , status: 'inactive', timestamp: '1325332799', sincetimestamp: '1293796800'},
        { name : '2010' , status: 'inactive', timestamp: '1293796799', sincetimestamp: '1262260800'},
        { name : '2009' , status: 'inactive', timestamp: '1262260799', sincetimestamp: '1230724800'},
        { name : '2008' , status: 'inactive', timestamp: '1230724799', sincetimestamp: '1199102400'},
        { name : '2007' , status: 'inactive', timestamp: '1199102399', sincetimestamp: '1167566400'},
        { name : '2006' , status: 'inactive', timestamp: '1167566399', sincetimestamp: '1136030400'},
        { name : '2005' , status: 'inactive', timestamp: '1136030399', sincetimestamp: '1104494400'},
    ];

    $scope.member = {};
    // HELPERS
    // =========================================
    function chooseColor() {
        var colors = [ 'blue', 'green', 'grey', 'light'];
        return colors[Math.floor(Math.random()*colors.length)];
    }

    function storyImageSize(story) {
        width = story.images[1].width;
        height = story.images[1].height;
        ratio = width/height;
        //reset width and height
        if (story.imageHeight) {story.imageHeight = null};
        if (story.imageWidth) {story.imageWidth = null};
        if (ratio >= 1) {
            switch (story.size) {
                case 'large':
                    story.imageHeight = '304';
                    break;
                case 'wide':
                    divRatio = 1.50657;
                    // if wider than div
                    if (ratio > divRatio){
                        story.imageHeight = '304';
                    } else {
                        story.imageWidth = '458';
                    }
                    break;
                case 'tall':
                    story.imageHeight = '458';
                    break;
                case 'small':
                    story.imageHeight = '150';
                    break;
            }
        // If image is tall, set its width to container div width
        } else {
            switch (story.size) {
                case 'large':
                    story.imageWidth = '304';
                    break;
                case 'wide':
                    story.imageWidth = '458';
                    break;
                case 'tall':
                    divRatio = 0.6637;
                    // if taller than div
                    if (ratio > divRatio){
                        story.imageHeight = '458';
                    } else {
                        story.imageWidth = '304';
                    }
                    break;
                case 'small':
                    story.imageWidth = '150';
                    break;
            }
        }
        return story;
    };

    // ALGORTIHM EXPLANATION
    // ======================
    // Have initial array with all patterns
    // Remove patterns that need more images than there is available
    // Random choose one of the patters thats left
    // 
    // Take out the number of images that the pattern requires into new array... delete them from the original one
    // apply the pattern to the new array... save the position of the last image...
    // repeat until original pool is empty, then delete the pool

    function tileStories(stories) {

        function displayable(story) {
            return story.display;
        };
        function enoughImages(pattern) {
            return storyCount >= pattern.imagecount;
        };
        var patternPool = tilePatterns;
        var storyPool = stories.filter(displayable);
        var storyCount = storyPool.length;
        var storyPointer = 0;
        console.log('Story Pool');
        console.log(storyPool);
        

        while (storyPool.length > 0 && storyPointer < storyCount && storiesLeft != 1) {
            var storiesLeft = storyCount - storyPointer;
            validPatterns = patternPool.filter(enoughImages);
            if (validPatterns.length == 0) { break; };
            // Random choose one of the patterns
            var randPattern = validPatterns[Math.floor(Math.random()*validPatterns.length)];
            console.log("valid Patterns are");
            console.log(validPatterns);
            console.log("Chosen Pattern is");
            console.log(randPattern);
            patternString = randPattern.pattern;
            for ( var i = 0; i < patternString.length; i++ ) {
                if (storyPointer >= storyCount) break;
                size = letterToSize(patternString.charAt(i));                
                storyPool[storyPointer].size = size;    // CHANGING THE SIZE
                if (storyPool[storyPointer].blocktype == 'photo') {
                    storyPool[storyPointer] = storyImageSize(storyPool[storyPointer]);
                }
                storyPointer++;
            };
        };

        // Replace visible stories in original stories
        stories = $scope.stories;
        for (var i = 0; i < stories.length; i++) {
            for (var x = 0; x < storyPool.length; x++) {
                if (stories[i].id == storyPool[x].id) {
                    stories[i] = storyPool[x];
                };
            };
        };
        return stories;
    };

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].id === obj.id) {
                return true;
            }
        }
        return false;
    };

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    function sortStoriesByDate() {
        $scope.stories.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
    }

    function sortStoriesByLikes() {
        $scope.stories.sort(function(a,b){
            a = (a.likes == null) ? null : a.likes.data.length;
            b = (b.likes == null) ? null : b.likes.data.length;

            var va = (a === null) ? "" : "" + a,
            vb = (b === null) ? "" : "" + b;

            return vb > va ? 1 : ( va === vb ? 0 : -1 );
        });
    }
    // *
    // This function makes sure that we only show
    // stories that are part of the selected type and year
    // *
    function toggleStories(display, type) {
        console.log("Im in toggle stories");

        selectedYear = getSelectedYear();
        startTimestamp = selectedYear.sincetimestamp*1000;
        endTimestamp = selectedYear.timestamp*1000;
        console.log(startTimestamp);
        console.log(endTimestamp);
        console.log($scope.stories);
        for (i = 0; i < $scope.stories.length ; i++) {
            if ($scope.stories[i].timestamp < startTimestamp || $scope.stories[i].timestamp > endTimestamp) {
                $scope.stories[i].display = false;
            } else {
                // If its in the right year, then check the type
                if (type == 'photo') {
                    if ($scope.stories[i].blocktype == type) {
                        $scope.stories[i].display = display;
                    };
                } else if (type == 'location_tags'){
                    if ($scope.stories[i].story != null && ($scope.stories[i].story.indexOf('You were tagged at') != '-1')) {
                        $scope.stories[i].display = display;
                    };
                } else {
                    if ($scope.stories[i].status_type == type) {
                        $scope.stories[i].display = display;
                    };
                }
            }
        };
        $scope.stories = tileStories($scope.stories);
    };

    function toggleYear(year) {
        // Toggle selected year on, and other years off
        for (i = 0; i < $scope.years.length ; i++) {
            if (year.name == $scope.years[i].name) {
                $scope.years[i].status = 'active';
            } else {
                $scope.years[i].status = 'inactive';
            }
        };
    };

    function getSelectedYear() {
        for (i = 0; i < $scope.years.length ; i++) {
            if ($scope.years[i].status == "active") {
                return $scope.years[i];
            };
        };
    };

    // *
    // This function gets called when we want to apply all filters
    // to our stories, including post types, and year
    // *
    function applyFilters() {
        for (filter in $scope.filters) {

            console.log('INSIDE FILTERS');
            console.log($scope.filters[filter]);

            if ($scope.filters[filter].status == 'active') {
                toggleStories(true, $scope.filters[filter].identifier);
            } else if ($scope.filters[filter].status == 'inactive') {
                toggleStories(false, $scope.filters[filter].identifier);
            };
        };
    };

}]);