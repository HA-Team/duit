app.controller('login', function($scope){
  $scope.wrongUserOrPass = false;
  uiFunctions.buildTabs();
  $scope.loginWithPassword = () => {
    if ($scope.username && $scope.password) {
      Meteor.loginWithPassword($scope.username, $scope.password, (error) => {
        if (error) {
          $scope.wrongUserOrPass = true;
        } else {
          $scope.wrongUserOrPass = false;
          window.history.back();
        }
      })
    }
  }
  $scope.registerUser = () => {
    $scope.passNotMatch = false;
    $scope.formIncomplete = false;
    $scope.userExists = false;
    $scope.otherError = false;
    if ($scope.username && $scope.email && $scope.password && $scope.password2) {
      if ($scope.password === $scope.password2) {
        $scope.passNotMatch = false;
        $scope.formIncomplete = false;
        Accounts.createUser({username: $scope.username, email: $scope.email, password: $scope.password}, (error) => {
          if (error && error.reason === "Username already exists.") {
            $scope.userExists = true;
          } else if (error) {
            $scope.otherError = true;
          } else {
            $scope.userExists = false;
            $scope.otherError = false;
            window.history.back();
          }
        })
      } else {
        $scope.passNotMatch = true;
      }
    } else {
      $scope.formIncomplete = true;
    }
  }

})