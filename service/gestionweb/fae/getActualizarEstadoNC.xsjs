$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarComprometidos(empresa,numero, est){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        
        query = 'update '+empresa+'.ORIN '+
        'set "U_AB_DMEB"=\''+est+'\' '+
        ' where ("U_SYP_MDSD"||\'-\'||"U_SYP_MDCD"=\''+numero+'\') ';
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();
                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

try{

	var empId = $.request.parameters.get('empId');
	var numeroDoc = $.request.parameters.get('numeroDoc');
	var estado = $.request.parameters.get('estado');
	
	if (numeroDoc !== undefined && estado !== undefined )
	{
	    var dbname = functions.GetDataBase(empId);
	    conn = $.db.getConnection();
 
	    //actualizar OV
	    var actualizar = ActualizarComprometidos(dbname,numeroDoc, estado);
	        
	    if(actualizar === Constants.MESSAGE_SUCCESS){
            objType = Constants.SUCCESS_MESSAGE_RESPONSE;
	        objResult = functions.CreateJSONMessage(numeroDoc, Constants.MESSAGE_SUCCESS);
	        conn.commit();
        }else{
            conn.rollback();
            objType = Constants.ERROR_MESSAGE_RESPONSE;  
	        objResult = functions.CreateJSONMessage(-102, query);
        }
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;  
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse,objType);
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;  
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResult, 1);
	functions.DisplayJSON(objResponse, objType);
}finally{
    conn.close();
}