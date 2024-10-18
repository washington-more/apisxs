$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;

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

function ObtenerLineas(clave, database){
    
    try {
        
        var mQuery = 'select T0."LineNum" as "Linea", ' +
                      '	 T0."ItemCode" as "Articulo", ' +
                      '  T0."Dscription" as "Descrip", '+
                      '	 T0."UomEntry" as "UnidadMedida", ' +
                      '  T0."UomCode" as "NomUnid", '+
                      '	 T0."WhsCode" as "Almacen", ' +
                    '	 T0."Quantity" as "Cantidad", ' +
                    '	 T0."OpenQty" as "Disponible", ' +
                    '	 T0.U_JA_CODPRECIO as "ListaPrecio", ' +
                    '	 T0."PriceAfVAT" as "PrecioUnitario", ' +
                    '	 T0."DiscPrcnt" as "PorcentajeDescuento", ' +
                    '	 T0."TaxCode" as "Impuesto", ' +
                    '	T0."BaseEntry" AS "ClaveBase", ' +
                    '	T0."U_AB_DMCB" AS "CodBonif", ' +
                    '	T0."U_AB_OVOB" AS "ObjBonif" ' +
                    ' from '+database+'.INV1 T0 where T0."DocEntry" = ' + clave;
        
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
        		mIncomingPaymentLine += '"Linea": "' + mRS[j].Linea + '",';
        		mIncomingPaymentLine += '"Articulo": "' + mRS[j].Articulo + '",';
        		mIncomingPaymentLine += '"Descrip": "' + mRS[j].Descrip + '",';
        		mIncomingPaymentLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
        		mIncomingPaymentLine += '"NomUnid": "' + mRS[j].NomUnid + '",';
        		mIncomingPaymentLine += '"Almacen": "' + mRS[j].Almacen + '",';
        		mIncomingPaymentLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
        		mIncomingPaymentLine += '"Disponible": "' + mRS[j].Disponible + '",';
        		mIncomingPaymentLine += '"ListaPrecio": "' + mRS[j].ListaPrecio + '",';
        		mIncomingPaymentLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
        		mIncomingPaymentLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
        		mIncomingPaymentLine += '"Impuesto": "' + mRS[j].Impuesto + '",';
        		mIncomingPaymentLine += '"ClaveBase": ' + mRS[j].ClaveBase + ',';
        		mIncomingPaymentLine += '"CodBonif": "' + mRS[j].CodBonif + '",';
        		mIncomingPaymentLine += '"ObjBonif": "' + mRS[j].ObjBonif + '",';
        	//	mIncomingPaymentLine += '"Lotes": [' + obtenerLotes(database,clave, mRS[j].Linea) + ']';
        		mIncomingPaymentLine += '"Lotes": []';
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
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined && cove !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    localCurrency = functions.GetLocalCurrency(dbname);
        query = 'SELECT T0."U_AB_SUCURSAL" AS "Sucursal", '+
                    'T0."DocEntry" AS "Clave", '+
                    'T0."DocNum" AS "Numero", '+
                    'IFNULL(T0."U_SYP_MDSD",\'\') || \'-\' || LPAD(IFNULL(T0."U_SYP_MDCD",0),8, \'0\') AS "Referencia", '+
                    'T0."CardCode" AS "SocioNegocio", '+
                    'T0."CardName" AS "Razon", '+
                    'IFNULL(T2."ListNum",-99) AS "ListaPrecio", '+
                    'T0."DocCur" AS "Moneda", '+
                    'T0."SlpCode" AS "EmpleadoVenta", '+
                    'DAYS_BETWEEN(T0."TaxDate",CURRENT_DATE) AS "Dias", '+
                    'substring(IFNULL(T0."Comments",\'\'),0,98) AS "Comentario", '+
                    'TO_VARCHAR(T0."DocDate",\'YYYYMMDD\') AS "FechaContable", '+
                    'TO_VARCHAR(T0."DocDueDate", \'YYYYMMDD\') AS "FechaVencimiento", '+
                    'IFNULL(T0."PayToCode",\'\') AS "DireccionFiscal", '+
                    'T2."Address" AS "DireccionEntrega", '+
                    'T0."GroupNum" AS "CondicionPago", '+
                    'IFNULL(T0."Indicator",\'\') AS "Indicador", '+
                    '(T0."DocTotal" - T0."VatSum" + T0."DiscSum") AS "SubTotal", '+
                    '(T0."DocTotalFC" - T0."VatSumFC" + T0."DiscSumFC")  AS "SubTotalFC", '+
                    'T0."DiscSum" AS "Descuento", '+
                    'T0."DiscSumFC" AS "DescuentoFC", '+
                    'T0."VatSum" AS "Impuesto", '+
                    'T0."VatSumFC" AS "ImpuestoFC", '+
                    'T0."DocTotal" AS "Total", '+
                    'T0."DocTotalFC" AS "TotalFC", '+
                    '(T0."DocTotal"-T0."PaidToDate") AS "Saldo", '+
                    '(T0."DocTotalFC"-T0."PaidFC") AS "SaldoFC", '+
                    'T0."U_AB_CODCON" as "Consolidado", '+
                    'T4."U_AB_LATS" as "Latitud", '+
                    'T4."U_AB_LONGS" as "Longitud", '+
                    'T1."U_AB_MESA" as "Mesa", '+
                    'T1."U_AB_GRUVEN" as "Grupo", '+
                    'T0."U_SYP_MDVC" as "Placa", '+
                    'T0."U_AB_DMRO" as "RelacionadoOrden" '+
                    'FROM '+dbname+'.OINV T0 '+
                    'INNER JOIN '+dbname+'.OCRD T2 ON T0."CardCode" = T2."CardCode" '+
                    'INNER JOIN '+dbname+'.OSLP T1 ON T0."SlpCode" = T1."SlpCode" '+
                    'inner join '+dbname+'."@AB_PRCC" T3 on T0."U_AB_CODCON"=T3."Code" '+
                    'left join '+dbname+'.INV12 T4 on T0."DocEntry"=T4."DocEntry" '+
                    'WHERE T0."DocTotal" <> T0."PaidToDate" '+
                    'and T3."U_AB_CCFP" between \'2024-08-01\' and current_date '+  
                    //'and T3."U_AB_CCFP" between \'2024-09-05\' and \'2024-09-19\' '+
                    //'and T3."U_AB_CCFP" = current_date '+
                    'AND T0."CANCELED" = \'N\' '+
                    'AND T0."U_AB_OILQ" ='+cove;
	                        
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
    			mIncomingPayment += '"Sucursal": "'+rs[i].Sucursal+'",';
        		mIncomingPayment += '"Clave": '+rs[i].Clave+',';
        		mIncomingPayment += '"Numero": '+rs[i].Numero+',';
        		mIncomingPayment += '"Referencia": "'+rs[i].Referencia+'",';
        		mIncomingPayment += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		mIncomingPayment += '"Razon": "'+rs[i].Razon+'",';
        		mIncomingPayment += '"ListaPrecio": '+rs[i].ListaPrecio+',';
        		mIncomingPayment += '"Moneda": "'+rs[i].Moneda+'",';
        		mIncomingPayment += '"EmpleadoVenta": "'+rs[i].EmpleadoVenta+'",';
        		mIncomingPayment += '"Comentario": "'+functions.CleanChars(rs[i].Comentario)+'",';
        		mIncomingPayment += '"FechaContable": "'+rs[i].FechaContable+'",';
        		mIncomingPayment += '"FechaVencimiento": "'+rs[i].FechaVencimiento+'",';
        		mIncomingPayment += '"Dias": "'+rs[i].Dias+'",';
        		mIncomingPayment += '"DireccionFiscal": "'+rs[i].DireccionFiscal+'",';
        		mIncomingPayment += '"DireccionEntrega": "'+rs[i].DireccionEntrega +'",';
        		mIncomingPayment += '"CondicionPago": "'+rs[i].CondicionPago+'",';
        		mIncomingPayment += '"Indicador": "'+rs[i].Indicador+'",';
        		mIncomingPayment += '"Consolidado": "'+rs[i].Consolidado+'",';
        		mIncomingPayment += '"EmpleadoVenta": '+rs[i].EmpleadoVenta+',';
        		mIncomingPayment += '"Mesa": '+rs[i].Mesa+',';
        		mIncomingPayment += '"Grupo": "'+rs[i].Grupo+'",';
        		mIncomingPayment += '"Placa": "'+rs[i].Placa+'",';
        		mIncomingPayment += '"RelacionadoOrden": "'+rs[i].RelacionadoOrden+'",';
        		
        		if(localCurrency !== rs[i].Moneda){
        		    mIncomingPayment += '"SubTotal": "'+rs[i].SubTotalFC+'",';
            		mIncomingPayment += '"Descuento": "'+rs[i].DescuentoFC+'",';
            		mIncomingPayment += '"Impuesto": "'+rs[i].ImpuestoFC+'",';
            		mIncomingPayment += '"Total": "'+rs[i].TotalFC+'",';
            		mIncomingPayment += '"Saldo": "'+rs[i].SaldoFC+'",';
        		}else{
        		    mIncomingPayment += '"SubTotal": "'+rs[i].SubTotal+'",';
            		mIncomingPayment += '"Descuento": "'+rs[i].Descuento+'",';
            		mIncomingPayment += '"Impuesto": "'+rs[i].Impuesto+'",';
            		mIncomingPayment += '"Total": "'+rs[i].Total+'",';
            		mIncomingPayment += '"Saldo": "'+rs[i].Saldo+'",';    
        		}
        		
                    mIncomingPayment += '"Latitud": "'+rs[i].Latitud+'",';
                    mIncomingPayment += '"Longitud": "'+rs[i].Longitud+'",';
        		    mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname) + ']';
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}finally{
    mConn.close();
}