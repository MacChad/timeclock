var timeclock = angular.module("timeclock", ['angularMoment', 'ui.bootstrap','ngCsv','UserApp'])
.config(function($locationProvider, $routeProvider) {
    $routeProvider
        .when("/clock", { controller: "clock", templateUrl: "app/views/clock.html", public: true })
        .when("/login", {templateUrl: "app/views/login.html", login: true})
        .when("/signup", {templateUrl: "app/views/signup.html"})
        .when("/admin/", { controller: "admin", templateUrl: "app/views/admin.html"})
        .when("/admin/edit", { controller: "edit", templateUrl: "app/views/edit.html" })
        .when("/admin/users", { controller: "users", templateUrl: "app/views/users.html" })
        .when("/admin/users/:id", { controller: "users", templateUrl: "app/views/user.html" })
        .otherwise({ redirectTo: '/clock' });
})
.constant('COMPANYNAME', 'Cornerstone Christian Church')
.factory('usersApi', ['$http', function($http) {
    return {
        add : function(name) {
            return $http.get("api/?action=usersAdd&name=" + name.name + "&pin="+name.pin);
        },
        get : function(active) {
            return $http.get("api/?action=usersGet&active=" + active);
        },
        deleteUser : function(active) {
            return $http.get("api/?action=userDelete&id=" + active);
        },
        getUser : function(id) {
            return $http.get("api/?action=userGet&id=" + id);
        },
        update : function(id) {
            return $http.get("api/?action=usersUpdate&id=" + id);
        },
        updateUserDetails : function (user) {
            return $http.get("api/?action=updateUserDetails&id="+ user.id+ "&name="+user.name+"&pin="+user.pin);
        }
    };
}])

.factory('clockApi', ['$http', function($http) {
    return {
        add : function(user, start, end) {
            return $http.get("api/?action=clockAdd&user=" + user + "&start=" + start + "&end=" + end);
        },
        clockIn : function(user,start) {
            return $http.get("api/?action=clockAdd&user=" + user+ "&start=" + start);
        },
        get : function(user, start, end) {
            return $http.get("api/?action=clockGet&user=" + user + "&start=" + start + "&end=" + end);
        },
        getLast : function(user) {
            return $http.get("api/index.php?action=clockGet&user=" + user);
        },
        update : function(id, start, end) {
            return $http.get("api/?action=clockUpdate&id=" + id + "&start=" + start + "&end=" + end);
        },
        clockOut : function(user, end) {
            return this.getLast(user).then(function(response) {
                return $http.get("api/?action=clockUpdate&id=" + response.data.id + "&end=" + end);
            });
        },
        remove : function(id) {
            return $http.get("api/?action=clockDelete&id=" + id);
        }
    };
}])
.factory('customPayperiodFactory', function() {
    var dateStart = moment('2013-01-07').isoWeek()%2;
    return {
        customPeriodDates : function(startdate,enddate) {
            var momentObj = {};
            momentDate = moment(date);
            // if (momentDate.isoWeek()%2 === dateStart) {
            //     momentDate.day()===0 ? momentDate.day(-7) : momentDate.startOf('week').day(1);
            // } else {
            //     momentDate.day()===0 ? momentDate.day(-13) : momentDate.startOf('week').day(-6);
            // }
            
            //momentObj['firstWeekStart'] = momentDate.format('YYYY-MM-DD');
            //momentObj['secondWeekStart'] = momentObj['firstWeekEnd'] = moment(momentDate).day(8).format('YYYY-MM-DD');
            //momentObj['secondWeekEnd']  = moment(momentDate).day(15).format('YYYY-MM-DD');
            momentObj['']
            console.log(momentObj);
            return momentObj;
        }
    };
})
.factory('payperiodFactory', function() {
    var dateStart = moment('2013-01-07').isoWeek()%2;
    return {
        periodDates : function(date) {
            var momentObj = {};
            momentDate = moment(date);
            if (momentDate.isoWeek()%2 === dateStart) {
                momentDate.day()===0 ? momentDate.day(-7) : momentDate.startOf('week').day(1);
            } else {
                momentDate.day()===0 ? momentDate.day(-13) : momentDate.startOf('week').day(-6);
            }
            momentObj['firstWeekStart'] = momentDate.format('YYYY-MM-DD');
            momentObj['secondWeekStart'] = momentObj['firstWeekEnd'] = moment(momentDate).day(8).format('YYYY-MM-DD');
            momentObj['secondWeekEnd']  = moment(momentDate).day(15).format('YYYY-MM-DD');
            return momentObj;
        }
    };
})
.factory('CurrentTime', function() {
    return {
        getCurrentTime: function () {
            var curTime = moment();
        return curTime;
        }
    };
})
.factory('totaltimeFactory', function() {
    return {
        getTotal : function(obj) {
            var total = 0;
            angular.forEach(obj, function(value, key) {
                if (value.totalTime !== null)
                    total += Number(value.totalTime);
            });
            return total;
        }
    };
})
.directive('myCurrentTime', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
      var format,  // date format
          timeoutId; // timeoutId, so that we can cancel the time updates

      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      // watch the expression, and update the UI on change.
      scope.$watch(attrs.myCurrentTime, function(value) {
        format = value;
        updateTime();
      });

      // schedule update in one second
      function updateLater() {
        // save the timeoutId for canceling
        timeoutId = $timeout(function() {
          updateTime(); // update DOM
          updateLater(); // schedule another update
        }, 1000);
      }

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time ofter the DOM element was removed.
      element.bind('$destroy', function() {
        $timeout.cancel(timeoutId);
      });

      updateLater(); // kick off the UI update process.
    };
  })
  .run(function(user) {
      //user.onAuthenticationRequired(function(route, stateParams) {
        // open login popup, do transition, ...
        //console.log(user.current);
        //alert("Sorry, you have to be logged in to access that page!");
    //});
	user.init({ appId: '53b1a6925f5fc' });

});
  
