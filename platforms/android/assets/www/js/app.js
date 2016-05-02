var API_Settings = {
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

const registerPushNotifications = function() {
	var push = PushNotification.init({
		android: {
			senderID: "2177584716"
		}
	});
	console.log("starting push");
	push.on('registration', function(data) {
		// data.registrationId
		var regId = data.registrationId;
		if (localStorage.myEmail == undefined) {
			var myEmail = prompt("What's your email address?");
		} else {
			var myEmail = localStorage.myEmail;
		}
		var data = {
			token: regId,
			os: "Android",
			email: myEmail
		};
		$.post(API_Settings.server + "pnfw/register/", data, function(response) {
			console.log(response);
		}, function(error) {
			console.log(error);
		});
	});
	push.on('notification', function(data) {
		// data.message,
		// data.title,
		// data.count,
		// data.sound,
		// data.image,
		// data.additionalData
		console.log(data);
		alert("push");
	}); //onNotification
	push.on('error', function(error) {
		console.log(error);
	})
	PushNotification.hasPermission(function(data) {
		console.log(data);
	});
} // registerPushNotifications



const DataLayer = {
	event: function(id, callback) {
		var home = this;
		if (localStorage.getItem("event_" + id) != undefined) {
			callback(jQuery.parseJSON(localStorage.getItem("event_" + id)));
		} else {
			serverCalls.getOne(id, "events", function(response) {
				home.getImages(response);
				if (typeof(callback) == "function") {
					callback(response);
				}
			}, function(error) {
				console.log(error);
			})
		}
	},
	events: function(callback) {
		var home = this;
		var amInew = (localStorage.getItem("events") != undefined);
		serverCalls.getAll("events", function(response) {
			for (var i = response.length - 1; i >= 0; i--) {
				var response_one = response[i];
				home.getImages(response_one);
				console.log(i);
			}
			localStorage.setItem("events", JSON.stringify(response));
			if (!amInew && (typeof(callback) == "function")) {
				callback(response);
			}
		}, function(error) {
			console.log(error);
		});
		if (amInew) {
			callback(jQuery.parseJSON(localStorage.getItem("events")));
		}

	},
	getImages: function(response_one) {
		if (response_one.featured_media > 0) {
			serverCalls.getOne("media", response_one.featured_media, function(media) {
				response_one.medium_image = media.media_details.sizes.full.source_url;
				localStorage.setItem("event_" + response_one.id, JSON.stringify(response_one));
			}, function(error) {
				console.log(error);
			});
		}
	},
	socials: function() {
		return [{
			caption: "Facebook",
			link: "http://www.facebook.com/pep",
			img: ""
		},{
			caption: "Twitter",
			link: "http://www.twitter.com/peptalks",
			img: ""
		}];
	}
}; // DataLayer

const dateForSafari = function(dateString) {
	if (typeof(dateString) == "object") {
		dateString = dateString[0];
	} else {
		console.log(typeof(dateString));
	}
	return new Date(dateString.replace(/-/g, "/"));
} // dateForSafari
const niceDate = function(dateObj) {
	var nowTime = new Date();
	var day = dateObj.getDate();
	var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][dateObj.getMonth()];
	if (nowTime.getFullYear() != dateObj.getFullYear()) {
		var year = dateObj.getFullYear();
		return day + " " + month + " " + year;
	} else {
		return day + " " + month;
	}
} // niceDate()
const niceTime = function(dateObj) {
	var hours = dateObj.getHours();
	var minutes = dateObj.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return hours + ":" + minutes;
} // niceTime()

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
	refresh: function() {
		DataLayer.events(function(r) {

		});
	},
	render: function() {
		switch (this.props.left) {
			case "back":
				var left = (
					<div className="left-anchor">
						<a href="#" className="maticon">chevron_left</a>
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
							<li className="pep-logo-link"><img src="img/PEP_logo.png" /></li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/my" onClick={this.toggleMenu}><i className="maticon">query_builder</i> My Schedule</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/" onClick={this.toggleMenu}><i className="maticon">explore</i> Explore</Link>
							</li>
							<li className="menu-link">
								<Link activeClassName="active-menu-link" to="/social" onClick={this.toggleMenu}><i className="maticon">question_answer</i> Social</Link>
							</li>
						</ul>
						<a onClick={this.toggleMenu} className="maticon">menu</a>
					</div>
				);
				var headerStyle = "top";
			break;
			case "refresh":
				var right = (
					<div className="right-anchor">
						<a onClick={this.refresh} className="maticon">cloud_download</a>
					</div>
				);
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
		return(
			<div className={"app-header headertype-" + headerStyle + " eventheader-" + this.props.eventid} >
				{bgimg}
				{left}
				<span className="event-date-in-header">{this.props.eventDate}</span>
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
	faveme: function() {
		if (localStorage.eventsIfollow == undefined) {
			var eventsIfollow = {};
		} else {
			var eventsIfollow = JSON.parse(localStorage.eventsIfollow);
		}
		if (this.state.followed) {
			eventsIfollow[this.state.id] = "no";
		} else {
			eventsIfollow[this.state.id] = "yes";
		}
		this.setState({followed: !this.state.followed});
		localStorage.setItem("eventsIfollow", JSON.stringify(eventsIfollow));
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
					<a
						onClick={this.faveme}
						className={"maticon event-icon-in-list event-icon" + (this.state.followed ? " faved" : "")}>{this.state.followed ? "favorite" : "favorite_border"}</a>
					<Link to={"/events/" + element.id}>
						{(element.hasOwnProperty("medium_image")) ? <img src={element.medium_image} /> : (element.hasOwnProperty("thumbnail_image") ? <img src={element.thumbnail_image} /> : <img/> )}
						<h5 className="list-item-title">
								{element.title.rendered}
						</h5>
						<div className="list-item-description">
							<p className="list-item-description-text">{element.acf.speaker} & {element._OrganizerOrganizer}</p>
							<p className="list-item-description-time">{nice_date} {fromNicetime} to {toNicetime}</p>
						</div>
					</Link>
				</div>
			);
		} else {
			return (<li></li>);
		}
	}
}); // EventListItem

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
			this.setState
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
	share: function() {
		window.plugins.socialsharing.share(
			"Hello World!",
			"You might be interested in",
			null,
			"http://www.pep.photo/"
		);
	},
	componentDidMount: function() {
		// load data into events array
		if (localStorage.events != undefined) {
			var events = jQuery.parseJSON(localStorage.events);
			// console.log(events);
			// var sorted = events.sort(function(a, b) {
			// 	if (a.hasOwnProperty.hero_event && b.hasOwnProperty.hero_event) {
			// 		console.log("0");
			// 		return 0;
			// 	}
			// 	if (a.hasOwnProperty.hero_event && !b.hasOwnProperty.hero_event) {
			// 		console.log("-1");
			// 		return -1;
			// 	}
			// 	if (!a.hasOwnProperty.hero_event && b.hasOwnProperty.hero_event) {
			// 		console.log("1");
			// 		return 1;
			// 	}
			// }).reverse();
			// console.log(sorted);
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
		var events = this.state.events.map( function(element, idx) {
			if (element.hasOwnProperty("hero_event")) {
				var listType = "hero";
				var listItemClass = "list-item list-item-hero";
			} else {
				var listType = "normal";
				var listItemClass = "list-item list-item-normal";
			}
			// console.log(element);
			return (
				<EventListItem
					key={idx}
					id={element.id}
					element={element}
					listType={listType}
					listItemClass={listItemClass} />
			);
		});
		var header = (<Header title="PEP" right="menu" />);
		return (
			<section className="list-view">
				{header}
				{events}
			</section>
		);
	}
}); // Home
const Faved = React.createClass({
	getInitialState: function() {
		return {
			events: [],
			haveFaves: false
		}
	},
	componentDidMount: function() {
		// load data into events array
		if (localStorage.events != undefined) {
			if (localStorage.eventsIfollow != undefined) {
				var events = jQuery.parseJSON(localStorage.events);
				var eventsIfollow = jQuery.parseJSON(localStorage.eventsIfollow);
				var myEvents = [];
				for (var i = events.length - 1; i >= 0; i--) {
					if (eventsIfollow[events[i].id] == "yes") {
						myEvents.push(events[i]);
						this.setState({haveFaves: true});
					}
				}
			}
			this.setState({
				events: myEvents
			});
		}
	},
	render: function() {
		var events = this.state.events.map( function(element, idx) {
			var listItemClass = "list-item list-item-normal";
			return (
				<EventListItem
					key={idx}
					id={element.id}
					element={element}
					listItemClass={listItemClass} />
			);
		});
		if (!this.state.haveFaves) {
			events = (
				<li className="empty-message">You haven&rsquo;t selected any events yet</li>
			);
		}
		var header = (<Header title="My Schedule" left="menu" />);
		return (
			<ul className="list-view">
				{header}
				{events}
			</ul>
		);
	}
}); // Faved
const Social = React.createClass({
	getInitialState: function() {
		return {
			socials: DataLayer.socials()
		};
	},
	render: function() {
		var socials = this.state.socials.map(function(element, idx) {
			return (
				<li className="social-box" key={idx}>
					<a href={element.link}>
						<img src={element.img} alt={element.caption} />
					</a>
				</li>
			);
		});
		return (
			<ul className="list-view">
				<Header title="Social" left="menu" />
				{socials}
			</ul>
		);
	}
});
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
			followed: false
		};
	},
	componentDidMount: function() {
		if (localStorage.eventsIfollow == undefined) {
			var eventsIfollow = {};
			eventsIfollow[this.props.params.id] = "no";
		} else {
			var eventsIfollow = JSON.parse(localStorage.eventsIfollow);
		}
		localStorage.setItem("eventsIfollow", JSON.stringify(eventsIfollow));
		var that = this
		DataLayer.event(that.props.params.id, function(theEvent) {
			that.setState({
				id: that.props.params.id,
				event: theEvent,
				followed: (eventsIfollow[that.props.params.id] == "yes")
			});
		});
	},
	faveme: function() {
		if (localStorage.eventsIfollow == undefined) {
			var eventsIfollow = {};
		} else {
			var eventsIfollow = JSON.parse(localStorage.eventsIfollow);
		}
		if (this.state.followed) {
			eventsIfollow[this.state.id] = "no";
		} else {
			eventsIfollow[this.state.id] = "yes";
		}
		this.setState({followed: !this.state.followed});
		localStorage.setItem("eventsIfollow", JSON.stringify(eventsIfollow));
	},
	share: function() {
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
						onClick={this.faveme}
						className={"maticon event-icon" + (this.state.followed ? " faved" : "")}>{this.state.followed ? "favorite" : "favorite_border"}</a>
					<a
						onClick={this.share}
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
});

React.render((
	<Router>
		<Route component={Main} title="PEP">
			<Route path="/" title="PEP" component={Home} />
				<Route path="events/:id" component={TheEvent} />
			<Route path="my" title="My Events" component={Faved} />
			<Route path="social" component={Social} />
			<Route path="register" />
		</Route>
	</Router>
	), document.getElementById("root")
);

document.addEventListener('deviceready', function() {
	console.log("deviceready fired");
	registerPushNotifications();
}, false);