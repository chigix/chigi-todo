//@require:jquery,backbone,chigiThis('TodoCollection/todos'),chigiThis('Todo/TodoCommon')
'use strict';

var Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function(param) {
		// Set the current filter to be used
		//chigiThis('Todo/TodoCommon').TodoFilter = param.trim() || '';
		if (param) {
			chigiThis('Todo/TodoCommon').TodoFilter = param.trim();
		}else{
			chigiThis('Todo/TodoCommon').TodoFilter = '';
		};

		// Trigger a collection filter event, causing hiding/unhiding
		// of the Todo view items
		chigiThis('TodoCollection/todos').trigger('filter');
	}
});

return Workspace;