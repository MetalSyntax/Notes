 /*Materialize CSS*/
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

 /*Angular*/
 var AppNotes = angular.module('AppNote', ['ngRoute']);
 /*Titulo*/
 AppNotes.controller('Titulo', ["$scope", function ($scope) {
     $scope.title = "Notes";
 }]);
 /*Usuario y Correo*/
 AppNotes.controller('Usuario', ["$scope", function ($scope) {
     $scope.user = "MetalSyntax";
     $scope.email = "metalsyntax@gmail.com";
 }]);
 /*Obtencion de Datos
 AppNotes.controller('NotasDemo', ['$scope', '$http', function ($scope, $http) {
     $http({
         method: 'GET',
         url: 'js/notes.json'
     }).then(function (Notes) {
         $scope.ItemNotes = Notes.data;
     }).then(function (error) {
         //console.log(error);
     });
 }]);*/
 /*Crear Notas*/
 AppNotes.controller('NewNotes', ['$scope', function ($scope) {
    //Notas de Prueba
    $scope.NoteList = [{
             title: 'Do nothing',
             message: 'Lorem'
         },
         {
             title: 'Show some tasks',
             message: 'Lorem'
         },
         {
             title: 'Add a task',
             message: 'Lorem'
         },
         {
             title: 'Walk the dog',
             message: 'Lorem'
         }, {
             title: 'New a task',
             message: 'Lorem'
         }, {
             title: 'Eat Hotdog',
             message: 'Lorem'
         }
     ];
     //Agregar una Nueva Nota
     $scope.add = function (title,message) {
       $scope.NoteList.push({
        title: title,
        message: message
       });
     };
     //Borrar una Nota
     $scope.delete = function () {
        $scope.NoteList.splice(this.$index, 1);
     };
 }]);