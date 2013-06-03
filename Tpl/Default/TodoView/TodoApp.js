//@require:backbone,jquery,underscore,chigiThis('TodoCollection/todos'),chigiThis('TodoView/TodosView'),chigiThis('TodoView/TodoCommon')
'use strict';

var AppView = Backbone.View.extend({

	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	el: '#chigiThis',

	// Compile our stats template
	template: _.template($('#chigiThis("TodoView/TodoStatsView")').html()),

	// Delegated events for creating new items, and clearing completed ones.
	events: {
		'keypress #new-todo': 'createOnEnter',
		'click #clear-completed': 'clearCompleted',
		'click #toggle-all': 'toggleAllComplete'
	},

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function() {
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(chigiThis('TodoCollection/todos'), 'add', this.addOne);
		this.listenTo(chigiThis('TodoCollection/todos'), 'reset', this.addAll);
		this.listenTo(chigiThis('TodoCollection/todos'), 'change:completed', this.filterOne);
		this.listenTo(chigiThis('TodoCollection/todos'), 'filter', this.filterAll);
		this.listenTo(chigiThis('TodoCollection/todos'), 'all', this.render);

		chigiThis('TodoCollection/todos').fetch();
	},

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render: function() {
		var completed = chigiThis('TodoCollection/todos').completed().length;
		var remaining = chigiThis('TodoCollection/todos').remaining().length;

		if (chigiThis('TodoCollection/todos').length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(_.template($('#chigiThis("TodoView/TodoStatsView")').html(), {
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (chigiThis('TodoView/TodoCommon').TodoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
	},

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(todo) {
		var view = new chigiThis('TodoView/TodosView')({
			model: todo
		});
		$('#todo-list').append(view.render().el);
	},

	// Add all items in the **Todos** collection at once.
	addAll: function() {
		this.$('#todo-list').html('');
		chigiThis('TodoCollection/todos').each(this.addOne, this);
	},

	filterOne: function(todo) {
		todo.trigger('visible');
	},

	filterAll: function() {
		chigiThis('TodoCollection/todos').each(this.filterOne, this);
	},

	// Generate the attributes for a new Todo item.
	newAttributes: function() {
		return {
			title: this.$input.val().trim(),
			order: chigiThis('TodoCollection/todos').nextOrder(),
			completed: false
		};
	},

	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
	createOnEnter: function(e) {
		if (e.which !== chigiThis('TodoView/TodoCommon').ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		chigiThis('TodoCollection/todos').create(this.newAttributes());
		this.$input.val('');
	},

	// Clear all completed todo items, destroying their models.
	clearCompleted: function() {
		_.invoke(chigiThis('TodoCollection/todos').completed(), 'destroy');
		return false;
	},

	toggleAllComplete: function() {
		var completed = this.allCheckbox.checked;

		chigiThis('TodoCollection/todos').each(function(todo) {
			todo.save({
				'completed': completed
			});
		});
	}
});

return AppView;