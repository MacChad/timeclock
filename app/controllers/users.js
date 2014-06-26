timeclock.controller('users', function users($scope, usersApi,$routeParams) {
    $scope.newUser = '';
    if ($routeParams.id) {
        getUser($routeParams.id);
    } else {
        getUsers();
    }
    $scope.mytime = new Date();
    function getUsers() {
        $scope.newUser = '';
        usersApi.get(1).then(function(response) {
            $scope.activeUsers = response.data;
           // console.log(response.data);
        }, function(err) {
            alert("something bad happened.");
        });
        usersApi.get(0).then(function(response) {
            $scope.inactiveUsers = response.data;
        });
    }
    
    function getUser(id) {
        $scope.users = '';
        usersApi.getUser(id).then(function(response) {
            $scope.users = response.data;
        }, function(err) {
            alert("something bad happened.");
        });
    }

    $scope.addUser = function() {
        usersApi.add($scope.newUser).then(function () {
            getUsers();
        });
    };

    $scope.updateUser = function(user) {
        usersApi.update(user.id).then(function() {
            getUsers();
        });
    };
    
    $scope.updateUserDetails = function(user) {
        $scope.message = {};
        var tmpUser = user;
        usersApi.updateUserDetails(user).then(function() {
           $scope.message.text = "User Saved Successfully!";
           $scope.message.cssClass = "success";
           getUser(tmpUser.id);
        }, function(error) {
           $scope.message.text = "Uh oh! Something went wrong. Please try again. Error: "+error;
           $scope.message.cssClass = "danger";
        }
        );
    };
    

});