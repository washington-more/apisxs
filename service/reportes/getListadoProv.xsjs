$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query = '';

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        // D.1A1   
        query ='select "U_AB_CODPROV","CardName","Total",round(("Total"*100)/"Total100",2) as "Porcentaje" '+
        'from( '+
        'select T2."U_AB_CODPROV",T3."CardName",sum(T0."LineTotal") as "Total", '+
        '(select sum(S0."LineTotal") from ' + dbname + '.RDR1 S0 inner join ' + dbname + '.ORDR S1 on S0."DocEntry"=S1."DocEntry" '+
        'where S1."DocDate"=current_date and S1."SlpCode"='+cove+' and S1."DocStatus"<>\'C\') as "Total100" '+
        'from ' + dbname + '.RDR1 T0 inner join ' + dbname + '.ORDR T1 on T0."DocEntry"=T1."DocEntry" '+
        'inner join ' + dbname + '.OITM T2 on T0."ItemCode"=T2."ItemCode" '+
        'left join ' + dbname + '.OCRD T3 on T2."U_AB_CODPROV"=T3."CardCode" '+
        'where T1."DocDate"=current_date and T1."DocStatus"<>\'C\' and T1."SlpCode"='+cove+' '+
        'group by T2."U_AB_CODPROV",T3."CardName" '+
        'order by T3."CardName" '+
        ')Q0';
        
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    		var mResult = [];
    		var i;
    		
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
    	    objResult = functions.CreateJSONMessage(-101, "No se ha configurado las cuentas para pagos recibidos. ("+empId+")");
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}