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

var TheApp = React.createClass({
	render: function() {
		return(
			<Router>
				<Route path="/" component={App}>
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