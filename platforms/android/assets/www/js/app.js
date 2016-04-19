var API_Settings = {
	root: "http://pep.photo/wp-json/",
	versionString : "wp/v2/",
	nonce: null,
};

var Home = React.createClass({
	getInitialState: function() {
		return {
			events: []
		};
	},
	componentDidMount: function() {
		var that = this;
		$.get(API_Settings.root + API_Settings.versionString + "events", function(response) {
			for(n in response) {
				if (response.hasOwnProperty(n)) {
					var event = response[n];
					localStorage.setItem("event_" + event.id, JSON.stringify(event));
				}
			}
			// localStorage.setItem("events", JSON.stringify(response));
			that.setState({ events: response });
		});
	},
	render: function() {
		var events = this.state.events.map( function(element, idx) {
			if (element.hero_event[0] == 1) {
				var listItemClass = "list-item list-item-hero jumbotron";
			} else {
				var listItemClass = "list-item";
			}
			return (
				<li className={listItemClass}>
					<a href={"#event/" + element.id}>
						<h5 className="list-item-title">
							{element.title.rendered}
						</h5>
						<div className="list-item-description">
							{element.content.rendered}
							From {element._EventStartDate[0]} to {element._EventEndDate[0]}
						</div>
					</a>
				</li>
			);
		});
		return(
			<div className="row">
				<h1 className="title-bar col-xs-12">PEP</h1>
				<ul className="col-xs-12 list-view">
					{events}
				</ul>
			</div>
		);
	}
}); // Home
var Event = React.createClass({
	render: function() {
		return(
			<div className="row">
				<a className="col-xs-1">
				<h1 className="title-bar col-xs-11">
		);
	}
});
var TheApp = React.createClass({
	mixins: [PageSlider],
	getInitialState: function() {
		return {
			page: <Home />
		};
	},
	componentDidMount: function() {
		router.addRoute('', function() {
			this.slidePage(<Home />);
		}.bind(this));
		router.addRoute('event/:id', function(id) {
			this.slidePage(<Event eventId={id} />);
		}.bind(this));
		router.start();
	}
});
React.render(
	<TheApp />,
	document.getElementById("arena")
);