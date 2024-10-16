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
    var suc = $.request.parameters.get('suc');
    var uneg = $.request.parameters.get('uneg');
    var test = $.request.parameters.get('test');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select "codigo","nombre","unidad", '+
            	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%MAY-CON\') as "P1", '+
            	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%BOD-CON\') as "P3", '+
            	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%MER-CON\') as "P5", '+
            	'sum(case when "ListName" like \'%MAY-CON\' then "margen" end) as "MAY-CON", '+
            	'sum(case when "ListName" like \'%BOD-CON\' then "margen" end) as "BOD-CON", '+
            	'sum(case when "ListName" like \'%MER-CON\' then "margen" end) as "MER-CON", '+
            	'"Stock","Categoria","Comentario" '+
                'from( '+
                'select distinct oi."ItemCode" as "codigo",oi."ItemName" as "nombre", oi."InvntryUom" as "unidad",op."ListName" , '+
                				'it."Price"*(100+ifnull(18,0))/100.0 as "Precio Inc.IGV", ow."OnHand" as "Stock", '+
                				'case when mg."U_AB_MAMR" is null then 0 else mg."U_AB_MAMR" end as "margen", ct."Name" as "Categoria", '+
                				'ifnull(('+
                            	    'SELECT TO_VARCHAR(mgq."U_AB_MACO")'+
                            	    'FROM ('+
                            	        'SELECT "U_AB_MACO", ROW_NUMBER() OVER (PARTITION BY "U_AB_MACA" ORDER BY "U_AB_MACA" desc) AS row_num '+
                            	        'FROM '+dbname+'."@AB_MARGENES" '+
                            	        'WHERE "U_AB_MACA" = oi."ItemCode" and "U_AB_MACO" is not null and TO_VARCHAR("U_AB_MACO") != \'null\' '+
                            	    ') AS mgq '+
                            	    'WHERE mgq.row_num = \'1\' '+
                                 '), \'\') as "Comentario" ' +
                		'from '+dbname+'.ITM1 it inner join '+dbname+'.OITM oi on it."ItemCode"=oi."ItemCode" and oi."frozenFor" = \'N\' '+ 
    						 'inner join '+dbname+'.OITW ow on ow."ItemCode"=oi."ItemCode" and ow."WhsCode"= '+
    						 '(select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL"=\''+suc+'\' and "WhsName" like \'Almacen Principal%\') '+
    						 'inner join '+dbname+'.OPLN op on it."PriceList"=op."ListNum" '+
    						 'left join '+dbname+'."@AB_CATEGORIAPRV" ct on oi."U_COD_CATPRV"=ct."Code" '+
                			 'left join '+dbname+'."@AB_MARGENES" mg on it."ItemCode"=mg."U_AB_MACA" and op."ListNum"=mg."U_AB_MACL" '+
                		'where ow."WhsCode"= (select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL"=\''+suc+'\' and "WhsName" like \'Almacen Principal%\') '+
                		'and op."U_AB_SUCURSAL"=\''+suc+'\' and oi."U_AB_UNPROV"=\''+uneg+'\' and oi."frozenFor" = \'N\' '+
                		'and ow."Locked"  = \'N\' and oi."ItemType"=\'I\' '+
                ')Q '+
                'group by "codigo","nombre","unidad","Stock","Categoria","Comentario" ';
	        
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
    	    if(test) {
    	        objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+") consulta= " + query);
    	    }else{
    	        
    	        objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	    }
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