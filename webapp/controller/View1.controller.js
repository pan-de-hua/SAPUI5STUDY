sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, UIComponent, History, formatter, Filter, FilterOperator) {
	"use strict";
	var oModel;
	var sCurrentPath; // current path
	var sCurrentRow; // cureent row
	return Controller.extend("Test.sapui5firstApp.controller.View1", {
		formatter: formatter,
		// btn_press: function() {
		// 	oModel.read("/ZPM_CODEGROUP(codegruppe='1000',sprache='VI')", {
		// 		success: function(oData, oResponse) {
		// 			console.log(oResponse);
		// 			console.log(oData);
		// 		},
		// 		error: function(oError) {
		// 			console.log(oError);
		// 		}
		// 	});
		// },
		openDialog: function() {
			var oView = this.getView();
			var oEmpDialog = oView.byId("Dialog");
			if (!oEmpDialog) {
				oEmpDialog = sap.ui.xmlfragment(oView.getId(),
					"Test.sapui5firstApp.view.Dialog");
				oView.addDependent(oEmpDialog);
			}
			//window.console.log(oEmpDialog);
			oEmpDialog.open();

			// Attach press event for CancelButton
			var oCancelButton = oView.byId("CancelButton");
			oCancelButton.attachPress(function() {
				sCurrentRow = "";
				oEmpDialog.close();
			});
		},
		onCreate: function() {
			var oView = this.getView();
			this.openDialog();
			var oDialog = oView.byId("Dialog");
			oDialog.setTitle("创建物料");
			oView.byId("Dialog.MATNR").setEditable(true);
			oView.byId("SaveEdit").setVisible(false);
			oView.byId("SaveCreate").setVisible(true);

			// clear
			oView.byId("Dialog.MATNR").setValue("");
			oView.byId("Dialog.MAKTX").setValue("");
			// commit save
			oView.byId("SaveCreate").attachPress(function() {
				var oNewEntry = {
					"MATNR": "",
					"MAKTX": ""
				};
				// populate value from form
				oNewEntry.MATNR = oView.byId("Dialog.MATNR").getValue();
				oNewEntry.MAKTX = oView.byId("Dialog.MAKTX").getValue();
				// Commit creation operation
				oModel.create("/ZTEST1Set", oNewEntry, {
					success: function() {
						sap.m.MessageToast.show("保存成功.");
					},
					error: function(oError) {
						window.console.log("Error", oError);
					}
				});
				// close dialog
				if (oDialog) {
					oDialog.close();
				}
			});
		},
		onEdit: function() {
			// no row was selected
			if (!sCurrentRow) {
				sap.m.MessageToast.show("No row was selected.");
				return;
			}
			var oView = this.getView();
			this.openDialog();
			var oDialog = oView.byId("Dialog");
			oDialog.setTitle("修改物料");
			oView.byId("Dialog.MATNR").setEditable(false);
			oView.byId("SaveEdit").setVisible(true);
			oView.byId("SaveCreate").setVisible(false);
			// populate fields
			oView.byId("Dialog.MATNR").setValue(oModel.getProperty(sCurrentPath + "/MATNR"));
			oView.byId("Dialog.MAKTX").setValue(oModel.getProperty(sCurrentPath + "/MAKTX"));
			// Attach save event
			oView.byId("SaveEdit").attachPress(function() {
				var oChanges = {
					"MATNR": "",
					"MAKTX": ""
				};

				// populate value from form
				oChanges.MATNR = oView.byId("Dialog.MATNR").getValue();
				oChanges.MAKTX = oView.byId("Dialog.MAKTX").getValue();

				// commit creation
				oModel.update(sCurrentPath, oChanges, {
					success: function() {
						sap.m.MessageToast.show("修改保存成功.");
					},
					error: function(oError) {
						window.console.log("Error", oError);
					}
				});

				// close dialog
				if (oDialog) {
					oDialog.close();
				}
			});
		},
		onDelete: function() {
			var that = this;
			// no row was selected
			if (!sCurrentRow) {
				sap.m.MessageToast.show("No row was selected.");
				return;
			}
			var oDeleteDialog = new sap.m.Dialog();
			oDeleteDialog.setTitle("删除");
			var oText = new sap.m.Label({
				text: "是否要删除  物料 [" + sCurrentRow + "]？"
			});
			oDeleteDialog.addContent(oText);

			oDeleteDialog.addButton(
				new sap.m.Button({
					text: "Confirm",
					press: function() {
						that.deleteRowData();
						oDeleteDialog.close();
					}
				})
			);

			oDeleteDialog.open();
		},
		// deletion operation
		deleteRowData: function() {
			oModel.remove(sCurrentPath, {
				success: function() {
					sap.m.MessageToast.show("删除成功 .");
				},
				error: function(oError) {
					window.console.log("Error", oError);
				}
			});
		},

		onItemPress: function(evt) {
			var oContext = evt.getSource().getBindingContext();
			sCurrentPath = oContext.getPath();
			sCurrentRow = oContext.getProperty("MATNR");

			var oRouter = UIComponent.getRouterFor(this);
			var oItem = evt.getSource();
			var sPath = oItem.getBindingContext().getPath();
			oRouter.navTo("detail", {
				MATNR: encodeURIComponent(sPath)
			});
		},
		onInit: function() {
			oModel = this.getOwnerComponent().getModel("Ztest1");
			oModel.setUseBatch(false);
			this.getView().setModel(oModel);
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
		},
		onFilterMatnrs: function(oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("MAKTX", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oTable = this.byId("ztest1table");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});