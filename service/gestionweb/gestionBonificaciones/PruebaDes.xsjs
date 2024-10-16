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
        // D.1A1   
        
        
        
       // sucursales 
       query='  with "Sucursales" as ( '+
            '    select  distinct "Codigo_Rel", "Sucursal" from ( '+
            '       select DISTINCT T10."U_AB_DUCG" as "Codigo_Rel", T1."U_AB_DUCNS" as "Sucursal"'+
            '       from ' + dbname + '."@AB_DUUC" T10   '+
            '       inner join ' + dbname + '."@AB_DUCS" T1 on T1."Code" = T10."Code"    '+
            '       union all   '+
                               
            '       select  DISTINCT T20."U_AB_DTCG" as "Codigo_Rel", T1."U_AB_DTCNS" as "Sucursal" '+
            '       from ' + dbname + '."@AB_DCST" T20   '+
            '       inner join ' + dbname + '."@AB_DTCU" T1 on T1."Code" = T20."Code"    '+
            '       union all '+
                                    
            '       select  DISTINCT T22."U_AB_DCCG" as "Codigo_Rel", T21."U_AB_DCCNS" as "Sucursal" '+
            '       from ' + dbname + '."@AB_DCCE" T22   '+
            '       inner join ' + dbname + '."@AB_DCCS" T21 on T22."Code" = T21."Code"  '+
            '       union all  '+
                                  
            '        select  DISTINCT T24."U_AB_DTBG" as "Codigo_Rel", T25."U_AB_DTBNS" as "Sucursal"    '+
            '        from ' + dbname + '."@AB_DTBO" T24    '+
            '        inner join ' + dbname + '."@AB_DTBS" T25 on T24."Code" = T25."Code"   '+
            '        )  '+
            '    )  '+
       
        'select \'AB_DUUC\' as "Tipo", T0."Code", T0."U_AB_DUCD", T0."U_AB_DUCA", TO_NVARCHAR(T0."U_AB_DUCI",\'YYYY-MM-DD\') AS "U_AB_DUCI", TO_NVARCHAR(T0."U_AB_DUCF",\'YYYY-MM-DD\') AS "U_AB_DUCF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DUCNS", \'/\') from ' + dbname + '."@AB_DUCS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull((  SELECT GV."Code" || \'-\' ||GV."Name"  FROM ' + dbname + '."@AB_UNPROV" GV '+
                    'WHERE GV."Code" = LEFT(T0."U_AB_DUCD", 3)'+
            '),\'\') as "Unidad" '+
        'from ' + dbname + '."@AB_DUUC" T0 WHERE T0."U_AB_DUCU"=\'N\' and T0."U_AB_DUAG"=\'N\' '+
        'union all '+
        // D.TICKETCOMPRAESCALA
        'select \'AB_DCST\' as "Tipo",T0."Code",T0."U_AB_DTCD",T0."U_AB_DTCA",TO_NVARCHAR(T0."U_AB_DTCI",\'YYYY-MM-DD\') AS "U_AB_DTCI",TO_NVARCHAR(T0."U_AB_DTCF",\'YYYY-MM-DD\') AS "U_AB_DTCF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DTCNS", \'/\') from ' + dbname + '."@AB_DTCU" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull((  SELECT GV."Code" || \'-\' ||GV."Name" FROM ' + dbname + '."@AB_UNPROV" GV '+
                    'WHERE GV."Code" = LEFT(T0."U_AB_DTCD", 3)'+
                '),\'\') as "Unidad" '+
        'from ' + dbname + '."@AB_DCST" T0 WHERE T0."U_AB_DTCU"=\'N\' and T0."U_AB_DTEG"=\'N\' '+
        
        'union all '+
        
        // D.COMBOESCALA
        'select \'AB_DCCE\' as "Tipo",T0."Code",T0."U_AB_DCCD",T0."U_AB_DCCA",TO_NVARCHAR(T0."U_AB_DCCI",\'YYYY-MM-DD\') AS "U_AB_DCCI",TO_NVARCHAR(T0."U_AB_DCCF",\'YYYY-MM-DD\') AS "U_AB_DCCF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DCCNS", \'/\') from ' + dbname + '."@AB_DCCS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull((  SELECT GV."Code" || \'-\' ||GV."Name" FROM ' + dbname + '."@AB_UNPROV" GV '+
                      'WHERE GV."Code" = LEFT(T0."U_AB_DCCD", 3)'+
                '),\'\') as "Unidad" '+
        'from ' + dbname + '."@AB_DCCE" T0 WHERE T0."U_AB_DCCU"=\'N\' and T0."U_AB_DCEG"=\'N\' '+
        
        'union all '+
        
        'select \'AB_DTBO\' as "Tipo",T0."Code",T0."U_AB_DTBD",T0."U_AB_DTBA",TO_NVARCHAR(T0."U_AB_DTBI",\'YYYY-MM-DD\') AS "U_AB_DTBI",TO_NVARCHAR(T0."U_AB_DTBF",\'YYYY-MM-DD\') AS "U_AB_DTBF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DTBNS", \'/\') from ' + dbname + '."@AB_DTBS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull(( '+
         'SELECT LEFT(T1."U_AB_DTBCA",3)||\'-\'|| T2."Name" from ' + dbname + '."@AB_DTBI" T1 '+
 		 'LEFT JOIN ' + dbname + '."@AB_UNPROV" T2 ON LEFT(T1."U_AB_DTBCA",3) = T2."Code" '+
 		 'WHERE T1."Code"=T0."Code" AND T1."LineId"=\'1\' '+
        '),(ifnull((  SELECT GV."Code" || \'-\' ||GV."Name" as "cadena" FROM ' + dbname + '."@AB_UNPROV" GV '+
                      'WHERE GV."Code" = LEFT(T0."U_AB_DTBD", 3)'+
                '),\'\'))'+
        ') as "Unidad" '+
        'from ' + dbname + '."@AB_DTBO" T0 WHERE T0."U_AB_DTBU"=\'N\' and T0."U_AB_DTAG"=\'N\''+
        
        /**'union all '+
        'select \'AB_DAER\' as "Tipo",T0."Code",T0."Name",T0."U_AB_DAEA",TO_NVARCHAR(T0."U_AB_DAEI",\'YYYY-MM-DD\') AS "U_AB_DAEI",TO_NVARCHAR(T0."U_AB_DAEF",\'YYYY-MM-DD\') AS "U_AB_DAEF", '+
        'ifnull((select STRING_AGG(T3."U_AB_DRGNS", \'/\') from ' + dbname + '."@AB_DDAE" T1 '+
        'inner join ' + dbname + '."@AB_DSRE" T2 on T1."U_AB_DAECR"=T2."Code"'+
        'inner join ' + dbname + '."@AB_DRDS" T3 on T3."Code"=T2."Code"'+
        'where T0."Code"=T1."Code"'+
        'group by T1."Code" ), \'\') as "Sucursal", '+
        '\'-\' as "Unidad" '+
        // ' \'\' as "Sucursal" '+
        'from ' + dbname + '."@AB_DAER" T0 '+ **/
        'union all '+
        
        
        'select \'AB_DBAR\' as "Tipo",T0."Code",T0."U_AB_DARE" as "Name", T0."U_AB_DARA",TO_NVARCHAR(T0."U_AB_DARI",\'YYYY-MM-DD\') AS "U_AB_DARI",TO_NVARCHAR(T0."U_AB_DARF",\'YYYY-MM-DD\') AS "U_AB_DARF", '+
        '( select ' +
	    '	ifnull( STRING_AGG( T20."Sucursal" , \'/\'),\'\') '+
	    '	from "Sucursales" T20 '+
	    '	where T20."Codigo_Rel" =T0."Code" ' +
	    '	GROUP BY T0."Code" ) as "Sucursal", '+
        'ifnull((  SELECT  GV."Code" || \'-\' ||GV."Name" as "cadena"  FROM ' + dbname + '."@AB_UNPROV" GV '+
                      'WHERE GV."Code" = LEFT(T0."U_AB_DARE", 3)'+
            '),\'\') as "Unidad"'+
        'from ' + dbname + '."@AB_DARG" T0 '+
        'order by T0."Code" desc';
        
        // 'select \'AB_DRG\' as "Tipo","Code","U_AB_DSRD","U_AB_DSRA","U_AB_DSRI" '+
        // 'from ' + dbname + '."@AB_DSRE" '
        // 'union all '+
        // 'select \'AB_DDAR\' as "Tipo","Code",\'-\' as "U_AB_DSRD",\'-\' as "U_AB_DSRA",\'-\' as "U_AB_DSRI" '+
        // 'from ' + dbname + '."@AB_DDAR" '+
        // 'union all '+
        // 'select \'AB_DDAE\' as "Tipo","Code",\'-\' as "U_AB_DSRD",\'-\' as "U_AB_DSRA",\'-\' as "U_AB_DSRI" '+
        // 'from ' + dbname + '."@AB_DDAE" '
        
	        
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
    	    //objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	   objResult = functions.CreateJSONObject(100, query, 1);
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
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.",query);
	    objResponse = functions.CreateResponse(objType, objResult, 0);
	    functions.DisplayJSON(objResponse, objType);
	}
	
}catch(e){
    objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}