$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;

function ObtenerLineas(clave, database){
    
    try {
        
        var mQuery = 'select \'6\' as "tipodocumentoemisor",\'20102892381\' as "numerodocumentoemisor",T0."Indicator" as "tipodocumento", '+ 
	'T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD" as "serienumero",T1."LineNum"+1 as "numeroordenitem", '+
	'case when T1."Quantity"=0 then 1 else T1."Quantity" end as "cantidad", '+
	'ifnull(T2."U_SYP_TIPUNMED",\'NIU\') as "unidadmedida",ifnull(T2."ItemName",T1."Dscription") as "descripcion", '+
	'T1."Price" as "importeunitariosinimpuesto", '+ 
	'ROUND(T1."PriceAfVAT",2) as "importeunitarioconimpuesto",case when T1."TaxCode"=\'IGV\' then \'01\' else \'02\' end as "codigoimporteunitarioconimpues", '+
	//'case when T1."DiscPrcnt"=100 then cast(ROUND((((T1."PriceBefDi"*T1."Quantity")*18)/100),2) as varchar) else cast(ROUND(T1."VatSum",2) as varchar) end as "importetotalimpuestos", '+
	'case when T1."DiscPrcnt"=100 then \'0.00\' else cast(ROUND(T1."VatSum",2) as varchar) end as "importetotalimpuestos", '+
	'case when T1."DiscPrcnt"=100 then ROUND((T1."PriceBefDi"*T1."Quantity"),2) else T1."LineTotal" end as "montobaseigv", '+
	'18.00 as "tasaigv",case when T1."DiscPrcnt"=100 then cast(ROUND(((T1."PriceBefDi"*T1."Quantity")*18)/100,2) as varchar) else cast(ROUND(T1."VatSum",2) as varchar) end as "importeigv", '+
	'case when T1."DiscPrcnt"=100 then \'15\' else \'10\' end as "codigorazonexoneracion",case when T1."DiscPrcnt"=100 then ROUND((T1."PriceBefDi"*T1."Quantity"),2) else T1."LineTotal" end as "importetotalsinimpuesto", '+
	'ifnull(T1."ItemCode",T1."AcctCode") as "codigoproducto",\'\' as "codigoproductosunat", case when T1."DiscPrcnt"=100 then ROUND((T1."PriceBefDi"),2) else null end as "importereferencial", '+
	'case when T1."DiscPrcnt"=100 then \'02\' else \'\' end as "codigoimportereferencial" '+
'from '+database+'.OINV T0 inner join '+database+'.INV1 T1 on T0."DocEntry"=T1."DocEntry" '+
	'left join '+database+'.OITM T2 on T1."ItemCode"=T2."ItemCode" '+
'where T1."DocEntry"='+clave+'';
        
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
        		mIncomingPaymentLine += '"tipodocumentoemisor": "' + mRS[j].tipodocumentoemisor + '",';
        		mIncomingPaymentLine += '"numerodocumentoemisor": "' + mRS[j].numerodocumentoemisor + '",';
        		mIncomingPaymentLine += '"tipodocumento": "' + mRS[j].tipodocumento + '",';
        		mIncomingPaymentLine += '"serienumero": "' + mRS[j].serienumero + '",';
        		mIncomingPaymentLine += '"numeroordenitem": ' + mRS[j].numeroordenitem + ',';
        		mIncomingPaymentLine += '"cantidad": ' + mRS[j].cantidad + ',';
        		mIncomingPaymentLine += '"unidadmedida": "' + mRS[j].unidadmedida + '",';
        		mIncomingPaymentLine += '"descripcion": "' + mRS[j].descripcion + '",';
        		mIncomingPaymentLine += '"importeunitariosinimpuesto": ' + mRS[j].importeunitariosinimpuesto + ',';
        		mIncomingPaymentLine += '"importeunitarioconimpuesto": ' + mRS[j].importeunitarioconimpuesto + ',';
        		mIncomingPaymentLine += '"codigoimporteunitarioconimpues": "' + mRS[j].codigoimporteunitarioconimpues + '",';
        		mIncomingPaymentLine += '"importetotalimpuestos": "' + mRS[j].importetotalimpuestos + '",';
        		mIncomingPaymentLine += '"montobaseigv": ' + mRS[j].montobaseigv + ',';
        		mIncomingPaymentLine += '"tasaigv": "' + mRS[j].tasaigv + '",';
        		mIncomingPaymentLine += '"importeigv": "' + mRS[j].importeigv + '",';
        		mIncomingPaymentLine += '"codigorazonexoneracion": "' + mRS[j].codigorazonexoneracion + '",';
        		mIncomingPaymentLine += '"importetotalsinimpuesto": ' + mRS[j].importetotalsinimpuesto + ',';
        		mIncomingPaymentLine += '"codigoproducto": "' + mRS[j].codigoproducto + '",';
        		mIncomingPaymentLine += '"codigoproductosunat": "' + mRS[j].codigoproductosunat + '",';
        		mIncomingPaymentLine += '"importereferencial": ' + mRS[j].importereferencial + ',';
        		mIncomingPaymentLine += '"codigoimportereferencial": "' + mRS[j].codigoimportereferencial + '"';
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
    var fini = $.request.parameters.get('fini');
    var ffin = $.request.parameters.get('ffin');
    var suc = $.request.parameters.get('suc');
    
    if (empId !== undefined && suc !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    localCurrency = functions.GetLocalCurrency(dbname);
        query = 'select \'20102892381\' as "numerodocumentoemisor",\'6\' as "tipodocumentoemisor", '+
'\'RA-\'||TO_VARCHAR (TO_DATE(current_date), \'YYYYMMDD\')||\'-\'||SUBSTRING (T0."U_SYP_MDCD",4,5) as "resumenid", '+
'TO_VARCHAR (TO_DATE(T0."DocDate"),\'YYYY-MM-DD\') as "fechaemisioncomprobante", '+
'TO_VARCHAR (TO_DATE(current_date),\'YYYY-MM-DD\') as "fechageneracionresumen", '+
'\'DISTRIBUIDORA COMERCIAL ALVAREZ BOHL SRL\' as "razonsocialemisor",\'info@alvarezbohl.pe\' as "correoemisor", '+
'\'RA\' as "resumentipo",\'1\' as "numerofila",T0."Indicator" as "tipodocumento",T0."U_SYP_MDSD" as "seriedocumentobaja", '+
'T0."U_SYP_MDCD" as "numerodocumentobaja",\'ANULACION\' as "motivobaja",T0."U_AB_DMEB" as "bl_estadoregistro" '+
'from '+dbname+'.OINV T0 '+
'where T0."DocDate" between \''+fini+'\' and \''+ffin+'\' and T0."Indicator"=\'01\' '+
'and T0."CANCELED"=\'Y\' and T0."U_AB_SUCURSAL"=\''+suc+'\' ';
	                        
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
    			mIncomingPayment += '"numerodocumentoemisor": "'+rs[i].numerodocumentoemisor+'",';
        		mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		mIncomingPayment += '"resumenid": "'+rs[i].resumenid+'",';
        		mIncomingPayment += '"fechaemisioncomprobante": "'+rs[i].fechaemisioncomprobante+'",';
        		mIncomingPayment += '"fechageneracionresumen": "'+rs[i].fechageneracionresumen+'",';
        		mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		mIncomingPayment += '"razonsocialemisor": "'+rs[i].razonsocialemisor+'",';
        		mIncomingPayment += '"razonsocialemisor": "'+rs[i].razonsocialemisor+'",';
        		mIncomingPayment += '"correoemisor": "'+rs[i].correoemisor+'",';
        		mIncomingPayment += '"resumentipo": "'+rs[i].resumentipo+'",';
        		mIncomingPayment += '"inhabilitado": "1",';
        		mIncomingPayment += '"bl_estadoregistro": "'+rs[i].bl_estadoregistro+'",';
        		
        		    mIncomingPayment += '"spe_canceldetail": [';
        		    mIncomingPayment += '{'; 
        		    mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		    mIncomingPayment += '"numerodocumentoemisor": "'+rs[i].numerodocumentoemisor+'",';
        		    mIncomingPayment += '"resumenid": "'+rs[i].resumenid+'",';
        		    mIncomingPayment += '"numerofila": "'+rs[i].numerofila+'",';
        		    mIncomingPayment += '"tipodocumento": "'+rs[i].tipodocumento+'",';
        		    mIncomingPayment += '"seriedocumentobaja": "'+rs[i].seriedocumentobaja+'",';
        		    mIncomingPayment += '"numerodocumentobaja": "'+rs[i].numerodocumentobaja+'",';
        		    mIncomingPayment += '"motivobaja": "'+rs[i].motivobaja+'"';
        		    mIncomingPayment += '}';
        		    mIncomingPayment += ']';
        		    mIncomingPayment += '}'; 
        		
        		
        		
        		
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