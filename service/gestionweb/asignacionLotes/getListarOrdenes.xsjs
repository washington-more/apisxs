$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;
function limpiarComentarioss(comentario) {
    // Reemplazar cualquier caracter especial por una cadena vacía
    // Por ejemplo, eliminar todos los caracteres que no sean letras, números o espacios
    var comentarioLimpio = comentario.replace(/[^a-zA-Z0-9\s]/g, '-');
    return comentarioLimpio;
}
function obtenerLotes(database, docEntry, lineNum){
    
    var lstLotes = [];
    var lote = '';
    
    try{
        var mQuery = 'SELECT DISTINCT  T3."BatchNum" as "NroLote", ' +
                     '   				T3."Quantity" as "Cantidad", ' +
                     '   				T3."BaseLinNum" as "LineaBase" ' +
                     '   FROM '+database+'.OINV T0 INNER JOIN '+database+'.INV1 T2 ON T0."DocEntry" = T2."DocEntry" ' +
                     '   LEFT OUTER JOIN '+database+'.IBT1 T3 ON T0."DocNum" = T3."BaseNum" AND T3."ItemCode" = T2."ItemCode" ' +
                     '   WHERE T0."DocEntry" = '+docEntry+' AND T3."BaseLinNum" = ' + lineNum;
                     
        //var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	//mConn.close();
    	
    	if (mRS.length > 0)
    	{
    	    var j;
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    lote = '{'; 
    		    lote += '"Lote": "' + mRS[j].NroLote + '",';
        		lote += '"Cantidad": ' + mRS[j].Cantidad + ',';
        		lote += '"LineaBase": ' + mRS[j].LineaBase;
        		lote += "}";
        		
        		lstLotes.push(lote);
    		}
    	}else{
    	    return '';
    	}
                     
    }catch(e){
        return '';
    }
    
    return lstLotes.join(",");
}

function ObtenerLineas(clave, database,vend){
    
    try {
        
        var mQuery = 'select T0."LineNum" as "linea", '+
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
                    '(SELECT IFNULL(T1."U_AB_CODE",\'\') FROM '+database+'.OITM T2 INNER JOIN '+database+'.OITB T1 '+
                    'ON T2."ItmsGrpCod"=T1."ItmsGrpCod" WHERE T2."ItemCode" = T0."ItemCode") as "Clinea", '+
                    //'T0."OcrCode2" as "linea", '+
                    '(select cn."U_AB_CACC" from '+database+'.OSLP vn inner join '+database+'."@AB_CANAL" cn on vn."U_AB_CANA"=cn."Code" where vn."SlpCode"='+vend+') as "centroCosto", '+
                    //'T0."OcrCode3" as "centroCosto", '+
                    'T0."InvQty" as "CantidadInventario", '+
                    'T1."ManBtchNum" as "Glotes" '+
                    'from '+database+'.RDR1 T0 inner join '+database+'.OITM T1 on T0."ItemCode"=T1."ItemCode" '+
                    'where T0."DocEntry"=' + clave;
        
        //var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	//mConn.close();
    	
    	var j;
    	var mIncomingPaymentLine = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mIncomingPaymentLine = '{'; 
        		mIncomingPaymentLine += '"linea": ' + mRS[j].linea + ',';
        		mIncomingPaymentLine += '"codArticulo": "' + mRS[j].codArticulo + '",';
        		mIncomingPaymentLine += '"descripcion": "' + mRS[j].descripcion + '",';
        		mIncomingPaymentLine += '"cantidad": ' + mRS[j].cantidad + ',';
        		mIncomingPaymentLine += '"Almacen": "' + mRS[j].Almacen + '",';
        		mIncomingPaymentLine += '"precio": ' + mRS[j].precio + ',';
        		mIncomingPaymentLine += '"descuento": ' + mRS[j].descuento + ',';
        		mIncomingPaymentLine += '"impuesto": ' + mRS[j].impuesto + ',';
        		mIncomingPaymentLine += '"total": ' + mRS[j].total + ',';
        		mIncomingPaymentLine += '"unidad": "' + mRS[j].unidad + '",';
        		mIncomingPaymentLine += '"lprecio": "' + mRS[j].lprecio + '",';
        		mIncomingPaymentLine += '"LoteAsignado": "' + mRS[j].LoteAsignado + '",';
        		mIncomingPaymentLine += '"area": "' + mRS[j].area + '",';
        		mIncomingPaymentLine += '"Clinea": "' + mRS[j].Clinea + '",';
        		mIncomingPaymentLine += '"centroCosto": "' + mRS[j].centroCosto + '",';
        		mIncomingPaymentLine += '"CantidadInventario": ' + mRS[j].CantidadInventario + ',';
        		mIncomingPaymentLine += '"Glotes": "' + mRS[j].Glotes + '"';
        	//	mIncomingPaymentLine += '"Lotes": [' + obtenerLotes(database,clave, mRS[j].Linea) + ']';
        	//	mIncomingPaymentLine += '"Lotes": []';
        		mIncomingPaymentLine += "}";
        		
        		mLines.push(mIncomingPaymentLine);
    		}
    	}else{
    	    return '';
    	}
    	
    //	mConn.close();
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

