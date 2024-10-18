$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    var lprecio = $.request.parameters.get('lprecio');
    var monto = $.request.parameters.get('monto');
    var codigo = $.request.parameters.get('codigo');
    var ccliente = $.request.parameters.get('ccliente');
    var suc = $.request.parameters.get('suc');
    var cond = $.request.parameters.get('cond');
    var mesa = $.request.parameters.get('mesa');
    var grupo = $.request.parameters.get('grupo');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'select distinct "Codigo","Nombre","CodigoDesc","Udo","Descuento","CodGrupo","AplicaGrupo"  from ( '+
    'select \''+codigo+'\' as "Codigo",(select T3."ItemName" from '+dbname+'.OITM T3 where T3."ItemCode"=\''+codigo+'\') as "Nombre",T0."Code" as "CodigoDesc", '+
    '\'AB_DCST\' as "Udo",T0."U_AB_DCSTD" AS "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU MAY-CON\',\'LP PIU MAY-CRE\',\'LP TUM MAY-CON\',\'LP TUM MAY-CRE\',\'LP CIX MAY-CON\',\'LP CIX MAY-CRE\', '+
    '\'LP TRU MAY-CON\',\'LP TRU MAY-CRE\',\'LP CHB MAY-CON\',\'LP CHB MAY-CRE\',\'LP CAX MAY-CON\',\'LP CAX MAY-CRE\',\'LP HUA MAY-CON\', '+
    '\'LP HUA MAY-CRE\') then '+
    'case when '+monto+' between T0."U_AB_DTCDD" and T0."U_AB_DCSHH" then T0."U_AB_DCSTD" else 0 end else 0 end as "Valor", '+
    'T2."U_AB_DTCG" as "CodGrupo",T2."U_AB_DTEG" as "AplicaGrupo" '+
    'from '+dbname+'."@AB_DTCD" T0 inner join '+dbname+'."@AB_DCST" T2 on T0."Code"=T2."Code" '+
    'left join '+dbname+'."@AB_DTC1" T1 on T0."Code"=T1."Code" '+
    'where T2."U_AB_DTCA"=\'Y\' and T2."U_AB_DTCM"=\'Y\' '+ 
    //'and (T1."U_AB_DTCCA"=\''+codigo+'\' or (select T3."ItmsGrpCod" from '+dbname+'.OITM T3 where T3."ItemCode"=\''+codigo+'\') in '+
    //'(select T3."U_AB_DTCCG" from '+dbname+'."@AB_DTCA" T3 where T3."Code"=T0."Code")) '+
    'and T0."Code"=\''+codigo+'\' '+
    'and current_date between T2."U_AB_DTCI" and T2."U_AB_DTCF" '+
    'and \''+ccliente+'\' in (select ifnull(T3."U_AB_DTCCC",\''+ccliente+'\') from '+dbname+'."@AB_DTCL" T3 where T3."Code"=T0."Code") '+
    'and \''+cove+'\' in (select ifnull(T3."U_AB_DTCCV",\''+cove+'\') from '+dbname+'."@AB_DTCW" T3 where T3."Code"=T0."Code") '+
    'and \''+suc+'\' in (select ifnull(T3."U_AB_DTCCS",\''+suc+'\') from '+dbname+'."@AB_DTCU" T3 where T3."Code"=T0."Code") '+
    'and \''+cond+'\' in (select ifnull(T3."U_AB_DTCCP",\''+cond+'\') from '+dbname+'."@AB_DTCB" T3 where T3."Code"=T0."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_DTCCM",\''+mesa+'\') from '+dbname+'."@AB_DTCT" T3 where T3."Code"=T0."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_DTCCV",\''+grupo+'\') from '+dbname+'."@AB_DTCF" T3 where T3."Code"=T0."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_DTCCX" from '+dbname+'."@AB_DTCX" T3 where T3."Code"=T2."Code")) '+
	'and '+monto+'*(T0."U_AB_DCSTD"/100)<=T0."U_AB_DCSPS" '+
    'union all '+
    'select \''+codigo+'\' as "Codigo",(select T3."ItemName" from '+dbname+'.OITM T3 where T3."ItemCode"=\''+codigo+'\') as "Nombre",T0."Code" as "CodigoDesc", '+
    '\'AB_DCST\' as "Udo",T0."U_AB_DCSTD" AS "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU BOD-CON\',\'LP PIU BOD-CRE\',\'LP TUM BOD-CON\',\'LP TUM BOD-CRE\',\'LP CIX BOD-CON\',\'LP CIX BOD-CRE\', '+
    '\'LP TRU BOD-CON\',\'LP TRU BOD-CRE\',\'LP CHB BOD-CON\',\'LP CHB BOD-CRE\',\'LP CAX BOD-CON\',\'LP CAX BOD-CRE\',\'LP HUA BOD-CON\',\'LP HUA BOD-CRE\') then '+
    'case when '+monto+' between T0."U_AB_DTCDD" and T0."U_AB_DCSHH" then T0."U_AB_DCSTD" else 0 end else 0 end as "Valor", '+
    'T2."U_AB_DTCG" as "CodGrupo",T2."U_AB_DTEG" as "AplicaGrupo" '+
    'from '+dbname+'."@AB_DTCD" T0 inner join '+dbname+'."@AB_DCST" T2 on T0."Code"=T2."Code" '+
    'left join '+dbname+'."@AB_DTC1" T1 on T0."Code"=T1."Code" '+
    'where T2."U_AB_DTCA"=\'Y\' and T2."U_AB_DTCB"=\'Y\' '+ 
    //'and (T1."U_AB_DTCCA"=\''+codigo+'\' or (select T3."ItmsGrpCod" from '+dbname+'.OITM T3 where T3."ItemCode"=\''+codigo+'\') in '+
    //'(select T3."U_AB_DTCCG" from '+dbname+'."@AB_DTCA" T3 where T3."Code"=T0."Code")) '+
    'and T0."Code"=\''+codigo+'\' '+
    'and current_date between T2."U_AB_DTCI" and T2."U_AB_DTCF" '+
    'and \''+ccliente+'\' in (select ifnull(T3."U_AB_DTCCC",\''+ccliente+'\') from '+dbname+'."@AB_DTCL" T3 where T3."Code"=T0."Code") '+
    'and \''+cove+'\' in (select ifnull(T3."U_AB_DTCCV",\''+cove+'\') from '+dbname+'."@AB_DTCW" T3 where T3."Code"=T0."Code") '+
    'and \''+suc+'\' in (select ifnull(T3."U_AB_DTCCS",\''+suc+'\') from '+dbname+'."@AB_DTCU" T3 where T3."Code"=T0."Code") '+
    'and \''+cond+'\' in (select ifnull(T3."U_AB_DTCCP",\''+cond+'\') from '+dbname+'."@AB_DTCB" T3 where T3."Code"=T0."Code")  '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_DTCCM",\''+mesa+'\') from '+dbname+'."@AB_DTCT" T3 where T3."Code"=T0."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_DTCCV",\''+grupo+'\') from '+dbname+'."@AB_DTCF" T3 where T3."Code"=T0."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_DTCCX" from '+dbname+'."@AB_DTCX" T3 where T3."Code"=T2."Code")) '+
	'and '+monto+'*(T0."U_AB_DCSTD"/100)<=T0."U_AB_DCSPS" '+
    'union all '+
    'select \''+codigo+'\' as "Codigo",(select T3."ItemName" from '+dbname+'.OITM T3 where T3."ItemCode"=\''+codigo+'\') as "Nombre",T0."Code" as "CodigoDesc", '+
    '\'AB_DCST\' as "Udo",T0."U_AB_DCSTD" AS "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU MER-CON\',\'LP PIU MER-CRE\',\'LP TUM MER-CON\',\'LP TUM MER-CRE\',\'LP CIX MER-CON\',\'LP CIX MER-CRE\', '+
    '\'LP TRU MER-CON\',\'LP TRU MER-CRE\',\'LP CHB MER-CON\',\'LP CHB MER-CRE\',\'LP CAX MER-CON\',\'LP CAX MER-CRE\',\'LP HUA MER-CON\',\'LP HUA MER-CRE\') then '+
    'case when '+monto+' between T0."U_AB_DTCDD" and T0."U_AB_DCSHH" then T0."U_AB_DCSTD" else 0 end else 0 end as "Valor", '+
    'T2."U_AB_DTCG" as "CodGrupo",T2."U_AB_DTEG" as "AplicaGrupo" '+
    'from '+dbname+'."@AB_DTCD" T0 inner join '+dbname+'."@AB_DCST" T2 on T0."Code"=T2."Code" '+
    'left join '+dbname+'."@AB_DTC1" T1 on T0."Code"=T1."Code" '+
    'where T2."U_AB_DTCA"=\'Y\' and T2."U_AB_DTCC"=\'Y\' '+ 
    //'and (T1."U_AB_DTCCA"=\''+codigo+'\' or (select T3."ItmsGrpCod" from '+dbname+'.OITM T3 where T3."ItemCode"=\''+codigo+'\') in '+
    //'(select T3."U_AB_DTCCG" from '+dbname+'."@AB_DTCA" T3 where T3."Code"=T0."Code")) '+
    'and T0."Code"=\''+codigo+'\' '+
    'and current_date between T2."U_AB_DTCI" and T2."U_AB_DTCF" '+
    'and \''+ccliente+'\' in (select ifnull(T3."U_AB_DTCCC",\''+ccliente+'\') from '+dbname+'."@AB_DTCL" T3 where T3."Code"=T0."Code") '+
    'and \''+cove+'\' in (select ifnull(T3."U_AB_DTCCV",\''+cove+'\') from '+dbname+'."@AB_DTCW" T3 where T3."Code"=T0."Code") '+
    'and \''+suc+'\' in (select ifnull(T3."U_AB_DTCCS",\''+suc+'\') from '+dbname+'."@AB_DTCU" T3 where T3."Code"=T0."Code") '+
    'and \''+cond+'\' in (select ifnull(T3."U_AB_DTCCP",\''+cond+'\') from '+dbname+'."@AB_DTCB" T3 where T3."Code"=T0."Code")  '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_DTCCM",\''+mesa+'\') from '+dbname+'."@AB_DTCT" T3 where T3."Code"=T0."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_DTCCV",\''+grupo+'\') from '+dbname+'."@AB_DTCF" T3 where T3."Code"=T0."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_DTCCX" from '+dbname+'."@AB_DTCX" T3 where T3."Code"=T2."Code")) '+
	'and '+monto+'*(T0."U_AB_DCSTD"/100)<=T0."U_AB_DCSPS" '+
    ')Q1 '+
    'where Q1."Valor">=1';
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mItem = '';
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mItem = '{';   
    			mItem += '"Codigo": "'+rs[i].Codigo+'",';
    			mItem += '"Nombre": "'+rs[i].Nombre+'",';
    			mItem += '"CodigoDesc": "'+rs[i].CodigoDesc+'",';
    			mItem += '"Udo": "'+rs[i].Udo+'",';
    			mItem += '"Descuento": '+rs[i].Descuento+',';
    			mItem += '"CodGrupo": "'+rs[i].CodGrupo+'",';
    			mItem += '"AplicaGrupo": "'+rs[i].AplicaGrupo+'"';
        		mItem += "}";
        		
        		mResult.push(JSON.parse(mItem));
        		//mResult.push(rs[i]);
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
    	    functions.DisplayJSON(objResponse, objType);
    	    
    	}else{
    	    objType = "MessageError";
    	    objResult = functions.CreateJSONMessage(-101, "no existe datos");
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