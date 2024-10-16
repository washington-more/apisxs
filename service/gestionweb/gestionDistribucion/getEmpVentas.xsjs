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
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select T0."SlpCode",T0."SlpName",T0."Memo",T0."Active",T0."Mobil",T0."Email",T0."U_AB_SUCURSAL",T1."U_MSS_NOSU", '+
	    'T0."U_AB_TIPDOC",T0."U_AB_DOCIDE",T0."U_AB_CARG",T2."Name",T3."U_AB_DESMES", T0."U_AB_CANA",'+
	    'T0."U_AB_GRUVEN",T4."Name" as "GrupVen",T0."U_AB_MEGV" '+
        'from '+dbname+'.OSLP T0 inner join '+dbname+'."@MSS_SUPER" T1 on T0."U_MSS_SUPE"=T1."Code" '+
        //'from '+dbname+'.OSLP T0 inner join '+dbname+'."@MSS_SUPE" T1 on T0."U_MSS_SUPE"=T1."Code" '+
	    'inner join '+dbname+'."@AB_CARGO" T2 on T0."U_AB_CARG"=T2."Code" '+
	    'inner join '+dbname+'."@AB_MESA" T3 on T0."U_AB_MESA"=T3."Code" '+
	    'inner join '+dbname+'."@AB_GRVE" T4 on T0."U_AB_GRUVEN"=T4."Code" '+
        'where T0."U_AB_SUCURSAL" =\''+suc+'\'';
	        
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
    	 
	}else{
	    objType = "MessageError";
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	    objResponse = functions.CreateResponse(objType, objResult, 0);
	    functions.DisplayJSON(objResponse, objType);
	} 
	
}catch(e){
    objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message + ' --- ' );
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}