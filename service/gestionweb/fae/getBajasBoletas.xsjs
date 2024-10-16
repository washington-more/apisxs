$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;

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
'\'RC-\'||TO_VARCHAR (TO_DATE(current_date),\'YYYYMMDD\')||\'-\'||SUBSTRING (T0."U_SYP_MDCD",4,5) as "resumenid", '+
'TO_VARCHAR (TO_DATE(T0."DocDate"),\'YYYY-MM-DD\') as "fechaemisioncomprobante", '+
'TO_VARCHAR (TO_DATE(current_date),\'YYYY-MM-DD\') as "fechageneracionresumen", '+ 
'\'DISTRIBUIDORA COMERCIAL ALVAREZ BOHL SRL\' as "razonsocialemisor",\'info@alvarezbohl.pe\' as "correoemisor", '+ 
'\'RC\' as "resumentipo",\'1\' as "inhabilitado", \'1\' as "numerofila",T0."Indicator" as "tipodocumento", '+
'\'PEN\' as "tipomoneda",T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD" as "numerocorrelativo", '+
'T1."U_SYP_BPTD" as "tipodocumentoadquiriente",T1."LicTradNum" as "numerodocumentoadquiriente", '+
'\'3\' as "estadoitem",Round(T0."DocTotal",2) as "totalventa",\'0.00\' as "totalisc", '+
'T0."VatSum" as "totaligv",\'0.00\' as "totalicbper", '+
'T0."U_AB_DMEB" as "bl_estadoregistro",Round(Round(T0."DocTotal",2)-round(T0."VatSum",2),2) as "totalvalorventaopgravadaconigv" '+
'from '+dbname+'.OINV T0 inner join '+dbname+'.OCRD T1 on T0."CardCode"=T1."CardCode" '+
'where T0."DocDate" between \''+fini+'\' and \''+ffin+'\' and T0."Indicator"=\'03\' '+
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
        		mIncomingPayment += '"correoemisor": "'+rs[i].correoemisor+'",';
        		mIncomingPayment += '"resumentipo": "'+rs[i].resumentipo+'",';
        		mIncomingPayment += '"inhabilitado": "1",';
        		mIncomingPayment += '"bl_estadoregistro": "'+rs[i].bl_estadoregistro+'",';
        		
        		
        		    mIncomingPayment += '"spe_summary_item": [';
        		    mIncomingPayment += '{'; 
        		    mIncomingPayment += '"tipodocumentoemisor": "'+rs[i].tipodocumentoemisor+'",';
        		    mIncomingPayment += '"numerodocumentoemisor": "'+rs[i].numerodocumentoemisor+'",';
        		    mIncomingPayment += '"resumenid": "'+rs[i].resumenid+'",';
        		    mIncomingPayment += '"numerofila": "'+rs[i].numerofila+'",';
        		    mIncomingPayment += '"tipodocumento": "'+rs[i].tipodocumento+'",';
        		    mIncomingPayment += '"tipomoneda": "'+rs[i].tipomoneda+'",';
        		    mIncomingPayment += '"numerocorrelativo": "'+rs[i].numerocorrelativo+'",';
        		    mIncomingPayment += '"tipodocumentoadquiriente": "'+rs[i].tipodocumentoadquiriente+'",';
        		    mIncomingPayment += '"numerodocumentoadquiriente": "'+rs[i].numerodocumentoadquiriente+'",';
        		    mIncomingPayment += '"estadoitem": "'+rs[i].estadoitem+'",';
        		    mIncomingPayment += '"totalventa": '+rs[i].totalventa+',';
        		    mIncomingPayment += '"totalisc": "'+rs[i].totalisc+'",';
        		    mIncomingPayment += '"totaligv": '+rs[i].totaligv+',';
        		    mIncomingPayment += '"totalvalorventaopgravadaconigv": '+rs[i].totalvalorventaopgravadaconigv+',';
        		    mIncomingPayment += '"totalicbper": "'+rs[i].totalicbper+'"';
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