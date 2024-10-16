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
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
                    
        query ='select \'AB_BUU\' as "Tipo", T0."Code", T0."Name" as "NameIpar", T0."U_AB_BUDS", T0."U_AB_BUAC", '+
        'TO_NVARCHAR(T0."U_AB_BUFI",\'YYYY-MM-DD\') AS "U_AB_BUFI",TO_NVARCHAR(T0."U_AB_BUFF",\'YYYY-MM-DD\') AS "U_AB_BUFF", '+
        'ifnull((select STRING_AGG(T1."U_AB_BUSN", \'/\') from ' + dbname + '."@AB_BUDS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull(( '+
         'SELECT LEFT(T1."U_AB_BUDC",3)||\'-\'|| T2."Name" from ' + dbname + '."@AB_BUDT" T1 '+
 		 'LEFT JOIN ' + dbname + '."@AB_UNPROV" T2 ON LEFT(T1."U_AB_BUDC",3) = T2."Code" '+
 		 'WHERE T1."Code"=T0."Code" AND T1."LineId"=\'1\' '+
        '),\'\') as "Unidad",'+
       
        'ifnull(( select STRING_AGG(T1."U_AB_BUOC" ||\'-\'|| T1."U_AB_BUOD", \'/\') from ' + dbname + '."@AB_BUDO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequio" '+
        'from ' + dbname + '."@AB_BUU" T0 WHERE T0."U_AB_BUIW"=\'Y\''+ 
        'and T0."Code" not in ( select distinct "U_AB_DBARC" from ' + dbname + '."@AB_DBAR"  where "U_AB_DBARU"= \'AB_BUU\'  )'+
        
        'union all '+
        'select \'AB_BCTC\' as "Tipo", T0."Code", T0."Name", T0."U_AB_BTCD", T0."U_AB_BTCA",'+
        'TO_NVARCHAR(T0."U_AB_BTCI",\'YYYY-MM-DD\') AS "U_AB_BTCI", TO_NVARCHAR(T0."U_AB_BTCF",\'YYYY-MM-DD\') AS "U_AB_BTCF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DTCNS", \'/\') from ' + dbname + '."@AB_DTCS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull(( '+
         'SELECT LEFT(T1."U_AB_DTCCA",3)||\'-\'|| T2."Name" from ' + dbname + '."@AB_DTCI" T1 '+
 		 'LEFT JOIN ' + dbname + '."@AB_UNPROV" T2 ON LEFT(T1."U_AB_DTCCA",3) = T2."Code" '+
 		 'WHERE T1."Code"=T0."Code" AND T1."LineId"=\'1\' '+
        '),\'\') as "Unidad", '+
        'ifnull((select STRING_AGG(T1."U_AB_DTCCB" ||\'-\'|| T1."U_AB_DTCDB", \'/\') from ' + dbname + '."@AB_DTCO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequio" '+
        'from ' + dbname + '."@AB_BCTC" T0 WHERE T0."U_AB_BTCU"=\'Y\''+
        
        'union all '+
        'select \'AB_DCEH\' as "Tipo", T0."Code", T0."Name", T0."U_AB_BCED", T0."U_AB_BCEA",'+
        'TO_NVARCHAR(T0."U_AB_BCEF",\'YYYY-MM-DD\') AS "U_AB_BCEF", TO_NVARCHAR(T0."U_AB_BCEE",\'YYYY-MM-DD\') AS "U_AB_BCEE", '+
        'ifnull((select  STRING_AGG(T1."U_AB_DCENS", \'/\') from ' + dbname + '."@AB_DCES" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull(( '+
         'SELECT LEFT(T1."U_AB_DCEC",3)||\'-\'|| T2."Name" from ' + dbname + '."@AB_DCEI" T1 '+
 		 'LEFT JOIN ' + dbname + '."@AB_UNPROV" T2 ON LEFT(T1."U_AB_DCEC",3) = T2."Code" '+
 		 'WHERE T1."Code"=T0."Code" AND T1."LineId"=\'1\' '+
        '),\'\') as "Unidad",'+
        '\'\' as "Obsequio"'+
        'from ' + dbname + '."@AB_BTCE" T0 WHERE T0."U_AB_BCEU"=\'Y\''+
        
        'union all '+ 
        'select \'AB_DUUC\' as "Tipo", T0."Code", T0."Name", T0."U_AB_DUCD", T0."U_AB_DUCA", TO_NVARCHAR(T0."U_AB_DUCI",\'YYYY-MM-DD\') AS "U_AB_DUCI", TO_NVARCHAR(T0."U_AB_DUCF",\'YYYY-MM-DD\') AS "U_AB_DUCF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DUCNS", \'/\') from ' + dbname + '."@AB_DUCS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull(( '+
         'SELECT LEFT(T1."U_AB_DUCCA",3)||\'-\'|| T2."Name" from ' + dbname + '."@AB_DUDT" T1 '+
 		 'LEFT JOIN ' + dbname + '."@AB_UNPROV" T2 ON LEFT(T1."U_AB_DUCCA",3) = T2."Code" '+
 		 'WHERE T1."Code"=T0."Code" AND T1."LineId"=\'1\' '+
        '),\'\') as "Unidad", '+
        '\'\' as "Obsequido"'+
        'from ' + dbname + '."@AB_DUUC" T0 WHERE T0."U_AB_DUCU"=\'Y\''+
        'union all '+
        // Agrupacion de reglas
        'select Distinct  \'AB_DBARC\' as "Tipo", T0."Code", T0."Name",  CAST(T0."U_AB_BARD" AS VARCHAR), T0."U_AB_BARA",'+
        'TO_NVARCHAR(T0."U_AB_BARI",\'YYYY-MM-DD\') AS "U_AB_BARI", TO_NVARCHAR(T0."U_AB_BARF",\'YYYY-MM-DD\') AS "U_AB_BARF", '+
        //'ifnull((select STRING_AGG(T3."U_AB_BRGNS", \'/\') from ' + dbname + '."@AB_DBAR" T1 '+
        //'inner join ' + dbname + '."@AB_BORE" T2 on T1."U_AB_DBARC"=T2."Code"'+
        //'inner join ' + dbname + '."@AB_BRDS" T3 on T3."Code"=T2."Code"'+
        //'where T0."Code"=T1."Code"'+
        //'group by T1."Code" ), \'\') as "Sucursal", '+
        //'\'-\' as "Sucursal", '+
        'ifnull((select STRING_AGG(T1."U_AB_BUSN", \'/\') from ' + dbname + '."@AB_BUDS" T1 where T1."Code"= T2."U_AB_DBARC" group by T1."Code"),\'\') as "Sucursal", '+
        '\'-\' as "Unidad", '+
        //'\'\' as "Obsequio"'+
        'ifnull(( select STRING_AGG(T1."U_AB_DBARC" ||\'-\'|| T1."U_AB_DBARD", \'/\') from ' + dbname + '."@AB_BARO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequio" '+
        'from ' + dbname + '."@AB_BARG" T0 '+
       'inner join ' + dbname +'."@AB_DBAR" T2 on T0."Code" = T2."Code"'+
       'where  T0."U_AB_BUIW"=\'Y\''+
        'order by T0."Code" desc';
	        
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