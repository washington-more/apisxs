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
	//'case when T1."DiscPrcnt"=100 then \'0.00\' else cast(ROUND(T1."VatSum",2) as varchar) end as "importetotalimpuestos", '+
	'case when T1."LineTotal"=0 then \'0.00\' else cast(ROUND(T1."VatSum",2) as varchar) end as "importetotalimpuestos", '+
	//'case when T1."DiscPrcnt"=100 then ROUND((ROUND((T1."PriceBefDi"),2)*T1."Quantity"),2) else T1."LineTotal" end as "montobaseigv", '+
	'case when T1."LineTotal"=0 then ROUND((ROUND((case when T1."PriceBefDi"=0 then 1 else T1."PriceBefDi" end),2)*T1."Quantity"),2) else T1."LineTotal" end as "montobaseigv", '+
	'18.00 as "tasaigv",case when T1."LineTotal"=0 then cast(ROUND(((ROUND((case when T1."PriceBefDi"=0 then 1 else T1."PriceBefDi" end),2)*T1."Quantity")*18)/100,2) as varchar) else cast(ROUND(T1."VatSum",2) as varchar) end as "importeigv", '+
	'case when T1."LineTotal"=0 then \'15\' else \'10\' end as "codigorazonexoneracion",case when T1."LineTotal"=0 then ROUND((ROUND((case when T1."PriceBefDi"=0 then 1 else T1."PriceBefDi" end),2)*T1."Quantity"),2) else T1."LineTotal" end as "importetotalsinimpuesto", '+
	'ifnull(T1."ItemCode",T1."AcctCode") as "codigoproducto",\'\' as "codigoproductosunat", case when T1."LineTotal"=0 then ROUND((case when T1."PriceBefDi"=0 then 1 else T1."PriceBefDi" end),2) else null end as "importereferencial", '+
	'case when T1."LineTotal"=0 then \'02\' else \'\' end as "codigoimportereferencial" '+
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
    var tipo = $.request.parameters.get('tipo');
    var suc = $.request.parameters.get('suc');
    
    if (empId !== undefined && suc !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    localCurrency = functions.GetLocalCurrency(dbname);
        query = 'select T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD" as "serienumero",TO_VARCHAR (TO_DATE(T0."DocDate"), \'YYYY-MM-DD\') as "fechaemision", '+
	 'T0."Indicator" as "tipodocumento",\'PEN\' as "tipomoneda",\'20102892381\' as "numerodocumentoemisor",\'6\' as "tipodocumentoemisor", '+
	 '\'DISTRIBUIDORA COMERCIAL ALVAREZ BOHL SRL\' as "razonsocialemisor",\'gvilchez@alvarezbohl.com\' as "correoemisor", '+
	 'T2."U_SYP_ESTRUC" as "codigolocalanexoemisor",T1."U_SYP_BPTD" as "tipodocumentoadquiriente",T1."LicTradNum" as "numerodocumentoadquiriente", '+
	 'T1."CardName" as "razonsocialadquiriente",case when ifnull(T1."E_Mail",\'info@alvarezbohl.pe\')=\'\' then \'info@alvarezbohl.pe\' else ifnull(T1."E_Mail",\'info@alvarezbohl.pe\') end as "correoadquiriente",cast(ROUND(T0."VatSum",2) as varchar) as "totalimpuestos", '+
	 'cast(round(T0."DocTotal"-T0."VatSum",2) as varchar) as "totalvalorventanetoopgravadas", '+
	 'cast(ROUND(T0."VatSum",2) as varchar) as "totaligv", '+
	'cast(round(T0."DocTotal"-T0."VatSum",2)+ROUND(T0."VatSum",2) as varchar) as "totalventa",T0."DocTotal"-T0."VatSum" as "totalvalorventa", '+
	'cast(round(T0."DocTotal"-T0."VatSum",2)+ROUND(T0."VatSum",2) as varchar) AS "totalprecioventa", '+
	'\'0101\' as "tipooperacion",T0."U_AB_DMEB" as "bl_estadoregistro",T0."DocEntry" as "Clave", '+
	'\'CAR.PIURA SULLANA LOTE. A OTR. VALLE MEDIO PIURA P1-02 (FRENTE A LA EMPRESA BACKUS)\' as "direccionemisor",\'PIURA\' as "departamentoemisor", '+
	'\'VEINTISEIS DE OCTUBRE\' as "urbanizacion",\'PIURA\' as "provinciaemisor",\'200105\' as "ubigeoemisor",\'PIURA\' as "distritoemisor", '+
	'\'PE\' as "paisemisor",(select round(sum(case when T3."LineTotal"=0 then round(case when T3."PriceBefDi"=0 then 1 else T3."PriceBefDi" end,2)*T3."Quantity" else 0 end),2) from '+dbname+'.INV1 T3 '+
	'WHERE T3."DocEntry"=T0."DocEntry") as "totalvalorventanetoopgratuitas",\'1\' as "inhabilitado",\'1000\' as "codigoleyenda_1", '+
	//'T0."U_AB_DMML" as "textoleyenda_1",case when T0."GroupNum"=-1 then 0 else 1 end as "valor", '+
	'T0."U_AB_DMML" as "textoleyenda_1",0 as "valor", '+
	'ifnull((select cast(ROUND(sum(((case when T3."PriceBefDi"=0 then 1 else T3."PriceBefDi" end*T3."Quantity")*18)/100),2) as varchar) from '+dbname+'.INV1 T3 where T3."DocEntry"=T0."DocEntry" and T3."LineTotal"=0),\'0.00\') '+
	'as "totalTributosOpeGratuitas" '+
'from '+dbname+'.OINV T0 inner join '+dbname+'.OCRD T1 on T0."CardCode"=T1."CardCode" '+
	'left join '+dbname+'.OWHS T2 on T0."U_AB_SUCURSAL"=T2."U_AB_SUCURSAL" and T2."WhsName" like \'%Principal%\' '+
'where T0."DocDate" between \''+fini+'\' and \''+ffin+'\' and T0."Indicator"=\''+tipo+'\' and T0."CANCELED"=\'N\' '+
'and T0."U_AB_SUCURSAL"=\''+suc+'\' and T0."U_AB_DMEB"=\'E\' ';
	                        
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
    			mIncomingPayment += '"serienumero": "'+rs[i].serienumero+'",';
        		mIncomingPayment += '"fechaemision": "'+rs[i].fechaemision+'",';
        		mIncomingPayment += '"tipodocumento": "'+rs[i].tipodocumento+'",';
        		mIncomingPayment += '"tipomoneda": "'+rs[i].tipomoneda+'",';
        		mIncomingPayment += '"numerodocumentoemisor": "'+rs[i].numerodocumentoemisor+'",';
        		mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		mIncomingPayment += '"razonsocialemisor": "'+rs[i].razonsocialemisor+'",';
        		mIncomingPayment += '"correoemisor": "'+rs[i].correoemisor+'",';
        		mIncomingPayment += '"codigolocalanexoemisor": "'+rs[i].codigolocalanexoemisor+'",';
        		mIncomingPayment += '"tipodocumentoadquiriente": "'+rs[i].tipodocumentoadquiriente+'",';
        		mIncomingPayment += '"numerodocumentoadquiriente": "'+rs[i].numerodocumentoadquiriente+'",';
        		mIncomingPayment += '"razonsocialadquiriente": "'+rs[i].razonsocialadquiriente+'",';
        		mIncomingPayment += '"correoadquiriente": "'+rs[i].correoadquiriente+'",';
        		mIncomingPayment += '"totalimpuestos": "'+rs[i].totalimpuestos+'",';
        		mIncomingPayment += '"totalvalorventanetoopgravadas": "'+rs[i].totalvalorventanetoopgravadas+'",';
        		mIncomingPayment += '"totaligv": "'+rs[i].totaligv +'",';
        		mIncomingPayment += '"totalventa": '+rs[i].totalventa+',';
        		mIncomingPayment += '"totalvalorventa": '+rs[i].totalvalorventa+',';
        		mIncomingPayment += '"totalprecioventa": '+rs[i].totalprecioventa+',';
        		mIncomingPayment += '"tipooperacion": "'+rs[i].tipooperacion+'",';
        		mIncomingPayment += '"bl_estadoregistro": "'+rs[i].bl_estadoregistro+'",';
        		mIncomingPayment += '"direccionemisor": "'+rs[i].direccionemisor+'",';
        		mIncomingPayment += '"departamentoemisor": "'+rs[i].departamentoemisor+'",';
        		mIncomingPayment += '"urbanizacion": "'+rs[i].urbanizacion+'",';
        		mIncomingPayment += '"provinciaemisor": "'+rs[i].provinciaemisor+'",';
        		mIncomingPayment += '"ubigeoemisor": "'+rs[i].ubigeoemisor+'",';
        		mIncomingPayment += '"distritoemisor": "'+rs[i].distritoemisor+'",';
        		mIncomingPayment += '"paisemisor": "'+rs[i].paisemisor+'",';
        		mIncomingPayment += '"totalvalorventanetoopgratuitas": '+rs[i].totalvalorventanetoopgratuitas+',';
        		mIncomingPayment += '"inhabilitado": "'+rs[i].inhabilitado+'",';
        		mIncomingPayment += '"codigoleyenda_1": "'+rs[i].codigoleyenda_1+'",';
        		mIncomingPayment += '"textoleyenda_1": "'+rs[i].textoleyenda_1+'",';

        		    mIncomingPayment += '"invoiceDetails": [' + ObtenerLineas(rs[i].Clave, dbname) + '],';
        		    mIncomingPayment += '"spe_einvoiceheader_add": [';
        		    mIncomingPayment += '{'; 
        		    mIncomingPayment += '"clave": "formaPagoNegociable",';
        		    mIncomingPayment += '"numerodocumentoemisor": "'+rs[i].numerodocumentoemisor+'",';
        		    mIncomingPayment += '"serienumero": "'+rs[i].serienumero+'",';
        		    mIncomingPayment += '"tipodocumento": "'+rs[i].tipodocumento+'",';
        		    mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		    mIncomingPayment += '"valor": "'+rs[i].valor+'"';
        		    mIncomingPayment += '},';
        		    mIncomingPayment += '{'; 
        		    mIncomingPayment += '"clave": "totalTributosOpeGratuitas",';
        		    mIncomingPayment += '"numerodocumentoemisor": "'+rs[i].numerodocumentoemisor+'",';
        		    mIncomingPayment += '"serienumero": "'+rs[i].serienumero+'",';
        		    mIncomingPayment += '"tipodocumento": "'+rs[i].tipodocumento+'",';
        		    mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		    mIncomingPayment += '"valor": "'+rs[i].totalTributosOpeGratuitas+'"';
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