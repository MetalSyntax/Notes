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
              .when('/Add', {
                  templateUrl: 'html/add.html'
              })
               .when('/Edit', {
                   templateUrl: 'html/edit.html'
               })
              .when('/Help', {
                  templateUrl: 'html/help.html'
              })
              .when('/About', {
                  templateUrl: 'html/about.html'
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
        title: 'Welcome to Syntax Notes',
        message: 'This is a Web App Developing in Angular JS'
    }];
    //Guardar Notas
    localStorage.setItem('note', JSON.stringify($scope.NoteList));

     //Agregar una Nueva Nota
     $scope.add = function(title, message) {
        $scope.NoteList.push({
            title: title,
            message: message
         });
         $scope.title = "";
         $scope.message = "";
         localStorage.setItem('note', JSON.stringify($scope.NoteList));
     };

    //Editar una Nota
     $scope.edit = function (title, message) {
        //Obtiene los valores
        ArrayNote = localStorage.getItem('note');
        ArrayNote = JSON.parse(ArrayNote);
        //Inserta los valores
        $scope.title = ArrayNote[this.$index].title;
        $scope.message = ArrayNote[this.$index].message;
        //Borrado de datos
        index = $scope.NoteList.indexOf();
        $scope.NoteList.splice(this.$index, 1);
        //Actualizacion
    $scope.update = function (title, message) {
        //Agregar nuevo cambio
        $scope.NoteList.push({
            title: title,
            message: message
        });
        $scope.title = "";
        $scope.message = "";
        localStorage.setItem('note', JSON.stringify($scope.NoteList));
    };
    };

     //Borrar una Nota
     $scope.delete = function () {
        index = $scope.NoteList.indexOf();
        $scope.NoteList.splice(this.$index, 1);
        localStorage.setItem('note', JSON.stringify($scope.NoteList));
     };

     //Flow Text
     $scope.flow = localStorage.getItem('flow');
     // Agregar Remover Flow Text
     $scope.addRemoveFlowClass = function () {
         if ($scope.flow) {
             $scope.flow = "";
             localStorage.setItem('flow', $scope.flow);
         } else {
             $scope.flow = "flow-text";
             localStorage.setItem('flow', $scope.flow);
         }
     };

    //Colores
     $scope.color = localStorage.getItem('color');
    // Cambiar Colores
     $scope.addRemoveColorClass = function () {
         ArrayColor = ['light-blue lighten-3', ' red lighten-3', 'pink lighten-3', 'purple lighten-3', 'deep-purple lighten-3', 'indigo lighten-3', 'blue lighten-3', 'grey lighten-3', 'blue-grey lighten-3', 'cyan lighten-3', 'teal lighten-3', 'green lighten-3', 'light-green lighten-3', 'lime lighten-3', ' yellow lighten-3', ' amber lighten-3', 'orange lighten-3', 'deep-orange lighten-3'];
        RandomColor = Math.floor(Math.random() * ArrayColor.length);
         $scope.color = ArrayColor[RandomColor];
         localStorage.setItem('color', $scope.color);
     };

 }]);
 


