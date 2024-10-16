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
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select "codigo","nombre","unidad","P1","P2","P3","P4","P5","P6","MAY-CON" as "MAYCON","MAY_CRE" as "MAYCRE","BOD-CON" as "BODCON", '+
	'"BOD-CRE" as "BODCRE","MER-CON" as "MERCON","MER-CRE" as "MERCRE","Stock","Costo Inc.IGV" as "Costo", '+
	'case when "MAY-CON"=0 then 0 else 100-"Costo Inc.IGV"/"MAY-CON"*100 end as "fMAYCON", '+
	'case when "MAY_CRE"=0 then 0 else 100-"Costo Inc.IGV"/"MAY_CRE"*100 end as "fMAYCRE", '+
	'case when "BOD-CON"=0 then 0 else 100-"Costo Inc.IGV"/"BOD-CON"*100 end as "fBODCON", '+
	'case when "BOD-CRE"=0 then 0 else 100-"Costo Inc.IGV"/"BOD-CRE"*100 end as "fBODCRE", '+
	'case when "MER-CON"=0 then 0 else 100-"Costo Inc.IGV"/"MER-CON"*100 end as "fMERCON", '+
	'case when "MER-CRE"=0 then 0 else 100-"Costo Inc.IGV"/"MER-CRE"*100 end as "fMERCRE", '+
	'"revision","comentarios" '+
	//'"(select "U_AB_MAMR" from '+dbname+'."@AB_MARGENES" where "U_AB_MACA"="codigo" and "U_AB_MACL"="P1") as "Margen1" '+
'from( '+
'select "codigo","nombre","unidad", '+
	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%MAY-CON\') as "P1", '+
	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%MAY-CRE\') as "P2", '+
	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%BOD-CON\') as "P3", '+
	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%BOD-CRE\') as "P4", '+
	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%MER-CON\') as "P5", '+
	'(select "ListNum" from '+dbname+'.OPLN where "U_AB_SUCURSAL"=\''+suc+'\' and "ListName" like \'%MER-CRE\') as "P6", '+
	'sum(case when "ListName" like \'%MAY-CON\' then "Precio Inc.IGV" end) as "MAY-CON", '+
	'sum(case when "ListName" like \'%MAY-CRE\' then "Precio Inc.IGV" end) as "MAY_CRE", '+
	'sum(case when "ListName" like \'%BOD-CON\' then "Precio Inc.IGV" end) as "BOD-CON", '+
	'sum(case when "ListName" like \'%BOD-CRE\' then "Precio Inc.IGV" end) as "BOD-CRE", '+
	'sum(case when "ListName" like \'%MER-CON\' then "Precio Inc.IGV" end) as "MER-CON", '+
	'sum(case when "ListName" like \'%MER-CRE\' then "Precio Inc.IGV" end) as "MER-CRE", '+
	'sum(case when "ListName" like \'LP Base%\' then "Precio Inc.IGV" end) as "Costo Inc.IGV", '+
	'"Stock","revision","comentarios" '+
'from( '+
'select distinct oi."ItemCode" as "codigo",oi."ItemName" as "nombre", oi."InvntryUom" as "unidad",op."ListName" , '+
				'it."Price"*(100+ifnull(18,0))/100.0 as "Precio Inc.IGV", ow."OnHand" as "Stock",ow."U_AB_DMAR" as "revision", '+
				'oi."ValidComm" as "comentarios" '+
		'from '+dbname+'.ITM1 it inner join '+dbname+'.OITM oi on it."ItemCode"=oi."ItemCode" and oi."frozenFor" = \'N\' '+
						 'inner join '+dbname+'.OITW ow on ow."ItemCode"=oi."ItemCode" and ow."WhsCode"= '+
						 '(select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL"=\''+suc+'\' and "WhsName" like \'Almacen Principal%\') '+
						 'inner join '+dbname+'.OPLN op on it."PriceList"=op."ListNum" '+
		'where ow."WhsCode"= (select "WhsCode" from '+dbname+'.OWHS where "U_AB_SUCURSAL"=\''+suc+'\' and "WhsName" like \'Almacen Principal%\') '+ 
		'and op."U_AB_SUCURSAL"=\''+suc+'\' and oi."U_AB_UNPROV"=\''+uneg+'\' and oi."frozenFor" = \'N\' '+
		'and ow."Locked"  = \'N\' and oi."ItemType"=\'I\' '+
')Q '+
'group by "codigo","nombre","unidad","Stock","revision","comentarios" '+
')Q1; ';
	        
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