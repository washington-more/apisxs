
    $.import("AB_MOBILE.Functions", "Functions");
    $.import("AB_MOBILE.Constants","Constants");
    var Constants = $.AB_MOBILE.Constants;
    var functions = $.AB_MOBILE.Functions;
    var objResponse;
    var objResult;
    var objType;
    var localCurrency = null;
    
    function obtenerLotes(database, docEntry, lineNum,art){
        
        var lstLotes = [];
        var lote = '';
        
        try{
             var mQuery = '';
                mQuery = 'SELECT T3."BatchNum" as "NroLote", '+
                        'T3."Quantity" as "Cantidad" '+
                        //'T3."BaseLinNum" as "LineaBase" '+
                        'FROM '+database+'.IBT1 T3 '+
                        'WHERE T3."BaseEntry" = '+docEntry+' and T3."BaseType"=15 '+
	                    'and T3."Quantity">0 '+
	                    'AND T3."BaseLinNum" = ' + lineNum+
	                    ' and T3."ItemCode"=\''+art+'\' ';
    
            
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
            		lote += '"Cantidad": ' + mRS[j].Cantidad;
            		//lote += '"LineaBase": ' + mRS[j].LineaBase;
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
    
    function ObtenerLineas(clave, database,relacionado){
        
        try {
            
            var mQuery = '';
            
               mQuery = 'SELECT ' +
                    	'	T0."LineNum" AS "Linea", ' +
                    	'	T0."BaseLine" AS "LineaBase", ' +
                    	'	T0."BaseEntry" AS "ClaveBase", ' +
                    	'	T0."ItemCode" AS "Articulo", ' +
                    	'	T2."ItemName" AS "Descripcion", ' +
                    	'	CASE T2."UgpEntry" WHEN -1 THEN -1 ELSE T0."UomEntry" END AS "UnidadMedida", ' +
                    	'	T0."WhsCode" AS "Almacen", ' +
                    	'	T0."Quantity" AS "Cantidad", ' +
                    	'	T0."PriceBefDi" AS "PrecioUnitario", ' +
                    	' 	IFNULL(T0."DiscPrcnt",0) AS "PorcentajeDescuento", ' +
                    	'	T0."TaxCode" AS "Impuesto", ' +
                    	'	IFNULL(T0."LineTotal",0) AS "TotalLinea", ' +   
                    	'	IFNULL(T0."VatSum",0) AS "MontoImpuesto", ' +
                    	'T0."AcctCode" as "Cuenta", '+
                    	//'T3."BatchNum" as "Lotes", '+
                    	'T0."InvQty" as "CantidadInv", '+
                    	'T0."U_AB_DMLB" as "LineaBaseEn" '+
                    	' FROM ' + database + '.DRF1 "T0" inner join ' + database + '.ODRF T1 on T0."DocEntry"=T1."DocEntry" ' +
                    	'	INNER JOIN ' + database + '.OITM "T2" ON T2."ItemCode" = T0."ItemCode" ' +
                    	//'left join ' + database + '.IBT1 T3 on T3."BaseLinNum"=T0."LineNum" and T3."BaseEntry"=T1."U_AB_DMER" '+
	                    //'and T3."BaseType"=15 and T3."Quantity">0 '+
                    	' where T0."DocEntry" = ' + clave;
            
            
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
            		mPurchaseOrderLine += '"LineaBase": "' + mRS[j].LineaBaseEn + '",';
            		mPurchaseOrderLine += '"ClaveBase": ' + mRS[j].ClaveBase + ',';
            		mPurchaseOrderLine += '"Articulo": "' + mRS[j].Articulo + '",';
            		mPurchaseOrderLine += '"Descripcion": "' + mRS[j].Descripcion + '",';
            		mPurchaseOrderLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
            		mPurchaseOrderLine += '"Almacen": "' + mRS[j].Almacen + '",';
            		mPurchaseOrderLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
            		mPurchaseOrderLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
            		mPurchaseOrderLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
            		mPurchaseOrderLine += '"Impuesto": "' + mRS[j].Impuesto + '",';
            		mPurchaseOrderLine += '"TotalLinea": "' + mRS[j].TotalLinea + '",';
            		mPurchaseOrderLine += '"MontoImpuesto": "' + mRS[j].MontoImpuesto + '",';
            		mPurchaseOrderLine += '"Cuenta": "' + mRS[j].Cuenta + '",';

            		//mPurchaseOrderLine += '"Lotes": []';
            		//mPurchaseOrderLine += '"Lotes": "' + mRS[j].Lotes + '",';
            		mPurchaseOrderLine += '"CantidadInv": "' + mRS[j].CantidadInv + '",';
            		mPurchaseOrderLine += '"Lotes": [' + obtenerLotes(database,relacionado, mRS[j].LineaBaseEn,mRS[j].Articulo) + ']';
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
    
    function ObtenerLineasA(clave, database,relacionado){
        
        try {
            
            var mQuery = '';
                    	
                    	mQuery = 'SELECT ' +
                    	'	T0."LineNum" AS "Linea", ' +
                    	'	T0."BaseLine" AS "LineaBase", ' +
                    	'	T0."BaseEntry" AS "ClaveBase", ' +
                    	'	T0."ItemCode" AS "Articulo", ' +
                    	'	T2."ItemName" AS "Descripcion", ' +
                    	'	CASE T2."UgpEntry" WHEN -1 THEN -1 ELSE T0."UomEntry" END AS "UnidadMedida", ' +
                    	'	T0."WhsCode" AS "Almacen", ' +
                    	'	T0."Quantity" AS "Cantidad", ' +
                    	'	T0."PriceBefDi" AS "PrecioUnitario", ' +
                    	' 	IFNULL(T0."DiscPrcnt",0) AS "PorcentajeDescuento", ' +
                    	'	T0."TaxCode" AS "Impuesto", ' +
                    	'	IFNULL(T0."LineTotal",0) AS "TotalLinea", ' +   
                    	'	IFNULL(T0."VatSum",0) AS "MontoImpuesto", ' +
                    	'T0."AcctCode" as "Cuenta", '+
                    	'\'\' as "Lotes", '+
                    	'T0."InvQty" as "CantidadInv" '+
                    	' FROM ' + database + '.DRF1 "T0" inner join ' + database + '.ODRF T1 on T0."DocEntry"=T1."DocEntry" ' +
                    	'	INNER JOIN ' + database + '.OITM "T2" ON T2."ItemCode" = T0."ItemCode" ' +
                    	' where T0."DocEntry" = ' + clave;
            
            
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
            		mPurchaseOrderLine += '"Descripcion": "' + mRS[j].Descripcion + '",';
            		mPurchaseOrderLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
            		mPurchaseOrderLine += '"Almacen": "' + mRS[j].Almacen + '",';
            		mPurchaseOrderLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
            		mPurchaseOrderLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
            		mPurchaseOrderLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
            		mPurchaseOrderLine += '"Impuesto": "' + mRS[j].Impuesto + '",';
            		mPurchaseOrderLine += '"TotalLinea": "' + mRS[j].TotalLinea + '",';
            		mPurchaseOrderLine += '"MontoImpuesto": "' + mRS[j].MontoImpuesto + '",';
            		mPurchaseOrderLine += '"Cuenta": "' + mRS[j].Cuenta + '",';
            		//mPurchaseOrderLine += '"Lotes": [' + obtenerLotes(database,relacionado, mRS[j].Linea) + ']';
            		//mPurchaseOrderLine += '"Lotes": "' + mRS[j].Lotes + '",';
            		mPurchaseOrderLine += '"CantidadInv": "' + mRS[j].CantidadInv + '",';
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
        var consolidado = $.request.parameters.get('consolidado');
        
        if (empId !== undefined && consolidado !== undefined)
    	{ 
    	    var dbname = functions.GetDataBase(empId);
    	    localCurrency = functions.GetLocalCurrency(dbname);
            var query = 'SELECT  T0."DocEntry"  AS "Clave",  '+
                                'T0."DocNum"  AS "Numero", '+
                                'T0."TaxDate"  AS "FechaEmision", '+
                                'T0."DocDate"  AS "FechaConta", '+
                                'T0."CardName" AS "CodCliente", '+
                                'T0."CardCode" AS "NomCliente", '+
                                'T0."SlpCode"  AS "CodVendedor", '+
                                'T1."SlpName"  AS "Vendedor", '+
                                'T0."U_SYP_MDTO" AS "TipoOrig", '+
                                'T0."U_SYP_MDSO" AS "SerieOrig", '+
                                'T0."U_SYP_MDCO" AS "CorrelaOrig", '+
                                'T0."U_SYP_FECHAREF"  AS "FechaOrig", '+
                                'T0."U_SYP_MOTNCND" AS "Motivo", '+
                                'T0."U_SYP_FECAT09" AS "MotivoSunat", '+
                                'T0."U_AB_DMER" AS "Relacionado", '+
                                '(T0."DocTotal" - T0."VatSum" + T0."DiscSum")  AS "SubTotal", '+
                                'T0."VatSum"  AS "Impuesto", '+
                                'T0."DocTotal"  AS "Total", '+
                                'T0."U_AB_DMER" as "Relacionado", '+
                                'case when T0."U_SYP_STATUS"=\'A\' then \'ANULADO\' else \'NC\' end as "Estado", '+
                                'T0."U_AB_DMRF" as "RelacionadoFacturas", '+
                                '(select S0."Series" from ' + dbname + '.NNM1 S0 where S0."U_AB_SUDO"=T0."U_AB_SUCURSAL" and S0."U_AB_TSDO"=T0."U_SYP_MDTO") as "Series", '+
                                'T0."U_AB_CODCON" as "Consolidado",T0."U_AB_OILQ" as "Liquidador",T0."U_SYP_MDVC" as "Placa" '+
                            'FROM ' + dbname + '.ODRF "T0" INNER JOIN ' + dbname + '.OSLP "T1"  ON T1."SlpCode" = T0."SlpCode" '+
                            'inner JOIN ' + dbname + '.OCRD "T2" ON T0."CardCode" = T2."CardCode" '+
                            'WHERE T0."ObjType" = \'14\' '+
                            'AND T0."DocStatus" = \'O\'  '+
                            'AND T0."DocType" = \'I\' '+
                            'AND T0."WddStatus" NOT IN (\'N\', \'C\') '+
                            'AND T0."U_AB_CODCON"  = \''+consolidado+'\''; 
    	        
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
            		mPurchaseOrder += '"FechaEmision": "'+rs[i].FechaEmision+'",';
            		mPurchaseOrder += '"FechaConta": "'+rs[i].FechaConta+'",';
            		mPurchaseOrder += '"CodCliente": "'+rs[i].CodCliente+'",';
            		mPurchaseOrder += '"NomCliente": "'+rs[i].NomCliente+'",';
            		mPurchaseOrder += '"CodVendedor": '+rs[i].CodVendedor+',';
            		mPurchaseOrder += '"Vendedor": "'+rs[i].Vendedor+'",';
            		mPurchaseOrder += '"TipoOrig": "'+rs[i].TipoOrig+'",';
            		mPurchaseOrder += '"SerieOrig": "'+rs[i].SerieOrig+'",';
            		mPurchaseOrder += '"CorrelaOrig": "'+rs[i].CorrelaOrig+'",';
            		mPurchaseOrder += '"FechaOrig": "'+rs[i].FechaOrig+'",';
            		mPurchaseOrder += '"Motivo": "'+rs[i].Motivo+'",';
            		mPurchaseOrder += '"MotivoSunat": "'+rs[i].MotivoSunat+'",';
            		mPurchaseOrder += '"Relacionado": '+rs[i].Relacionado+',';
            		    mPurchaseOrder += '"SubTotal": "'+rs[i].SubTotal+'",';
            		    mPurchaseOrder += '"Impuesto": "'+rs[i].Impuesto+'",';
            		    mPurchaseOrder += '"Total": "'+rs[i].Total+'",';
            		    mPurchaseOrder += '"Relacionado": '+rs[i].Relacionado+',';
            		    mPurchaseOrder += '"Estado": "'+rs[i].Estado+'",';
            		    mPurchaseOrder += '"RelacionadoFacturas": '+rs[i].RelacionadoFacturas+',';
            		    mPurchaseOrder += '"Series": '+rs[i].Series+',';
            		    mPurchaseOrder += '"Consolidado": "'+rs[i].Consolidado+'",';
            		    mPurchaseOrder += '"Liquidador": '+rs[i].Liquidador+',';
            		    mPurchaseOrder += '"Placa": "'+rs[i].Placa+'",';
            		    if(rs[i].Estado==='ANULADO'){
            		        mPurchaseOrder += '"Lineas": [' + ObtenerLineasA(rs[i].Clave, dbname,rs[i].Relacionado) + ']';
            		    }else{
            		        mPurchaseOrder += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname,rs[i].Relacionado) + ']';
            		    }
            		
            		mPurchaseOrder += "}";
            		
            		try{
            		    var so = JSON.parse(mPurchaseOrder);
            		    so.MotivoSunat = rs[i].MotivoSunat;
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
    	objResponse = functions.CreateResponse(objType, objResponse, 0);
    	functions.DisplayJSON(objResponse,objType);
    }