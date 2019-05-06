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

  //Rutas
  AppNotes.config(['$routeProvider',
      function ($routeProvider) {
          $routeProvider
              .when('/', {
                  templateUrl: 'html/main.html'
              })
              .when('/Terms', {
                  templateUrl: 'html/terms.html'
              })
              .when('/Settings', {
                  templateUrl: 'html/setting.html'
              })
              .when('/Form', {
                  templateUrl: 'html/form.html'
              })
              .otherwise({
                  redirectTo: '/'
              })
      }
  ]);

 /*Titulo*/
AppNotes.controller('Titulo', ["$scope", function ($scope) {
     $scope.title = "Notes";
    }]);

 /*Usuario y Correo*/
 AppNotes.controller('Usuario', ["$scope", function ($scope) {
     $scope.user = "Admin";
     $scope.email = "Admin@gmail.com";
 }]);

 /*Crear Notas*/
 AppNotes.controller('NewNotes', ['$scope', function ($scope) {
    
    //Obtener Notas
    $scope.saved = localStorage.getItem('note');
    //Notas
    $scope.NoteList = (localStorage.getItem('note') !== null) ? JSON.parse($scope.saved) : [{
        title: 'Welcome to Notes',
        message: 'This is a Web App Developing in Angular JS'
    }];
    //Guardar Notas
    localStorage.setItem('note', JSON.stringify($scope.NoteList));

     //Agregar una Nueva Nota
     $scope.add = function(title, message) {
        $scope.NoteList.push({
            title: title,
            message: message,
         });
         $scope.title = "";
         $scope.message = "";
         localStorage.setItem('note', JSON.stringify($scope.NoteList));
     };

     //Editar una Nota
     $scope.edit = function (title, message) {
         
     }
 
     //Borrar una Nota
     $scope.delete = function () {
        index = $scope.NoteList.indexOf();
        $scope.NoteList.splice(this.$index, 1);
        localStorage.setItem('note', JSON.stringify($scope.NoteList));
     };

     //Flow Text
     $scope.flow = "";
     // Agregar Remover Flow Text
     $scope.addRemoveFlowClass = function () {
         if ($scope.flow) {
             $scope.flow = "";
         } else {
             $scope.flow = "flow-text";
         }
     };

    //Colores
     $scope.color = "grey lighten-5";
    // Cambiar Colores
     $scope.addRemoveColorClass = function () {
         ArrayColor = ['blue', 'red', 'yellow', 'green', 'cyan', 'indigo' , 'teal' ,'grey lighten-5'];
        RandomColor = Math.floor(Math.random() * ArrayColor.length);
         $scope.color = ArrayColor[RandomColor]
     };

 }]);
 


