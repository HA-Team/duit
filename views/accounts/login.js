app.controller('login', function($scope){
  $scope.wrongUserOrPass = false;
  uiFunctions.buildTabs();
  $scope.loginWithPassword = () => {
    if ($scope.email && $scope.password) {
      Meteor.loginWithPassword($scope.email, $scope.password, (error) => {
        if (error) {
          $scope.wrongUserOrPass = true;
        } else {
          $scope.wrongUserOrPass = false;
          window.history.back();
        }
      })
    }
  };
  $scope.loginWithFacebook = () => {
    Meteor.loginWithFacebook({
      requestPermissions: ['public_profile', 'email']},
      function(err){
        if (err) {
          console.log('Handle errors here: ', err);
        } else {
          window.history.back();
        }
      }
    );
  }
  $scope.registerUser = () => {
    $scope.passNotMatch = false;
    $scope.formIncomplete = false;
    $scope.userExists = false;
    $scope.otherError = false;
    if ($scope.email && $scope.password && $scope.password2) {
      if ($scope.password === $scope.password2) {
        $scope.passNotMatch = false;
        $scope.formIncomplete = false;
        Accounts.createUser({email: $scope.email, password: $scope.password}, (error) => {
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