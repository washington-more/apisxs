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
    var clave = $.request.parameters.get('clave');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
                    
        query ='select T0."LineNum" as "linea", '+
                    'T0."ItemCode" as "codArticulo", '+
                    'T0."Dscription" as "descripcion", '+
                    'T0."Quantity" as "cantidad", '+
                    'T0."WhsCode" as "Almacen", '+
                    'T0."Price" as "precio", '+
                    'T0."DiscPrcnt" as "descuento", '+
                    'T0."VatSum" as "impuesto", '+
                    'T0."LineTotal" as "total", '+
                    'T0."unitMsr" as "unidad", '+
                    'T0."U_JA_CODPRECIO" as "lprecio", '+
                    '\'\' as "LoteAsignado", '+
                    'T0."OcrCode" as "area", '+
                    '(SELECT IFNULL(T1."U_AB_CODE",\'\') FROM ' + dbname + '.OITM T2 INNER JOIN ' + dbname + '.OITB T1 '+
                    'ON T2."ItmsGrpCod"=T1."ItmsGrpCod" WHERE T2."ItemCode" = T0."ItemCode") as "Clinea", '+
                    'T0."OcrCode3" as "centroCosto", '+
                    'T0."InvQty" as "CantidadInventario", '+
                    'T1."ManBtchNum" as "Glotes" '+
                    'from ' + dbname + '.RDR1 T0 inner join ' + dbname + '.OITM T1 on T0."ItemCode"=T1."ItemCode" '+
                    'where T0."DocEntry"=' + clave;
	        
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