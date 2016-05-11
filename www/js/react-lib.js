function toTitleCase(str) {
	if (typeof(str) !== "string") {
		return str;
	}
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
const DataLayer = {
	tag: function(id) {
		var home = this;
		if (localStorage.getItem("tag_" + id) != undefined) {
			return localStorage.getItem("tag_" + id);
		} else {
			home.loadTags();
		}
	},
	loadTags: function() {
		serverCalls.getAll("tags?per_page=100", function(response) {
			// console.log(response);
			for (var i = response.length - 1; i >= 0; i--) {
				var response_one = response[i];
				localStorage.setItem("tag_" + response_one.id, response_one.name);
			};
		}, function(error) {
			console.log(error);
		});
	},
	event: function(id, callback) {
		var home = this;
		if (localStorage.getItem("event_" + id) != undefined) {
			callback(jQuery.parseJSON(localStorage.getItem("event_" + id)));
		} else {
			serverCalls.getOne("events", id, function(response) {
				home.getImages(response, "event");
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
				home.getImages(response_one, "event");
				// console.log(i);
			}
			localStorage.setItem("events", JSON.stringify(response));
			if (!amInew && (typeof(callback) == "function")) {
				callback(response);
			}
		}, function(error) {
			console.log(error);
		});
		if (amInew) {
			this.loadTags();
			callback(jQuery.parseJSON(localStorage.getItem("events")));
		}
	},
	getImages: function(response_one, type, spCallback) {
		if (response_one.featured_media > 0) {
			console.log("featured " + response_one.featured_media);
			serverCalls.getOne("media", response_one.featured_media, function(media) {
				if (media.media_details.sizes.app !== undefined) {
					response_one.medium_image = media.media_details.sizes.app.source_url;
				} else if (media.media_details.sizes.medium !== undefined) {
					response_one.medium_image = media.media_details.sizes.medium.source_url;
				}
				response_one.thumbnail_image = media.media_details.sizes.thumbnail.source_url;

				if (type == "shareable") {
					var eventId = response_one._custom_post_type_onomies_relationship;
					console.log(eventId + " is the shareable's parent event");
					if (localStorage.getItem("socialsof_" + eventId) == undefined) {
						var socialOfEvent = {};
					} else {
						var socialOfEvent = JSON.parse(localStorage.getItem("socialsof_" + eventId));
					}
					socialOfEvent[response_one.date] = response_one;
						// socialOfEvent.unshift(response_one);	// add the shareable to the array of its
																// event, in the beginning
					localStorage.setItem("socialsof_" + eventId, JSON.stringify(socialOfEvent));
				}
				localStorage.setItem(type + "_" + response_one.id, JSON.stringify(response_one));
				if (typeof(spCallback) == "function") {
					// spCallback(response_one);
				}
			}, function(error) {
				console.log(error);
			});
		}
	},
	participants: function(callback) {
		if (localStorage.participants != undefined) {
			if (typeof(callback) == "function") {
				callback(JSON.parse(localStorage.participants));
			}
		}
		serverCalls.getAll("participants?per_page=85", function(response) {
			localStorage.setItem("participants", JSON.stringify(response));
		}, function(error) {
			console.log(error);
		});
	},
	partners: function(callback) {
		if (localStorage.partners != undefined) {
			if (typeof(callback) == "function") {
				callback(JSON.parse(localStorage.partners));
			}
		}
		serverCalls.getAll("partners", function(response) {
			localStorage.setItem("partners", JSON.stringify(response));
		}, function(error) {
			console.log(error);
		});
	},
	socials: function(callback) {
		var home = this;
		serverCalls.getAll("shareables", function(response) {
			for (var i = response.length - 1; i >= 0; i--) {
				var response_one = response[i];
				var tags = response_one.tags.map( function(element, idx) {
					return home.tag(element);
				});
				response_one.tags = tags;
				home.getImages(response_one, "shareable", callback);
			}
			callback(response);
		}, function(error) {
			console.log(error);
		});
	}
}; // DataLayer

const dateForSafari = function(dateString) {
	if (typeof(dateString) == "object") {
		dateString = dateString[0];
	} else {
		console.log(typeof(dateString));
	}
	return new Date(dateString.replace(/-/g, "/"));
}; // dateForSafari

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
}; // niceDate()
const niceTime = function(dateObj) {
	var hours = dateObj.getHours();
	var minutes = dateObj.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return hours + ":" + minutes;
}; // niceTime()

const haptic = function() {
	if (window.plugins != undefined) {
		window.plugins.deviceFeedback.haptic(window.plugins.deviceFeedback.VIRTUAL_KEY);
	}
}; // haptic