var query;
try{
 
    var empId = $.request.parameters.get('empId');
    var suc = $.request.parameters.get('suc');
    
    if (empId !== undefined && suc !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select T5."PrcName" as "sucursal", '+
        'T0."DocEntry" as "clave", '+
        'T0."DocNum" as "claveSAP", '+
        'T0."CardCode" as "codCliente", '+
        'T0."CardName" as "cliente", '+
        'T0."DocDate" as "Fecha", '+
        'T0."DocDueDate" as "vencimiento",'+
        'T0."DocTotal" as "total", '+
        //'REPLACE(T0."Comments",\'+\',\'|\') as "Comentario", '+ 
        //'REPLACE(T0."Comments",\' \',\'\') as "Comentario", '+ 
        'REPLACE_REGEXPR(\'(\n|\r)\' IN T0."Comments" WITH \'\')  as "Comentario", '+ 
        //'T0."Comments" as "Comentario", '+
        'T3."SlpName" as "vendedor", '+
        'ifnull(T2."Name",\'\') as "ruta", '+
        'T0."DocTime" as "hora", '+
        '0 as "Fletes", '+
        '0 as "otrosCargos", '+
        'T0."SlpCode" as "codVend", '+
        //'ifnull((SELECT T6."validFor" from '+dbname+'.OCRD T6 WHERE T6."CardCode" = T0."CardCode" ),\'\') as "codCliEst" '+
        'ifnull(T4."validFor",\'\') as "codCliEst" '+
        'from '+dbname+'.ORDR T0 inner join '+dbname+'.OSLP T3 on T0."SlpCode"=T3."SlpCode" '+
        'left join '+dbname+'."@AB_RUTAS" T2 on T0."U_AB_CRUTA"=T2."Code" '+
        'inner join '+dbname+'.OCRD T4 on T0."CardCode"=T4."CardCode" '+
        'inner join '+dbname+'.OPRC T5 on T0."U_AB_SUCURSAL"=T5."PrcCode" '+
        'where T0."DocStatus"=\'O\' and T0."U_AB_SUCURSAL"=\''+suc+'\' and T0."U_AB_LOTES"=\'N\' ;';
	        
    	mConn = $.hdb.getConnection();
    	var rs = mConn.executeQuery(query);
    	//conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mIncomingPayment = '';
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mIncomingPayment = '{';   
    			mIncomingPayment += '"sucursal": "'+rs[i].sucursal+'",';
        		mIncomingPayment += '"clave": "'+rs[i].clave+'",';
        		mIncomingPayment += '"claveSAP": "'+rs[i].claveSAP+'",';
        		mIncomingPayment += '"codCliente": "'+rs[i].codCliente+'",';
        		mIncomingPayment += '"cliente": "'+rs[i].cliente+'",';
        		mIncomingPayment += '"Fecha": "'+rs[i].Fecha+'",';
        		mIncomingPayment += '"vencimiento": "'+rs[i].vencimiento+'",';
        		mIncomingPayment += '"total": '+rs[i].total+',';
        		mIncomingPayment += '"Comments": "'+rs[i].Comentario+'",';
        		mIncomingPayment += '"vendedor": "'+rs[i].vendedor+'",';
        		mIncomingPayment += '"ruta": "'+rs[i].ruta+'",';
        		mIncomingPayment += '"hora": "'+rs[i].hora+'",';
        		mIncomingPayment += '"Fletes": '+rs[i].Fletes+',';
        		mIncomingPayment += '"otrosCargos": '+rs[i].otrosCargos+',';
        		mIncomingPayment += '"codVend": '+rs[i].codVend+',';
        		mIncomingPayment += '"codCliEst": "'+rs[i].codCliEst+'",';
        		    mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].clave, dbname,rs[i].codVend) + ']';
        		    mIncomingPayment += "}";

        		try{
        		    mResult.push(JSON.parse(mIncomingPayment));
        		}catch(e){
            	    throw new functions.buildException(mIncomingPayment);
            	}
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
    	    functions.DisplayJSON(objResponse, objType);
    	    
    	}else{
    	    objType = "MessageError";
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")" + query);
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
}finally{
    mConn.close();
}