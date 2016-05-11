const registerGCM = function(regId) {
	var myEmail = localStorage.myEmail;
	var data = {
		token: regId,
		os: "Android",
		email: myEmail
	};
	// $.get(API_Settings.server + "/?regId=" + regId, function(response) {
	// 	console.log("GCMed: " + response);
	// }, function(error) {
	// 	console.log(error);
	// });
	$.post(API_Settings.server + "pnfw/register/", data, function(response) {
		console.log(response);
	}, function(error) {
		console.log(error);
	});
}; // registerGCM
const registerPushNotifications = function() {
	var push = PushNotification.init({
		"android": {
			"senderID": "2177584716",
			"icon": "ic_stat_pep_logo",
			"iconColor": "#ffbe00"
		},
		"ios": {
			"alert": "true",
			"badge": "true",
			"sound": "true"
		},
		"windows": {}
	});
	console.log("starting push");
	push.on('registration', function(data) {
		// data.registrationId
		var regId = data.registrationId;
		if (localStorage.myEmail == undefined) {
			navigator.notification.prompt("What's your email address?", function(results) {
				if (results.buttonIndex == 2) {
					navigator.app.exitApp();
				} else {
					if ((results.input1 == "") || (results.input1.indexOf("@") == -1)) {
						navigator.notification.alert("Invalid email address", function() {
							location.reload();
						});
					} else {
						localStorage.setItem("myEmail", results.input1);
						registerGCM(regId);
					}
				}
			}, "PEP Talks", ['OK', 'Exit']);
		} else {
			registerGCM(regId);
		}
	});
	push.on('notification', function(data) {
		// data.message,
		// data.title,
		// data.count,
		// data.sound,
		// data.image,
		// data.additionalData
		console.log(data);
		window.location = "#social";
		location.reload();
		// navigator.notification.alert(data.message, function() {}, data.title);
	}); //onNotification
	push.on('error', function(error) {
		console.log(error);
	})
	PushNotification.hasPermission(function(data) {
		console.log(data);
	});
} // registerPushNotifications