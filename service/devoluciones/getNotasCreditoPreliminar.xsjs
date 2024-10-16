$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var localCurrency = null;

var query = '';

function obtenerLotes(database, docEntry, lineNum){
    
    var lstLotes = [];
    var lote = '';
    
    
    try{
         var mQuery = '';
            mQuery = 'SELECT DISTINCT  T3."BatchNum" as "NroLote", ' +
                     '   				T3."Quantity" as "Cantidad", ' +
                     '   				T3."BaseLinNum" as "LineaBase" ' +
                     '   FROM '+database+'.ODRF T0 INNER JOIN '+database+'.DRF1 T2 ON T0."DocEntry" = T2."DocEntry" ' +
                     '   LEFT OUTER JOIN '+database+'.IBT1 T3 ON T0."DocNum" = T3."BaseNum" AND T3."ItemCode" = T2."ItemCode" ' +
                     '   WHERE T0."DocEntry" = '+docEntry+' AND T3."BaseLinNum" = ' + lineNum;

        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
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
        
        var mQuery = '';
        
            mQuery = 'SELECT ' +
                	'	T0."LineNum" AS "Linea", ' +
                	'	T0."BaseLine" AS "LineaBase", ' +
                	'	T0."BaseEntry" AS "ClaveBase", ' +
                	'	T0."ItemCode" AS "Articulo", ' +
                	'	CASE T2."UgpEntry" WHEN -1 THEN -1 ELSE T0."UomEntry" END AS "UnidadMedida", ' +
                	'	T0."WhsCode" AS "Almacen", ' +
                	'	T0."Quantity" AS "Cantidad", ' +
                	'	T0."PriceBefDi" AS "PrecioUnitario", ' +
                	'	T0."PriceBefDi" AS "PrecioReferencial", ' +
                	' 	IFNULL(T0."DiscPrcnt",0) AS "PorcentajeDescuento", ' +
                	'	T0."TaxCode" AS "Impuesto", ' +
                	'	IFNULL(T0."PriceAfVAT",0) AS "PrecioBruto", ' +
                	'	IFNULL(T0."LineTotal",0) AS "TotalLinea", ' +   
                	'	IFNULL(T0."TotalFrgn",0) AS "TotalLineaFC", ' +
                	'	IFNULL(T0."Currency",\'\') AS "Moneda", ' +
                	'	IFNULL(T0."VatPrcnt",0) AS "PorcentajeImpuesto" ' +
                	' FROM ' + database + '.DRF1 "T0" ' +
                	'	INNER JOIN ' + database + '.OITM "T2" ON T2."ItemCode" = T0."ItemCode" ' +
                	' where T0."DocDate"=current_date and T0."DocEntry" = ' + clave;
        
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mPurchaseOrderLine = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mPurchaseOrderLine = '{'; 
        		mPurchaseOrderLine += '"Linea": ' + mRS[j].Linea + ',';
        		mPurchaseOrderLine += '"LineaBase": ' + mRS[j].LineaBase + ',';
        		mPurchaseOrderLine += '"ClaveBase": ' + mRS[j].ClaveBase + ',';
        		mPurchaseOrderLine += '"Articulo": "' + mRS[j].Articulo + '",';
        		mPurchaseOrderLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
        		mPurchaseOrderLine += '"Almacen": "' + mRS[j].Almacen + '",';
        		mPurchaseOrderLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
        		mPurchaseOrderLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
        		mPurchaseOrderLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
        		mPurchaseOrderLine += '"Impuesto": "' + mRS[j].Impuesto + '",';
        		mPurchaseOrderLine += '"PrecioBruto": "' + mRS[j].PrecioBruto + '",';
        		
        		if(localCurrency !== mRS[j].Moneda){
        		    mPurchaseOrderLine += '"TotalLinea": "' + mRS[j].TotalLineaFC + '",';
        		}else{
        		    mPurchaseOrderLine += '"TotalLinea": "' + mRS[j].TotalLinea + '",';    
        		}
        		
        		mPurchaseOrderLine += '"Moneda": "' + mRS[j].Moneda + '",';
        		mPurchaseOrderLine += '"PorcentajeImpuesto": "' + mRS[j].PorcentajeImpuesto + '",';
        		//mPurchaseOrderLine += '"Lotes": [' + obtenerLotes(database,clave, mRS[j].Linea) + ']';
        		mPurchaseOrderLine += '"Lotes": []';
        		mPurchaseOrderLine += "}";
        		
        		mLines.push(mPurchaseOrderLine);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined && cove !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    localCurrency = functions.GetLocalCurrency(dbname);
        query = 'SELECT  T0."DocEntry"  AS "Clave",  '+
                            'T0."DocNum"  AS "Numero", '+
                            'T0."CardName" AS "Referencia", '+
                            'T0."CardCode" AS "SocioNegocio", '+
                            'IFNULL(T2."ListNum", -99) AS "ListaPrecio", '+
                            'T0."DocCur" AS "Moneda", '+
                            'T0."SlpCode"  AS "EmpleadoVenta", '+
                            'T1."SlpName" || \' - \' || IFNULL(T0."Comments",\'\') AS "Comentario", '+
                            'TO_VARCHAR(T0."DocDate", \'YYYYMMDD\') AS "FechaContable", '+
                            'IFNULL(TO_VARCHAR(T0."DocDueDate", \'YYYYMMDD\'), TO_VARCHAR(T0."DocDate", \'YYYYMMDD\'))  AS "FechaVencimiento", '+
                            'IFNULL(T0."PayToCode",\'\') AS "DireccionFiscal", '+
                            'T0."U_SYP_MDSO"||\'-\'||T0."U_SYP_MDCO" AS "Docuemto", '+
                            'T0."GroupNum"  AS "CondicionPago", '+
                            'IFNULL(T0."Indicator",\'\') AS "Indicador", '+
                            '(T0."DocTotal" - T0."VatSum" + T0."DiscSum")  AS "SubTotal", '+
                            '(T0."DocTotalFC" - T0."VatSumFC" + T0."DiscSumFC")  AS "SubTotalFC", '+
                            'T0."VatSum"  AS "Impuesto", '+
                            'T0."VatSumFC"  AS "ImpuestoFC", '+
                            'T0."DocTotal"  AS "Total", '+
                            'T0."DocTotalFC"  AS "TotalFC", '+
                            'IFNULL(T0."U_MSSM_LAT",\'\') AS "Latitud", '+
                            'IFNULL(T0."U_MSSM_LON",\'\') AS "Longitud", '+
                            'IFNULL(T0."U_MSSM_HOR",\'\') AS "HoraCreacion", '+
                            'IFNULL(T0."U_MSSM_RAN",\'03\') AS "RangoDireccion", '+
                            'IFNULL(T0."DiscPrcnt",0) AS "PorcentajeDescuento", '+
                            'IFNULL(T0."DiscSum",0) AS "DescuentoImporte", '+
                            'IFNULL(T0."DiscSumFC",0) AS "DescuentoImporteFC" '+
                        'FROM ' + dbname + '.ODRF "T0" INNER JOIN ' + dbname + '.OSLP "T1"  ON T1."SlpCode" = T0."SlpCode" '+
                        'inner JOIN ' + dbname + '.OCRD "T2" ON T0."CardCode" = T2."CardCode" '+
                        'WHERE T0."ObjType" = \'14\' '+
                        'AND T0."DocStatus" = \'O\'  '+
                        'AND T0."DocType" = \'I\' '+
                        'AND T0."WddStatus" NOT IN (\'N\', \'C\') '+
                        'AND T0."SlpCode" <> -1  AND T0."U_AB_OILQ"  = '+cove;
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mPurchaseOrder = '';
    	    var mPurchaseOrderDetail = '';
    		var mResult = [];
    		var mDetail = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mPurchaseOrder = '{';   
        		mPurchaseOrder += '"Clave": '+rs[i].Clave+',';
        		mPurchaseOrder += '"Numero": '+rs[i].Numero+',';
        		mPurchaseOrder += '"Referencia": "'+rs[i].Referencia+'",';
        		mPurchaseOrder += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		mPurchaseOrder += '"ListaPrecio": '+rs[i].ListaPrecio+',';
        		mPurchaseOrder += '"Moneda": "'+rs[i].Moneda+'",';
        		mPurchaseOrder += '"EmpleadoVenta": '+rs[i].EmpleadoVenta+',';
        		mPurchaseOrder += '"FechaContable": "'+rs[i].FechaContable+'",';
        		mPurchaseOrder += '"FechaVencimiento": "'+rs[i].FechaVencimiento+'",';
        		mPurchaseOrder += '"DireccionFiscal": "'+rs[i].DireccionFiscal+'",';
        		mPurchaseOrder += '"Docuemto": "'+rs[i].Docuemto+'",';
        		mPurchaseOrder += '"CondicionPago": '+rs[i].CondicionPago+',';
        		mPurchaseOrder += '"Indicador": "'+rs[i].Indicador+'",';
        		
        		if(localCurrency !== rs[i].Moneda){
        		    mPurchaseOrder += '"DescuentoImporte": "'+rs[i].DescuentoImporteFC+'",';
        		    mPurchaseOrder += '"Impuesto": "'+rs[i].ImpuestoFC+'",';
        		    mPurchaseOrder += '"SubTotal": "'+rs[i].SubTotalFC+'",';  
        		    mPurchaseOrder += '"Total": "'+rs[i].TotalFC+'",';
        		}else{
        		    mPurchaseOrder += '"DescuentoImporte": "'+rs[i].DescuentoImporte+'",';
        		    mPurchaseOrder += '"Impuesto": "'+rs[i].Impuesto+'",';
        		    mPurchaseOrder += '"SubTotal": "'+rs[i].SubTotal+'",';
        		    mPurchaseOrder += '"Total": "'+rs[i].Total+'",';    
        		}
        		
        		mPurchaseOrder += '"Latitud": "'+rs[i].Latitud+'",';
        		mPurchaseOrder += '"Longitud": "'+rs[i].Longitud+'",';
        		mPurchaseOrder += '"HoraCreacion": "'+rs[i].HoraCreacion+'",';
        		mPurchaseOrder += '"RangoDireccion": "'+rs[i].RangoDireccion+'",';
        		mPurchaseOrder += '"PorcentajeDescuento": "'+rs[i].PorcentajeDescuento+'",';
        		mPurchaseOrder += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname) + ']';
        		mPurchaseOrder += "}";
        		
        		try{
        		    var so = JSON.parse(mPurchaseOrder);
        		    so.Comentario = rs[i].Comentario;
        		    mResult.push(so);    
        		}catch(e){
        		    throw new functions.buildException(mPurchaseOrder);
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
// 	objResponse = functions.CreateJSONMessage(-9703000, query);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}