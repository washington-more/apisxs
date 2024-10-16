$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarPrecios(empresa, articulo, lista, precio, comment) {
//function ActualizarPrecios(empresa, articulo, lista, precio, comment, codal) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '."@AB_MARGENES" set "U_AB_MAMR"=' + precio + ', "U_AB_MACO"=\'' + comment + '\'';
		//var where = ' where "U_AB_MACA"=\'' + articulo + '\' and "U_AB_MACL"=\'' + lista +'\' and "U_AB_MAAL"=\'' + codal +'\' ';
		var where = ' where "U_AB_MACA"=\'' + articulo + '\' and "U_AB_MACL"=\'' + lista +'\'  ';
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
	var itemcode = $.request.parameters.get('itemcode');
	var pricel = $.request.parameters.get('pricel');
	var marg = $.request.parameters.get('marg');
	var comment = $.request.parameters.get('coment');
	//var codal = $.request.parameters.get('codal');

	if (empId !== undefined && pricel !== undefined && itemcode !== undefined && comment !== undefined) {
		conn = $.db.getConnection();

		//actualizar OV
		//var precbase = ActualizarPrecios(empId, itemcode, pricel, marg, comment, codal);
        var precbase = ActualizarPrecios(empId, itemcode, pricel, marg, comment);
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