//@require:backbone,jquery,underscore,chigiThis('TodoView/objCommon')
'use strict';
// 一个TodoView 与一个 TodoModel一一对应
var TodoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#chigiThis("TodoView/TodoView")').html()),

	// 为每个Todo条目绑定通用事件
	events: {
		'click .toggle': 'toggleCompleted',
		'dblclick label': 'edit',
		'click .destroy': 'clear',
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close'
	},

	// The TodoView listens for changes to its model, re-rendering. Since there's
	// a one-to-one correspondence between a **Todo** and a **TodoView** in this
	// app, we set a direct reference on the model for convenience.
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	// Re-render the titles of the todo item.
	render: function() {
		this.$el.html(_.template($('#chigiThis("TodoView/TodoView")').html(), this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));

		this.toggleVisible();
		this.$input = this.$('.edit');
		return this;
	},

	toggleVisible: function() {
		this.$el.toggleClass('hidden', this.isHidden());
	},

	isHidden: function() {
		var isCompleted = this.model.get('completed');
		return ( // hidden cases only
		(!isCompleted && chigiThis('TodoView/objCommon').TodoFilter === 'completed') ||
			(isCompleted && chigiThis('TodoView/objCommon').TodoFilter === 'active'));
	},

	// Toggle the `"completed"` state of the model.
	toggleCompleted: function() {
		this.model.toggle();
	},

	// Switch this view into `"editing"` mode, displaying the input field.
	edit: function() {
		this.$el.addClass('editing');
		this.$input.focus();
	},

	// Close the `"editing"` mode, saving changes to the todo.
	close: function() {
		var value = this.$input.val().trim();

		if (value) {
			this.model.set({
				title: value
			});
			this.model.save();
		} else {
			this.clear();
		}

		this.$el.removeClass('editing');
	},

	// If you hit `enter`, we're through editing the item.
	updateOnEnter: function(e) {
		if (e.keyCode === chigiThis('TodoView/objCommon').ENTER_KEY) {
			this.close();
		}
	},

	// Remove the item, destroy the model from *localStorage* and delete its view.
	clear: function() {
		this.model.destroy();
	}
});

return TodoView;