/** namespace for behance app */
var BEHANCEAPP = {
    views: {},
    router: {},

	/**
	 *  Start App: Initiate the router and start history (needed for bookmarkable URL's)
	 */
    init: function() {
	    new BEHANCEAPP.router();
	    Backbone.history.start();
    }
}


	
/** ===========================================================================
 * Responsible for displaying navigation. Consists of
 * - list/carousel with thumbnail images
 * - previous/next buttons
 * - pager
 * 
 * uses tinycarousel.
 * KIM that tinycarousel starts element count at 0 but page count at 1
 * ===========================================================================*/
BEHANCEAPP.views.Navigation = Backbone.View.extend({

	el: $('nav'),
	elementsVisible: 4,
	currentPage: 1,
	templates: {
		listItem:_.template($('#tplNavListItem').html()),
		pagerItem: _.template($('#tplNavPagerItem').html()),
		
	},
	lookup: {},
	
	initialize: function () {
		_.bindAll(this, 'handleCarouselChanges');
	},
	
	/**
	 * populate navigation from projects, populate lookup table
	 */
	render: function (projects) {
		var self=this, i=0,
			list = $('.overview'),
			pager = $('.pager'),
			nofPages = Math.floor(projects.length/this.elementsVisible);
		
		//remove any content present
		list.empty();
		pager.empty();
		
		//populate list/carousel
		projects.each(function (project) {
			var data = project.attributes,
				resolutions  = _.keys(data.covers);
			//select image with best resolution available
			data.cover = data.covers[_.max(resolutions)];
			self.lookup[data.id] = i++;
			list.append(self.templates.listItem(data));
		});
		
		//render pager items; KIM that (page-)ids have to start at 0 here
		for (j=0; j<=nofPages; j++) {
			pager.append(self.templates.pagerItem({index: j}));
			
		}
		//start tinycarousel
		this.$el.tinycarousel({
			display: self.elementsVisible, // move elementsVisible blocks at a time
			controls: true, // show left and right navigation button
			pager: true, // display pager
			callback: self.handleCarouselChanges
		});
	},
	
	/**
	 *  mark entry with id as current
	 */
	setActive: function (id) {
		var newPage = Math.floor(this.lookup[id] / this.elementsVisible) + 1;
		this.$el.find('.overview li').removeClass('selected');
		this.$el.find(".overview [data-id='" + id + "']").addClass('selected');
		if (newPage != this.currentPage) {
			this.$el.tinycarousel_move(newPage);
			this.currentPage = newPage;
		}
	},
	
	handleCarouselChanges: function (element, index) {
		/* KIM: element is always the element at position index, but index 
		 * behaves differently for elementsVisible != 1: index corresponds then
		 * to page-1 */
		this.currentPage = index+1;
	}
});



/** ===========================================================================
 * Responsible for displaying content
 * ===========================================================================*/
BEHANCEAPP.views.Stage = Backbone.View.extend({
	el: $('#stage'),
	model: null,
	template: _.template($('#tplStage').html()),
	
	/**
	 * display element and start galleria
	 */
	render: function (item) {
		item = this.prepare(item);
		this.$el.html(this.template(item.attributes));
		if (item.get('images').length > 0) {
			Galleria.run('#galleria');
		}
	},
	
	/**
	 * extract/prepare some data if necessary
	 */
	prepare: function(item) {
		var data = item.attributes;
		if ((data.byline === undefined) || (data.longDescription === undefined) || (data.images === undefined)) {
			var longDescription = '', images = [], byline = '';
			if (data.modules && data.modules.length > 0) {
				/* extract byline from first and long description from second module entry by convention */
				if (data.modules[0].type == 'text') {
					byline = data.modules[0].text_plain;
				}
				if (data.modules[1].type == 'text') {
					longDescription = data.modules[1].text_plain;
				}
				_.each(data.modules, function (module) {
					if (module.type == 'image') {
						images.push({
							thumb: module.src, 
							original: module.sizes.original,
							caption: module.caption || '',
						});
					}
				});
			}
			item.set('longDescription', longDescription);
			item.set('images', images);
			item.set('byline', byline);
		};
		return item;
	}
});



/**===========================================================================
 * Responsible for handling urls and loading projects
 * ===========================================================================*/
