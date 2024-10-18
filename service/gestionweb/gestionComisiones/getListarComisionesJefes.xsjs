$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var cod;
var periodo;
var query;

try{
    empId = $.request.parameters.get('empId');
    periodo = $.request.parameters.get('periodo');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
    	var conn = $.hdb.getConnection();
        query = conn.loadProcedure(dbname, "JA_COMISIONES_JEFEVENT"); 
        var params = query({ "periodo": periodo});
        var rs = params['$resultSets'];
    	conn.close();
    	
    	
    	if (rs.length > 0)
    	{
    		var mResult = [];
    		var i;
    		for(i = 0; i < rs.length ; i++)
    		{
	            var row = rs[i];
    		    for(var col in row) {
            	    mResult.push(row[col]);
    		    }
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;

    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}

}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, 'Tabla de usuario no encontrada');
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}