var API_Settings = {
	root: "http://pep.photo/wp-json/",
	versionString : "wp/v2/",
	nonce: null,
};

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Link = ReactRouter.Link;
const browserHistory = ReactRouter.browserHistory;
const IndexRoute = ReactRouter.IndexRoute;
// const ReactSwipe = ReactSwipe.ReactSwipe;

const niceTime = function(dateObj) {
	return dateObj.getHours() + ":" + dateObj.getMinutes();
}
const Header = React.createClass({
	getInitialState: function() {
		return {
			showMenu: false,
		};
	},
	toggleMenu: function() {
		this.setState({
			showMenu: !this.state.showMenu
		});
	},
	render: function() {
		switch (this.props.left) {
			case "menu":
				var left = (
					<div className="col-xs-1">
						<ul className={"menu-links " + (this.state.showMenu ? "visible" : "hidden")}>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/" onClick={this.toggleMenu}>Home</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/my" onClick={this.toggleMenu}>My Schedule</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/social" onClick={this.toggleMenu}>Social</Link>
							</li>
						</ul>
						<span onClick={this.toggleMenu} className="glyphicon glyphicon-menu-hamburger"></span>
					</div>
				);
			break;
			case "back":
				var left = (
					<div className="col-xs-1">
						<a href="#" className="glyphicon glyphicon-arrow-left"></a>
					</div>
				);
		}
		return(
			<div className="app-header">
				{left}
				<h1 className="col-xs-10">{this.props.title}</h1>
				<div className="clearfix"></div>
			</div>
		);
	}
}); // Header

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
			var fromDate = new Date(element._EventStartDate);
				var fromNicetime = niceTime(fromDate);
			var toDate = new Date(element._EventEndDate);
				var toNicetime = niceTime(toDate);
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
							<p>From {fromNicetime} to {toNicetime}</p>
						</div>
					</Link>
				</li>
			);
		} else {
			return (<li></li>);
		}
	}
}); // EventListItem

const Main = React.createClass({
	render: function() {
		return(
			<div className="row">
				<div className="main">
					{this.props.children}
				</div>
			</div>
		);
	}
}); // Main
const Home = React.createClass({
	getInitialState: function() {
		return {
			events: []
		}
	},
	componentDidMount: function() {
		// load data into events array
		this.setState({
			events: jQuery.parseJSON(localStorage.events)
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
		console.log(this.props);
		switch (this.props.params.title) {
			case "PEP":
				var header = (<Header title="PEP" left="menu" />);
			break;
			default:
				var header = (<Header title={this.props.params.title} left="back" />);
			break;
		}
		return (
			<ul className="list-view">
				{header}
				{events}
			</ul>
		);
	}
});
const Social = React.createClass({
	getInitialState: function() {
		return {
			facebook: "http://facebook.com/pep",
			twitter: "http://twitter.com/pep"
		};
	},
	render: function() {
		return (
			<ul className="list-view">
				<Header title="Social" left="back" />
				<li><a href={this.state.facebook}>Facebook</a></li>
				<li><a href={this.state.twitter}>Twitter</a></li>
			</ul>
		);
	}
});
const Event = React.createClass({
	getInitialState: function() {
		return {
			id: 0,
			event: {}
		};
	},
	componentDidMount: function() {
		this.setState({
			id: this.props.params.id,
			event: jQuery.parseJSON(localStorage.getItem("event_" + this.props.params.id))
		})
	},
	render: function() {
		return (
			<div className="col-xs-12">
				<Header title={this.state.event.title} left="back" />
				<img src="" alt=""/>
				{this.props.params.id}
				<p>{jQuery(this.state.event.content).text()}</p>
			</div>
		);
	}
});
React.render((
	<Router>
		<Route component={Main} title="PEP">
			<Route path="/" title="PEP" component={Home} />
				<Route path="events/:id" component={Event} />
			<Route path="my" title="My Events" component={Home} />
			<Route path="social" component={Social} />
			<Route path="register" />
		</Route>
	</Router>
	), document.getElementById("root")
);