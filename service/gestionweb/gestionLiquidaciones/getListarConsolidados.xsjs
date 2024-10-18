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
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select "Codigo","Estado","CodTipo","TipoDesc","Fecha","Sucursal","Vehiculo","Chofer","Pedidos","Clientes","TotalContado","TotalCredito","EstadoCon" from( '+
        'select distinct T0."Code" as "Codigo",\'A\' as "Estado", '+
        'T4."Code" as "CodTipo", T4."Name" as "TipoDesc", '+
        'TO_VARCHAR(TO_DATE(T0."U_AB_CCFP"), \'YYYY-MM-DD\') as "Fecha",T1."PrcName" as "Sucursal",T2."U_AB_DCCV" as "Vehiculo",T3."Name" as "Chofer", '+
        'T0."U_AB_CCTP" as "Pedidos",T0."U_AB_CCTK" as "Clientes",T0."U_AB_CCCT" as "TotalContado", '+
        'T0."U_AB_CCKT" as "TotalCredito", '+
        '(select count(S0."CardCode") from '+dbname+'.OINV S0 where "DocStatus"=\'O\' and S0."U_AB_CODCON"=T0."Code") as "Lineas", '+
        'case when T0."U_AB_CCEL"=\'L\' then \'Liquidado\' else \'Pendiente\' end as "EstadoCon" '+
        'from '+dbname+'."@AB_PRCC" T0 inner join '+dbname+'.OPRC T1 on T0."U_AB_CCSU"=T1."PrcCode" '+
        	'inner join '+dbname+'."@AB_PRDC" T2 on T0."Code"=T2."Code" '+
        	'inner join '+dbname+'."@SYP_CONDUC" T3 on T0."U_AB_CCCH"=T3."Code" '+
        	'inner join '+dbname+'."@AB_PLTC" T4 on T0."U_AB_CCTC"=T4."Code" '+
        'where T1."DimCode"=3 and T1."Active"=\'Y\' and T0."U_AB_CCSU"=\''+suc+'\' and T0."U_AB_CCFP"=\''+fecha+'\' '+
        ')Q0 where "Lineas">0';

	        
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