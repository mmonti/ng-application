(function() {
  'use strict';

  angular
    .module('application')
    .constant('mobileView', 992)
    .constant('utils', {
      diff : function(from, to, property) {
        var that = this;
        if (!property || !angular.isArray(from) || !angular.isArray(to)) {
          return [];
        }
        return from.filter(function(item){
          var ids = that.flattern(to, property);
          return (ids.indexOf(item[property]) === -1);
        });
      },
      flattern : function(context, extract) {
        if (!context) {
          return [];
        }
        if (angular.isArray(context)) {
          var values = [];
          context.forEach(function(currentContext){
            var value = currentContext[extract];
            if (value) {
              values.push(value);
            }
          }, this);
          return values;
        }
        return context[extract];
      },
      override : function(context, struct) {
        if (angular.isArray(context)) {
          var contexts = [];
          context.forEach(function(currentContext){
            contexts.push(angular.extend(currentContext, struct));
          }, this);
          return contexts;
        }
        return this.override([contexts], struct)[0];
      },
      omit : function(context, omits) {
        if (angular.isArray(context)) {
          context.forEach(function(currentContext){
            return this.omit(currentContext, omits);
          }, this);
          return context;
        }
        if (angular.isArray(omits)) {
          omits.forEach(function(element) {
            return this.omit(context, element);
          }, this);
          return context;
        } else {
          if (omits.indexOf('.') < 0 ) {
            if (context.hasOwnProperty(omits)) {
              delete context[omits];
            }
          } else {
            var parts = omits.split('.')
            var currentProperty = parts.splice(0, 1);
            return this.omit(context[currentProperty], parts.length > 1 ? parts.join(".") : parts[0]);
          }
        }
        return context;
      }
    });
})();
