/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"LGB4/Carpinteria/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});