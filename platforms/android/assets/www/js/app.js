const API_Settings = {
	server: "http://pep.photo/",
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

const Register = React.createClass({
	getInitialState: function() {
		return {
			myEmail: ""
		};
	},
	updateEmail: function(e) {
		this.setState({
			myEmail: e.target.value
		});
	},
	setEmail: function() {
		haptic();
		localStorage.setItem("myEmail", this.state.myEmail);
		// window.location = "/";
		location.reload();
	},
	render: function() {
		return (
			<div>
				<input type="email" required value={this.state.myEmail} onChange={this.updateEmail} />
				<input type="button" value="Submit" onTouchStart={this.setEmail} />
			</div>
		);
	}
}); // Register

const Header = React.createClass({
	getInitialState: function() {
		return {
			showMenu: false,
		};
	},
	toggleMenu: function() {
		haptic();
		this.setState({
			showMenu: !this.state.showMenu
		});
	},
	refresh: function() {
		DataLayer.events(function(r) {

		});
	},
	render: function() {
		switch (this.props.left) {
			case "back":
				var left = (
					<div className="left-anchor">
						<a href="#" className="maticon">&#xE314;</a>
					</div>
				);
				var headerStyle = "middle";
			break;
		}
		switch (this.props.right) {
			case "menu":
				var left = (
					<div className="right-anchor">
						<ul className={"menu-links " + (this.state.showMenu ? "visible" : "hidden")}>
							<li className="pep-logo-link"><img src="img/menu-logo.png" /></li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/" onClick={this.toggleMenu}><i className="maticon">mic</i> Talks</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/social" onClick={this.toggleMenu}><i className="maticon">&#xE8AF;</i> Social</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/participants" onClick={this.toggleMenu}><i className="maticon">face</i> Participants</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/partners" onClick={this.toggleMenu}><i className="maticon">star</i> Partners</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/map" onClick={this.toggleMenu}><i className="maticon">map</i> Map</Link>
							</li>
						</ul>
						<a onTouchStart={this.toggleMenu} className="maticon">menu</a>
					</div>
				);
				var headerStyle = "top";
			break;
			case "refresh":
				var right = (
					<div className="right-anchor">
						<a onTouchStart={this.refresh} className="maticon">cloud_download</a>
					</div>
				);
			break;
		}
		// console.log(this.props.background);
		if (this.props.background != undefined) {
			var bgimg = (<img src={this.props.background} className="event-image" />);
		}
		if (this.props.title == "PEP") {
			var screenTitle = (<img src="img/pep_logo_red.png" className="app-title-image" />);
		} else {
			var screenTitle = this.props.title;
		}
		if (this.props.eventDate) {
			var eventDate = (<span className="event-date-in-header">{this.props.eventDate}</span>);
		}
		return(
			<div className={"app-header headertype-" + headerStyle + " eventheader-" + this.props.eventid} >
				{bgimg}
				{left}
				{eventDate}
				<h1 className={"screen-title" + (this.props.title=="PEP" ? " home-title" : "")}>{screenTitle}</h1>
				{right}
				<div className="clearfix"></div>
			</div>
		);
	}
}); // Header

const EventListItem = React.createClass({
	getInitialState: function() {
		return {
			id: 0,
			element: {},
			followed: false
		}
	},
	componentDidMount: function() {
		this.setState({
			id: this.props.id,
			element: localStorage.getItem("event_" + this.props.id)
		});
		if (localStorage.eventsIfollow == undefined) {
			var eventsIfollow = {};
			eventsIfollow[this.props.id] = "no";
		} else {
			var eventsIfollow = JSON.parse(localStorage.eventsIfollow);
		}
		localStorage.setItem("eventsIfollow", JSON.stringify(eventsIfollow));
		this.setState({
			followed: (eventsIfollow[this.props.id] == "yes")
		});
	},
	render: function() {
		var element = jQuery.parseJSON(localStorage.getItem("event_" + this.props.id));
		if (!!element) {
			var fromDate = dateForSafari(element._EventStartDate);
				var fromNicetime = niceTime(fromDate);
			var toDate = dateForSafari(element._EventEndDate);
				var toNicetime = niceTime(toDate);
			var nice_date = niceDate(fromDate);
			return(
				<div className={this.props.listItemClass}>
					<Link to={"/events/" + element.id}>
						{(element.hasOwnProperty("medium_image")) ? <img src={element.medium_image} /> : (element.hasOwnProperty("thumbnail_image") ? <img src={element.thumbnail_image} /> : <img/> )}
						<h5 className="list-item-title">
								{element.title.rendered}
						</h5>
						<div className="list-item-description">
							<p className="list-item-description-text">{element.acf.speaker}</p>
						</div>
					</Link>
				</div>
			);
		} else {
			return (<li></li>);
		}
	}
}); // EventListItem

const TheEvent = React.createClass({
	getInitialState: function() {
		return {
			id: 0,
			event: {
				title: {
					rendered: ""
				},
				content: {
					rendered: ""
				},
			},
		};
	},
	componentDidMount: function() {
		var that = this
		DataLayer.event(that.props.params.id, function(theEvent) {
			that.setState({
				id: that.props.params.id,
				event: theEvent,
			});
		});
	},
	share: function() {
		haptic();
		window.plugins.socialsharing.share(
			this.state.event.content.rendered,
			"You might be interested in " + this.state.event.title.rendered,
			this.state.event.medium_image,
			this.state.event.guid
		);
	},
	dsihtml: function(text) {
		return {
			__html: text
		};
	},
	render: function() {
		var xContent = this.dsihtml(this.state.event.content.rendered);
		if (this.state.event._EventStartDate != undefined) {
			var st = dateForSafari(this.state.event._EventStartDate);
			var en = dateForSafari(this.state.event._EventEndDate);
			var start = niceTime(st);
			var end = niceTime(en);
			var dt = niceDate(st);
		}
		return (
			<div className="event">
				<Header title={this.state.event.title.rendered} eventDate={dt} background={this.state.event.medium_image} eventid={this.props.params.id} left="back" />
				<div className="event-sidebar">
					<a
						onTouchStart={this.share}
						className="maticon event-icon">share</a>
					<p className="event-times">
						<span className="event-begin">{start}</span> -
						<span className="event-end">{end}</span>
					</p>
				</div>
				<div className="event-content">
					<div dangerouslySetInnerHTML={xContent} />
				</div>
			</div>
		);
	}
}); // TheEvent
const Main = React.createClass({
	getInitialState: function() {
		return {
			children: "",
		};
	},
	componentDidMount: function() {
		DataLayer.events(function(response) {
			// no dothing
		});
		if (localStorage.myEmail == undefined) {
			
		} else {
			this.setState({children: this.props.children});
		}
	},
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
		if (localStorage.events != undefined) {
			var events = jQuery.parseJSON(localStorage.events);
			this.setState({
				events: events
			});
		} else {
			DataLayer.events( function(response) {
				this.setState({
					events: response
				});
			}.bind(this));
		}
	},
	render: function() {
		if (this.state.events.length > 0) {
			var events = this.state.events.map( function(element, idx) {
				var listType = "normal";
				var listItemClass = "list-item list-item-normal";
				return (
					<EventListItem
						key={idx}
						id={element.id}
						element={element}
						listType={listType}
						listItemClass={listItemClass} />
				);
			});
		} else {
			var events = (
				<span className="loading">Loading</span>
			);
		}
		var header = (<Header title="PEP" right="menu" />);
		return (
			<section className="list-view">
				{header}
				{events}
			</section>
		);
	}
}); // Home

