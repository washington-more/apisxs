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
    var consolidado = $.request.parameters.get('consolidado');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select T0."DocEntry",T0."DocNum","PrcName" as "Sucursal",T0."CardCode" as "CodCliente",T0."CardName" as "Cliente", '+
        'T2."SlpName" as "Vendedor",T4."Name" as "Ruta",T5."PymntGroup" as "Condicion",T0."DocTotal" as "Saldo", '+
        'case when T0."GroupNum"=-1 then (T0."DocTotal"-T0."PaidToDate") else 0 end as "Pago",T0."U_AB_DMMR" as "Rechazo",\'Efectivo\' as "TipoPago", '+
        ' '+dbname+'."JA_OBTENER_CAJA" (T0."U_AB_SUCURSAL") as "CuentaEfectivo", '+
        'T0."U_AB_DMCL" as "Comentario", T0."U_AB_DMNR" as RelacionadoNC, T6."Balance" as "SaldoCli", T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD" as "Documento", '+
        'T0."DocDate" as "FechaEmision" '+
        //'T0."U_AB_DMER" as "RelacionadoEntregas" '+
        'from '+dbname+'.OINV T0 inner join '+dbname+'.OPRC T1 on T0."U_AB_SUCURSAL"=T1."PrcCode" '+
        'inner join '+dbname+'.OCRD T6 ON T0."CardCode"=T6."CardCode" '+
	    'inner join '+dbname+'.OSLP T2 on T0."SlpCode"=T2."SlpCode" '+
	    'inner join '+dbname+'.INV12 T3 on T0."DocEntry"=T3."DocEntry" '+
	    'inner join '+dbname+'.OCTG T5 on T0."GroupNum"=T5."GroupNum" '+
	    //'inner join '+dbname+'."@AB_PRDC" T6 on T6."U_AB_DCDE"=T0."DocEntry" '+
	    'left join '+dbname+'."@AB_RUTAS" T4 on T0."U_AB_CRUTA"=T4."Code" '+
        'where T0."U_AB_CODCON"=\''+consolidado+'\' and "DocStatus"=\'O\'';

	        
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