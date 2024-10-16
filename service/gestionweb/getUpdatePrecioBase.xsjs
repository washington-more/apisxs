$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function ActualizarPrecioBase(empresa, articulo, sucursal, precio){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        var dbname = functions.GetDataBase(empresa);
        
        query = 'update T0 '+
        'set T0."Price"='+precio+' '+
        'from '+dbname+'.ITM1 T0 inner join '+dbname+'.OPLN T1 on T0."PriceList"=T1."ListNum" ';
        var where =' where T0."ItemCode"=\''+articulo+'\' and T1."U_AB_SUCURSAL"=\''+sucursal+'\' and T1."ListName" like \'LP Base%\' ';
        
            query += where;
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();

                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

function ActualizarEstado(empresa, cod, articulo){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        var dbname = functions.GetDataBase(empresa);
        
        query = 'update '+dbname+'.PDN1 set "U_AB_RVPC"=\'Y\' ';
        var where ='where "DocEntry"='+cod+' and "ItemCode"=\''+articulo+'\'';
        
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
	var docentry = $.request.parameters.get('docentry');
	var itemcode = $.request.parameters.get('itemcode');
	var suc = $.request.parameters.get('suc');
	var price = $.request.parameters.get('price');
	var revi = $.request.parameters.get('revi');
	
	if (empId !== undefined && docentry !== undefined && itemcode !== undefined)
	{
	    conn = $.db.getConnection();
 
	    //actualizar OV
	    var precbase = ActualizarPrecioBase(empId, itemcode, suc, price);
	    var estado = ActualizarEstado(empId, docentry, itemcode);
	    var rev = ActualizarEstadoAlmacen(empId, suc, itemcode,revi);
	        
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