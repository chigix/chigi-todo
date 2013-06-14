//@require:backbone,chigiThis('TodoView/TodoApp'),chigiThis('TodoCollection/objTodos'),chigiThis('TodoView/objCommon'),CGA
// Initialize routing and start Backbone.history()
// 定义路由
var Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function(param) {
		// param → 当前路由名称，即null 或 active 或 completed
		if (param) {
			chigiThis('TodoView/objCommon').TodoFilter = param.trim();
		} else {
			chigiThis('TodoView/objCommon').TodoFilter = '';
		};
		// 为Todos Collection 触发filter事件，该事件绑定于TodoApp中
		chigiThis('TodoCollection/objTodos').trigger('filter');
	}
});
//启动路由
new Workspace();
Backbone.history.start();
// Initialize the application view
new chigiThis('TodoView/TodoApp')();