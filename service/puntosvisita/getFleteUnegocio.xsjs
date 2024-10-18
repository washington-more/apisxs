$.import("AZH_MOBILE.Functions", "Functions");
$.import("AZH_MOBILE.Constants","Constants");
var functions = $.AZH_MOBILE.Functions;
var Constants = $.AZH_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var suc;
var zona;
var categ;
var uneg;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');
    suc = $.request.parameters.get('suc');
    zona = $.request.parameters.get('zona');
    categ = $.request.parameters.get('categ');
    uneg = $.request.parameters.get('uneg');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);

        query = 'select T0."U_AB_FPFL" '+
                'from '+dbname+'."@AB_FLPA" T0 '+
                'where T0."U_AB_FPCS"=\''+suc+'\' and T0."U_AB_FPQZ"=\''+zona+'\' and T0."U_AB_FPQC"=\''+categ+'\' '+
                'and \''+uneg+'\' in (select T1."U_AB_PNCN" from '+dbname+'."@AB_FPUN" T1 where T1."Code"=T0."Code")';

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
	objResult = functions.CreateJSONMessage(-9703000, query);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}