$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query = '';

try{
 
    var empId = $.request.parameters.get('empId');
    var tipo = $.request.parameters.get('tipo');
    var codigo = $.request.parameters.get('codigo');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
	    
	    if(tipo === 'BUU'){
	        query ='select Sum("PorEntregar") as "PorEntregar",sum("Entregado") as "Entregado" '+
            'from( '+
            'select sum(T0."IsCommited") as "PorEntregar", 0 as "Entregado" '+
            'from ' + dbname + '.OITW T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_BUOC" from ' + dbname + '."@AB_BUDO" T1 where T1."Code"='+codigo+') '+
            'union all '+
            'select 0 as "PorEntregar", sum(T0."Quantity") as "Entregado" '+
            'from ' + dbname + '.INV1 T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_BUOC" from ' + dbname + '."@AB_BUDO" T1 where T1."Code"='+codigo+') '+
            ')T0 ';
	    }else{
	        if(tipo === 'BTCE'){
	        query ='select Sum("PorEntregar") as "PorEntregar",sum("Entregado") as "Entregado" '+
            'from( '+
            'select sum(T0."IsCommited") as "PorEntregar", 0 as "Entregado" '+
            'from ' + dbname + '.OITW T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DCECB" from ' + dbname + '."@AB_DCEO" T1 where T1."Code"='+codigo+') '+
            'union all '+
            'select 0 as "PorEntregar", sum(T0."Quantity") as "Entregado" '+
            'from ' + dbname + '.INV1 T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DCECB" from ' + dbname + '."@AB_DCEO" T1 where T1."Code"='+codigo+') '+
            ')T0 ';
	    }else{
	       if(tipo === 'BCTC'){
	        query ='select Sum("PorEntregar") as "PorEntregar",sum("Entregado") as "Entregado" '+
            'from( '+
            'select sum(T0."IsCommited") as "PorEntregar", 0 as "Entregado" '+
            'from ' + dbname + '.OITW T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DTCCB" from ' + dbname + '."@AB_DTCO" T1 where T1."Code"='+codigo+') '+
            'union all '+
            'select 0 as "PorEntregar", sum(T0."Quantity") as "Entregado" '+
            'from ' + dbname + '.INV1 T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DTCCB" from ' + dbname + '."@AB_DTCO" T1 where T1."Code"='+codigo+') '+
            ')T0 ';
	    }else{
	        if(tipo === 'BARG'){
	        query ='select Sum("PorEntregar") as "PorEntregar",sum("Entregado") as "Entregado" '+
            'from( '+
            'select sum(T0."IsCommited") as "PorEntregar", 0 as "Entregado" '+
            'from ' + dbname + '.OITW T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DBARC" from ' + dbname + '."@AB_BARO" T1 where T1."Code"='+codigo+') '+
            'union all '+
            'select 0 as "PorEntregar", sum(T0."Quantity") as "Entregado" '+
            'from ' + dbname + '.INV1 T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DBARC" from ' + dbname + '."@AB_BARO" T1 where T1."Code"='+codigo+') '+
            ')T0 ';
	    }else{
	        if(tipo === 'BOBE'){
	        query ='select Sum("PorEntregar") as "PorEntregar",sum("Entregado") as "Entregado" '+
            'from( '+
            'select sum(T0."IsCommited") as "PorEntregar", 0 as "Entregado" '+
            'from ' + dbname + '.OITW T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DBECB" from ' + dbname + '."@AB_DBEO" T1 where T1."Code"='+codigo+') '+
            'union all '+
            'select 0 as "PorEntregar", sum(T0."Quantity") as "Entregado" '+
            'from ' + dbname + '.INV1 T0 '+
            'where LENGTH(T0."WhsCode")=2 and T0."ItemCode" in (select T1."U_AB_DBECB" from ' + dbname + '."@AB_DBEO" T1 where T1."Code"='+codigo+') '+
            ')T0 ';
	    }else{
	        query ='select 0 as "PorEntregar",0 as "Entregado" from dummy';
	    }
	    } 
	    } 
	    }
	    } 
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    		var mResult = [];
    		var i;
    		
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
    	    objResult = functions.CreateJSONMessage(-101, "No se ha configurado las cuentas para pagos recibidos. ("+empId+")");
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}