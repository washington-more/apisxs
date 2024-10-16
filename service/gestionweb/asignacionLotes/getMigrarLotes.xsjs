$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var query;
var conn;

function EliminarLotes(empresa, sucursal){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        var dbname = functions.GetDataBase(empresa);
        
        query = 'delete from "SBO_MSS_MOBILE".LTOV where "WhsCode" = '+
        '(select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL" = \''+sucursal+'\' '+
        'and "WhsName" like \'Almacen Principal%\')';
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();

                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

function MigrarLotes(empresa, sucursal){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        var dbname = functions.GetDataBase(empresa);
        
        query = 'insert into "SBO_MSS_MOBILE"."LTOV" SELECT '+
        'T1."WhsCode" AS "Almacen", '+
        'T1."ItemCode" AS "CodArticulo", '+
        'T1."ItemName" AS "Descripcion", '+
        'T0."InvntryUom", '+
        //'T1."Quantity" AS "Stock", '+
        'T1."Quantity"-ifnull(T1."IsCommited",0) AS "Stock", '+
        'T1."BatchNum" AS "Lote", '+
        'CASE IFNULL(T1."ExpDate", \'\') '+
        'WHEN \'\' THEN \'\' '+ 
        'ELSE CAST(T1."ExpDate" AS date) '+
        'END AS "FechaVencimiento", '+
        //'DAYS_BETWEEN(T1."ExpDate", CURRENT_DATE) AS "DiasParaVencer",0,T1."Quantity" '+
        'DAYS_BETWEEN(T1."ExpDate", CURRENT_DATE) AS "DiasParaVencer",0,T1."Quantity"-ifnull(T1."IsCommited",0) as "Quantity" '+
        'FROM '+dbname+'.OIBT T1 '+
        'INNER JOIN '+dbname+'.OITM T0 '+
        'ON T1."ItemCode" = T0."ItemCode" '+
        'INNER JOIN '+dbname+'.OWHS T8 '+
        'ON T1."WhsCode" = T8."WhsCode" '+
        'WHERE (T8."U_AB_SUCURSAL" = \''+sucursal+'\') '+
        'and T8."WhsName" like \'Almacen Principal%\' '+
        'AND T1."Quantity" > 0 ';
            
            var pstmt = conn.prepareStatement(query);   
            pstmt.execute();

                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

try{

	var empId = $.request.parameters.get('empId');
	var suc = $.request.parameters.get('suc');
	
	if (empId !== undefined && suc !== undefined)
	{
	    conn = $.db.getConnection();
 
	    //actualizar OV
	    var eliminar = EliminarLotes(empId, suc);
	    var precbase = MigrarLotes(empId, suc);
	        
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