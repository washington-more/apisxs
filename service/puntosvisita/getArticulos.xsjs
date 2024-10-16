$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;


// Función para eliminar elementos repetidos de una cadena
function eliminarRepetidos(cadena) {
    if(cadena!==null){
        // Dividir la cadena en un array de elementos
        var elementos = cadena.split(",");
        
        // Verificar si hay elementos repetidos
        var hayRepetidos = elementos.some(function(elemento, index) {
            return elementos.indexOf(elemento) !== index;
        });
        
        // Si no hay elementos repetidos, devolver la cadena original
        if (!hayRepetidos) {
            return cadena;
        }
        
        // Crear un nuevo array para almacenar elementos únicos
        var unicos = [];
        
        // Iterar sobre los elementos
        elementos.forEach(function(elemento) {
            // Si el elemento no está en el array de elementos únicos, agregarlo
            if (unicos.indexOf(elemento) === -1) {
                unicos.push(elemento);
            }
           
        });
        var cadenaUnica = unicos.join(",");
        
        return cadenaUnica;
    }
    return null;
}

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT T0."ItemCode" AS "Codigo", '+ 
                    'T0."ItemName" AS "Nombre", '+
                    'T0."ItmsGrpCod" AS "GrupoArticulo", '+
                    'T0."UgpEntry" AS "GrupoUnidadMedida", '+
                    'IFNULL(T0."TaxCodeAR", \'\') AS "CodigoImpuesto", '+
                    'T1."WhsCode" AS "AlmacenDefecto", '+
                    'IFNULL(CASE T0."UgpEntry" WHEN -1 THEN (SELECT T10."UomEntry" FROM '+dbname+'.OUOM T10 '+
                    'WHERE T10."UomName" = T0."SalUnitMsr") ELSE T0."SUoMEntry" END,-99)  AS "UnidadMedidaVenta", '+
                    'T0.U_AB_BUUM AS "Grupo1May", '+
                    'T0.U_AB_BUUB AS "Grupo1Cob", '+
                    'T0.U_AB_BUUQ AS "Grupo1Mer", '+
                    'T0.U_AB_BTEM AS "Grupo2May", '+
                    'T0.U_AB_BTEQ AS "Grupo2Cob", '+
                    'T0.U_AB_BTEB AS "Grupo2Mer", '+
                    'T0.U_AB_BTCM AS "Grupo3May", '+
                    'T0.U_AB_BTCB AS "Grupo3Cob", '+
                    'T0.U_AB_BTCQ AS "Grupo3Mer", '+
                    'T0.U_AB_BBEM AS "Grupo4May", '+
                    'T0.U_AB_BBEB AS "Grupo4Cob", '+
                    'T0.U_AB_BBEQ AS "Grupo4Mer", '+
                    'T0.U_AB_BCEM AS "Grupo5May", '+
                    'T0.U_AB_BCEQ AS "Grupo5Cob", '+
                    'T0.U_AB_BCEB AS "Grupo5Mer", '+
                    'T0.U_AB_DUUM as "Des1May", '+
                    'T0.U_AB_DUUB as "Des1Cob", '+
                    'T0.U_AB_DUUQ as "Des1Mer", '+
                    'T0.U_AB_DCEM as "Des2May", '+
                    'T0.U_AB_DCEB as "Des2Cob", '+
                    'T0.U_AB_DCEQ as "Des2Mer", '+
                    'T0.U_AB_DTCM as "Des3May", '+
                    'T0.U_AB_DTCB as "Des3Cob", '+
                    'T0.U_AB_DTCQ as "Des3Mer", '+
                    'T0.U_AB_DTEM as "Des4May", '+
                    'T0.U_AB_DTEB as "Des4Cob", '+
                    'T0.U_AB_DTEQ as "Des4Mer", '+
                    'T0.U_AB_DARM as "Des5May", '+
                    'T0.U_AB_DARB as "Des5Cob", '+
                    'T0.U_AB_DARQ as "Des5Mer", '+
                    'T0.U_AB_UNPROV as "UnidNeg", '+
                    'T0.U_AB_MAAC as "Campania" '+
                'FROM '+dbname+'.OITM T0 inner join '+dbname+'.OITW T1 on T0."ItemCode"=T1."ItemCode" '+
                'WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\' '+
                'AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" ='+cove+') '+
                'and T1."OnHand">0 '+
                'and T0."U_AB_MAAB"<>\'Y\' '+
                'and T0."U_AB_UNPROV" in (select X2."U_AB_CODMU" from '+dbname+'.OSLP X1 inner join '+dbname+'."@AB_DMUN" X2 on X1."U_AB_MESA"=X2."Code" '+ 
                'where X1."SlpCode"='+cove+') '+
                'union all '+
                'SELECT T0."ItemCode" AS "Codigo", '+
                'T0."ItemName" AS "Nombre", '+
                'T0."ItmsGrpCod" AS "GrupoArticulo", '+
                'T0."UgpEntry" AS "GrupoUnidadMedida", '+
                'IFNULL(T0."TaxCodeAR", \'\') AS "CodigoImpuesto", '+
                'T1."WhsCode" AS "AlmacenDefecto", '+
                'IFNULL(CASE T0."UgpEntry" WHEN -1 THEN (SELECT T10."UomEntry" FROM '+dbname+'.OUOM T10 '+
                'WHERE T10."UomName" = T0."SalUnitMsr") ELSE T0."SUoMEntry" END,-99)  AS "UnidadMedidaVenta", '+
                  'T0.U_AB_BUUM AS "Grupo1May", '+
                    'T0.U_AB_BUUB AS "Grupo1Cob", '+
                    'T0.U_AB_BUUQ AS "Grupo1Mer", '+
                    'T0.U_AB_BTEM AS "Grupo2May", '+
                    'T0.U_AB_BTEQ AS "Grupo2Cob", '+
                    'T0.U_AB_BTEB AS "Grupo2Mer", '+
                    'T0.U_AB_BTCM AS "Grupo3May", '+
                    'T0.U_AB_BTCB AS "Grupo3Cob", '+
                    'T0.U_AB_BTCQ AS "Grupo3Mer", '+
                    'T0.U_AB_BBEM AS "Grupo4May", '+
                    'T0.U_AB_BBEQ AS "Grupo4Cob", '+
                    'T0.U_AB_BBEB AS "Grupo4Mer", '+
                    'T0.U_AB_BCEM AS "Grupo5May", '+
                    'T0.U_AB_BCEQ AS "Grupo5Cob", '+
                    'T0.U_AB_BCEB AS "Grupo5Mer", '+
                    'T0.U_AB_DUUM as "Des1May", '+
                    'T0.U_AB_DUUB as "Des1Cob", '+
                    'T0.U_AB_DUUQ as "Des1Mer", '+
                    'T0.U_AB_DCEM as "Des2May", '+
                    'T0.U_AB_DCEB as "Des2Cob", '+
                    'T0.U_AB_DCEQ as "Des2Mer", '+
                    'T0.U_AB_DTCM as "Des3May", '+
                    'T0.U_AB_DTCB as "Des3Cob", '+
                    'T0.U_AB_DTCQ as "Des3Mer", '+
                    'T0.U_AB_DTEM as "Des4May", '+
                    'T0.U_AB_DTEB as "Des4Cob", '+
                    'T0.U_AB_DTEQ as "Des4Mer", '+
                    'T0.U_AB_DARM as "Des5May", '+
                    'T0.U_AB_DARB as "Des5Cob", '+
                    'T0.U_AB_DARQ as "Des5Mer", '+
                    'T0.U_AB_UNPROV as "UnidNeg", '+
                    'T0.U_AB_MAAC as "Campania" '+
                'FROM '+dbname+'.OITM T0 inner join '+dbname+'.OITW T1 on T0."ItemCode"=T1."ItemCode" '+
                'WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\' '+
                'AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 where X0."Code" ='+cove+') '+
                'and T1."OnHand">0 '+
                'and T0."U_AB_MAAB"<>\'Y\' '+
                'and T0."ItemCode" in (select X2."U_AB_CODMA" from '+dbname+'.OSLP X1 inner join '+dbname+'."@AB_MESART" X2 on X1."U_AB_MESA"=X2."Code" '+
                'where X1."SlpCode"='+cove+') ';
	        
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
    		    try{
    		        mItem = '{';   
        			mItem += '"Codigo": "'+rs[i].Codigo+'",';
            		mItem += '"Nombre": "'+rs[i].Nombre+'",';
            		mItem += '"GrupoArticulo": "'+rs[i].GrupoArticulo+'",';
            		mItem += '"GrupoUnidadMedida": "'+rs[i].GrupoUnidadMedida+'",';
            		mItem += '"UnidadMedidaVenta": "'+rs[i].UnidadMedidaVenta+'",';
            		mItem += '"AlmacenDefecto": "'+rs[i].AlmacenDefecto+'",';
            		mItem += '"CodigoImpuesto": "'+rs[i].CodigoImpuesto+'",';
            		mItem += '"Grupo1May": "'+eliminarRepetidos(rs[i].Grupo1May)+'",';
            		mItem += '"Grupo1Cob": "'+eliminarRepetidos(rs[i].Grupo1Cob)+'",';
            		mItem += '"Grupo1Mer": "'+eliminarRepetidos(rs[i].Grupo1Mer)+'",';
            		mItem += '"Grupo2May": "'+eliminarRepetidos(rs[i].Grupo2May)+'",';
            		mItem += '"Grupo2Cob": "'+eliminarRepetidos(rs[i].Grupo2Cob)+'",';
            		mItem += '"Grupo2Mer": "'+eliminarRepetidos(rs[i].Grupo2Mer)+'",';
            		mItem += '"Grupo3May": "'+eliminarRepetidos(rs[i].Grupo3May)+'",';
            		mItem += '"Grupo3Cob": "'+eliminarRepetidos(rs[i].Grupo3Cob)+'",';
            		mItem += '"Grupo3Mer": "'+eliminarRepetidos(rs[i].Grupo3Mer)+'",';
            		mItem += '"Grupo4May": "'+eliminarRepetidos(rs[i].Grupo4May)+'",';
            		mItem += '"Grupo4Cob": "'+eliminarRepetidos(rs[i].Grupo4Cob)+'",';
            		mItem += '"Grupo4Mer": "'+eliminarRepetidos(rs[i].Grupo4Mer)+'",';
            		mItem += '"Grupo5May": "'+eliminarRepetidos(rs[i].Grupo5May)+'",';
            		mItem += '"Grupo5Cob": "'+eliminarRepetidos(rs[i].Grupo5Cob)+'",';
            		mItem += '"Grupo5Mer": "'+eliminarRepetidos(rs[i].Grupo5Mer)+'",';
            		mItem += '"Des1May": "'+eliminarRepetidos(rs[i].Des1May)+'",';
            		mItem += '"Des1Cob": "'+eliminarRepetidos(rs[i].Des1Cob)+'",';
            		mItem += '"Des1Mer": "'+eliminarRepetidos(rs[i].Des1Mer)+'",';
            		mItem += '"Des2May": "'+eliminarRepetidos(rs[i].Des2May)+'",';
            		mItem += '"Des2Cob": "'+eliminarRepetidos(rs[i].Des2Cob)+'",';
            		mItem += '"Des2Mer": "'+eliminarRepetidos(rs[i].Des2Mer)+'",';
            		mItem += '"Des3May": "'+eliminarRepetidos(rs[i].Des3May)+'",';
            		mItem += '"Des3Cob": "'+eliminarRepetidos(rs[i].Des3Cob)+'",';
            		mItem += '"Des3Mer": "'+eliminarRepetidos(rs[i].Des3Mer)+'",';
            		mItem += '"Des4May": "'+eliminarRepetidos(rs[i].Des4May)+'",';
            		mItem += '"Des4Cob": "'+eliminarRepetidos(rs[i].Des4Cob)+'",';
            		mItem += '"Des4Mer": "'+eliminarRepetidos(rs[i].Des4Mer)+'",';
            		mItem += '"Des5May": "'+eliminarRepetidos(rs[i].Des5May)+'",';
            		mItem += '"Des5Cob": "'+eliminarRepetidos(rs[i].Des5Cob)+'",';
            		mItem += '"Des5Mer": "'+eliminarRepetidos(rs[i].Des5Mer)+'",';
            		mItem += '"UnidNeg": "'+eliminarRepetidos(rs[i].UnidNeg)+'",';
            		mItem += '"Campania": "'+eliminarRepetidos(rs[i].Campania)+'"';
            		mItem += "}";
        		
        		    mResult.push(JSON.parse(mItem));
        		    
    		    }catch(e){
    		        
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
	objResponse = functions.CreateJSONMessage(-9703000, query);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}