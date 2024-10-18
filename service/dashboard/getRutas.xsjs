$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var functions = $.AB_MOBILE.Functions;
var Constants = $.AB_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var vend;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');
    vend = $.request.parameters.get('vend');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        query = 'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCLU"=\'Y\' then 2 else 0 end)=DayOfWeek(CURRENT_DATE) '+
                ' union all '+
                'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCMA"=\'Y\' then 3 else 0 end)=DayOfWeek(CURRENT_DATE) '+
                ' union all '+
                'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCMI"=\'Y\' then 4 else 0 end)=DayOfWeek(CURRENT_DATE) '+
                ' union all '+
                'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCJU"=\'Y\' then 5 else 0 end)=DayOfWeek(CURRENT_DATE) '+
                ' union all '+
                'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCVI"=\'Y\' then 6 else 0 end)=DayOfWeek(CURRENT_DATE) '+
                ' union all '+
                'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCSA"=\'Y\' then 7 else 0 end)=DayOfWeek(CURRENT_DATE) '+
                ' union all '+
                'select distinct T0."U_AB_RUTA" as "Codigo",T1."Name" as "Nombre",T1."U_AB_ZONA" as "Zona" '+
                'from '+dbname+'.CRD1 T0 inner join '+dbname+'."@AB_RUTAS" T1 on T0."U_AB_RUTA"=T1."Code" '+
                'inner join '+dbname+'.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                'where T2."U_AB_PCCV"='+ vend +' and (case when T2."U_AB_PCDO"=\'Y\' then 1 else 0 end)=DayOfWeek(CURRENT_DATE) ';

    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	
    	if (rs.length > 0)
    	{
	        var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    activity = '{';   
    		    activity += '"Codigo": "'+rs[i].Codigo+'",';
    		    activity += '"Nombre": "'+rs[i].Nombre+'",';
    		    activity += '"Zona": "'+rs[i].Zona+'"';
    		    activity += "}";
            	mResult.push(JSON.parse(activity));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;

    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}

}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message + '-' + activity);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}