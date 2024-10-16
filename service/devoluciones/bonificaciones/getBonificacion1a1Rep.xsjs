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
    var cove = $.request.parameters.get('cove');
    var lprecio = $.request.parameters.get('lprecio');
    var cantidad = $.request.parameters.get('cantidad');
    var codigo = $.request.parameters.get('codigo');
    var ccliente = $.request.parameters.get('ccliente');
    var suc = $.request.parameters.get('suc');
    var cond = $.request.parameters.get('cond');
    var mesa = $.request.parameters.get('mesa');
    var grupo = $.request.parameters.get('grupo');
    
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select * from ( '+
    'select T0."U_AB_BUOC" as "codigo",T0."U_AB_BUOD" as "descripcion",IFNULL(T1."TaxCodeAR", \'\') AS "CodigoImpuesto", '+
    '(select top 1 X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" = '+cove+') AS "AlmacenDefecto", '+
    '(SELECT T2."UomEntry" FROM '+dbname+'.OUOM T2 WHERE T2."UomName" = T0."U_AB_BUOU") AS "UnidadMedidaVenta", '+
    'case when \''+lprecio+'\' in (\'LP PIU MAY-CON\',\'LP PIU MAY-CRE\',\'LP TUM MAY-CON\',\'LP TUM MAY-CRE\',\'LP CIX MAY-CON\',\'LP CIX MAY-CRE\', '+
    '\'LP TRU MAY-CON\',\'LP TRU MAY-CRE\',\'LP CHB MAY-CON\',\'LP CHB MAY-CRE\',\'LP CAX MAY-CON\',\'LP CAX MAY-CRE\',\'LP HUA MAY-CON\',\'LP HUA MAY-CRE\') '+ 
    'then case when '+cantidad+' between T0."U_AB_BUOB" and T0."U_AB_BUOH" then '+
    'round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) else 0 end else 0 end as "CantidadBonif", 100 as "Descuento", '+
    'ifnull((select T3."Price" FROM '+dbname+'.ITM1 T3 where T3."ItemCode"=T0."U_AB_BUOC" and T3."PriceList"=1),0) as "Precio", '+
    'T2."U_AB_BUCG" as "CodGrupo" '+
    'from '+dbname+'."@AB_BUDO" T0 inner join '+dbname+'.OITM T1 on T0."U_AB_BUOC"=T1."ItemCode" '+
	'inner join '+dbname+'."@AB_BUU" T2 on T0."Code"=T2."Code" '+
    'where T2."U_AB_BUAR"=\'Y\' and T2."U_AB_BUMY"=\'Y\' and T0."Code"=\''+codigo+'\' and current_date between T2."U_AB_BUFI" and T2."U_AB_BUFF" '+
	'and \''+ccliente+'\' in (select ifnull(T3."U_AB_BUCC",\''+ccliente+'\') from '+dbname+'."@AB_BUDC" T3 where T3."Code"=T2."Code") '+
	'and \''+cove+'\' in (select ifnull(T3."U_AB_BUVC",\''+cove+'\') from '+dbname+'."@AB_BUDV" T3 where T3."Code"=T2."Code") '+
	'and \''+suc+'\' in (select ifnull(T3."U_AB_BUSC",\''+suc+'\') from '+dbname+'."@AB_BUDS" T3 where T3."Code"=T2."Code") '+
	'and \''+cond+'\' in (select ifnull(T3."U_AB_BUCP",\''+cond+'\') from '+dbname+'."@AB_BUDP" T3 where T3."Code"=T2."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_BUMC",\''+mesa+'\') from '+dbname+'."@AB_BUDM" T3 where T3."Code"=T2."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_BUCG",\''+grupo+'\') from '+dbname+'."@AB_BUDR" T3 where T3."Code"=T2."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_BUVE" from '+dbname+'."@AB_BUDE" T3 where T3."Code"=T2."Code"))'+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOA" '+ 
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOS" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOM" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <= '+ 
	'case when EXISTS (select ifnull(T3."U_AB_MSST",99999) from '+dbname+'."@AB_CMST" T3 where T3."U_AB_MSQC"= \''+ccliente+'\' and T3."U_AB_MSCU"= \''+codigo+'\' and T3."U_AB_MSNU"=\'AB_BUU\') '+
	'then (select ifnull(T3."U_AB_MSST",99999) from '+dbname+'."@AB_CMST" T3 where T3."U_AB_MSQC"= \''+ccliente+'\' and T3."U_AB_MSCU"= \''+codigo+'\' and T3."U_AB_MSNU"=\'AB_BUU\') '+
	'else 99999 end '+
    'union all '+
    'select T0."U_AB_BUOC" as "codigo",T0."U_AB_BUOD" as "descripcion",IFNULL(T1."TaxCodeAR", \'\') AS "CodigoImpuesto", '+
    '(select top 1 X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" = '+cove+') AS "AlmacenDefecto", '+
    '(SELECT T2."UomEntry" FROM '+dbname+'.OUOM T2 WHERE T2."UomName" = T0."U_AB_BUOU") AS "UnidadMedidaVenta", '+
    'case when \''+lprecio+'\' in (\'LP PIU BOD-CON\',\'LP PIU BOD-CRE\',\'LP TUM BOD-CON\',\'LP TUM BOD-CRE\',\'LP CIX BOD-CON\',\'LP CIX BOD-CRE\', '+
    '\'LP TRU BOD-CON\',\'LP TRU BOD-CRE\',\'LP CHB BOD-CON\',\'LP CHB BOD-CRE\',\'LP CAX BOD-CON\',\'LP CAX BOD-CRE\',\'LP HUA BOD-CON\',\'LP HUA BOD-CRE\') '+
    'then case when '+cantidad+' between T0."U_AB_BUOB" and T0."U_AB_BUOH" then '+
    'round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) else 0 end else 0 end as "CantidadBonif", 100 as "Descuento", '+
    'ifnull((select T3."Price" FROM '+dbname+'.ITM1 T3 where T3."ItemCode"=T0."U_AB_BUOC" and T3."PriceList"=1),0) as "Precio", '+
    'T2."U_AB_BUCG" as "CodGrupo" '+
    'from '+dbname+'."@AB_BUDO" T0 inner join '+dbname+'.OITM T1 on T0."U_AB_BUOC"=T1."ItemCode" '+
	'inner join '+dbname+'."@AB_BUU" T2 on T0."Code"=T2."Code" '+
    'where T2."U_AB_BUAR"=\'Y\' and T2."U_AB_BUBD"=\'Y\' and T0."Code"=\''+codigo+'\' and current_date between T2."U_AB_BUFI" and T2."U_AB_BUFF" '+
	'and \''+ccliente+'\' in (select ifnull(T3."U_AB_BUCC",\''+ccliente+'\') from '+dbname+'."@AB_BUDC" T3 where T3."Code"=T2."Code") '+
	'and \''+cove+'\' in (select ifnull(T3."U_AB_BUVC",\''+cove+'\') from '+dbname+'."@AB_BUDV" T3 where T3."Code"=T2."Code") '+
	'and \''+suc+'\' in (select ifnull(T3."U_AB_BUSC",\''+suc+'\') from '+dbname+'."@AB_BUDS" T3 where T3."Code"=T2."Code") '+
	'and \''+cond+'\' in (select ifnull(T3."U_AB_BUCP",\''+cond+'\') from '+dbname+'."@AB_BUDP" T3 where T3."Code"=T2."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_BUMC",\''+mesa+'\') from '+dbname+'."@AB_BUDM" T3 where T3."Code"=T2."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_BUCG",\''+grupo+'\') from '+dbname+'."@AB_BUDR" T3 where T3."Code"=T2."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_BUVE" from '+dbname+'."@AB_BUDE" T3 where T3."Code"=T2."Code"))'+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOA" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOS" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOM" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <= '+ 
	'case when EXISTS (select ifnull(T3."U_AB_MSST",99999) from '+dbname+'."@AB_CMST" T3 where T3."U_AB_MSQC"= \''+ccliente+'\' and T3."U_AB_MSCU"= \''+codigo+'\' and T3."U_AB_MSNU"=\'AB_BUU\') '+
	'then (select ifnull(T3."U_AB_MSST",99999) from '+dbname+'."@AB_CMST" T3 where T3."U_AB_MSQC"= \''+ccliente+'\' and T3."U_AB_MSCU"= \''+codigo+'\' and T3."U_AB_MSNU"=\'AB_BUU\') '+
	'else 99999 end '+
    'union all '+
    'select T0."U_AB_BUOC" as "codigo",T0."U_AB_BUOD" as "descripcion",IFNULL(T1."TaxCodeAR", \'\') AS "CodigoImpuesto", '+
    '(select top 1 X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" = '+cove+') AS "AlmacenDefecto", '+
    '(SELECT T2."UomEntry" FROM '+dbname+'.OUOM T2 WHERE T2."UomName" = T0."U_AB_BUOU") AS "UnidadMedidaVenta", '+
    'case when \''+lprecio+'\' in (\'LP PIU MER-CON\',\'LP PIU MER-CRE\',\'LP TUM MER-CON\',\'LP TUM MER-CRE\',\'LP CIX MER-CON\',\'LP CIX MER-CRE\', '+
    '\'LP TRU MER-CON\',\'LP TRU MER-CRE\',\'LP CHB MER-CON\',\'LP CHB MER-CRE\',\'LP CAX MER-CON\',\'LP CAX MER-CRE\',\'LP HUA MER-CON\',\'LP HUA MER-CRE\') '+
    'then case when '+cantidad+' between T0."U_AB_BUOB" and T0."U_AB_BUOH" then '+
    'round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) else 0 end else 0 end as "CantidadBonif", 100 as "Descuento", '+
    'ifnull((select T3."Price" FROM '+dbname+'.ITM1 T3 where T3."ItemCode"=T0."U_AB_BUOC" and T3."PriceList"=1),0) as "Precio", '+
    'T2."U_AB_BUCG" as "CodGrupo" '+
    'from '+dbname+'."@AB_BUDO" T0 inner join '+dbname+'.OITM T1 on T0."U_AB_BUOC"=T1."ItemCode" '+
	'inner join '+dbname+'."@AB_BUU" T2 on T0."Code"=T2."Code" '+
    'where T2."U_AB_BUAR"=\'Y\' and T2."U_AB_BUMC"=\'Y\' and T0."Code"=\''+codigo+'\' and current_date between T2."U_AB_BUFI" and T2."U_AB_BUFF" '+
	'and \''+ccliente+'\' in (select ifnull(T3."U_AB_BUCC",\''+ccliente+'\') from '+dbname+'."@AB_BUDC" T3 where T3."Code"=T2."Code") '+
	'and \''+cove+'\' in (select ifnull(T3."U_AB_BUVC",\''+cove+'\') from '+dbname+'."@AB_BUDV" T3 where T3."Code"=T2."Code") '+
	'and \''+suc+'\' in (select ifnull(T3."U_AB_BUSC",\''+suc+'\') from '+dbname+'."@AB_BUDS" T3 where T3."Code"=T2."Code") '+
	'and \''+cond+'\' in (select ifnull(T3."U_AB_BUCP",\''+cond+'\') from '+dbname+'."@AB_BUDP" T3 where T3."Code"=T2."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_BUMC",\''+mesa+'\') from '+dbname+'."@AB_BUDM" T3 where T3."Code"=T2."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_BUCG",\''+grupo+'\') from '+dbname+'."@AB_BUDR" T3 where T3."Code"=T2."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_BUVE" from '+dbname+'."@AB_BUDE" T3 where T3."Code"=T2."Code"))'+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOA" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOS" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <=T0."U_AB_BUOM" '+
	'and round(round(('+cantidad+'/T0."U_AB_BUOK"),0,ROUND_DOWN)*T0."U_AB_BUOQ",0,ROUND_DOWN) <= '+ 
	'case when EXISTS (select ifnull(T3."U_AB_MSST",99999) from '+dbname+'."@AB_CMST" T3 where T3."U_AB_MSQC"= \''+ccliente+'\' and T3."U_AB_MSCU"= \''+codigo+'\' and T3."U_AB_MSNU"=\'AB_BUU\') '+
	'then (select ifnull(T3."U_AB_MSST",99999) from '+dbname+'."@AB_CMST" T3 where T3."U_AB_MSQC"= \''+ccliente+'\' and T3."U_AB_MSCU"= \''+codigo+'\' and T3."U_AB_MSNU"=\'AB_BUU\') '+
	'else 99999 end '+
    ')Q1 '+
    'where Q1."CantidadBonif" > 0';
	        
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
    	    objResult = functions.CreateJSONMessage(-101, "No existen datos");
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