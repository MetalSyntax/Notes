/*Materialize CSS*/
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);

  // Close sidenav on link click
  var links = document.querySelectorAll(".sidenav a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var elem = document.querySelector(".sidenav");
      var instance = M.Sidenav.getInstance(elem);
      if (instance.isOpen) {
        instance.close();
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
});
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".fixed-action-btn");
  var instances = M.FloatingActionButton.init(elems, {
    direction: "up",
    hoverEnabled: false,
  });
});

/*Angular*/
var AppNotes = angular.module("AppNote", ["ngRoute"]);

AppNotes.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsHtml(url);
    };
}]);

//Rutas
AppNotes.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "src/views/main.html",
      })
      .when("/Terms", {
        templateUrl: "src/views/terms.html",
      })
      .when("/Settings", {
        templateUrl: "src/views/setting.html",
      })
      .when("/Add", {
        templateUrl: "src/views/add.html",
        controller: "AddNoteController"
      })
      .when("/Edit", {
        templateUrl: "src/views/edit.html",
        controller: "EditNoteController"
      })
      .when("/Help", {
        templateUrl: "src/views/help.html",
        controller: "HelpController"
      })
      .when("/About", {
        templateUrl: "src/views/about.html",
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]).run(function() {
    if(localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

/*Titulo*/
AppNotes.controller("Titulo", [
  "$scope",
  function ($scope) {
    $scope.title = "Notes";
  },
]);

/*Usuario y Correo*/
AppNotes.controller("Usuario", [
  "$scope",
  function ($scope) {
    $scope.user = localStorage.getItem('userName') || "Admin";
    $scope.email = localStorage.getItem('userEmail') || "Admin@gmail.com";
  },
]);

/*Ajustes*/
AppNotes.controller("SettingsController", [
  "$scope",
  "$window",
  function ($scope, $window) {
    $scope.userName = localStorage.getItem('userName') || "Admin";
    $scope.userEmail = localStorage.getItem('userEmail') || "Admin@gmail.com";
    $scope.darkMode = localStorage.getItem('darkMode') === 'true';

    $scope.toggleDarkMode = function() {
        if($scope.darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    };

    $scope.saveSettings = function() {
        localStorage.setItem('userName', $scope.userName);
        localStorage.setItem('userEmail', $scope.userEmail);
        M.toast({html: 'Ajustes guardados', classes: 'rounded'});
    };

    $scope.deleteAllNotes = function() {
        if(confirm("¿Estás seguro de que quieres borrar todas las notas? Esta acción no se puede deshacer.")) {
            localStorage.removeItem('note');
            M.toast({html: 'Todas las notas han sido eliminadas', classes: 'rounded'});
            setTimeout(function(){
                 $window.location.href = '#!/';
                 $window.location.reload();
            }, 1000);
        }
    };
  }
]);

/*Ayuda*/
AppNotes.controller("HelpController", [
  "$scope",
  function ($scope) {
    setTimeout(function() {
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems);
    }, 100);
  }
]);

/*Add Note Controller*/
AppNotes.controller("AddNoteController", [
  "$scope",
  "$timeout",
  function ($scope, $timeout) {
    // Init Quill
    $timeout(function() {
        var container = document.getElementById('editor-container');
        if(container) {
            container.innerHTML = ''; // Clear previous content
            window.quill = new Quill('#editor-container', {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'checked' }]
                    ]
                },
                placeholder: 'Escribe tu nota aquí...',
                theme: 'snow'
            });
            
            window.quill.on('text-change', function() {
                $scope.message = window.quill.root.innerHTML;
                if(!$scope.$$phase) $scope.$apply();
            });
        }
    }, 100);

    $scope.addCheckbox = function() {
        if(window.quill) {
            var range = window.quill.getSelection(true);
            if(range) {
                window.quill.insertText(range.index, 'Tarea', 'user');
                window.quill.setSelection(range.index + 5);
                window.quill.formatLine(range.index, 1, 'list', 'checked');
            } else {
                var length = window.quill.getLength();
                window.quill.insertText(length - 1, 'Tarea', 'user');
                window.quill.formatLine(length - 1, 1, 'list', 'checked');
            }
        }
    };
  }
]);

