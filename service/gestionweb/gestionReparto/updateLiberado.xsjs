$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarVisita(empresa,consolidado, clave) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '."@AB_PRDC" set "U_AB_DCPL"=\'Y\' ';
		var where = ' where "Code"=\'' + consolidado + '\' and "U_AB_DCDE"=' + clave;
		query += where;

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

function ActualizarMontos(empresa,consolidado, clave) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update T0 set T0."U_AB_CCCT"=T0."U_AB_CCCT"-T1."U_AB_DCTT" from ' + dbname + '."@AB_PRCC" T0 inner join '+ dbname + '."@AB_PRDC" T1 on T0."Code"=T1."Code" ';
		var where = ' where T0."Code"=\'' + consolidado + '\' and T1."U_AB_DCDE"=' + clave;
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
	var cons = $.request.parameters.get('cons');
	var docentry = $.request.parameters.get('docentry');

	if (empId !== undefined && cons !== undefined && docentry !== undefined ) {
		conn = $.db.getConnection();

        var precbase = ActualizarVisita(empId, cons, docentry);
		if (precbase === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase);
		}
		var precbase2 = ActualizarMontos(empId, cons, docentry);
		if (precbase2 === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase2);
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