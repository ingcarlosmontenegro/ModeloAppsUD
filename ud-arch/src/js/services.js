angular.module('base.services', [])

.factory('User', function($resource) {
  return $resource(`http://localhost:3001/user/`);
})

.factory('Grades', function($resource) {
  return $resource(`http://localhost:3001/grades`);
});