const Social = React.createClass({
	getInitialState: function() {
		return {
			socials: []
		};
	},
	componentDidMount: function() {
		var that = this;
		DataLayer.socials( function(response) {
			that.setState({
				socials: response
			});
			console.log(response);
		});
	},
	render: function() {
		console.log(this.state.socials);
		console.log(this.state.socials.length);
		if (this.state.socials.length > 0) {
			var socials = this.state.socials.map(function(element, idx) {
				return (
					<Shareable
						id={element.id}
						key={idx} />
				);
			});
		} else {
			var socials = (
				<span className="loading">Loading</span>
			);
		}
		return (
			<ul className="list-view">
				<Header title="Social" right="menu" />
				{socials}
			</ul>
		);
	}
}); // Social

const Shareable = React.createClass({
	getInitialState: function() {
		return {
			id: 0,
			element: {},
		}
	},
	componentDidMount: function() {
		this.setState({
			id: this.props.id,
			element: JSON.parse(localStorage.getItem("shareable_" + this.props.id))
		});
	},
	share: function() {
		haptic();
		var that = this;
		console.log(this.state.element.tags);
		var tags = this.state.element.tags.join(" #");
		console.log(that.state.element);
		console.log(tags);
		var plainContent = $(that.state.element.content.rendered).text() + tags;
		window.plugins.socialsharing.share(
			that.state.element.title.rendered + tags,
			null,
			that.state.element.thumbnail_image,
			"http://www.pep.photo/"
		);
	},
	render: function() {
		// var element = jQuery.parseJSON(localStorage.getItem("shareable_" + this.props.id));
		var element = this.state.element;
		if (element.id != undefined) {
			return(
				<div className="list-item list-item-normal">
					{(element.hasOwnProperty("medium_image")) ? <img src={element.medium_image} /> : (element.hasOwnProperty("thumbnail_image") ? <img src={element.thumbnail_image} /> : <img/> )}
					<div className="shareable-description" onTouchStart={this.share}>
						<h5 className="shareable-title">
							{element.title.rendered} | <i className="maticon">share</i>
						</h5>
						<p className="list-item-description-text">{element.acf.speaker}</p>
					</div>
				</div>
			);
		} else {
			return (<li></li>);
		}
	}
}); // Shareable
const GMap = React.createClass({
	render: function() {
		var mapHeight = window.innerHeight - 48;
		console.log(mapHeight);
		return (
			<div>
				<Header title="The Way to PEP" right="menu" />
				<span className="loading">Loading</span>
				<iframe
					className="map-iframe"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.5702236973657!2d72.8212489143756!3d18.994578759463916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce8b78ac3db9%3A0x395ad82b0a483225!2sThe+St.+Regis+Mumbai!5e0!3m2!1sen!2sin!4v1462360857601"
					height={mapHeight}
					allowFullScreen></iframe>
			</div>
		);
	}
}); // GMap

React.render((
	<Router>
		<Route component={Main} title="PEP">
			<Route path="/" title="PEP" component={Home} />
				<Route path="events/:id" component={TheEvent} />
			<Route path="map" title="The Way to PEP" component={GMap} />
			<Route path="social" component={Social} />
			<Route path="register" component={Register} />
			<Route path="register" component={Register} />
		</Route>
	</Router>
	), document.getElementById("root")
);

document.addEventListener('deviceready', function() {
	console.log("deviceready fired");
	registerPushNotifications();
}, false);