BEHANCEAPP.router = Backbone.Router.extend({
    routes: {
        "works/:id": "defaultRoute"
    },
	views : [],
	selectedProjectId : null,
	
	initialize: function() {
		var user, self=this, string, newString;
		this.views.nav = new BEHANCEAPP.views.Navigation();
		this.views.stage = new BEHANCEAPP.views.Stage();
		this.projects = new Backbone.Collection();
		
		/* make sure views react to changed project list */
		this.projects.on('reset', function() {
			self.views.nav.render(self.projects);
			self.updateViews();
		});
		this.initializeFromFile();
	},
	
	/**
	 * reset projects from string. used for development since it prevents
	 * any issues related to asynchronity. remove for productive environment.
	 */
	initializeFromString: function() {
		var string = '[{"id":5055813,"name":"Der Bote der Urschweiz","published_on":1346870931,"created_on":1346870207,"modified_on":1350575118,"url":"http:\/\/www.behance.net\/gallery\/Der-Bote-der-Urschweiz\/5055813","fields":["Interaction Design","User Interface Design","Web Design"],"covers":{"115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/115x089cc79e9a2d9b3cd4f2d8d1e8562fa5.png","202":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/089cc79e9a2d9b3cd4f2d8d1e8562fa5.png","404":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/404x089cc79e9a2d9b3cd4f2d8d1e8562fa5.png","230":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/5055813\/230x089cc79e9a2d9b3cd4f2d8d1e8562fa5.png"},"mature_content":0,"owners":{"1182455":{"id":1182455,"first_name":"Andreas","last_name":"Frey Sang","username":"freysang","city":"Bern","state":"","country":"Switzerland","company":"","occupation":"Aspiring Interaction Designer, Screendesigner, Typograf","created_on":1337613545,"url":"http:\/\/www.behance.net\/freysang","display_name":"Andreas Frey Sang","images":{"32":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/32x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","50":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/50x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","78":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/78x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/115x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","129":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/129x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","138":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/3dafdc37cac37adfe7c4ce866dd1f9cc.jpg"},"fields":["Graphic Design","Interaction Design","Print Design"]}},"stats":{"views":6,"appreciations":0,"comments":0}},{"id":3995717,"name":"Jugend Macht!","published_on":1337629826,"created_on":1337628804,"modified_on":1346879437,"url":"http:\/\/www.behance.net\/gallery\/Jugend-Macht\/3995717","fields":["Graphic Design","Print Design"],"covers":{"115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/3995717\/115x634cd0fe8ed1540f1c69b204f2ff56b0.png","202":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/projects\/3995717\/634cd0fe8ed1540f1c69b204f2ff56b0.png"},"mature_content":0,"owners":{"1182455":{"id":1182455,"first_name":"Andreas","last_name":"Frey Sang","username":"freysang","city":"Bern","state":"","country":"Switzerland","company":"","occupation":"Aspiring Interaction Designer, Screendesigner, Typograf","created_on":1337613545,"url":"http:\/\/www.behance.net\/freysang","display_name":"Andreas Frey Sang","images":{"32":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/32x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","50":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/50x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","78":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/78x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","115":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/115x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","129":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/129x3dafdc37cac37adfe7c4ce866dd1f9cc.jpg","138":"http:\/\/behance.vo.llnwd.net\/profiles9\/1182455\/3dafdc37cac37adfe7c4ce866dd1f9cc.jpg"},"fields":["Graphic Design","Interaction Design","Print Design"]}},"stats":{"views":31,"appreciations":1,"comments":0}}]';
		this.projects = new Behance.ProjectsCollection(JSON.parse(string));
	},
	
	/**
	 * reset projects from projects.json file
	 */
	initializeFromFile: function() {
		var self=this;
		$.get('projects.json', function(data) {
			self.projects.reset(data);
		});
	},
    
    defaultRoute: function( id ) {
    	this.selectedProjectId = id;
    	//if projects are already loaded, update view
    	if (this.projects.length > 0) {
    		this.updateViews();
    	}// else reset of this.projects will trigger updateViews
    },
    
    /**
     * provide respective data to views for rendering
     */
    updateViews: function () {
    	var project;
    	if (!this.selectedProjectId) {
    		project = this.projects.models[0];
    		this.selectedProjectId = project.id;
    	} else {
        	project = this.projects.get(this.selectedProjectId);
    	}
		this.views.stage.render(project);
		this.views.nav.setActive(this.selectedProjectId);
    }
});