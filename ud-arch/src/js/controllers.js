angular.module('base.controllers', ['base.services'])

.controller('DashCtrl', function($scope, User) {
  $scope.student = User.get();
})
