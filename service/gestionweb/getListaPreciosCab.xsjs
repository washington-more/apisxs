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
    var campo = $.request.parameters.get('campo');
    var suc = $.request.parameters.get('suc');
    var valor = $.request.parameters.get('valor');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select distinct oi."ItemCode" as "codigo",oi."ItemName" as "nombre", oi."InvntryUom" as "unidad",op."ListName" , '+
				'it."Price"*(100+ifnull(18,0))/100.0 as "Precio Inc.IGV", ow."OnHand" as "Stock" '+
		'from '+dbname+'.ITM1 it inner join '+dbname+'.OITM oi on it."ItemCode"=oi."ItemCode" and oi."frozenFor" = \'N\' '+
						 'inner join '+dbname+'.OITW ow on ow."ItemCode"=oi."ItemCode" and ow."WhsCode"= '+
						 '(select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL"=\''+suc+'\' and "WhsName" like \'Almacen Principal%\') '+
						 'inner join '+dbname+'.OPLN op on it."PriceList"=op."ListNum" '+
		'where ow."WhsCode"= (select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL"=\''+suc+'\' and "WhsName" like \'Almacen Principal%\') '+  
		'and op."U_AB_SUCURSAL"=\''+suc+'\' and oi."frozenFor" = \'N\' '+
		'and ow."Locked"  = \'N\' and oi."ItemType"=\'I\' and op."ListName" like \'LP Base%\' '+ 
		'and '+campo+' like \''+valor+'%\'';
	        
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