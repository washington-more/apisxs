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
    var periodo = $.request.parameters.get('periodo');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        /**query = 'select T0."Code" as "Codigo",T0."U_AB_CUPE" as "Periodo",T1."PrcName" as "Sucursal",T2."SlpName" as "Vendedor",T0."U_AB_CUCB" as "Cobertura", '+
	'T0."U_AB_CUNP" as "Pedidos",T0."U_AB_CUUN" as "CodUnidadNegocio",T3."Name" as "UnidaNegocio",T0."U_AB_CUCT" as "Cuota" '+
'from '+dbname+'."@AB_COCU" T0 inner join '+dbname+'.OPRC T1 on T0."U_AB_CUSU"=T1."PrcCode" '+
	'inner join '+dbname+'.OSLP T2 on T0."U_AB_CUCV"=T2."SlpCode" '+
	'inner join '+dbname+'."@AB_UNPROV" T3 on T0."U_AB_CUUN"=T3."Code" '+
'where T0."U_AB_CUSU"=\''+suc+'\' and T0."U_AB_CUPE"=\''+periodo+'\' ';**/

        query = 'select T0."Code" as "Codigo",T12."U_AB_CUPE" as "Periodo",T1."PrcName" as "Sucursal",T2."SlpName" as "Vendedor",T0."U_AB_CUCB" as "Cobertura", '+
                	'T0."U_AB_CUNP" as "Pedidos",T0."U_AB_CUUN" as "CodUnidadNegocio",'+
                	'T0."U_AB_CUUN" as "UnidaNegocio",'+
                	//'T3."Name" as "UnidaNegocio",'+
                	'T0."U_AB_CUCT" as "Cuota" '+
                'from '+dbname+'."@AB_MACU" T0 '+
                    'inner join '+dbname+'.OPRC T1 on T0."U_AB_CUSU" = T1."PrcCode" '+
                    'inner join '+dbname+'."@AB_COCU" T12 on T0."Code" = T12."Code" '+
                	'inner join '+dbname+'.OSLP T2 on T0."U_AB_CUCV" = T2."SlpCode" '+
                	//'inner join '+dbname+'."@AB_AUNN" T3 on T0."U_AB_CUUN"=T3."Code" '+
                'where T0."U_AB_CUSU"=\''+suc+'\' and T12."U_AB_CUPE"=\''+periodo+'\' ';
	        
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message + ' --- ' + rs[i]);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}