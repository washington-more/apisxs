$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarPrecios(empresa, articulo, lista, precio){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        var dbname = functions.GetDataBase(empresa);
        
        query = 'update '+dbname+'.ITM1 set "Price"='+precio;
        var where =' where "ItemCode"=\''+articulo+'\' and "PriceList"='+lista;
            query += where;
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();

                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

function ActualizarEstadoAlmacen(empresa, sucursal, articulo,esta){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        var dbname = functions.GetDataBase(empresa);
        
        query = 'update T0 '+
        'set "U_AB_DMAR"=\''+esta+'\' '+ 
        'from '+dbname+'.OITW T0 inner join '+dbname+'.OWHS T1 on T0."WhsCode"=T1."WhsCode"';
        var where ='where T0."ItemCode"=\''+articulo+'\' and T1."U_AB_SUCURSAL"=\''+sucursal+'\' and T1."WhsName" like \'Almacen Principal%\' ';
            query += where;
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();

                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

try{

	var empId = $.request.parameters.get('empId');
	var itemcode = $.request.parameters.get('itemcode');
	var pricel = $.request.parameters.get('pricel');
	var price = $.request.parameters.get('price');
	var suc = $.request.parameters.get('suc');
	var rev = $.request.parameters.get('rev');
	
	if (empId !== undefined && pricel !== undefined && itemcode !== undefined)
	{
	    conn = $.db.getConnection();
 
	    //actualizar OV
	    var precbase = ActualizarPrecios(empId, itemcode, pricel, price);
	    var revi = ActualizarEstadoAlmacen(empId, suc, itemcode, rev);
	        
	    if(precbase === Constants.MESSAGE_SUCCESS){
            objType = Constants.SUCCESS_MESSAGE_RESPONSE;
	        objResult = functions.CreateJSONMessage(empId, Constants.MESSAGE_SUCCESS);
	        conn.commit();
        }else{
            conn.rollback();
            objType = Constants.ERROR_MESSAGE_RESPONSE;  
	        objResult = functions.CreateJSONMessage(-102, precbase);
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