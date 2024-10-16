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
    var test = $.request.parameters.get('test');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'Select * from( '+
        'select T1."DocDate",T1."DocEntry",T1."DocNum",T1."U_AB_SUCURSAL",T2."PrcName",T0."ItemCode",T0."Dscription",T3."InvntryUom", '+
    //'T0."LineTotal"/"InvQty" as "Ncosto",T4."Price" as "Acosto", '+
    'ROUND(T0."PriceBefDi"/T0."NumPerMsr",3) as "Ncosto",T4."Price" as "Acosto", '+ 
    //'case when round(T0."LineTotal"/"InvQty",3)=0 then 0 else round(100-T4."Price"/(T0."LineTotal"/"InvQty")*100,3) end as "marguen", '+
    'case when round(T0."LineTotal"/"InvQty",3)=0 then 0 else round(100-T4."Price"/ROUND(T0."PriceBefDi"/T0."NumPerMsr",3)*100,3) end as "marguen", '+
    '"InvQty" as "Cantidad",T1."DocDate" as "ejecutado",T6."OnHand" as "stock" '+
    'from '+dbname+'.PDN1 T0 inner join '+dbname+'.OPDN T1 on T0."DocEntry"=T1."DocEntry" '+
    'inner join '+dbname+'.OPRC T2 on T1."U_AB_SUCURSAL"=T2."PrcCode" '+
    'inner join '+dbname+'.OITM T3 on T0."ItemCode"=T3."ItemCode" '+
    'inner join '+dbname+'.ITM1 T4 on T0."ItemCode"=T4."ItemCode" '+
    'inner join '+dbname+'.OPLN T5 on T4."PriceList"=T5."ListNum" and T5."ListName" like \'LP Base%\' '+
    'inner join '+dbname+'.OITW T6 on T0."ItemCode"=T6."ItemCode" and T6."WhsCode"=T0."WhsCode" '+
    'and T1."U_AB_SUCURSAL"=T5."U_AB_SUCURSAL" '+
    'where T0."U_AB_RVPC"=\'N\' and T1."CANCELED"=\'N\' '+
    'and T1."U_AB_SUCURSAL"=\''+suc+'\''+
    ')Q0 where "marguen"<>0 ';
	 
	 if (test)
    	{
    	    objType = "MessageTest";
    	    objResult = functions.CreateJSONMessage(100, "Consula utilizada en el XS => "+query);
    	    objResponse = functions.CreateResponse(objType, objResult, 0);
    	    functions.DisplayJSON(objResponse, objType);
    	}else{      
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