 document.addEventListener('DOMContentLoaded', function () {
     var elems = document.querySelectorAll('.sidenav');
     var instances = M.Sidenav.init(elems);
 });
 document.addEventListener('DOMContentLoaded', function () {
     var elems = document.querySelectorAll('.modal');
     var instances = M.Modal.init(elems);
 });
 document.addEventListener('DOMContentLoaded', function () {
     var elems = document.querySelectorAll('.fixed-action-btn');
     var instances = M.FloatingActionButton.init(elems, {
         direction: 'up',
         hoverEnabled: false
     });
 });

 var AppNotes = angular.module('AppNote', ['ngRoute']);

 AppNotes.controller('Titulo', ["$scope", function ($scope) {
     $scope.title = "Notes";
 }]);
 /*Filtros*/
 AppNotes.controller('filtroNotas', ['$scope', '$http', function ($scope, $http) {
     $http({method: 'GET',url: 'js/notes.json'
     }).then(function (Notes) {
        $scope.ItemNotes = Notes.data;
     }).then(function (error) {
         //console.log(error);
     });
 }]);