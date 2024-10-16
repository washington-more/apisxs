$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
	    // query = 'select "U_AB_MNF9" as "codigo", "U_AB_MNDS" as "nombre" from '+dbname+'."@AB_MNCD" where "U_AB_MNTD" in (\'NC\')';
        query = 'select "Code" as "codigo","U_AB_MNDS" as "nombre" from '+dbname+'."@AB_MNCD" where "U_AB_MNTD" in (\'NC\')';

    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	
    	if (rs.length > 0)
    	{
	        var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    activity = '{';   
    		    activity += '"codigo": "'+rs[i].codigo+'",';
    		    activity += '"nombre": "'+rs[i].nombre+'"';
    		    activity += "}";
            	mResult.push(JSON.parse(activity));
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