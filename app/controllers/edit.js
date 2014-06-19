timeclock.controller('edit', function edit($scope, usersApi, clockApi, payperiodFactory, totaltimeFactory) {
    $scope.currentTimes = {};
    $scope.currentUser = 0;
    $scope.selectedDate = moment().format('MM/DD/YYYY');
    //$scope.selectedDate = moment().format('MM/DD/YYYY');
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.startTime = new Date();
    $scope.endTime = new Date();
    $scope.currentDate = new Date();
    //$scope.whatever = new Date();
    //get the list of users
    usersApi.get(1).then(function(response) {
        $scope.users = response.data;
    });
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        //console.log('clicked');
        $scope.opened = true;
    };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

      //$scope.initDate = new Date('2016-15-20');
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','MM/DD/YYYY'];
      $scope.format = $scope.formats[0];
    
    
    $scope.changedTime = function() {
        //console.log('My Time changed to: ' + $scope.whatever);
        console.log('Start Time changed to: ' + moment($scope.startTime).format("HH:mm"));
        //console.log('End Time changed to: ' + moment($scope.endTime,'shortTime');
     };  

    function getTimes(date) {
        var obj = {};
        obj.payperiodTotal = 0;
        var periodDates = payperiodFactory.periodDates(date);
        $scope.startDate = periodDates.firstWeekStart;
        $scope.endDate = periodDates.secondWeekEnd;
        clockApi.get($scope.currentUser, periodDates.firstWeekStart, periodDates.firstWeekEnd).then(function(response) {
            obj.firstWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.firstWeek = response.data;
            obj.payperiodTotal += obj.firstWeekTotal;
        });
        clockApi.get($scope.currentUser, periodDates.secondWeekStart, periodDates.secondWeekEnd).then(function(response) {
            obj.secondWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.secondWeek = response.data;
            obj.payperiodTotal += obj.secondWeekTotal;
        });
        return obj;
    }

    //resets back to basics
    function reset() {
        $scope.currentTimes = {};
        $scope.currentUser = 0;
        $scope.selectedDate = moment('MM/DD/YYYY');
        //$scope.selectedDate = new Date();
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.startTime = "";
        $scope.endTime = "";
    }

    $scope.getTimes = function() {
        if($scope.currentUser > 0) {
            $scope.currentTimes = getTimes($scope.selectedDate);
        } else {
            reset();
        }
    };

    $scope.addRow = function() {
        var formattedDate = moment($scope.selectedDate).format("YYYY-MM-DD");
        var start = moment(formattedDate + " " + moment($scope.startTime).format('HH:mm'), "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm:ss");
        var end = moment(formattedDate + " " + moment($scope.endTime).format('HH:mm'), "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm:ss");
        clockApi.add($scope.currentUser, start, end).then(function() {
            //$scope.currentTimes = getTimes($scope.selectedDate);
            $scope.currentTimes = getTimes($scope.selectedDate);
            $scope.startTime = "";
            $scope.endTime = "";
        });
    };

    $scope.removeRow = function(id) {
        clockApi.remove(id).then(function() {
            $scope.currentTimes = getTimes($scope.selectedDate);
        });
    };

    $scope.reset = function() {
        reset();
    };
});