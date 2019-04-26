sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createTestModel: function() {
			var oModel = new JSONModel({
				firstName: "Harry",
				lastName: "Hawk",
				enabled: true,
				address: {
					street: "Dietmar-Hopp-Allee 16",
					city: "Walldorf",
					zip: "69190",
					country: "Germany"
				}

			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}

	};
});