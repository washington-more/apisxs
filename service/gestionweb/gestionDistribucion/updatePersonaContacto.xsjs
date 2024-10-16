$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarVisita(empresa,vendedor, ruta, lunes, martes, miercoles,jueves,viernes,sabado,domingo) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '.OCPR set "U_AB_PCLU"=\'' + lunes + '\', "U_AB_PCMA"=\'' + martes + '\', "U_AB_PCMI"=\'' + miercoles + '\', "U_AB_PCJU"=\'' + jueves + '\', "U_AB_PCVI"=\'' + viernes + '\', "U_AB_PCSA"=\'' + sabado + '\', "U_AB_PCDO"=\'' + domingo + '\' ';
		var where = ' where "U_AB_PCCV"=\'' + vendedor + '\' and "U_AB_PCRU"=\'' + ruta +'\'  ';
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
	var cove = $.request.parameters.get('cove');
	var rut = $.request.parameters.get('rut');
	var lun = $.request.parameters.get('lun');
	var mar = $.request.parameters.get('mar');
	var mie = $.request.parameters.get('mie');
	var jue = $.request.parameters.get('jue');
	var vie = $.request.parameters.get('vie');
	var sab = $.request.parameters.get('sab');
	var dom = $.request.parameters.get('dom');

	if (empId !== undefined && cove !== undefined && rut !== undefined && lun !== undefined) {
		conn = $.db.getConnection();

		//actualizar OV
		//var precbase = ActualizarPrecios(empId, itemcode, pricel, marg, comment, codal);
        var precbase = ActualizarVisita(empId, cove, rut, lun, mar, mie, jue, vie, sab, dom);
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