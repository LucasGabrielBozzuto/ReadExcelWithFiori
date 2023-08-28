sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator,MessageToast) {
	"use strict";

	return Controller.extend("LGB4.Carpinteria.controller.Master", {
		onInit: function () {
			var oModel = new JSONModel([]);
			this.getView().setModel(oModel, "excelModel");
		},
		uploadExcel: function(oEvent){
			this._importExcel(oEvent.getParameter("files"), 0)
		},
		_importExcel: function(files, index){
			var file = files[index];
			
			if(file && window.FileReader){
				var excelData = [];
				var reader = new FileReader();
				
				reader.onload = function (oEvent){
					var data = oEvent.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'	
					});
					var excelModel = this.getView().getModel("excelModel");
					var json = excelModel.getData();
					
					var lastId = 1;
					
					if (json.length > 0){
						lastId = json[json.length - 1].id + 1;
					}
					
					workbook.SheetNames.forEach(function (sheetName) {
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
						
						for(var i in excelData){
							excelData[i].id = lastId;
							lastId = lastId + 1;
							excelData[i].IDLOCAL = excelData[i]["IDLOCAL"];
							excelData[i].NOMBREPRODUCTO = excelData[i]["NOMBREPRODUCTO"];
							excelData[i].VALOR = excelData[i]["VALOR"];
							json.push(excelData[i]);
						}
						excelModel.refresh();
						
					});
				}.bind(this);
				
				reader.onerror = function (ex){
					console.log(ex);
				}.bind(this);
				
				reader.readAsBinaryString(file);
				
			}
			let IDLOCAL = this.getView().getModel("excelModel").getData();
		},
		onUploadFiles: function(oEvent){
			var OData = this.getView().getModel();
			var that = this;
			var Exceldata = this.getView().getModel("excelModel").getData();
			var sPath = "/PRODUCTOSet";
			OData.setUseBatch(false);
			/*var data = {
				"Nombrelocal" : "ejemplo"
			}
			
			OData.create(sPath, data, {
	            success: function (response) {
	                debugger;
				},
				error: function(error){
					debugger;
				}
				
			});*/
			
			
			
			for (var i=0; i<Exceldata.length; i++){
				var data =	{
					"Idlocal" : "",
					"Nombreproducto" : "",
					"Valor" : ""
				};
				data.Idlocal = Exceldata[i].IDLOCAL;
				data.Nombreproducto = Exceldata[i].NOMBREPRODUCTO;
				data.Valor = Exceldata[i].VALOR;
				OData.create(sPath,data, {
                    success: function (response) {
                        debugger;
					},
					error: function(error){
						debugger;
					}
			
				}
			)};
			
		}
	})
})