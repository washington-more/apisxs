$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarVisita(empresa,cli,mont) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '."OCRD" set "U_AB_SNLQ"=ifnull("U_AB_SNLQ",0)+'+mont+' ';
		var where = ' where "CardCode"=\'' + cli + '\' ';
		query += where;

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

try {

	var empId = $.request.parameters.get('empId');
	var cliente = $.request.parameters.get('cliente');
	var monto = $.request.parameters.get('monto');

	if (empId !== undefined && cliente !== undefined && monto !== undefined) {
		conn = $.db.getConnection();

		//actualizar OV
		//var precbase = ActualizarPrecios(empId, itemcode, pricel, marg, comment, codal);
        var precbase = ActualizarVisita(empId, cliente, monto);
		if (precbase === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase);
		}
	} else {
		objType = Constants.ERROR_MESSAGE_RESPONSE;
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}

	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);

} catch (e) {
	objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
} finally {
	conn.close();
}