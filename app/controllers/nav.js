timeclock.controller('NavCtrl',function($scope,$location) {
    var navMenu = [];
    console.log($location.path());
    $scope.inAdmin = false;
    if($location.path() === '/admin/') {
        navMenu = [{"text": "Users","url": "#/admin/users"},{"text": "Edit","url": "#/admin/edit"}];
        $scope.inAdmin = true;
    }
    else {
        navMenu = [{"text": "Login","url": "#/admin"}];
        
    }
    $scope.navItems = navMenu;
    });