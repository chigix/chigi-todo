//@require:underscore,backbone,chigiThis('TodoModel/ClsTodo'),localstorage
'use strict';

var TodosCollection = Backbone.Collection.extend({
	// Reference to this collection's model.
	model: chigiThis('TodoModel/ClsTodo'),

	// url: '{:redirect_link("Ajax/todo")}',
	//url: '{:rest_link("Ajax/todo")}',

	// Save all of the todo items under the `"todos"` namespace.
	localStorage: new Localstorage('todos-backbone'),

	// Filter down the list of all todo items that are finished.
	completed: function() {
		return this.filter(function(chigiThis('TodoModel/ClsTodo')) {
			return chigiThis('TodoModel/ClsTodo').get('completed');
		});
	},

	// Filter down the list to only todo items that are still not finished.
	remaining: function() {
		return this.without.apply(this, this.completed());
	},

	// We keep the Todos in sequential order, despite being saved by unordered
	// GUID in the database. This generates the next order number for new items.
	nextOrder: function() {
		if (!this.length) {
			return 1;
		}
		return this.last().get('order') + 1;
	},

	// Todos are sorted by their original insertion order.
	comparator: function(ClsTodo) {
		return ClsTodo.get('order');
	}
});

return new TodosCollection();