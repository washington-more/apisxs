$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;

function ActualizarComprometidos(articulo, almacen,lote,comprometido,disponible){
    
    var updateResult = Constants.MESSAGE_SUCCESS;

    try{
        
        var mQuery = 'update "SBO_MSS_MOBILE".LTOV '+
        'set "IsCommited"='+comprometido+', "Disponible"='+disponible+
        ' where "ItemCode"=\''+articulo+'\' and "WhsCode"=\''+almacen+'\' and "Batches"=\''+lote+'\'';
            
            var pstmt = mConn.prepareStatement(mQuery);   
            pstmt.execute();

                    
    }catch(e){
        updateResult = e.message;
    }
    
    return updateResult;
}

var query;
try{
 
    var empId = $.request.parameters.get('empId');
    var art = $.request.parameters.get('art');
    var alm = $.request.parameters.get('alm');
    var cant = $.request.parameters.get('cant');
    
    if (empId !== undefined && alm !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        //query = 'select top 1 "Batches","IsCommited","Disponible" from "SBO_MSS_MOBILE".LTOV '+
        query = 'select top 1 "Batches","IsCommited","Disponible", case when "Disponible">='+cant+' then '+cant+' else "Disponible" end as "cantidad" from "SBO_MSS_MOBILE".LTOV '+
        //'where "ItemCode"=\''+art+'\' and "Dias"<0 and "WhsCode"=\''+alm+'\' and "Disponible">'+cant+
        'where "ItemCode"=\''+art+'\' and  "Disponible">0 and "WhsCode"=\''+alm+'\' '+
        ' order by "Dias" desc';
	        
    	mConn = $.hdb.getConnection();
    	var rs = mConn.executeQuery(query);
    	//conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mIncomingPayment = '';
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mIncomingPayment = '{';   
    			mIncomingPayment += '"Batches": "'+rs[i].Batches+'",';
    			mIncomingPayment += '"IsCommited": '+rs[i].IsCommited+',';
    			mIncomingPayment += '"Disponible": '+rs[i].Disponible+',';
    			mIncomingPayment += '"cantidad": '+rs[i].cantidad+'';
 
        		    //mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].clave, dbname) + ']';
        		    mIncomingPayment += "}";
      
                		    

        		try{
        		    mResult.push(JSON.parse(mIncomingPayment));
        		    //var actualiza = ActualizarComprometidos(art, alm,rs[i].Batches,rs[i].IsCommited+cant,rs[i].Disponible-cant);  
        		}catch(e){
            	    throw new functions.buildException(mIncomingPayment);
            	}
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
}finally{
    mConn.close();
}