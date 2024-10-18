$.import("AZH_MOBILE.Functions", "Functions");
$.import("AZH_MOBILE.Constants","Constants");
var functions = $.AZH_MOBILE.Functions;
var Constants = $.AZH_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;

var query;
var cadena;
var activity;
var suc ;
try{
    empId = $.request.parameters.get('empId');
    suc = $.request.parameters.get('suc');
    
	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
         query =   'select T0."U_AB_DCCV" as "CodVehiculo",T0."U_AB_DCDN" as "Documento",T0."U_AB_DCPE" as "Peso",T0."U_AB_DCVO" as "Volumen", '+
	    'T0."U_AB_DCFD" as "Fecha",T0."U_AB_DCCR" as "Credito",T0."U_AB_DCTT" as "Total",T0."U_AB_DCKR" as "Ruta", '+
    	'T0."Code" as "Consolidado",T0."U_AB_DCCK" as "CodCliente",T0."U_AB_DCCL" as "Cliente",T0."U_AB_DCQR" as "CodResponsable", '+
	    'T0."U_AB_DCNR" as "Responsable",T0."U_AB_DCDE" as "DocEntry",T0."U_AB_DCCM" as "Comentarios" '+
        'from '+dbname+'."@AB_PRDC" T0 inner join '+dbname+'."@AB_PRCC" T1 on T0."Code"=T1."Code" '+
        'where T0."U_AB_DCPL"=\'Y\' and "U_AB_CCSU"=\''+suc+'\'';
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
    // 		objResult = functions.CreateJSONObject(100,query, 1);
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