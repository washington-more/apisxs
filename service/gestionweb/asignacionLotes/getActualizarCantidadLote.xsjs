$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarComprometidos(articulo, almacen,lote,comprometido,disponible){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        
        query = 'update "SBO_MSS_MOBILE".LTOV '+
        'set "IsCommited"='+comprometido+', "Disponible"='+disponible+
        ' where "ItemCode"=\''+articulo+'\' and "WhsCode"=\''+almacen+'\' and "Batches"=\''+lote+'\'';
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();
                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

try{

	var batch = $.request.parameters.get('batch');
	var art = $.request.parameters.get('art');
    var alm = $.request.parameters.get('alm');
    var cant = $.request.parameters.get('cant');
    var dispo = $.request.parameters.get('dispo');
	
	if (batch !== undefined && art !== undefined )
	{
	    conn = $.db.getConnection();
 
	    //actualizar OV
	    var actualizar = ActualizarComprometidos(art, alm,batch,cant,dispo);
	        
	    if(actualizar === Constants.MESSAGE_SUCCESS){
            objType = Constants.SUCCESS_MESSAGE_RESPONSE;
	        objResult = functions.CreateJSONMessage(batch, Constants.MESSAGE_SUCCESS);
	        conn.commit();
        }else{
            conn.rollback();
            objType = Constants.ERROR_MESSAGE_RESPONSE;  
	        objResult = functions.CreateJSONMessage(-102, actualizar);
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