//@require:backbone,chigiThis('Todo/TodoApp'),chigiThis('Todo/TodoRouter')
/*jshint nonew:false*/
// Initialize routing and start Backbone.history()
new chigiThis('Todo/TodoRouter')();
Backbone.history.start();

// Initialize the application view
new chigiThis('Todo/TodoApp')();