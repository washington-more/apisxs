$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarPrecios(empresa, fec, suc, coc) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
	    if(coc!==''){
	        
    		var dbname = functions.GetDataBase(empresa);
    
    		query = 'update ' + dbname + '.ORDR set "U_SYP_MDVC"=null, "U_AB_CODCON"=\'\' '+
        		    'where "U_AB_SUCURSAL"=\'' + suc +'\' and "U_AB_CODCON"=\'' + coc +'\' and "CANCELED"=\'N\' and "DocStatus"=\'O\' ';
    		//query += where;
    		//var where = ' where "DocDate"=\'' + fec + '\' and "U_AB_SUCURSAL"=\'' + suc +'\' and "U_AB_CODCON"=\'' + coc +'\' ';
    
    		var pstmt = conn.prepareStatement(query);
    		pstmt.execute();
        }

	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

try {

	var empId = $.request.parameters.get('empId');
	var suc = $.request.parameters.get('suc');
	var fec = $.request.parameters.get('fec');
	var coc = $.request.parameters.get('coc');

	if (empId !== undefined && coc !== undefined && suc !== undefined && fec !== undefined) {
		conn = $.db.getConnection();

		//actualizar OV
		var precbase = ActualizarPrecios(empId, fec, suc, coc);

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