cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-gcmpushplugin/www/gpp.js",
        "id": "cordova-plugin-gcmpushplugin.GCMPushPlugin",
        "clobbers": [
            "GcmPushPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-gcmpushplugin": "1.2.0",
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-x-socialsharing": "5.0.12"
}
// BOTTOM OF METADATA
});