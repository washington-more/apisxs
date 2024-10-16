$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query;
var rs;
var i;

try{
 
    var empId = $.request.parameters.get('empId');
    var suc = $.request.parameters.get('suc');
    var fecha = $.request.parameters.get('fecha');
    var test = $.request.parameters.get('test');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = ' select T0."Code" from '+dbname+'."@AB_PRCC" T0 where T0."U_AB_CCSU"=\''+suc+'\' and T0."U_AB_CCFP"=\''+fecha+'\' order by T0."Code" ';
	        
	   if (test)
    	{
    	    objType = "MessageTest";
    	    objResult = functions.CreateJSONMessage(100, "Consula utilizada en el XS => "+query);
    	    objResponse = functions.CreateResponse(objType, objResult, 0);
    	    functions.DisplayJSON(objResponse, objType);
    	}else{
        	var conn = $.hdb.getConnection();
        	rs = conn.executeQuery(query);
        	conn.close();
    	    
    	    if (rs.length > 0)
        	{
        		var mResult = [];
        		
        		for(i = 0; i < rs.length ; i++)
        		{
            		mResult.push(rs[i]);
        		}
        		
        		objType = Constants.SUCCESS_OBJECT_RESPONSE;
        	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
        	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
        	    functions.DisplayJSON(objResponse, objType);
        	    
        	}else{
        	    objType = "MessageError";
        	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
        	    objResponse = functions.CreateResponse(objType, objResult, 0);
        	    functions.DisplayJSON(objResponse, objType);
        	}
    	}
    	 
	}else{
	    objType = "MessageError";
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	    objResponse = functions.CreateResponse(objType, objResult, 0);
	    functions.DisplayJSON(objResponse, objType);
	} 
	
}catch(e){
    objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message + ' --- ' + rs[i]);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}