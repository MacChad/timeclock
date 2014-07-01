timeclock.controller('NavCtrl',function($scope) {
    var navMenu = [];
    //console.log($location.path());
    //$scope.inAdmin = false;
    
    if ($scope.user.authenticated) {
        navMenu = [{"text": "Users","url": "#/admin/users"},
                    {"text": "Edit","url": "#/admin/edit"}];
        $scope.inAdmin = true;
    }
    
    $scope.navItems = navMenu;
    });