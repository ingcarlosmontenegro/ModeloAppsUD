angular.module('grades.controllers', ['base.services'])

.controller('GradesCtrl', function($scope, Grades) {
  $scope.grades = Grades.query();

  $scope.toggleAccordionItem = function(e) {
    const collapsedClassName = 'course--collapsed';
    const element = e.currentTarget.parentNode;
    element.classList.toggle(collapsedClassName);
  }
})
