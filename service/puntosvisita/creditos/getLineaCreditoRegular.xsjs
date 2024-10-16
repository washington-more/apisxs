$.import("AZH_MOBILE.Functions", "Functions");
$.import("AZH_MOBILE.Constants", "Constants");

var functions = $.AZH_MOBILE.Functions;
var Constants = $.AZH_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var cliente;
var monto;
var query;

var activity;

try {
    
    empId = $.request.parameters.get('empId');
    cliente = $.request.parameters.get('cliente');
    
    if (empId !== null && empId !== undefined) {
        var dbname = functions.GetDataBase(empId);
        
        query = ' SELECT ifnull(T1."U_AB_SNLR",0)-ifnull(T1."U_AB_SNRQ",0) as "credito" FROM '+dbname+'."OCRD" T1' +
                ' WHERE T1."CardCode"=\''+cliente+'\'; ';
    

		
        var conn = $.hdb.getConnection();
        var rs = conn.executeQuery(query);
        conn.close();
        
        if (rs.length > 0)
    	{
	        var mResult = rs[0];
    		var i;
    		
    		
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;

    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	}
    } else {
        objType = Constants.ERROR_MESSAGE_RESPONSE;
        objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
    }

    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify(empId));

} catch (e) {
    objType = Constants.ERROR_MESSAGE_RESPONSE;
    objResult = functions.CreateJSONMessage(-9703000, 'Tabla de usuario no encontrada');
} finally {
    objResponse = functions.CreateResponse(objType, objResult, objCount);
    functions.DisplayJSON(objResponse, objType);
}