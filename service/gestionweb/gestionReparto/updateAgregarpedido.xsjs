$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarVisita(empresa,consolAnt,consolNue,clave,pla) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '."@AB_PRDC" set "Code"=\''+consolNue+'\', "U_AB_DCCV"=\''+pla+'\', "U_AB_DCPL"=\'N\' ,'+
		'"LineId"=(select ifnull(max(S0."LineId"),0)+1 from ' + dbname + '."@AB_PRDC" S0 where S0."Code"=\''+consolNue+'\') ';
		var where = ' where "Code"=\'' + consolAnt+'\' and "U_AB_DCDE"='+clave;
		query += where;

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

function ActualizarMontos(empresa,consolNue, clave) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update T0 set T0."U_AB_CCCT"=T0."U_AB_CCCT"+T1."U_AB_DCTT" from ' + dbname + '."@AB_PRCC" T0 inner join '+ dbname + '."@AB_PRDC" T1 on T0."Code"=T1."Code" ';
		var where = ' where T0."Code"=\'' + consolNue + '\' and T1."U_AB_DCDE"=' + clave;
		query += where;

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

function ActualizarOrdenes(empresa,consolNue,clave,pla) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '.ORDR set "U_AB_CODCON"=\''+consolNue+'\', "U_SYP_MDVC"=\''+pla+'\' ';
		var where = ' where "DocEntry"=' + clave;
		query += where;

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

function ActualizarFacturas(empresa,consolNue,clave,pla) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '.OINV set "U_AB_CODCON"=\''+consolNue+'\', "U_SYP_MDVC"=\''+pla+'\' ';
		var where = ' where "DocEntry"=(select S0."U_AB_DMRF" from ' + dbname + '.ORDR S0 where S0."DocEntry"='+clave+')';
		query += where;

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

function ActualizarEntregas(empresa,consolNue,clave,pla) {

	var updateResult = Constants.MESSAGE_SUCCESS;

	try {
		var dbname = functions.GetDataBase(empresa);

		query = 'update ' + dbname + '.ODLN set "U_AB_CODCON"=\''+consolNue+'\', "U_SYP_MDVC"=\''+pla+'\' ';
		var where = ' where "DocEntry"=(select S0."U_AB_DMER" from ' + dbname + '.ORDR S0 where S0."DocEntry"='+clave+')';
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
	var consAnt = $.request.parameters.get('consAnt');
	var consNue = $.request.parameters.get('consNue');
	var docentry = $.request.parameters.get('docentry');
	var placa = $.request.parameters.get('placa');

	if (empId !== undefined && consAnt !== undefined && consNue !== undefined ) {
		conn = $.db.getConnection();

        var precbase = ActualizarVisita(empId, consAnt, consNue,docentry,placa);
		if (precbase === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase);
		}
		var precbase2 = ActualizarOrdenes(empId, consNue,docentry,placa);
		if (precbase2 === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase2);
		}
		var precbase3 = ActualizarFacturas(empId, consNue,docentry,placa);
		if (precbase3 === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase);
		}
		var precbase4 = ActualizarEntregas(empId, consNue,docentry,placa);
		if (precbase4 === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase4);
		}
		var precbase5 = ActualizarMontos(empId, consNue,docentry);
		if (precbase5 === Constants.MESSAGE_SUCCESS) {
			objType = Constants.SUCCESS_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
			conn.commit();
		} else {
			conn.rollback();
			objType = Constants.ERROR_MESSAGE_RESPONSE;
			objResult = functions.CreateJSONMessage(-102, precbase5);
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