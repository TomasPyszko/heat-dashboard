(function() {
    'use strict';

    angular.module('horizon.dashboard.project.heat_dashboard.template_generator')
      .controller('horizon.dashboard.project.heat_dashboard.template_generator.DraftModalCtrl', ['$scope',
        '$mdDialog', 'hotgenNotify', 'hotgenMessage', 'hotgenStates',
        'horizon.dashboard.project.heat_dashboard.template_generator.basePath',
         function($scope, $mdDialog, hotgenNotify, hotgenMessage, hotgenStates, basePath){
            $scope.showDialog = function(){
                $mdDialog.show({
                  controller: DraftDialogController,
                  templateUrl: basePath + 'templates/modal_draft.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose:true
                }).then(function(){
                    hotgenNotify.show_success('The draft is loaded successfully.');
                }, function(){
//                    hotgenNotify.show_error('dismiss a modal');
                });
                DraftDialogController.$inject = ['$scope', '$mdDialog', 'hotgenStates'];
                function DraftDialogController($scope, $mdDialog, hotgenStates) {
                    $scope.draft_list = [];
                    $scope.latest_draft = JSON.parse(localStorage.getItem('draft_'+localStorage.saved_counter));
                    for (var i = 0 ; i < 10; i++){
                        if (localStorage.getItem('draft_'+i)){
                            var saved_drafts = JSON.parse(localStorage.getItem('draft_'+i));
                            $scope.draft_list.push(saved_drafts);
                        }
                    }
                    $scope.data = {
                        nodes: hotgenStates.get_nodes(),
                        edges: hotgenStates.get_edges(),
                    }
                    $scope.load = function(draft) {
                        $mdDialog.hide();
                        $scope.data.nodes.clear();
                        for (var id in draft.nodes){
                            $scope.data.nodes.add(draft.nodes[id]);
                        }
                        $scope.data.edges.clear();
                        for (var id in draft.edges){
                            $scope.data.edges.add(draft.edges[id]);
                        }
                        hotgenStates.set_saved_resources(draft.saved_resources);
                        hotgenStates.set_saved_dependsons(draft.saved_depends_ons);
                        hotgenStates.set_saved_flags(draft.is_saved);
                        hotgenStates.set_counters(draft.counter);
                        hotgenStates.set_incremented_labels(draft.incremented_labels);

                    };
                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };
                }
            }
            $scope.$on('handle_load_draft', function(event, args){
                $scope.showDialog();
            });

         }]);
})();