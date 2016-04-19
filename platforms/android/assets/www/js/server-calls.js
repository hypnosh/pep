var $ = jQuery;
var WP_API_Settings = {
	root: "http://pep.photo/wp-json/",
	nonce: null,
};
var wpApiSettings = {
	versionString : "wp/v2/",
}
var serverCalls = {
	getOne: function(postType, postId, success, failure) {
		$("#main").addClass('loading');
		$.ajax({
			url: WP_API_Settings.root + wpApiSettings.versionString  + postType + '/' + postId,
			method: 'GET',
			beforeSend: function(xhr) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );
			}
		}).done(function(response) {
			// console.log("done");
			success(response);
		}).fail(function(response) {
			console.log("fail");
			if (typeof(failure) == "function") {
				failure(response);
			}
		}).always(function(response) {
			$("#main").removeClass('loading');
		});
	},
	getAll: function(postType, success, failure) {
		$("#main").addClass('loading');
		if (postType.indexOf("&") > -1) {
			var ptArr = postType.split("&");
			postType = ptArr[0];
			postMeta = ptArr[1];
		} else {
			postMeta = '';
		}
		// console.log(WP_API_Settings.root + wpApiSettings.versionString + postType + '/' + (postMeta != "" ? "?filter[meta_value]=" + postMeta : ""));
		$.ajax({
			url: WP_API_Settings.root + wpApiSettings.versionString + postType + '/' + (postMeta != "" ? "?filter[meta_value]=" + postMeta : ""),
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );
			}
		}).done(function(response) {
			// console.log("done");
			success(response);
		}).fail(function(response) {
			if (typeof(failure) == "function") {
				failure(response);
			}
		}).always(function(response) {
			$("#main").removeClass('loading');
		});
	},
	updatePost: function(postType, postData, success, failure) {
		console.log(postData);
		$("#main").addClass('loading');
		if (postData.id == undefined) {
			var endpointUrl = WP_API_Settings.root + wpApiSettings.versionString + postType + '/';
		} else {
			var endpointUrl = WP_API_Settings.root + wpApiSettings.versionString + postType + '/' + postData.id;
		}
		$.ajax({
			url: endpointUrl,
			method: 'POST',
			data: postData,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );
			}
		}).done(function(response) {
			console.log("done");
			success(response);
		}).fail(function(response) {
			if (typeof(failure) == "function") {
				failure(response);
			}
		}).always(function(response) {
			$("#main").removeClass('loading');
		});
	},
	deleteObject: function(id, success, failure) {
		$("#main".addClass('loading'));
		$.ajax({
			url: WP_API_Settings.root + 'llama/v1/delete/',
			method: 'POST',
			data: {
				id: id,
			},
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );
			}
		}).done(function(response) {
			success(response);
		}).fail(function(response) {
			if (typeof(failure) == "function") {
				failure(response);
			}
		}).always(function(response) {
			$("#main").removeClass('loading');
		});
	},
	toggleLink: function(childId, parentId, success, failure) {
		$("#main").addClass('loading');
		$.ajax({
			url: WP_API_Settings.root + 'llama/v1/toggle_meta',
			method: 'POST',
			data: {
				child_id: childId,
				parent_id: parentId
			},
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );
			}
		}).done(function(response) {
			success(response);
		}).fail(function(response) {
			if (typeof(failure) == "function") {
				failure(response);
			}
		}).always(function(response) {
			$("#main").removeClass('loading');
		});
	}
};