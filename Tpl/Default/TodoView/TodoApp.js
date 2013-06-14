//@require:backbone,jquery,underscore,chigiThis('TodoCollection/objTodos'),chigiThis('TodoView/TodoView'),chigiThis('TodoView/objCommon')
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

		this.listenTo(chigiThis('TodoCollection/objTodos'), 'add', this.addOne);
		this.listenTo(chigiThis('TodoCollection/objTodos'), 'reset', this.addAll);
		this.listenTo(chigiThis('TodoCollection/objTodos'), 'change:completed', this.filterOne);
		this.listenTo(chigiThis('TodoCollection/objTodos'), 'filter', this.filterAll);
		this.listenTo(chigiThis('TodoCollection/objTodos'), 'all', this.render);

		// 当前页面第一次获取初始数据
		chigiThis('TodoCollection/objTodos').fetch({
			error: function() {
				alert("ERROR");
			}
		});
	},

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render: function() {
		var completed = chigiThis('TodoCollection/objTodos').completed().length;
		var remaining = chigiThis('TodoCollection/objTodos').remaining().length;

		if (chigiThis('TodoCollection/objTodos').length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(_.template($('#chigiThis("TodoView/TodoStatsView")').html(), {
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (chigiThis('TodoView/objCommon').TodoFilter || '') + '"]')
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
		var view = new chigiThis('TodoView/TodoView')({
			model: todo
		});
		$('#todo-list').append(view.render().el);
	},

	// Add all items in the **Todos** collection at once.
	addAll: function() {
		this.$('#todo-list').html('');
		chigiThis('TodoCollection/objTodos').each(this.addOne, this);
	},

	filterOne: function(todo) {
		// 该事件绑定于 TodoView中
		todo.trigger('visible');
	},

	filterAll: function() {
		chigiThis('TodoCollection/objTodos').each(this.filterOne, this);
	},

	// Generate the attributes for a new Todo item.
	newAttributes: function() {
		return {
			title: this.$input.val().trim(),
			order: chigiThis('TodoCollection/objTodos').nextOrder(),
			completed: false
		};
	},

	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
	createOnEnter: function(e) {
		if (e.which !== chigiThis('TodoView/objCommon').ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		chigiThis('TodoCollection/objTodos').create(this.newAttributes());
		this.$input.val('');
	},

	// Clear all completed todo items, destroying their models.
	clearCompleted: function() {
		_.invoke(chigiThis('TodoCollection/objTodos').completed(), 'destroy');
		return false;
	},

	toggleAllComplete: function() {
		var completed = this.allCheckbox.checked;

		chigiThis('TodoCollection/objTodos').each(function(todo) {
			todo.save({
				'completed': completed
			});
		});
	}
});

return AppView;