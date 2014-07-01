timeclock.controller('admin', function admin($scope, $location, usersApi, clockApi, payperiodFactory, customPayperiodFactory, totaltimeFactory) {
    $scope.currentTimes = [];
    $scope.selectedDate = moment().format('MM/DD/YYYY');
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.today = function() {
        $scope.currentDate = new Date();
        //$scope.currentDate.format('shortDate');
    };
    //$scope.selectedDate().format('dd-MMMM-yyyy');
  $scope.today();
    var periodDates;

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
    function getDates(date) {
        periodDates = payperiodFactory.periodDates(date);
        $scope.startDate = periodDates.firstWeekStart;
        $scope.endDate = periodDates.firstWeekEnd;
        //$scope.endDate = periodDates.secondWeekEnd;
    }
    //$scope.currentDate = moment().format('shortDate');
    
    $scope.getAllTimes = function(startdate,enddate) {
        
    };
    $scope.getCustomTimes = function(date1,date2) {
        $scope.currentTimes = [];
        //getDates($scope.selectedDate);
       // console.log(moment(date1).format('YYYY-MM-DD'));
        angular.forEach($scope.users, function(value, key) {
            var obj = {};
            obj.payperiodTotal = 0;
            clockApi.get(value.id, moment(date1).format('YYYY-MM-DD'), moment(date2).format('YYYY-MM-DD')).then(function(response) {
                obj.customTotal = totaltimeFactory.getTotal(response.data);
                //obj.payperiodTotal += obj.firstWeekTotal;
                $scope.currentTimes.push({"name":value.name, "times":obj.customTotal});
                console.log(obj.customTotal);
                //$scope.arrCurrentTimes.push("name")
            });
            
        });
        //return obj;
    };
    $scope.getTimes = function() {
        $scope.currentTimes = [];
        getDates($scope.selectedDate);
        angular.forEach($scope.users, function(value, key) {
            var obj = {};
            obj.payperiodTotal = 0;
            clockApi.get(value.id, periodDates.firstWeekStart, periodDates.firstWeekEnd).then(function(response) {
                obj.firstWeekTotal = totaltimeFactory.getTotal(response.data);
                obj.payperiodTotal += obj.firstWeekTotal;
                clockApi.get(value.id, periodDates.secondWeekStart, periodDates.secondWeekEnd).then(function(response) {
                    obj.secondWeekTotal = totaltimeFactory.getTotal(response.data);
                    obj.payperiodTotal += obj.secondWeekTotal;
                    $scope.currentTimes.push({"name":value.name, "times":obj});
                });
            });
        });
    };
});