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
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT T1."WhsCode" as "Almacen", '+
	                'T0."ItemCode" AS "Articulo", '+
	                '(T1."OnHand" - T1."IsCommited") AS "Stock", '+
                    // '(T1."OnHand" + T1."OnOrder" - T1."IsCommited") AS "Stock", '+
                    'T1."IsCommited" AS "Comprometido", '+
                    'T1."OnOrder" AS "Solicitado", '+
                    '(T1."OnHand" + T1."OnOrder" - T1."IsCommited") AS "Disponible" '+
                    'FROM '+dbname+'.OITM T0 inner join '+dbname+'.OITW T1 on T0."ItemCode"=T1."ItemCode" '+
                    'WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\' '+
                    'AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" ='+cove+') '+
                    'and T1."OnHand">0 '+
                    'and T0."U_AB_UNPROV" in (select X2."U_AB_CODMU" from '+dbname+'.OSLP X1 inner join '+dbname+'."@AB_DMUN" X2 on X1."U_AB_MESA"=X2."Code" '+ 
                    'where X1."SlpCode"='+cove+') '+
                    'union all '+
                    'SELECT T1."WhsCode" as "Almacen", '+
                    'T0."ItemCode" AS "Articulo", '+
                    '(T1."OnHand" + T1."OnOrder" - T1."IsCommited") AS "Stock", '+
                    'T1."IsCommited" AS "Comprometido", '+
                    'T1."OnOrder" AS "Solicitado", '+
                    '(T1."OnHand" + T1."OnOrder" - T1."IsCommited") AS "Disponible" '+
                    'FROM '+dbname+'.OITM T0 inner join '+dbname+'.OITW T1 on T0."ItemCode"=T1."ItemCode" '+
                    'WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\' '+
                    'AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" ='+cove+') '+
                    'and T1."OnHand">0 '+
                    'and T0."ItemCode" in (select X2."U_AB_CODMA" from '+dbname+'.OSLP X1 inner join '+dbname+'."@AB_MESART" X2 on X1."U_AB_MESA"=X2."Code" '+
                    'where X1."SlpCode"='+cove+')';
	        
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
    			mItem += '"Almacen": "'+rs[i].Almacen+'",';
    			mItem += '"Articulo": "'+rs[i].Articulo+'",';
    			mItem += '"Stock": "'+rs[i].Stock+'",';
    			mItem += '"Comprometido": "'+rs[i].Comprometido+'",';
    			mItem += '"Solicitado": "'+rs[i].Solicitado+'",';
        		mItem += '"Disponible": "'+rs[i].Disponible+'"';
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