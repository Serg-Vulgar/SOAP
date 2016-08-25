angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $rootScope, $http, $state, appConfig, $ionicLoading, $ionicHistory) {

      //get localStorage
      if (localStorage.getItem('SOAP_settings')) {
        $rootScope.AppSettings = JSON.parse(localStorage.getItem('SOAP_settings'));
        console.log($rootScope.AppSettings);
      } else {
        $rootScope.AppSettings = {
          URL: '',
          username: '',
          password: '',
          sessionId: ''
        };
        $state.go('app.settings');
      }

      var protocol = 'http';
      $scope.protocol = false;
      var apiUrl = protocol + '://' + $rootScope.AppSettings.URL + '/?wsdl';

      $scope.changeProtocol = function () {
        $scope.protocol = !$scope.protocol;
        if ($scope.protocol) {
          protocol = 'https';
        } else {
          protocol = 'http';
        }
        apiUrl = protocol + '://' + $rootScope.AppSettings.URL + '/?wsdl';
      };

      $scope.saveSettings = function (form) {
        if (form.$valid) {
          appConfig.saveSettings();
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.main');
          $scope.update();
        } else {
          $scope.showError = true;
        }
      };

      $scope.update = function () {
        $ionicLoading.show();
        getStatistics();
      };

      // var userData = {
      //   username: 'iosuser',
      //   apiKey: '123123123123TEST'
      // };
      // ti.buycheapink.org/api/


      function getStatistics() {
        $.soap({
          url: apiUrl,
          method: "call",
          data: {
            sessionId: $rootScope.AppSettings.sessionId,
            resourcePath: "orderstat.statistics"
          },
          success: function (response) {
            var statistics = JSON.parse(JSON.stringify(response));
            if (statistics.Body.Fault) {
              console.log('Error statistics request');
              getSessionId();
            } else {
              console.log('Statistics obtained');
              var statistics = JSON.parse(JSON.stringify(response));
              statistics = statistics.Body.callResponse.callReturn.item;
              $scope.$apply(function () {
                setStatisticsVar(statistics);
              });

            }
          },
          error: function () {
            $ionicLoading.hide();
            alert('Statistic url error');
          }
        })
      }


      function getSessionId() {
        $.soap({
          url: apiUrl,
          method: 'login',
          data: {
            username: $rootScope.AppSettings.username,
            apiKey: $rootScope.AppSettings.password
          },
          success: function (response) {
            var loginResponse = response.toJSON();
            $rootScope.AppSettings.sessionId = loginResponse.Body.loginResponse.loginReturn.toString();
            appConfig.saveSettings();
            getStatistics();
          }
          ,
          error: function () {
            $ionicLoading.hide();
            alert('Cannot login');
          }
        })
        ;
      }


      function setStatisticsVar(statistics) {
        statistics.forEach(function (item) {
          var key = item.key.toString();
          switch (key) {
            case "updated_at":
              $scope.updated_at = item.value;
              break;
            case "store_timezone":
              $scope.store_timezone = item.value;
              break;
            case "this_year_number":
              $scope.this_year_number = item.value;
              break;
            case "previous_year_number":
              $scope.previous_year_number = item.value;
              break;
            case "year_ago_this_day":
              $scope.year_ago_this_day = item.value;
              break;
            case "year_ago_this_month":
              $scope.year_ago_this_month = item.value;
              break;
            case "year_ago_whole_year":
              $scope.year_ago_whole_year = item.value;
              break;
            case "this_day":
              $scope.this_day = item.value;
              break;
            case "this_month":
              $scope.this_month = item.value;
              break;
            case "this_year":
              $scope.this_year = item.value;
              break;
          }
        });
        $scope.updated = true;
        $scope.updateDate = Date.now();
        $ionicLoading.hide();
      }
    }
  )

;