/*Edit Note Controller*/
AppNotes.controller("EditNoteController", [
  "$scope",
  "$timeout",
  function ($scope, $timeout) {
    // Init Quill
    $timeout(function() {
        var container = document.getElementById('editor-container');
        if(container) {
            container.innerHTML = ''; // Clear previous content
            window.quill = new Quill('#editor-container', {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'checked' }]
                    ]
                },
                placeholder: 'Escribe tu nota aquí...',
                theme: 'snow'
            });
            
            // Set content from parent scope
            if($scope.message) {
                 if($scope.message.indexOf('<') > -1) {
                     window.quill.clipboard.dangerouslyPasteHTML($scope.message);
                 } else {
                     window.quill.setText($scope.message);
                 }
            }
            
            window.quill.on('text-change', function() {
                $scope.message = window.quill.root.innerHTML;
                if(!$scope.$$phase) $scope.$apply();
            });
        }
    }, 100);

    $scope.addCheckbox = function() {
        if(window.quill) {
            var range = window.quill.getSelection(true);
            if(range) {
                window.quill.insertText(range.index, 'Tarea', 'user');
                window.quill.setSelection(range.index + 5);
                window.quill.formatLine(range.index, 1, 'list', 'checked');
            } else {
                var length = window.quill.getLength();
                window.quill.insertText(length - 1, 'Tarea', 'user');
                window.quill.formatLine(length - 1, 1, 'list', 'checked');
            }
        }
    };
  }
]);

/*Crear Notas*/
AppNotes.controller("NewNotes", [
  "$scope",
  function ($scope) {
    //Obtener Notas
    $scope.saved = localStorage.getItem("note");
    //Notas
    $scope.NoteList =
      localStorage.getItem("note") !== null
        ? JSON.parse($scope.saved)
        : [
            {
              title: "Welcome to Syntax Notes",
              message: "This is a Web App Developing in Angular JS",
              creationDate: new Date(),
              editedDate: new Date(),
            },
          ];
    
    // Ordenamiento
    $scope.sortType = 'creationDate'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    //Guardar Notas
    localStorage.setItem("note", JSON.stringify($scope.NoteList));

    //Agregar una Nueva Nota
    $scope.add = function (title, message) {
      // Get content from Quill if available
      if(window.quill) {
          message = window.quill.root.innerHTML;
      }
      
      $scope.NoteList.push({
        title: title,
        message: message,
        creationDate: new Date(),
        editedDate: new Date(),
      });
      $scope.title = "";
      $scope.message = "";
      localStorage.setItem("note", JSON.stringify($scope.NoteList));
    };

    $scope.addCheckbox = function() {
        if(window.quill) {
            var range = window.quill.getSelection(true);
            window.quill.insertText(range.index, 'Tarea', 'user');
            window.quill.setSelection(range.index + 5);
            window.quill.formatLine(range.index, 1, 'list', 'checked');
        }
    };
    
    // Init Quill logic removed from here as it is now in AddNoteController

    //Editar una Nota
    $scope.edit = function (title, message) {
      //Obtiene los valores
      ArrayNote = localStorage.getItem("note");
      ArrayNote = JSON.parse(ArrayNote);
      
      var currentNote = ArrayNote[this.$index];
      var creationDate = currentNote.creationDate || new Date();

      //Inserta los valores
      $scope.title = currentNote.title;
      $scope.message = currentNote.message;
      
      // Init Quill logic removed from here as it is now in EditNoteController

      //Borrado de datos
      index = $scope.NoteList.indexOf();
      $scope.NoteList.splice(this.$index, 1);
      //Actualizacion
      $scope.update = function (title, message) {
        // Get content from Quill
        if(window.quill) {
            message = window.quill.root.innerHTML;
        }
          
        //Agregar nuevo cambio
        $scope.NoteList.push({
          title: title,
          message: message,
          creationDate: creationDate,
          editedDate: new Date(),
        });
        $scope.title = "";
        $scope.message = "";
        localStorage.setItem("note", JSON.stringify($scope.NoteList));
      };
    };

    //Borrar una Nota
    $scope.delete = function () {
      index = $scope.NoteList.indexOf();
      $scope.NoteList.splice(this.$index, 1);
      localStorage.setItem("note", JSON.stringify($scope.NoteList));
    };

    //Flow Text
    // $scope.flow = localStorage.getItem("flow");
    // Agregar Remover Flow Text
    $scope.addRemoveFlowClass = function (note) {
      if (note.isLargeText) {
        note.isLargeText = false;
      } else {
        note.isLargeText = true;
      }
      localStorage.setItem("note", JSON.stringify($scope.NoteList));
    };

    //Colores
    //$scope.color = localStorage.getItem('color');
    // Cambiar Colores
    $scope.addRemoveColorClass = function (note) {
      ArrayColor = [
        "light-blue lighten-3",
        "red lighten-3",
        "pink lighten-3",
        "purple lighten-3",
        "deep-purple lighten-3",
        "indigo lighten-3",
        "blue lighten-3",
        "grey lighten-3",
        "blue-grey lighten-3",
        "cyan lighten-3",
        "teal lighten-3",
        "green lighten-3",
        "light-green lighten-3",
        "lime lighten-3",
        "yellow lighten-3",
        "amber lighten-3",
        "orange lighten-3",
        "deep-orange lighten-3",
      ];
      RandomColor = Math.floor(Math.random() * ArrayColor.length);
      note.color = ArrayColor[RandomColor];
      localStorage.setItem("note", JSON.stringify($scope.NoteList));
    };
  },
]);
