$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarEstadoAI(empresa, tipos, cod, est ) {
    
	var updateResult = Constants.MESSAGE_SUCCESS;
	try {
        
		var dbname = functions.GetDataBase(empresa);
		/** Bonficicaciones **/
		if(tipos==='AB_BUU'){
		    query = 'update ' + dbname + '."@AB_BUU" set "U_AB_BUAC"=\'' + est + '\'';
		}
		if(tipos==='AB_BCTC'){
		    query = 'update ' + dbname + '."@AB_BCTC" set "U_AB_BTCA"=\'' + est + '\'';
		}  
		if(tipos==='AB_DCEH'){
		    query = 'update ' + dbname + '."@AB_BTCE" set "U_AB_BCEA"=\'' + est + '\'';
		}
		if(tipos==='AB_BOBE'){
		    query = 'update ' + dbname + '."@AB_BOBE" set "U_AB_BBEA"=\'' + est + '\'';
		}
		if(tipos==='AB_DBAED'){
		    query = 'update ' + dbname + '."@AB_BAES" set "U_AB_BAEA"=\'' + est + '\'';
		}
		if(tipos==='AB_DBARC'){
		    query = 'update ' + dbname + '."@AB_BARG" set "U_AB_BARA"=\'' + est + '\'';
		}
		
		/** Descuentos **/
		if(tipos==='AB_DUUC'){
		    query = 'update ' + dbname + '."@AB_DUUC" set "U_AB_DUCA"=\'' + est + '\'';
		}
		if(tipos==='AB_DCST'){
		    query = 'update ' + dbname + '."@AB_DCST" set "U_AB_DTCA"=\'' + est + '\'';
		}  
		if(tipos==='AB_DCCE'){
		    query = 'update ' + dbname + '."@AB_DCCE" set "U_AB_DCCA"=\'' + est + '\'';
		}
		if(tipos==='AB_DTBO'){
		    query = 'update ' + dbname + '."@AB_DTBO" set "U_AB_DTBA"=\'' + est + '\'';
		}
		if(tipos==='AB_DAER'){
		    query = 'update ' + dbname + '."@AB_DAER" set "U_AB_DAEA"=\'' + est + '\'';
		}
		if(tipos==='AB_DBAR'){
		    query = 'update ' + dbname + '."@AB_DARG" set "U_AB_DARA"=\'' + est + '\'';
		}
		
		

		//query = 'update ' + detalle + '."@AB_MARGENES" set "U_AB_MAMR"=' + precio + ', "U_AB_MACO"=\'' + comment + '\'';
		var where = ' where "Code"=\'' + cod + '\'';
		query += where;
		
		/**query = 'update ' + dbname + '."@AB_MARGENES" set "U_AB_MAMR"=' + precio + ', "U_AB_MACO"=\'' + comment + '\'';
		var where = ' where "U_AB_MACA"=\'' + articulo + '\' and "U_AB_MACL"=' + lista;
		query += where;**/

		var pstmt = conn.prepareStatement(query);
		pstmt.execute();


	} catch (e) {
		updateResult = e.message;
	}

	return updateResult;
}

try {

	var empId = $.request.parameters.get('empId');
	var tipo = $.request.parameters.get('tipo');
	var codigo = $.request.parameters.get('codigo');
	var estado = $.request.parameters.get('estado');

	if (empId !== undefined && tipo !== undefined && codigo !== undefined && estado !== undefined) {
		conn = $.db.getConnection();

		//actualizar OV
		var precbase = ActualizarEstadoAI(empId, tipo, codigo, estado);

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