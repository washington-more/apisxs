$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var vend;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');
    vend = $.request.parameters.get('vend');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        query = 'select (select sum("DocTotal") from '+dbname+'.ORDR where "SlpCode"='+vend+' and "DocDate"=current_date and "CANCELED"=\'N\' ) as "ImporteOV", '+
        '(select count("DocEntry") from '+dbname+'.ORDR where "SlpCode"='+vend+' and "DocDate"=current_date and "CANCELED"=\'N\' ) as "CantidadOV", '+
        '100 as "Comision", '+
        '(select count(T1."CardCode") from '+dbname+'.OCPR T0 inner join '+dbname+'.OCRD T1 on T0."CardCode"=T1."CardCode" where T1."CardType"=\'L\' and "U_AB_PCCV"='+vend+') as "leads", '+
        '(select sum("DocTotal"-"PaidToDate") from '+dbname+'.OINV where "SlpCode"='+vend+') as "Cobranza", '+
        'ifnull((select sum(T0."SumApplied") from '+dbname+'.RCT2 T0 inner join '+dbname+'.ORCT T1 on T0."DocNum"=T1."DocEntry" '+
	    'inner join '+dbname+'.OINV T2 on  T0."DocEntry"=T2."DocEntry" '+
        'where T0."InvType"=13 and T1."Canceled"=\'N\' and T2."SlpCode"='+vend+' and T1."DocDate"=current_date),0) as "Cobrado" '+
        'from dummy';

    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	
    	if (rs.length > 0)
    	{
	        var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    activity = '{';   
    		    activity += '"ImporteOV": "'+rs[i].ImporteOV+'",';
    		    activity += '"CantidadOV": "'+rs[i].CantidadOV+'",';
    		    activity += '"Comision": "'+rs[i].Comision+'",';
    		    activity += '"leads": "'+rs[i].leads+'",';
    		    activity += '"Cobranza": "'+rs[i].Cobranza+'",';
    		    activity += '"Cobrado": "'+rs[i].Cobrado+'"';
    		    activity += "}";
            	mResult.push(JSON.parse(activity));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;

    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}

}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, 'Tabla de usuario no encontrada');
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}