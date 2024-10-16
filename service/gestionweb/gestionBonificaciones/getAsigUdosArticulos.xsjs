$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query;
var rs;
var i;

try{
 
    var empId = $.request.parameters.get('empId');
    var tipos = $.request.parameters.get('tpudo');
    var codigo = $.request.parameters.get('codigo');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    
	    /** Bonficicaciones **/
		if(tipos==='AB_BUU'){
		    query = 'select "U_AB_BUUM" as "M", "U_AB_BUUQ" as "Q", "U_AB_BUUB" as "B" ';
		}
		if(tipos==='AB_BCTC'){
		    query = 'select "U_AB_BTCM" as "M", "U_AB_BTCQ" as "Q", "U_AB_BTCB" as "B" ';
		}  
		if(tipos==='AB_DCEH'){
		    query = 'select "U_AB_BTEM" as "M", "U_AB_BTEQ" as "Q", "U_AB_BTEB" as "B" ';
		}
		if(tipos==='AB_BOBE'){
		    query = 'select "U_AB_BBEM" as "M", "U_AB_BBEQ" as "Q", "U_AB_BBEB" as "B" ';
		}
		if(tipos==='AB_DBARC'){
		    query = 'select "U_AB_BARM" as "M", "U_AB_BARQ" as "Q", "U_AB_BARB" as "B" ';
		}
		
		/** Descuentos **/
		if(tipos==='AB_DUUC'){
		    query = 'select "U_AB_DUUM" as "M", "U_AB_DUUQ" as "Q", "U_AB_DUUB" as "B" ';
		}
		if(tipos==='AB_DCST'){
		    query = 'select "U_AB_DTCM" as "M", "U_AB_DTCQ" as "Q", "U_AB_DTCB" as "B" ';
		}  
		if(tipos==='AB_DCCE'){
		    query = 'select "U_AB_DTEM" as "M", "U_AB_DTEQ" as "Q", "U_AB_DTEB" as "B" ';
		}
		if(tipos==='AB_DTBO'){
		    query = 'select "U_AB_DCEM" as "M", "U_AB_DCEQ" as "Q", "U_AB_DCEB" as "B" ';
		}
		if(tipos==='AB_DBAR'){
		    query = 'select "U_AB_DARM" as "M", "U_AB_DARQ" as "Q", "U_AB_DARB" as "B" ';
		}
        //query = 'SELECT "U_AB_BUUM" as "a", "U_AB_BUUQ" as "b", "U_AB_BUUB" as "c" '+
        //'from '+dbname+'.OITM '+
        var where = 'from '+dbname+'.OITM '+
        'where "ItemCode" = \''+codigo+'\'';
        
        query += where;
	        
    	var conn = $.hdb.getConnection();
    	rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    		var mResult = [];
    		
    		for(i = 0; i < rs.length ; i++)
    		{
        		mResult.push(rs[i]);
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message + ' --- ' + rs[i]);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}