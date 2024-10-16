$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mResult = [];

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT T0."UgpEntry" as "Codigo", '+
    	            'T2."U_AB_GVIC" AS "Nombre", '+
	                'T2."Code" as "CodUdo" '+
                    'FROM ' + dbname + '.OITM T0 inner join ' + dbname + '.OITW T1 on T0."ItemCode"=T1."ItemCode" '+
 	                'inner join ' + dbname + '."@AB_GRUV" T2 on T0."ItemCode"=T2."U_AB_GVIC" '+
                    'WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\' '+
 	                'AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from ' + dbname + '."@MSSM_CV1" X0 where X0."Code" ='+cove+') '+
                    'and T1."OnHand">0 '+
                    'and T0."U_AB_UNPROV" in (select X2."U_AB_CODMU" from ' + dbname + '.OSLP X1 inner join ' + dbname + '."@AB_DMUN" X2 on X1."U_AB_MESA"=X2."Code" '+
                    'where X1."SlpCode"='+cove+') '+
                    'and T2."U_AB_GVSC" = (select X0."U_AB_UCSU" from ' + dbname + '."@MSSM_CVE" X0 where X0."Code" ='+cove+') '+
                    'union all '+
                    'SELECT T0."UgpEntry" as "Codigo", '+
	                'T2."U_AB_GVIC" AS "Nombre", '+
	                'T2."Code" as "CodUdo" '+
                    'FROM ' + dbname + '.OITM T0 inner join ' + dbname + '.OITW T1 on T0."ItemCode"=T1."ItemCode" '+
 	                'inner join ' + dbname + '."@AB_GRUV" T2 on T0."ItemCode"=T2."U_AB_GVIC" '+
                    'WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\' '+
 	                'AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from ' + dbname + '."@MSSM_CV1" X0 where X0."Code" ='+cove+') '+
                    'and T1."OnHand">0 '+
                    'and T0."ItemCode" in (select X2."U_AB_CODMA" from ' + dbname + '.OSLP X1 inner join ' + dbname + '."@AB_MESART" X2 on X1."U_AB_MESA"=X2."Code" '+
                    'where X1."SlpCode"='+cove+')';
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var unitMeasureGroup = "";
    	    var unitMeasureGroupDet = "";
    		var mDetail = [];
    		var i;
    		var j;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    unitMeasureGroup = '{';   
        		unitMeasureGroup += '"Codigo": "'+rs[i].Codigo+'",';
        		unitMeasureGroup += '"Nombre": "'+rs[i].Nombre+'",';
        		
        		query = 'SELECT DISTINCT T1."UomEntry" AS "Codigo", '+
                    'T1."UomCode" AS "Nombre", '+
                    'T0."U_AB_DGVF" AS "Base" '+
                    'FROM ' + dbname + '."@AB_DUGV" T0 INNER JOIN ' + dbname + '.OUOM T1 ON T1."UomEntry" = T0."U_AB_DGVU" '+
                    'WHERE T0."Code" = \''+rs[i].CodUdo+'\'';
	        
            	conn = $.hdb.getConnection();
            	var rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    mDetail = [];
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    unitMeasureGroupDet = '{'; 
                		unitMeasureGroupDet += '"Codigo": "' + rsDet[j].Codigo + '",';
                		unitMeasureGroupDet += '"Nombre": "' + rsDet[j].Nombre + '",';
                		unitMeasureGroupDet += '"Base": "' + rsDet[j].Base + '"';
                		unitMeasureGroupDet += "}";
                		
                		mDetail.push(unitMeasureGroupDet);
            		}
            		
            		unitMeasureGroup += '"Detalles": [' + mDetail.join(",") + ']';
        		    unitMeasureGroup += "}";
        		    
            	}else{
            	    unitMeasureGroup += '"Detalles": []';
        		    unitMeasureGroup += "}";
            	}
            	
            	mResult.push(JSON.parse(unitMeasureGroup));
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}