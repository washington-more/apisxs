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
var canal;
var categ;
var unneg;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');
    suc = $.request.parameters.get('suc');
    canal = $.request.parameters.get('canal');
    categ = $.request.parameters.get('categ');
    //unneg = $.request.parameters.get('unneg');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);

        query = 'select T0."U_AB_TKMIN" as "tasa" '+
                'from '+dbname+'."@AB_CTKMIN" T0 '+
                'where T0."U_AB_TKCS"=\''+suc+'\' '+
                'and \''+canal+'\' in (select T1."U_AB_TKCC" from '+dbname+'."@AB_DTKMINCN" T1 where T1."Code"=T0."Code") '+
                'and \''+categ+'\' in (select T1."U_AB_TKCCC" from '+dbname+'."@AB_DTKMINCT" T1 where T1."Code"=T0."Code") ';
                //'and \''+unneg+'\' in (select T1."U_AB_TKCUN" from '+dbname+'."@AB_DTKMINUN" T1 where T1."Code"=T0."Code")';

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