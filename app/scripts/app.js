'use strict';

angular.module('SubsFormat', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
      $locationProvider.html5Mode(true);
    })
    .controller('MainCtrl', function ($scope, $log) {

      $scope.convert = function () {

        var src = $scope.src.split('\n')
        var result = ""
        var saving = false;
        var lastTime = 0;
//        var currentTime = 0;
        var makeBreak = false;
        var pattern = /([\d:]+),[\d]+ --> ([\d:]+),[\d]+/;
        for (var i = 0; i < src.length; i++) {
          if (src[i] == "9999") break;
          if (saving) {
            if (src[i].trim().length == 0) {
              saving = false;
            } else {
              if (makeBreak) {
                result += "\r\n";
                makeBreak = false;
              }
//              if (src[i+1].match(/^\/t\/1/)){
//                $log.info("yep");
//              }
              result += src[i].trim() + "\r\n";
            }
          }
          if (pattern.test(src[i])) {
            makeBreak = false;
            var startTime = parseInt(src[i].match(pattern)[1].split(':').join(''));
//            var endTime = parseInt(src[i].match(pattern)[1].split(':').join(''));
            if (lastTime !== 0 && (startTime - lastTime) > 5) makeBreak = true;
//            $log.info(currentTime);
            lastTime = startTime;
            saving = true;
          }
        }
        $scope.res = result;
      }
    });
