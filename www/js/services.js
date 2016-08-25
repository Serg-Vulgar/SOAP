angular.module('starter.services', [])


  .factory('appConfig', function ($rootScope) {
    function saveSettings() {
      var AppSettings = {
        URL: $rootScope.AppSettings.URL,
        username: $rootScope.AppSettings.username,
        password: $rootScope.AppSettings.password,
        sessionId: $rootScope.AppSettings.sessionId
      };
      localStorage.setItem('SOAP_settings', JSON.stringify(AppSettings));
    }

    return {
      saveSettings: saveSettings
    }

  })

;
