sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], function(Controller, UIComponent, History) {
	"use strict";

	var oModel;
	return Controller.extend("Test.sapui5firstApp.controller.ComboBoxUse", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Test.sapui5firstApp.view.ComboBoxUse
		 */
		onInit: function() {
			oModel = this.getOwnerComponent().getModel("Ztest1");
			oModel.setUseBatch(false);
			this.getView().setModel(oModel);

			// var combobox1 = this.getView().byId("combobox1");
			// if (!combobox1) {
			// 	combobox1.setFilterFunction(function(sTerm, oItem) {
			// 		// A case-insensitive 'string contains' filter
			// 		return oItem.getText().match(new RegExp(sTerm, "i")) || oItem.getKey().match(new RegExp(sTerm, "i"));
			// 	});
			// }
		},
		handleLoadItems: function(oControlEvent) {
			oControlEvent.getSource().getBinding("items").resume();
		},
		onNavPress: function(oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash != undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("mainapp", {}, true);
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Test.sapui5firstApp.view.ComboBoxUse
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Test.sapui5firstApp.view.ComboBoxUse
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Test.sapui5firstApp.view.ComboBoxUse
		 */
		//	onExit: function() {
		//
		//	}

	});

});