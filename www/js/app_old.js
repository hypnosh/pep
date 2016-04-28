var API_Settings = {
	root: "http://pep.photo/wp-json/",
	versionString : "wp/v2/",
	nonce: null,
};

var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var Link = window.ReactRouter.Link;
var browserHistory = window.ReactRouter.browserHistory;
var IndexRoute = window.ReactRouter.IndexRoute;

const App = React.createClass({
	render: function() {
		return(
			<div>
				<h1>Pep</h1>
				<ul>
					<li><Link to="/events">All Events</Link></li>
					<li><Link to="/">Home</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
});
const Home = React.createClass({
	getInitialState: function() {
		return {
			events: []
		};
	},
	componentDidMount: function() {
		var that = this;
		serverCalls.getAll( "events", function(response) {
			that.setState({events: response});
			localStorage.setItem("events", JSON.stringify(response));
			that.setState({ events: response });
			for(n in response) {
				if (response.hasOwnProperty(n)) {
					var event = response[n];
					// localStorage.setItem("event_" + event.id, JSON.stringify(event));
					if (event.hasOwnProperty("featured_media")) {
						var key = "event_" + event.id;
						serverCalls.getOne("media", event.featured_media, function(response) {
							console.log(response.media_details.sizes.medium.source_url);
							var event_temp = JSON.parse(localStorage[key]);
							event_temp.medium_image = response.media_details.sizes.medium.source_url;
							event_temp.thumbnail_image = response.media_details.sizes.thumbnail.source_url;
							localStorage.setItem(key, JSON.stringify(event_temp));
						}, function(error) {
							console.log(error);
						});
					}
				}
			}
		}, function(error) {
			console.log(error);
		});
	},
	render: function() {
		var events = this.state.events.map( function(element, idx) {
			if (element.hasOwnProperty("hero_event")) {
				var listItemClass = "list-item list-item-hero";
			} else {
				var listItemClass = "list-item";
			}
			console.log(element);
			return (
				<EventListItem
					key={idx}
					id={element.id}
					element={element}
					listItemClass={listItemClass} />
			);
		});
		return(
			<div className={"page " + this.props.position + " row"}>
				<h1 className="title-bar col-xs-12">PEP</h1>
				<ul className="col-xs-12 list-view">
					{events}
				</ul>
			</div>
		);
	}
}); // Home
const EventListItem = React.createClass({
	getInitialState: function() {
		return {
			element: ''
		}
	},
	componentDidMount: function() {
		console.log(this.props.id);
		this.setState({
			element: localStorage.getItem("event_" + this.props.id)
		})
	},
	render: function() {
		var element = jQuery.parseJSON(localStorage.getItem("event_" + this.props.id));
		if (!!element) {
			return(
				<li className={this.props.listItemClass}>
					<Link to={"/events/" + element.id}>
						{(element.hasOwnProperty("medium_image") && element.hasOwnProperty("hero_event")) ? <img src={element.medium_image} /> : (element.hasOwnProperty("thumbnail_image") ? <img src={element.thumbnail_image} /> : <img/> )}
						<img src={element.medium_image} />
						<h5 className="list-item-title">
								{element.title.rendered}
						</h5>
						<div className="list-item-description">
							<p>{jQuery(element.content.rendered).text()}</p>
							<p>From {element._EventStartDate[0]} to {element._EventEndDate[0]}</p>
						</div>
					</Link>
				</li>
			);
		} else {
			return (<li></li>);
		}

	}
}); // EventListItem
const Events = React.createClass({
	render: function() {
		return(
			<div>
				<h1>Events Placeholder Page</h1>
				{this.props.children}
			</div>
		);
	}
});
const EventOld = React.createClass({
	render: function() {
		return(
			<div className="row">
				<a href="#" className="col-xs-1">
					<i className="glyphicon glyphicon-chevron-left"></i>
				</a>
				<h1 className="title-bar col-xs-10">Event</h1>
			</div>
		);
	}
});
//mixins: [PageSlider],
// componentDidMount: function() {
// 	router.addRoute('', function() {
// 		this.slidePage(<Home />);
// 	}.bind(this));
// 	router.addRoute('event/:id', function(id) {
// 		this.slidePage(<Event eventId={id} />);
// 	}.bind(this));
// 	router.start();
// }
var TheApp = React.createClass({
	render: function() {
		return(
			<Router>
				<Route 	path="/" component={App}>
					<IndexRoute component={Home} />
					<Route path="events" component={Events}>
						<Route path="events/:id" component={Event} />
					</Route>
				</Route>
			</Router>
		);
	},
});
React.render(
	<TheApp />,
	document.getElementById("root")
);