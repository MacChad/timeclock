timeclock.controller('clock', function clock($scope, usersApi, clockApi, payperiodFactory, totaltimeFactory, CurrentTime) {
    $scope.currentUser = 0;
    $scope.clockedIn = false;
    $scope.inputPin = "";
    var objCurUser = {};
    $scope.errorMsg = "";
    //get the list of users
    usersApi.get(1).then(function(response) {
        $scope.users = response.data;
    });
    //$scope.companyName = Settings.getCompanyName();
    //get a users current status
    function getStatus(user) {
        var status;
        clockApi.getLast($scope.currentUser).then(function(response) {
            if (response.data.clockIn !== null && response.data.clockOut !== null) {
                status = "Clocked out " + moment(response.data.clockOut).fromNow();
                $scope.clockedIn = false;
            } else {
                status = "Clocked in " + moment(response.data.clockIn).fromNow();
                $scope.clockedIn = true;
            }
            $scope.currentStatus = status;
        });
    }

    function getTimes(date) {
        var obj = {};
        obj.payperiodTotal = 0;
        var periodDates = payperiodFactory.periodDates(date);
        clockApi.get($scope.currentUser, periodDates.firstWeekStart, periodDates.firstWeekEnd).then(function(response) {
            obj.firstWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.firstWeek = response.data;
            obj.payperiodTotal += obj.firstWeekTotal;
        });
        //clockApi.get($scope.currentUser, periodDates.secondWeekStart, periodDates.secondWeekEnd).then(function(response) {
        //    obj.secondWeekTotal = totaltimeFactory.getTotal(response.data);
        //    obj.secondWeek = response.data;
        //    obj.payperiodTotal += obj.secondWeekTotal;
        //});
        return obj;
    }

    //resets back to basics
    function reset() {
        $scope.currentTimes = {};
        $scope.previousTimes = {};
        $scope.clockedIn = false;
        $scope.currentStatus = "";
        $scope.currentUser = 0;
        $scope.correctPin = false;
        $scope.inputPin = "";
        objCurUser = {};
        console.log('reset!');
    }

    $scope.getTimes = function() {
        if($scope.currentUser > 0) {
            getStatus($scope.currentUser);
            $scope.currentTimes = getTimes(moment());
            $scope.previousTimes = getTimes(moment().day(-8));
            setCurrentUser();
        } else {
            reset();
        }
    };
    $scope.changeUser = function() {
        if($scope.currentUser > 0) {
            objCurUser = {};
            clearPin();
            
            setCurrentUser();
            getStatus($scope.currentUser);
        } else {
            reset();
        }
    };
    function setCurrentUser() {
        
        for (var i=0;i<$scope.users.length;i++) {
            if ($scope.users[i].id == $scope.currentUser) {
                objCurUser = $scope.users[i];
            }
        }
        
        //objCurUser = $scope.users[$scope.currentUser];
        
    }
    function clearPin() {
        $scope.inputPin = "";
        $scope.correctPin = false;
    }
    $scope.clock = function(inOut) {
        if(inOut === "clockIn") {
            clockApi.clockIn($scope.currentUser, moment().format("YYYY-MM-DD HH:mm:ss")).then(function() {
                console.log("Clocked in");
                $scope.getTimes();
            }, function() {
                alert('something went wrong. try again.');
            });
        } else {
            clockApi.clockOut($scope.currentUser, moment().format("YYYY-MM-DD HH:mm:ss")).then(function() {
                $scope.getTimes();
            });
        }
    };

    $scope.format = 'M/d/yy h:mm:ss a';
    $scope.logConsole = function() {
        alert('i got clicked');
    };
    $scope.checkPin = function() {
     //   console.log('clicked' + $scope.inputPin);
       //console.log("current users pin: " + objCurUser.pin);
        if (objCurUser.pin === $scope.inputPin) {
             $scope.correctPin = true;
             $scope.errorMsg = "";
             $scope.getTimes();
        } else {
            $scope.correctPin = false;
            $scope.errorMsg = "Invalid Pin!";
        }
        return $scope.correctPin;
    };
    $scope.reset = function() {
        reset();
       // alert('reset');
    };
});