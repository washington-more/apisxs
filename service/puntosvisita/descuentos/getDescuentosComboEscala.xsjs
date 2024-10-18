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
    var cantidad = $.request.parameters.get('cantidad');
    var codigo = $.request.parameters.get('codigo');
    var factor = $.request.parameters.get('factor');
    var ccliente = $.request.parameters.get('ccliente');
    var suc = $.request.parameters.get('suc');
    var cond = $.request.parameters.get('cond');
    var mesa = $.request.parameters.get('mesa');
    var grupo = $.request.parameters.get('grupo');
    var monto = $.request.parameters.get('monto');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'select "Codigo","Nombre","CodigoDesc","Udo","Descuento","CodGrupo","AplicaGrupo"  from ( '+
    'select \'\' as "Codigo",\'\' as "Nombre",T1."Code" as "CodigoDesc",\'AB_DCCE\' as "Udo", '+
    'T2."U_AB_DCCTD" AS "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU MAY-CON\',\'LP PIU MAY-CRE\',\'LP TUM MAY-CON\',\'LP TUM MAY-CRE\',\'LP CIX MAY-CON\',\'LP CIX MAY-CRE\', '+
    '\'LP TRU MAY-CON\',\'LP TRU MAY-CRE\',\'LP CHB MAY-CON\',\'LP CHB MAY-CRE\',\'LP CAX MAY-CON\',\'LP CAX MAY-CRE\',\'LP HUA MAY-CON\', '+
    '\'LP HUA MAY-CRE\') then '+
    'case when '+cantidad+'*'+factor+' between T2."U_AB_DCCDD" and T2."U_AB_DCSHH" then T2."U_AB_DCCTD" else 0 end else 0 end as "Valor", '+
    'T1."U_AB_DCCG" as "CodGrupo",T1."U_AB_DCEG" as "AplicaGrupo" '+
    'from '+dbname+'."@AB_DCCE" T1 '+
    'inner join '+dbname+'."@AB_DCCD" T2 on T1."Code"=T2."Code" '+
    //'where T1."U_AB_DCCA"=\'Y\' and T1."U_AB_DCCM"=\'Y\' and T0."U_AB_DCCDA"=\''+codigo+'\' '+ 
    'where T1."U_AB_DCCA"=\'Y\' and T1."U_AB_DCCM"=\'Y\' and T1."Code"=\''+codigo+'\' '+ 
    'and current_date between T1."U_AB_DCCI" and T1."U_AB_DCCF" '+
    'and \''+ccliente+'\' in (select ifnull(T3."U_AB_DCCCC",\''+ccliente+'\') from '+dbname+'."@AB_DCCC" T3 where T3."Code"=T1."Code") '+
    'and \''+cove+'\' in (select ifnull(T3."U_AB_DCCCV",\''+cove+'\') from '+dbname+'."@AB_DCCV" T3 where T3."Code"=T1."Code") '+
    'and \''+suc+'\' in (select ifnull(T3."U_AB_DCCCS",\''+suc+'\') from '+dbname+'."@AB_DCCS" T3 where T3."Code"=T1."Code") '+
    'and \''+cond+'\' in (select ifnull(T3."U_AB_DCCCP",\''+cond+'\') from '+dbname+'."@AB_DCCP" T3 where T3."Code"=T1."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_DCCCM",\''+mesa+'\') from '+dbname+'."@AB_DCCM" T3 where T3."Code"=T1."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_DCCCV",\''+grupo+'\') from '+dbname+'."@AB_DCCG" T3 where T3."Code"=T1."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_DCCCX" from '+dbname+'."@AB_DCCX" T3 where T3."Code"=T2."Code")) '+
	'and '+monto+'*(T2."U_AB_DCCTD"/100)<=T2."U_AB_DCCIM" '+
    'union all '+
    'select \'\' as "Codigo",\'\' as "Nombre",T1."Code" as "CodigoDesc",\'AB_DCCE\' as "Udo", '+
    'T2."U_AB_DCCTD" AS "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU BOD-CON\',\'LP PIU BOD-CRE\',\'LP TUM BOD-CON\',\'LP TUM BOD-CRE\',\'LP CIX BOD-CON\',\'LP CIX BOD-CRE\', '+
    '\'LP TRU BOD-CON\',\'LP TRU BOD-CRE\',\'LP CHB BOD-CON\',\'LP CHB BOD-CRE\',\'LP CAX BOD-CON\',\'LP CAX BOD-CRE\',\'LP HUA BOD-CON\',\'LP HUA BOD-CRE\') then '+
    'case when '+cantidad+'*'+factor+' between T2."U_AB_DCCDD" and T2."U_AB_DCSHH" then T2."U_AB_DCCTD" else 0 end else 0 end as "Valor", '+
    'T1."U_AB_DCCG" as "CodGrupo",T1."U_AB_DCEG" as "AplicaGrupo" '+
    'from '+dbname+'."@AB_DCCE" T1 '+
    'inner join '+dbname+'."@AB_DCCD" T2 on T1."Code"=T2."Code" '+
    //'where T1."U_AB_DCCA"=\'Y\' and T1."U_AB_DCCB"=\'Y\' and T0."U_AB_DCCDA"=\''+codigo+'\' '+  
    'where T1."U_AB_DCCA"=\'Y\' and T1."U_AB_DCCB"=\'Y\' and T1."Code"=\''+codigo+'\' '+ 
    'and current_date between T1."U_AB_DCCI" and T1."U_AB_DCCF" '+
    'and \''+ccliente+'\' in (select ifnull(T3."U_AB_DCCCC",\''+ccliente+'\') from '+dbname+'."@AB_DCCC" T3 where T3."Code"=T1."Code") '+
    'and \''+cove+'\' in (select ifnull(T3."U_AB_DCCCV",\''+cove+'\') from '+dbname+'."@AB_DCCV" T3 where T3."Code"=T1."Code") '+
    'and \''+suc+'\' in (select ifnull(T3."U_AB_DCCCS",\''+suc+'\') from '+dbname+'."@AB_DCCS" T3 where T3."Code"=T1."Code") '+
    'and \''+cond+'\' in (select ifnull(T3."U_AB_DCCCP",\''+cond+'\') from '+dbname+'."@AB_DCCP" T3 where T3."Code"=T1."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_DCCCM",\''+mesa+'\') from '+dbname+'."@AB_DCCM" T3 where T3."Code"=T1."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_DCCCV",\''+grupo+'\') from '+dbname+'."@AB_DCCG" T3 where T3."Code"=T1."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_DCCCX" from '+dbname+'."@AB_DCCX" T3 where T3."Code"=T2."Code")) '+
	'and '+monto+'*(T2."U_AB_DCCTD"/100)<=T2."U_AB_DCCIM" '+
    'union all '+
    'select \'\' as "Codigo",\'\' as "Nombre",T1."Code" as "CodigoDesc",\'AB_DCCE\' as "Udo", '+
    'T2."U_AB_DCCTD" AS "Descuento", '+
    'case when \''+lprecio+'\' in (\'LP PIU MER-CON\',\'LP PIU MER-CRE\',\'LP TUM MER-CON\',\'LP TUM MER-CRE\',\'LP CIX MER-CON\',\'LP CIX MER-CRE\', '+
    '\'LP TRU MER-CON\',\'LP TRU MER-CRE\',\'LP CHB MER-CON\',\'LP CHB MER-CRE\',\'LP CAX MER-CON\',\'LP CAX MER-CRE\',\'LP HUA MER-CON\',\'LP HUA MER-CRE\') then '+
    'case when '+cantidad+'*'+factor+' between T2."U_AB_DCCDD" and T2."U_AB_DCSHH" then T2."U_AB_DCCTD" else 0 end else 0 end as "Valor", '+
    'T1."U_AB_DCCG" as "CodGrupo",T1."U_AB_DCEG" as "AplicaGrupo" '+
    'from '+dbname+'."@AB_DCCE" T1 '+
    'inner join '+dbname+'."@AB_DCCD" T2 on T1."Code"=T2."Code" '+
    //'where T1."U_AB_DCCA"=\'Y\' and T1."U_AB_DCCC"=\'Y\' and T0."U_AB_DCCDA"=\''+codigo+'\' '+ 
    'where T1."U_AB_DCCA"=\'Y\' and T1."U_AB_DCCC"=\'Y\' and T1."Code"=\''+codigo+'\' '+ 
    'and current_date between T1."U_AB_DCCI" and T1."U_AB_DCCF" '+
    'and \''+ccliente+'\' in (select ifnull(T3."U_AB_DCCCC",\''+ccliente+'\') from '+dbname+'."@AB_DCCC" T3 where T3."Code"=T1."Code") '+
    'and \''+cove+'\' in (select ifnull(T3."U_AB_DCCCV",\''+cove+'\') from '+dbname+'."@AB_DCCV" T3 where T3."Code"=T1."Code") '+
    'and \''+suc+'\' in (select ifnull(T3."U_AB_DCCCS",\''+suc+'\') from '+dbname+'."@AB_DCCS" T3 where T3."Code"=T1."Code") '+
    'and \''+cond+'\' in (select ifnull(T3."U_AB_DCCCP",\''+cond+'\') from '+dbname+'."@AB_DCCP" T3 where T3."Code"=T1."Code") '+
	'and \''+mesa+'\' in (select ifnull(T3."U_AB_DCCCM",\''+mesa+'\') from '+dbname+'."@AB_DCCM" T3 where T3."Code"=T1."Code") '+
	'and \''+grupo+'\' in (select ifnull(T3."U_AB_DCCCV",\''+grupo+'\') from '+dbname+'."@AB_DCCG" T3 where T3."Code"=T1."Code") '+
	'and (\''+cove+'\' not in (select T3."U_AB_DCCCX" from '+dbname+'."@AB_DCCX" T3 where T3."Code"=T2."Code")) '+
	'and '+monto+'*(T2."U_AB_DCCTD"/100)<=T2."U_AB_DCCIM" '+
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
    	    objResult = functions.CreateJSONMessage(-101, "No existe data");
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