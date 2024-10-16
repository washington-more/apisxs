$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query = '';

try{
 //**************************  MODIFICADO  **********************************************************/
    var empId = $.request.parameters.get('empId');
    var test = $.request.parameters.get('test');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
                    
        query =' with "Sucursales" as ('+

				'	select distinct "Codigo_Rel","Sucursal" from '+
				'	( ' +
				'	select  DISTINCT T10."U_AB_BUCG" as "Codigo_Rel",T1."U_AB_BUSN" AS "Sucursal" from ' + dbname + '."@AB_BUU" T10 inner join ' + dbname + '."@AB_BUDS" T1 on T1."Code" = T10."Code" ' +
				'	union all ' +
				'	select distinct T20."U_AB_BTCG" as "Codigo_Rel" ,T1."U_AB_DTCNS"AS "Sucursal" from ' + dbname + '."@AB_BCTC" T20 inner join ' + dbname + '."@AB_DTCS" T1 on T1."Code" = T20."Code" ' +
				'	union all ' +
				'	select distinct T22."U_AB_BBCG" AS "Codigo_Rel",T21."U_AB_DBENS" AS "Sucursal" from ' + dbname + '."@AB_BOBE" T22 INNER JOIN ' + dbname + '."@AB_DBES" T21 ON T22."Code"=T21."Code" ' +
				'	union all ' +
				'	select distinct T24."U_AB_BCCG" AS "Codigo_Rel",T25."U_AB_DCENS" AS "Sucursal" from ' + dbname + '."@AB_BTCE" T24 INNER JOIN ' + dbname + '."@AB_DCES" T25 ON T24."Code"=T25."Code" ' +
				'	) '+
                '  )'+ 
        
        'select \'AB_BUU\' as "Tipo", T0."Code", T0."U_AB_BUDS", T0."U_AB_BUAC", '+
        'TO_NVARCHAR(T0."U_AB_BUFI",\'YYYY-MM-DD\') AS "U_AB_BUFI",TO_NVARCHAR(T0."U_AB_BUFF",\'YYYY-MM-DD\') AS "U_AB_BUFF", '+
        'ifnull((select STRING_AGG(T1."U_AB_BUSN", \'/\') from ' + dbname + '."@AB_BUDS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
       ' ifnull((  SELECT GV."Name" FROM ' + dbname + '."@AB_UNPROV" GV '+
                'WHERE GV."Code" = LEFT(T0."U_AB_BUDS", 3)'+
            '),\'\')'+
        ' as "Unidad", '+
        'ifnull((select STRING_AGG(T1."U_AB_BUOC" ||\'-\'|| T1."U_AB_BUOD", \'/\') from ' + dbname + '."@AB_BUDO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequido" '+
        'from ' + dbname + '."@AB_BUU" T0 WHERE T0."U_AB_BUIW"=\'N\' and T0."U_AB_BUAG"=\'N\''+
        
        'union all '+
        // B2
        
        'select \'AB_BCTC\' as "Tipo", T0."Code", T0."U_AB_BTCD", T0."U_AB_BTCA",'+
        'TO_NVARCHAR(T0."U_AB_BTCI",\'YYYY-MM-DD\') AS "U_AB_BTCI", TO_NVARCHAR(T0."U_AB_BTCF",\'YYYY-MM-DD\') AS "U_AB_BTCF", '+
        'ifnull((select STRING_AGG(T1."U_AB_DTCNS", \'/\') from ' + dbname + '."@AB_DTCS" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull((  SELECT GV."Name" FROM ' + dbname + '."@AB_UNPROV" GV '+
                'WHERE GV."Code" = LEFT(T0."U_AB_BTCD", 3)'+
        '),\'\')'+
        ' as "Unidad",' +
       'ifnull((select STRING_AGG(T1."U_AB_DTCCB" ||\'-\'|| T1."U_AB_DTCDB", \'/\') from ' + dbname + '."@AB_DTCO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequido" '+
        'from ' + dbname + '."@AB_BCTC" T0 WHERE T0."U_AB_BTCU"=\'N\' and T0."U_AB_BTAG"=\'N\' '+
        
        'union all '+
        // B3
        
        
        'select \'AB_DCEH\' as "Tipo", T0."Code", T0."U_AB_BCED", T0."U_AB_BCEA",'+
        'TO_NVARCHAR(T0."U_AB_BCEF",\'YYYY-MM-DD\') AS "U_AB_BCEF", TO_NVARCHAR(T0."U_AB_BCEE",\'YYYY-MM-DD\') AS "U_AB_BCEE", '+
        //'TO_NVARCHAR(T0."U_AB_BCEE",\'YYYY-MM-DD\') AS "U_AB_BCEE", TO_NVARCHAR(T0."U_AB_BCEF",\'YYYY-MM-DD\') AS "U_AB_BCEF", '+
        'ifnull((select  STRING_AGG(T1."U_AB_DCENS", \'/\') from ' + dbname + '."@AB_DCES" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
       'ifnull((  SELECT GV."Name" FROM ' + dbname + '."@AB_UNPROV" GV '+
              'WHERE GV."Code" = LEFT(T0."U_AB_BCED", 3)'+
        '),\'\')'+
        'as "Unidad", '+
        'ifnull((select STRING_AGG(T1."U_AB_DCECB" ||\'-\'|| T1."U_AB_DCEDB", \'/\') from ' + dbname + '."@AB_DCEO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequido" '+
        'from ' + dbname + '."@AB_BTCE" T0 WHERE T0."U_AB_BCEU"=\'N\' and T0."U_AB_BCAG"=\'N\''+
        
        'union all '+
        // 'select \'AB_DCEH\' as "Tipo","Code","U_AB_BCED","U_AB_BCEA","U_AB_BCEF" '+
        // 'from ' + dbname + '."@AB_BTCE" '+
        // 'union all '+ 
        // 'select \'AB_BCBE\' as "Tipo","Code","U_AB_BBED","U_AB_BBEA","U_AB_BBEI" '+
        // 'from ' + dbname + '."@AB_BCBE"' +
        // 'union all '+ 
        // B4
        
        
        'select \'AB_BOBE\' as "Tipo", T0."Code", T0."U_AB_BBED", T0."U_AB_BBEA",'+
        'TO_NVARCHAR(T0."U_AB_BBEI",\'YYYY-MM-DD\') AS "U_AB_BBEI", TO_NVARCHAR(T0."U_AB_BBEF",\'YYYY-MM-DD\') AS "U_AB_BBEF", '+
        'ifnull((select  STRING_AGG(T1."U_AB_DBENS", \'/\') from ' + dbname + '."@AB_DBES" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal", '+
        'ifnull((  SELECT GV."Name" FROM ' + dbname + '."@AB_UNPROV" GV '+
                      'WHERE GV."Code" = LEFT(T0."U_AB_BBED", 3)'+
            '),\'\')'+
        'as "Unidad", '+
        'ifnull((select STRING_AGG(T1."U_AB_DBECB" ||\'-\'|| T1."U_AB_DBEDB", \'/\') from ' + dbname + '."@AB_DBEO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequido" '+
        'from ' + dbname + '."@AB_BOBE" T0 WHERE T0."U_AB_BBEU"=\'N\'  and T0."U_AB_BBAG"=\'N\'' +
        'union all '+ 
        
        /**'select \'AB_DBAED\' as "Tipo", T0."Code", T0."Name", T0."U_AB_BAEA",'+
        'TO_NVARCHAR(T0."U_AB_BAEI",\'YYYY-MM-DD\') AS "U_AB_BAEI", TO_NVARCHAR(T0."U_AB_BAEF",\'YYYY-MM-DD\') AS "U_AB_BAEF", '+
        'ifnull((select STRING_AGG(T3."U_AB_BRGNS", \'/\') from ' + dbname + '."@AB_DBAEI" T1 '+
        'inner join ' + dbname + '."@AB_BORE" T2 on T1."U_AB_DBAEC"=T2."Code"'+
        'inner join ' + dbname + '."@AB_BRDS" T3 on T3."Code"=T2."Code"'+
        'where T0."Code"=T1."Code"'+
        'group by T1."Code" ), \'\') as "Sucursal", '+
        '\'-\' as "Unidad" '+
        // 'ifnull((select STRING_AGG(T3."U_AB_BRGNS", \'/\') from ' + dbname + '."@AB_BAES" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Sucursal" '+
        // ' \'\' as "Sucursal" '+
        'from ' + dbname + '."@AB_BAES" T0 ' +
        'union all '+ **/
        // codigo antiguo 
        
        'select \'AB_DBARC\' as "Tipo", T0."Code", T0."U_AB_BARD" as "Name", T0."U_AB_BARA",'+
        'TO_NVARCHAR(T0."U_AB_BARI",\'YYYY-MM-DD\') AS "U_AB_BARI", TO_NVARCHAR(T0."U_AB_BARF",\'YYYY-MM-DD\') AS "U_AB_BARF", '+
        '( select   ifnull( STRING_AGG( T20."Sucursal" , \'/\'),\'\') '+
        '        	from "Sucursales" T20'+
        '        	where T20."Codigo_Rel" =T0."Code" ' +
        '        	GROUP BY T0."Code"'+
        ') as "Sucursal",' +
        '(ifnull(( SELECT GV."Code" || \'-\' ||GV."Name"  FROM ' + dbname + '."@AB_UNPROV" GV '+
                      'WHERE GV."Code" = LEFT(T0."U_AB_BARD", 3)'+
                '),\'\')) as "Unidad", '+
        'ifnull((select STRING_AGG(T1."U_AB_DBARC" ||\'-\'|| T1."U_AB_DBARD", \'/\') from ' + dbname + '."@AB_BARO" T1 where T1."Code"=T0."Code" group by T1."Code"),\'\') as "Obsequido" '+
        'from ' + dbname + '."@AB_BARG" T0 where  T0."U_AB_BUIW"=\'N\''+
        'order by T0."Code" desc'; // falta la coma 
        // fin de codigo antiguo
	    /*
	    
	    select 
    	ifnull( STRING_AGG( T20."Sucursal" , '/'),'') 
    	from "Sucursales" T20
    	where T20."Codigo_Rel" =T0."Code" 
    	GROUP BY T0."Code"
    	
	    */
	    if (test)
    	{
    	    objType = "MessageTest";
    	    objResult = functions.CreateJSONMessage(100, "Consula utilizada en el XS => "+query);
    	    objResponse = functions.CreateResponse(objType, objResult, 0);
    	    functions.DisplayJSON(objResponse, objType);
    	}else{
	    
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
        	   // objResult = functions.CreateJSONObject(100, query, 1);
        	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
        	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
        	    functions.DisplayJSON(objResponse, objType);
            	
        	}else{
        	    objType = "MessageError";
        	    objResult = functions.CreateJSONMessage(-101, "No se ha configurado las cuentas para pagos recibidos. ("+empId+")");
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}