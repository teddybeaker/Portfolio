Galleria.loadTheme('js/galleria/themes/classic/galleria.classic.min.js');
$(document).ready(function() {
	NavView = Backbone.View.extend({
		el: $('nav'),
		templates: {
			listItem: _.template($('#tplNavListItem').html()),
			pagerItem: _.template($('#tplNavPagerItem').html()),
		},
		lookup: {},
		
		render: function (items) {
			var self=this, i=0,
				list = $('.overview'),
				pager = $('.pager');
			list.empty();
			pager.empty();
  			items.each(function (project) {
  				var data = project.attributes,
  					resolutions  = _.keys(data.covers);
  				//select image with best resolution available
  				data.cover = data.covers[_.max(resolutions)];
  				data.index = i++;
  				self.lookup[data.id] = data.index;
  				list.append(self.templates.listItem(data));
  				pager.append(self.templates.pagerItem(data));
  			});
  			this.$el.tinycarousel({pager: true});
		},
		
		setActive: function (id) {
			this.$el.find('li').removeClass('selected');
			this.$el.find("[data-id='" + id + "']").addClass('selected');
			this.$el.tinycarousel_move(this.lookup[id]+1);
		}
	});
	
	StageView = Backbone.View.extend({
		el: $('#stage'),
		model: null,
		template: _.template($('#tplStage').html()),
		
		render: function (item) {
			var data = item.attributes;
			if ((data.longDescription === undefined) || (data.images === undefined)) {
				var longDescription = '', images = [];
				if (data.modules && data.modules.length > 0) {
					_.each(data.modules, function (module) {
						/* extract long description from first module entry by 
						 * convention */
						if (!longDescription && module.type == 'text') {
							longDescription = module.text_plain;
						} else if (module.type == 'image') {
							images.push({
								thumb: module.src, 
								original: module.sizes.original,
								caption: module.caption,
							});
						}
					});
				}
				item.set('longDescription', longDescription);
				item.set('images', images);
			};
			this.$el.html(this.template(item.attributes));
			if (item.get('images').length > 0) {
				Galleria.run('#galleria');
			}
		}
	});
	
	AppRouter = Backbone.Router.extend({
        routes: {
            "works/:id": "defaultRoute"
        },

		views : [],
		
		selectedProject : null,
		
		initialize: function() {
			var user, self=this, string, newString;
			this.views.nav = new NavView();
			this.views.stage = new StageView();
			this.projects = new Backbone.Collection();
			/* make sure views react to changed project list */
			this.projects.on('reset', function() {
				self.updateViews();
			});
			this.initializeFromFile();
		},
		
		/** reset projects from string. used for development since it prevents
		 * any issues related to asynchronity. remove for productive environment. */
		initializeFromString: function() {
			var string = '[{"id":5055813,"name":"Der Bote der Urschweiz","published_on":1346870931,"created_on":1346870207,"modified_on":1350575118,"url":"http:\/\/www.behance.net\/gallery\/Der-Bote-der-Urschweiz\/5055813","fields":["Interaction Design","User Interface Design","Web Design"],"covers":{"115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/115x089cc79e9a2d9b3cd4f2d8d1e8562fa5.png","202":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/089cc79e9a2d9b3cd4f2d8d1e8562fa5.png","404":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/404x089cc79e9a2d9b3cd4f2d8d1e8562fa5.png","230":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/230x089cc79e9a2d9b3cd4f2d8d1e8562fa5.png"},"mature_content":0,"owners":{"1182455":{"id":1182455,"first_name":"Andreas","last_name":"Frey Sang","username":"freysang","city":"Bern","state":"","country":"Switzerland","company":"","occupation":"Aspiring Interaction Designer, Screendesigner, Typograf","created_on":1337613545,"url":"http:\/\/www.behance.net\/freysang","display_name":"Andreas Frey Sang","images":{"32":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/32x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","50":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/50x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","78":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/78x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/115x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","129":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/129x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","138":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/3dafdc37cac37adfe7c4ce866dd1f9cc.jpg"},"fields":["Graphic Design","Interaction Design","Print Design"]}},"stats":{"views":6,"appreciations":0,"comments":0}},{"id":3995717,"name":"Jugend Macht!","published_on":1337629826,"created_on":1337628804,"modified_on":1346879437,"url":"http:\/\/www.behance.net\/gallery\/Jugend-Macht\/3995717","fields":["Graphic Design","Print Design"],"covers":{"115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/3995717\/115x634cd0fe8ed1540f1c69b204f2ff56b0.png","202":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/3995717\/634cd0fe8ed1540f1c69b204f2ff56b0.png"},"mature_content":0,"owners":{"1182455":{"id":1182455,"first_name":"Andreas","last_name":"Frey Sang","username":"freysang","city":"Bern","state":"","country":"Switzerland","company":"","occupation":"Aspiring Interaction Designer, Screendesigner, Typograf","created_on":1337613545,"url":"http:\/\/www.behance.net\/freysang","display_name":"Andreas Frey Sang","images":{"32":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/32x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","50":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/50x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","78":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/78x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/115x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","129":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/129x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","138":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/3dafdc37cac37adfe7c4ce866dd1f9cc.jpg"},"fields":["Graphic Design","Interaction Design","Print Design"]}},"stats":{"views":31,"appreciations":1,"comments":0}}]';
  			this.projects = new Behance.ProjectsCollection(JSON.parse(string));
		},
		
		/** reset projects from projects.json file */
		initializeFromFile: function() {
			var self=this;
			$.get('projects.json', function(data) {
				self.projects.reset(data);
			});
		},
        
        defaultRoute: function( id ) {
        	this.selectedProject = id;
        	if (this.projects.length > 0) {
        		this.updateViews();
        	}// else reset of this.projects will trigger updateViews
        },
        
        updateViews: function () {
        	var item;
        	this.views.nav.render(this.projects);
        	if (this.selectedProject) {
	        	item = this.projects.get(this.selectedProject);
    			this.views.stage.render(item);
        		this.views.nav.setActive(this.selectedProject);
        	}
        }
    });
    // Initiate the router and start history (needed for bookmarkable URL's)
    new AppRouter();
    Backbone.history.start();
	
});
