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
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = ' SELECT T0."CardCode" AS "Cliente", '+
                    'T0."CardName" AS "Nombre", '+
                    'T0."Address" AS "Direccion", '+
                    'T4."LicTradNum" AS "Doc", '+
                    'T2."PymntGroup" AS "CondicionPago", '+
                    'T0."DocEntry" AS "Clave", '+
                    'T0."U_SYP_MDSD" || \'-\' || LPAD(CAST(T0."U_SYP_MDCD" AS NVARCHAR),7, \'0\') AS "Sunat", '+
                    'CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion", '+
                    'T1."SlpName" AS "Vendedor", '+
                    'TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision", '+
                    'T0."DocCur" AS "Moneda", '+
                    'T0."DocTotal" AS "Total", '+
                    '(T0."DocTotal"-T0."PaidToDate") AS "Saldo", '+
                    '\'\' AS "Pago_Fecha", '+ 
                    '0 AS "Pago_Dias", '+
                    '\'\' AS "Pago_Moneda", '+
                    '0 AS "Pagado_Importe" '+
                    'FROM '+dbname+'.OINV T0 '+
                    'INNER JOIN '+dbname+'.OSLP T1 ON T1."SlpCode" = T0."SlpCode" '+
                    'INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = T0."GroupNum" '+
                    'INNER JOIN '+dbname+'.OCRD T4 ON T4."CardCode" = T0."CardCode" '+
                    'WHERE '+
                    'T0."CANCELED" = \'N\' '+
                    'AND T0."DocTotal" <> T0."PaidToDate" '+
                    'AND T1."SlpCode" = '+cove+' '+
                    //'ORDER BY 1,5,6,3 ASC '+
                    'Union all '+
                    ' SELECT T0."CardCode" AS "Cliente", '+
                    'T0."CardName" AS "Nombre", '+
                    'T0."Address" AS "Direccion", '+
                    'T4."LicTradNum" AS "Doc", '+
                    'T2."PymntGroup" AS "CondicionPago", '+
                    'T0."DocEntry" AS "Clave", '+
                    'T0."U_SYP_MDSD" || \'-\' || LPAD(CAST(T0."U_SYP_MDCD" AS NVARCHAR),7, \'0\') AS "Sunat", '+
                    'CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion", '+
                    'T1."SlpName" AS "Vendedor", '+
                    'TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision", '+
                    'T0."DocCur" AS "Moneda", '+
                    'T0."DocTotal" AS "Total", '+
                    '(T0."DocTotal"-T0."PaidToDate") AS "Saldo", '+
                    '\'\' AS "Pago_Fecha", '+ 
                    '0 AS "Pago_Dias", '+
                    '\'\' AS "Pago_Moneda", '+
                    '0 AS "Pagado_Importe" '+
                    'FROM '+dbname+'.OINV T0 '+
                    'INNER JOIN '+dbname+'.OSLP T1 ON T1."SlpCode" = T0."SlpCode" '+
                    'INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = T0."GroupNum" '+
                    'INNER JOIN '+dbname+'.OCRD T4 ON T4."CardCode" = T0."CardCode" '+
                    'WHERE '+
                    'T0."CANCELED" = \'N\' '+
                    'AND T0."DocTotal" <> T0."PaidToDate" '+
                    'AND T0."U_AB_OILQ" = '+cove+' ';
                    //'ORDER BY 1,5,6,3 ASC ';
                    
	        
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