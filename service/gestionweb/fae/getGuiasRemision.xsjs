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
        
        var mQuery = 'select \'6\' as "tipodocumentoremision",\'20102892381\' as "numerodocumentoremision",\'09\' as "tipodocumentoguia", '+ 
	'T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD" as "serienumeroguia",T1."LineNum"+1 as "numeroordenitem",T1."Quantity" as "cantidad", '+
	'T2."U_SYP_TIPUNMED" as "unidadmedida",T2."ItemName" as "descripcion", '+ 
	'T1."ItemCode" as "codigo",\'\' as "codigoproductosunat" '+
'from '+database+'.ODLN T0 inner join '+database+'.DLN1 T1 on T0."DocEntry"=T1."DocEntry" '+
	'inner join '+database+'.OITM T2 on T1."ItemCode"=T2."ItemCode" '+
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
        		mIncomingPaymentLine += '"tipodocumentoremision": "' + mRS[j].tipodocumentoremision + '",';
        		mIncomingPaymentLine += '"tipodocumentoemisor": "' + mRS[j].tipodocumentoremision + '",';
        		mIncomingPaymentLine += '"numerodocumentoremision": "' + mRS[j].numerodocumentoremision + '",';
        		mIncomingPaymentLine += '"numerodocumentoemisor": "' + mRS[j].numerodocumentoremision + '",';
        		mIncomingPaymentLine += '"tipodocumentoguia": "' + mRS[j].tipodocumentoguia + '",';
        		mIncomingPaymentLine += '"tipodocumento": "' + mRS[j].tipodocumentoguia + '",';
        		mIncomingPaymentLine += '"serienumeroguia": "' + mRS[j].serienumeroguia + '",';
        		mIncomingPaymentLine += '"serienumero": "' + mRS[j].serienumeroguia + '",';
        		mIncomingPaymentLine += '"numeroordenitem": ' + mRS[j].numeroordenitem + ',';
        		mIncomingPaymentLine += '"ordendocrel": ' + mRS[j].numeroordenitem + ',';
        		mIncomingPaymentLine += '"cantidad": ' + mRS[j].cantidad + ',';
        		mIncomingPaymentLine += '"unidadmedida": "' + mRS[j].unidadmedida + '",';
        		mIncomingPaymentLine += '"descripcion": "' + mRS[j].descripcion + '",';
        		mIncomingPaymentLine += '"codigo": "' + mRS[j].codigo + '",';
        		mIncomingPaymentLine += '"codigoproductosunat": "' + mRS[j].codigoproductosunat + '"';
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
        query = 'select T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD" as "serienumeroguia",TO_VARCHAR (TO_DATE(T0."TaxDate"), \'YYYY-MM-DD\') as "fechaemisionguia", '+
	'\'09\' as "tipodocumentoguia",\'20102892381\' as "numerodocumentoremitente",\'6\' as "tipodocumentoremitente", '+
	'\'DISTRIBUIDORA COMERCIAL ALVAREZ BOHL SRL\' as "razonsocialremitente", T2."LicTradNum" as "numerodocumentodestinatario", '+
	'T2."U_SYP_BPTD" as "tipodocumentodestinatario",T0."CardName" as "razonsocialdestinatario",\'01\' as "motivotraslado", '+
	'ROUND( '+
	'(select sum(S0."Quantity"*case when S1."SWeight1"=0 then 1 else S1."SWeight1" end) from '+dbname+'.DLN1 S0 inner join '+dbname+'.OITM S1 on S0."ItemCode"=S1."ItemCode" where S0."DocEntry"=T0."DocEntry") '+
	',2) as "pesobrutototalbienes",\'KGM\' as "unidadmedidapesobruto",\'01\' as "modalidadtraslado", '+
	'(select S0."LicTradNum" from '+dbname+'.OCRD S0 where S0."CardCode"=T1."U_AB_CODPROV") as "numeroructransportista", '+
	'(select S0."U_SYP_BPTD" from '+dbname+'.OCRD S0 where S0."CardCode"=T1."U_AB_CODPROV") as "tipodocumentotransportista", '+
	'(select S0."CardName" from '+dbname+'.OCRD S0 where S0."CardCode"=T1."U_AB_CODPROV") as "razonsocialtransportista", '+
	'T1."U_AB_CODCHO" as "numerodocumentoconductor",\'1\' as "tipodocumentoconductor", '+
	'T3."ZipCodeS" as "ubigeoptollegada",T3."StreetS" as "direccionptollegada", '+
	'(select S0."ZipCode" from '+dbname+'.OWHS S0 where S0."U_AB_SUCURSAL"=T0."U_AB_SUCURSAL" and S0."WhsName" like \'Almacen Principal%\') as "ubigeoptopartida", '+
	'(select S0."Street" from '+dbname+'.OWHS S0 where S0."U_AB_SUCURSAL"=T0."U_AB_SUCURSAL" and S0."WhsName" like \'Almacen Principal%\') as "direccionptopartida", '+
	'\'info@alvarezbohl.pe\' as "correoremitente",case when ifnull(T2."E_Mail",\'info@alvarezbohl.pe\')=\'\' then \'info@alvarezbohl.pe\' else ifnull(T2."E_Mail",\'info@alvarezbohl.pe\') end as "correodestinatario", '+
	'TO_VARCHAR (TO_DATE(ADD_DAYS(T0."DocDueDate",1)), \'YYYY-MM-DD\') as "fechaentregabienes",\'true\' as "indregvehiculoycond",T1."U_SYP_VECI" as "numeroregistromtc", '+
	'T0."U_SYP_MDVC" as "numeroplacavehiculoprin",(select S0."U_SYP_CHNO" from '+dbname+'."@SYP_CONDUC" S0 where S0."Code"=T1."U_AB_CODCHO") as "nombreconductor", '+
	'(select S0."U_AB_CHAP" from '+dbname+'."@SYP_CONDUC" S0 where S0."Code"=T1."U_AB_CODCHO") as "apellidoconductor", '+
	'(select S0."U_SYP_CHLI" from '+dbname+'."@SYP_CONDUC" S0 where S0."Code"=T1."U_AB_CODCHO") as "numerolicencia", '+
	'case when T2."U_SYP_BPTD"=\'6\' then \'01\' else \'03\' end as "codigodocumentodocrel", '+
	'T4."U_SYP_MDSD"||\'-\'||T4."U_SYP_MDCD" as "numerodocumentodocrel",1 as "ordendocrel", '+
	'case when T2."U_SYP_BPTD"=\'6\' then \'FACTURA\' else \'BOLETA\' end as "tipodocumentodocrel",T0."DocEntry" as "Clave", '+
	'T0."U_AB_DMEB" as "bl_estadoregistro" '+
    'from '+dbname+'.ODLN T0 inner join '+dbname+'."@SYP_VEHICU" T1 on T0."U_SYP_MDVC"=T1."Code" '+
	'inner join '+dbname+'.OCRD T2 on T0."CardCode"=T2."CardCode" '+
	'inner join '+dbname+'.DLN12 T3 on T0."DocEntry"=T3."DocEntry" '+
	'inner join '+dbname+'.OINV T4 on T0."DocEntry"=T4."U_AB_DMER" '+
    'where T0."DocDate" between \''+fini+'\' and \''+ffin+'\' and T0."U_AB_SUCURSAL"=\''+suc+'\' ';
	                        
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
    			mIncomingPayment += '"serienumeroguia": "'+rs[i].serienumeroguia+'",';
        		mIncomingPayment += '"fechaemisionguia": "'+rs[i].fechaemisionguia+'",';
        		mIncomingPayment += '"tipodocumentoguia": "'+rs[i].tipodocumentoguia+'",';
        		mIncomingPayment += '"numerodocumentoremitente": "'+rs[i].numerodocumentoremitente+'",';
        		
        		mIncomingPayment += '"tipodocumentoremitente": "'+rs[i].tipodocumentoremitente+'",';
        		
        		mIncomingPayment += '"razonsocialremitente": "'+rs[i].razonsocialremitente+'",';
        		mIncomingPayment += '"numerodocumentodestinatario": "'+rs[i].numerodocumentodestinatario+'",';
        		mIncomingPayment += '"tipodocumentodestinatario": "'+rs[i].tipodocumentodestinatario+'",';
        		mIncomingPayment += '"razonsocialdestinatario": "'+rs[i].razonsocialdestinatario+'",';
        		mIncomingPayment += '"motivotraslado": "'+rs[i].motivotraslado+'",';
        		mIncomingPayment += '"pesobrutototalbienes": "'+rs[i].pesobrutototalbienes+'",';
        		mIncomingPayment += '"unidadmedidapesobruto": "'+rs[i].unidadmedidapesobruto+'",';
        		mIncomingPayment += '"modalidadtraslado": "'+rs[i].modalidadtraslado+'",';
        		mIncomingPayment += '"numeroructransportista": "'+rs[i].numeroructransportista+'",';
        		mIncomingPayment += '"tipodocumentotransportista": "'+rs[i].tipodocumentotransportista+'",';
        		mIncomingPayment += '"razonsocialtransportista": "'+rs[i].razonsocialtransportista +'",';
        		mIncomingPayment += '"numerodocumentoconductor": "'+rs[i].numerodocumentoconductor+'",';
        		mIncomingPayment += '"tipodocumentoconductor": "'+rs[i].tipodocumentoconductor+'",';
        		mIncomingPayment += '"ubigeoptollegada": "'+rs[i].ubigeoptollegada+'",';
        		mIncomingPayment += '"direccionptollegada": "'+rs[i].direccionptollegada+'",';
        		mIncomingPayment += '"ubigeoptopartida": "'+rs[i].ubigeoptopartida+'",';
        		mIncomingPayment += '"direccionptopartida": "'+rs[i].direccionptopartida+'",';
        		mIncomingPayment += '"correoremitente": "'+rs[i].correoremitente+'",';
        		mIncomingPayment += '"correodestinatario": "'+rs[i].correodestinatario+'",';
        		mIncomingPayment += '"fechaentregabienes": "'+rs[i].fechaentregabienes+'",';
        		mIncomingPayment += '"indregvehiculoycond": "'+rs[i].indregvehiculoycond+'",';
        		mIncomingPayment += '"numeroregistromtc": "'+rs[i].numeroregistromtc+'",';
        		mIncomingPayment += '"nombreconductor": "'+rs[i].nombreconductor+'",';
        		mIncomingPayment += '"apellidoconductor": "'+rs[i].apellidoconductor+'",';
        		mIncomingPayment += '"numerolicencia": "'+rs[i].numerolicencia+'",';
        		mIncomingPayment += '"numeroplacavehiculoprin": "'+rs[i].numeroplacavehiculoprin+'",';
        		mIncomingPayment += '"tipodocumentoremision": "'+rs[i].tipodocumentoremitente+'",';
        		mIncomingPayment += '"numerodocumentoremision": "'+rs[i].numerodocumentoremitente+'",';
        		mIncomingPayment += '"bl_estadoregistro": "'+rs[i].bl_estadoregistro+'",';

        		    mIncomingPayment += '"spe_despatch_item": [' + ObtenerLineas(rs[i].Clave, dbname) + '],';
        		    mIncomingPayment += '"spe_despatch_docrelacionado": [';
        		    mIncomingPayment += '{'; 
        		    mIncomingPayment += '"tipodocumentoguia": "09",';
        		    mIncomingPayment += '"serienumeroguia": "'+rs[i].serienumeroguia+'",';
        		    mIncomingPayment += '"codigodocumentodocrel": "'+rs[i].codigodocumentodocrel+'",';
        		    mIncomingPayment += '"numerodocumentodocrel": "'+rs[i].numerodocumentodocrel+'",';
        		    mIncomingPayment += '"ordendocrel": '+rs[i].ordendocrel+',';
        		    mIncomingPayment += '"tipodocumentodocrel": "'+rs[i].tipodocumentodocrel+'",';
        		    mIncomingPayment += '"numerodocumentoremision": "20102892381",';
        		    mIncomingPayment += '"numerodocumentoemisordocrel": "'+rs[i].numerodocumentoremitente+'",';
        		    mIncomingPayment += '"tipodocumentoemisordocrel": "'+rs[i].tipodocumentoremitente+'",';
        		    mIncomingPayment += '"tipodocumentoremision": "6"';
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