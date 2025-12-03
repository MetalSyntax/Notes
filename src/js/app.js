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
      .when("/View/:index", {
        templateUrl: "src/views/view.html",
        controller: "ViewNoteController"
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

/*Directive for Checklist*/
AppNotes.directive('checklistListener', function() {
    return {
        restrict: 'A',
        scope: {
            note: '='
        },
        link: function(scope, element, attrs) {
            element.on('click', function(e) {
                var target = e.target;
                var li = target.closest('li[data-list="checked"]');
                if (li) {
                    var allLis = element[0].querySelectorAll('li[data-list="checked"]');
                    var index = Array.prototype.indexOf.call(allLis, li);
                    
                    if (index !== -1) {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(scope.note.message, 'text/html');
                        var docLis = doc.querySelectorAll('li[data-list="checked"]');
                        
                        if (docLis[index]) {
                            var docLi = docLis[index];
                            if (docLi.classList.contains('ql-checked')) {
                                docLi.classList.remove('ql-checked');
                                docLi.setAttribute('aria-checked', 'false');
                            } else {
                                docLi.classList.add('ql-checked');
                                docLi.setAttribute('aria-checked', 'true');
                            }
                            
                            scope.note.message = doc.body.innerHTML;
                            scope.$apply();
                            scope.$emit('noteUpdated', scope.note);
                        }
                    }
                }
            });
        }
    };
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

    $scope.exportNotes = function() {
        var notes = localStorage.getItem("note");
        if (!notes) {
            M.toast({html: 'No hay notas para exportar', classes: 'rounded'});
            return;
        }
        var blob = new Blob([notes], {type: "application/json"});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "notes_backup_" + new Date().toISOString().slice(0,10) + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    $scope.importNotes = function(element) {
        var file = element.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var notes = JSON.parse(e.target.result);
                if (Array.isArray(notes)) {
                    // Simple import: replace or merge logic could be refined
                    var currentNotes = JSON.parse(localStorage.getItem("note") || "[]");
                    var mergedNotes = currentNotes.concat(notes);
                    // Remove duplicates based on creationDate if needed, but for now just merge
                    localStorage.setItem("note", JSON.stringify(mergedNotes));
                    
                    M.toast({html: 'Notas importadas correctamente', classes: 'rounded'});
                    $scope.$apply(function() {
                        // Refresh logic if needed
                    });
                } else {
                    M.toast({html: 'El archivo no tiene un formato válido', classes: 'rounded red'});
                }
            } catch (error) {
                console.error(error);
                M.toast({html: 'Error al leer el archivo', classes: 'rounded red'});
            }
        };
        reader.readAsText(file);
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

/*View Note Controller*/
AppNotes.controller("ViewNoteController", [
  "$scope",
  "$routeParams",
  "$location",
  function ($scope, $routeParams, $location) {
    var index = $routeParams.index;
    // Access parent scope NoteList directly if possible, or read from localStorage
    // Since we are in ng-view, we inherit from NewNotes scope (body).
    // So $scope.NoteList should be available.
    
    if ($scope.NoteList && $scope.NoteList[index]) {
        $scope.note = $scope.NoteList[index];
        $scope.index = index;
    } else {
        // Fallback if refresh happens and parent scope not ready?
        // Actually NewNotes runs on body, so it should be ready.
        // But if NoteList is empty?
        var notes = JSON.parse(localStorage.getItem("note"));
        if (notes && notes[index]) {
            $scope.note = notes[index];
            $scope.index = index;
        } else {
            $location.path('/');
        }
    }

    $scope.editNote = function() {
        // Set parent scope variables for EditNoteController
        $scope.$parent.title = $scope.note.title;
        $scope.$parent.message = $scope.note.message;
        // We also need to set the index for save/update
        // EditNoteController doesn't seem to use index from scope, but NewNotes.edit does.
        // NewNotes.edit uses 'this.$index'.
        // We need to simulate that or change how edit works.
        
        // Actually NewNotes.edit is:
        // $scope.edit = function (title, message) { ... var currentNote = ArrayNote[this.$index]; ... }
        // It relies on ng-repeat scope.
        
        // We can't easily use that function from here.
        // We should refactor EditNoteController to take index or note.
        // But to minimize changes, let's just navigate to Edit and handle loading there.
        
        // But EditNoteController expects $scope.message to be set.
        // We set it above.
        
        // However, we need to know WHICH note we are editing when saving.
        // The update function in NewNotes is defined INSIDE edit function!
        // This is bad design.
        
        // Let's refactor NewNotes.edit slightly or just handle it here.
        // If we change $scope.update in NewNotes to take an index.
        
        // Let's set a global or parent scope variable for 'currentEditIndex'.
        $scope.$parent.currentEditIndex = index;
        $location.path('/Edit');
    };
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
  "$routeParams",
  function ($scope, $timeout, $routeParams) {
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
    
    // Override update function to use currentEditIndex if available
    var originalUpdate = $scope.update;
    $scope.update = function(title, message) {
        if(window.quill) {
            message = window.quill.root.innerHTML;
        }
        
        if (typeof $scope.currentEditIndex !== 'undefined') {
             var creationDate = $scope.NoteList[$scope.currentEditIndex].creationDate;
             $scope.NoteList[$scope.currentEditIndex] = {
                  title: title,
                  message: message,
                  creationDate: creationDate,
                  editedDate: new Date()
             };
             $scope.title = "";
             $scope.message = "";
             localStorage.setItem("note", JSON.stringify($scope.NoteList));
             delete $scope.currentEditIndex;
             window.history.back();
        } else {
            // Fallback to original logic if called from list view (not implemented there for edit)
            // But wait, the original logic was inside $scope.edit which was called from ng-repeat.
            // If we are here, we are in Edit view.
            // We need to know the index.
            // If currentEditIndex is undefined, we have a problem.
            console.error("No index to update");
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
    
    $scope.$on('noteUpdated', function(event, note) {
        localStorage.setItem("note", JSON.stringify($scope.NoteList));
    });

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
