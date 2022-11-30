sap.ui.define([
	'sap/m/MessageToast',
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (MessageToast, Controller) {
		"use strict";

		return Controller.extend("uploadfile.controller.Home", {
			onInit: function () {

			},

			handleUploadComplete: function (oEvent) {
				const sStatus = oEvent.getParameter("status");
				var sResponse = oEvent.getParameter("responseRaw");

				
				if (sStatus === 201) {
					MessageToast.show('Upload Completado');
				} else {
					const errorPost = jQuery.parseXML(sResponse).querySelector("errordetails").querySelector("message").textContent;
					const errorMsg = 'Error: ' + errorPost;
					MessageToast.show(errorMsg);
				}
			},

			handleUploadPress: function () {
				var oFileUploader = this.byId("fileUploader");

				//   Se genera el nuevo token para el post del archivo
				const csrfToken = this.getView().getModel().getSecurityToken();
				oFileUploader.setSendXHR(true);

				//   Se agrega el header con el token generado
				var headerParma = new sap.ui.unified.FileUploaderParameter();
				headerParma.setName('x-csrf-token');
				headerParma.setValue(csrfToken);
				oFileUploader.addHeaderParameter(headerParma);

				//   Se agrega un nuevo header con el nombre del archivo
				var headerParma2 = new sap.ui.unified.FileUploaderParameter();
				headerParma2.setName('slug');
				headerParma2.setValue(oFileUploader.getValue());
				oFileUploader.addHeaderParameter(headerParma2);

				//   Se agrega un nuevo header con un tipo de pedido como prueba de 
				// pase de parámetros en el header
				var headerParma3 = new sap.ui.unified.FileUploaderParameter();
				headerParma3.setName('ponumber');
				headerParma3.setValue('1500000001');
				oFileUploader.addHeaderParameter(headerParma3);


				oFileUploader.checkFileReadable().then(function () {
					oFileUploader.upload();
					oFileUploader.destroyHeaderParameters();
				}, function (error) {
					MessageToast.show("The file cannot be read. It may have changed.");
				}).then(function () {
					oFileUploader.clear();
				});
			}

		});
	});
