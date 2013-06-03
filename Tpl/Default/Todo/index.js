//@require:backbone,chigiThis('TodoView/TodoApp'),chigiThis('TodoCollection/todos'),chigiThis('TodoView/TodoCommon')
// Initialize routing and start Backbone.history()
// 定义路由
var Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function(param) {
		console.log(param,"index.js");
		// Set the current filter to be used
		if (param) {
			chigiThis('TodoView/TodoCommon').TodoFilter = param.trim();
		} else {
			chigiThis('TodoView/TodoCommon').TodoFilter = '';
		};

		// Trigger a collection filter event, causing hiding/unhiding
		// of the Todo view items
		chigiThis('TodoCollection/todos').trigger('filter');
	}
});
//启动路由
new Workspace();
Backbone.history.start();

// Initialize the application view
new chigiThis('TodoView/TodoApp')();