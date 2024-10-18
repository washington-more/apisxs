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
    var lprecio = $.request.parameters.get('lprecio');
    var codigo = $.request.parameters.get('codigo');
    var codagrupado = $.request.parameters.get('codagrupado');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select distinct * from ( '+
    'select T0."Code" as "codigo",\'AB_DARG\' as "UDO",T0."U_AB_DART" as "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU MAY-CON\',\'LP PIU MAY-CRE\',\'LP TUM MAY-CON\',\'LP TUM MAY-CRE\',\'LP CIX MAY-CON\',\'LP CIX MAY-CRE\', '+
    '\'LP TRU MAY-CON\',\'LP TRU MAY-CRE\',\'LP CHB MAY-CON\',\'LP CHB MAY-CRE\',\'LP CAX MAY-CON\',\'LP CAX MAY-CRE\',\'LP HUA MAY-CON\',\'LP HUA MAY-CRE\') '+ 
    'then T0."U_AB_DART" else 0 end as "Valor" '+
    'from '+dbname+'."@AB_DARG" T0 '+
	'inner join '+dbname+'."@AB_DDAR" T2 on T0."Code"=T2."Code" '+
    'where T0."U_AB_DARA"=\'Y\' and T0."U_AB_DARM"=\'Y\' and T0."Code"=\''+codigo+'\' and current_date between T0."U_AB_DARI" and T0."U_AB_DARF" '+
	'and T0."U_AB_DART">0 '+
	'and \''+codagrupado+'\' = (select STRING_AGG(T3."U_AB_DARCR") from '+dbname+'."@AB_DDAR" T3 where T3."Code"=T0."Code") '+
    'union all '+
    'select T0."Code" as "codigo",\'AB_DARG\' as "UDO",T0."U_AB_DART" as "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU BOD-CON\',\'LP PIU BOD-CRE\',\'LP TUM BOD-CON\',\'LP TUM BOD-CRE\',\'LP CIX BOD-CON\',\'LP CIX BOD-CRE\', '+
    '\'LP TRU BOD-CON\',\'LP TRU BOD-CRE\',\'LP CHB BOD-CON\',\'LP CHB BOD-CRE\',\'LP CAX BOD-CON\',\'LP CAX BOD-CRE\',\'LP HUA BOD-CON\',\'LP HUA BOD-CRE\') '+
    'then T0."U_AB_DART" else 0 end as "Valor" '+
    'from '+dbname+'."@AB_DARG" T0 '+
	'inner join '+dbname+'."@AB_DDAR" T2 on T0."Code"=T2."Code" '+
    'where T0."U_AB_DARA"=\'Y\' and T0."U_AB_DARB"=\'Y\' and T0."Code"=\''+codigo+'\' and current_date between T0."U_AB_DARI" and T0."U_AB_DARF" '+
	'and T0."U_AB_DART">0 '+
	'and \''+codagrupado+'\' = (select STRING_AGG(T3."U_AB_DARCR") from '+dbname+'."@AB_DDAR" T3 where T3."Code"=T0."Code") '+
    'union all '+
    'select T0."Code" as "codigo",\'AB_DARG\' as "UDO",T0."U_AB_DART" as "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU MER-CON\',\'LP PIU MER-CRE\',\'LP TUM MER-CON\',\'LP TUM MER-CRE\',\'LP CIX MER-CON\',\'LP CIX MER-CRE\', '+
    '\'LP TRU MER-CON\',\'LP TRU MER-CRE\',\'LP CHB MER-CON\',\'LP CHB MER-CRE\',\'LP CAX MER-CON\',\'LP CAX MER-CRE\',\'LP HUA MER-CON\',\'LP HUA MER-CRE\') '+
   'then T0."U_AB_DART" else 0 end as "Valor" '+
    'from '+dbname+'."@AB_DARG" T0 '+
	'inner join '+dbname+'."@AB_DDAR" T2 on T0."Code"=T2."Code" '+
    'where T0."U_AB_DARA"=\'Y\' and T0."U_AB_DARB"=\'Y\' and T0."Code"=\''+codigo+'\' and current_date between T0."U_AB_DARI" and T0."U_AB_DARF" '+
	'and T0."U_AB_DART">0 '+
	'and \''+codagrupado+'\' = (select STRING_AGG(T3."U_AB_DARCR") from '+dbname+'."@AB_DDAR" T3 where T3."Code"=T0."Code") '+
    ')Q1 '+
    'where Q1."Valor">=1';
	        
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
    	    objResult = functions.CreateJSONMessage(-101, "No existen datos");
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message + ' --- ' + rs[i]);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}