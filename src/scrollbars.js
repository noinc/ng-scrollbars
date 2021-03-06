/**
 * ng-scrollbars 0.0.11
 */
(function () {
  'use strict';

  function ScrollBarsProvider() {
    this.defaults = {
      scrollButtons: {
        enable: true //enable scrolling buttons by default
      },
      axis: 'yx' //enable 2 axis scrollbars by default
    };

    // TODO: can we do this without jquery?
    $.mCustomScrollbar.defaults.scrollButtons = this.defaults.scrollButtons;
    $.mCustomScrollbar.defaults.axis = this.defaults.axis;

    this.$get = function ScrollBarsProvider() {
      return {
        defaults: this.defaults
      }
    }
  }

  function render(defaults, configuredDefaults, elem, scope) {
    elem.mCustomScrollbar('destroy');

    var config = {};
    if (scope.ngScrollbarsConfig) {
      config = scope.ngScrollbarsConfig;
    }

    // apply configured provider defaults only if the scope's config isn't defined (it has priority in that case)
    for (var setting in defaults) {
      if (defaults.hasOwnProperty(setting)) {

        switch (setting) {

          case 'scrollButtons':
            if (!config.hasOwnProperty(setting)) {
              configuredDefaults.scrollButtons = defaults[setting];
            }
            break;

          case 'axis':
            if (!config.hasOwnProperty(setting)) {
              configuredDefaults.axis = defaults[setting];
            }
            break;

          default:
            if (!config.hasOwnProperty(setting)) {
              config[setting] = defaults[setting];
            }
            break;

        }
      }
    }

    elem.mCustomScrollbar(config);
  }
  
	function getDynamicHeight(minHeight, offset, window){
		return window.innerHeight < minHeight ? minHeight: window.innerHeight - offset;
	}	
	

  function ScrollBarsDirective(ScrollBars, $window) {
    return {
      scope: {
        ngScrollbarsConfig: '=?',
        ngScrollbarsUpdate: '=?',
        ngScrollTo: '=?',
        ngScrollbarsMinHeight: '=?',
        ngScrollbarsMinHeightOffset: '=?',
        ngScrollbarsPosition: '=?',
        element: '=?'        
      },
      link: function (scope, elem, attrs) {

        scope.elem = elem;

        var defaults = ScrollBars.defaults;
        var configuredDefaults = $.mCustomScrollbar.defaults;
                
        if(scope.ngScrollbarsMinHeight){
        	configuredDefaults.setHeight = getDynamicHeight(scope.ngScrollbarsMinHeight, scope.ngScrollbarsMinHeightOffset, $window);
   
        }
   
        
        if(scope.ngScrollbarsPosition){
        	configuredDefaults.scrollbarPosition = scope.ngScrollbarsPosition;
       
        }
        
        scope.ngScrollbarsUpdate = function () {
          elem.mCustomScrollbar.apply(elem, arguments);
        };

        scope.$watch('ngScrollbarsConfig', function (newVal, oldVal) {
          if (newVal !== undefined) {
            render(defaults, configuredDefaults, elem, scope);
          }
        });
        
        scope.$watch('ngScrollTo', function (newVal, oldVal) {
            if (newVal !== undefined) {
              elem.mCustomScrollbar('scrollTo', newVal);
              scope.ngScrollTo = undefined;
            }
          });

        render(defaults, configuredDefaults, elem, scope);
      }
    };
  }

  angular.module('ngScrollbars', [])
    .provider('ScrollBars', ScrollBarsProvider)
    .directive('ngScrollbars', ScrollBarsDirective);

  ScrollBarsProvider.$inject = [];
  ScrollBarsDirective.$inject = ['ScrollBars', '$window'];

})();
