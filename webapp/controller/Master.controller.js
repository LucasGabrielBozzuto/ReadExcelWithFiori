sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("LGB4.Carpinteria.controller.Master", {
		onInit: function () {
			let oModel = new JSONModel([]);
			this.getView().setModel(oModel, "excelModel");
		},
		uploadExcel: function(oEvent){
			this._importExcel(oEvent.getParameter("files"), 0)
		},
		_importExcel: function(files, index){
			let file = files[index];
			
			if(file && window.FileReader){
				let excelData = [];
				let reader = new FileReader();
				
				reader.onload = function (oEvent){
					let data = oEvent.target.result;
					let workbook = XLSX.read(data, {
						type: 'binary'	
					});
					let excelModel = this.getView().getModel("excelModel");
					let json = excelModel.getData();
					
					let lastId = 1;
					
					if (json.length > 0){
						lastId = json[json.length - 1].id + 1;
					}
					
					workbook.SheetNames.forEach(function (sheetName) {
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
						
						for(var i in excelData){
							excelData[i].id = lastId;
							lastId = lastId + 1;
							excelData[i].IDLOCAL = excelData[i]["IDLOCAL"];
							excelData[i].NOMBRELOCAL = excelData[i]["NOMBRELOCAL"];
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
		}
	});
});