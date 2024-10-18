$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;

function ObtenerLineas(clave, database){
    
    try {
        
        var mQuery = 'select T0."DocEntry" as "CodComp",T0."Quantity" as "Cantidad",T0."ItemCode",T0."Dscription",T2."U_SYP_TIPUNMED", '+
	'case when T0."U_SYP_FECAT07"=\'15\' then ROUND(ifnull((Select T2."Price" from '+database+'.ITM1 T2 where T2."ItemCode"=T0."ItemCode" and T2."PriceList"=1),1)*1.18,3) else T0."PriceAfVAT" end as "PrecRef", '+
	'T0."Price", '+
	'0 as "Descuento", '+
	'case when T0."U_SYP_FECAT07"=\'15\' then ROUND((ifnull((Select T2."Price" from '+database+'.ITM1 T2 where T2."ItemCode"=T0."ItemCode" and T2."PriceList"=1),1)*T0."Quantity")*0.18,3) else T0."VatSum" end as "IGV", '+
	'case when T0."U_SYP_FECAT07"=\'15\' then round((ifnull((Select T2."Price" from '+database+'.ITM1 T2 where T2."ItemCode"=T0."ItemCode" and T2."PriceList"=1),1)*1.18)*T0."Quantity",3) else  T0."LineTotal"+T0."VatSum" end as "Total", '+
	'T0."U_SYP_FECAT07", '+ 
	'case when T0."U_SYP_FECAT07"=\'15\' then \'02\' else \'01\' end as "TipoPrecio",\'\' as "TipoAnt",\'\' as "DocAnt",\'\' as "MonAnt", 0 as "MontoAnt", '+
	'TO_VARCHAR (TO_DATE(T1."TaxDate"), \'YYYY-MM-DD\') as "Emis" '+
'from '+database+'.INV1 T0 inner join '+database+'.OINV T1 on T0."DocEntry"=T1."DocEntry" '+
	'inner join '+database+'.OITM T2 on T0."ItemCode"=T2."ItemCode" '+
'where T1."DocEntry"='+clave+' '+
'union all '+
'select T0."DocEntry" as "CodComp", '+
	'1 as "Cantidad",\'\',T0."Dscription",\'NIU\', '+
	'T0."PriceAfVAT" as "PrecRef", '+
	'T0."Price", '+
	'0 as "Descuento", '+
	'T0."VatSum", '+
	'T0."PriceAfVAT" as "Total", '+
	'\'10\', '+ 
	'\'01\' as "TipoPrecio",\'\' as "TipoAnt",\'\' as "DocAnt",\'\' as "MonAnt", 0 as "MontoAnt", '+
	'TO_VARCHAR (TO_DATE(T1."TaxDate"), \'YYYY-MM-DD\') as "Emis" '+
'from '+database+'.INV1 T0 inner join '+database+'.OINV T1 on T0."DocEntry"=T1."DocEntry" '+
'where T1."DocEntry"='+clave+' and T1."DocType"=\'S\';';
        
        //var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	//mConn.close();
    	
    	var j;
    	var mIncomingPaymentLine = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mIncomingPaymentLine = '{'; 
        		mIncomingPaymentLine += '"CodComp": ' + mRS[j].CodComp + ',';
        		mIncomingPaymentLine += '"Cantidad": ' + mRS[j].Cantidad + ',';
        		mIncomingPaymentLine += '"ItemCode": "' + mRS[j].ItemCode + '",';
        		mIncomingPaymentLine += '"Dscription": "' + mRS[j].Dscription + '",';
        		mIncomingPaymentLine += '"U_SYP_TIPUNMED": "' + mRS[j].U_SYP_TIPUNMED + '",';
        		mIncomingPaymentLine += '"PrecRef": ' + mRS[j].PrecRef + ',';
        		mIncomingPaymentLine += '"Price": ' + mRS[j].Price + ',';
        		mIncomingPaymentLine += '"Descuento": ' + mRS[j].Descuento + ',';
        		mIncomingPaymentLine += '"IGV": ' + mRS[j].IGV + ',';
        		mIncomingPaymentLine += '"Total": ' + mRS[j].Total + ',';
        		mIncomingPaymentLine += '"U_SYP_FECAT07": "' + mRS[j].U_SYP_FECAT07 + '",';
        		mIncomingPaymentLine += '"TipoPrecio": "' + mRS[j].TipoPrecio + '",';
        		mIncomingPaymentLine += '"TipoAnt": "' + mRS[j].TipoAnt + '",';
        		mIncomingPaymentLine += '"DocAnt": "' + mRS[j].DocAnt + '",';
        		mIncomingPaymentLine += '"MonAnt": "' + mRS[j].MonAnt + '",';
        		mIncomingPaymentLine += '"MontoAnt": ' + mRS[j].MontoAnt + ',';
        		mIncomingPaymentLine += '"Emis": "' + mRS[j].Emis + '"';
        		mIncomingPaymentLine += "}";
        		
        		mLines.push(mIncomingPaymentLine);
    		}
    	}else{
    	    return '';
    	}
    	
    //	mConn.close();
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

var query;
try{
 
    var empId = $.request.parameters.get('empId');
    var fini = $.request.parameters.get('fini');
    var ffin = $.request.parameters.get('ffin');
    var suc = $.request.parameters.get('suc');
    var tip = $.request.parameters.get('tip');
    
    if (empId !== undefined && suc !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    localCurrency = functions.GetLocalCurrency(dbname);
        query = 'select \'20102892381\' as "RUC",6 as "Tipo",\'DISTRIBUIDORA COMERCIAL ALVAREZ BOHL S.A.C.\' as "Raz",\'ALVAREZ BOHL\' as "Comercial", '+
	'\'CAR. PIURA SULLANA OTR. VALLE MEDIO PIURA P1-02 LT: A-VEINTISEIS DE OCTUBRE-PIURA\' as "Dire",\'0000\' as "Cod",\'OSE\' as "Prov",\'https://alvarez.pe/#/home\' as "Url", '+
	'T0."LicTradNum" as "DocRecep",T1."U_SYP_BPTD" as "TipoCli",T0."CardName" as "NombreRep",T2."StreetB" as "DirRep",T0."DocEntry" as "CodComp", '+
	'IFNULL(T0."U_SYP_MDSD",\'\')||\'-\'||SUBSTRING(\'00000000\', 1, 8 - (LENGTH(IFNULL(CAST(T0."U_SYP_MDCD" AS VARCHAR(20)),\'0\')))) || IFNULL(CAST(T0."U_SYP_MDCD" AS VARCHAR(20)),\'0\') as "CodVenta", '+
	'TO_VARCHAR (TO_DATE(T0."TaxDate"), \'YYYY-MM-DD\') as "Emis",TO_VARCHAR (TO_DATE(T0."DocDueDate"), \'YYYY-MM-DD\') as "Venc",\'16:00:00\' as "Hora", '+
	'\'SOLES\' as "Moneda",ROUND((Select IFNULL(SUM(I1."LineTotal"),0) FROM '+dbname+'."INV1" I1 where I1."DocEntry" = T0."DocEntry" AND I1."U_SYP_FECAT07" = \'10\')* (1-IFNULL(T0."DiscPrcnt",0)/100),2) AS  "Gravada", '+
	'ROUND((Select IFNULL(SUM(I1."LineTotal"),0) FROM '+dbname+'."INV1" I1 where I1."DocEntry" = T0."DocEntry" AND I1."U_SYP_FECAT07" IN (\'30\'))* (1-IFNULL(T0."DiscPrcnt",0)/100),2) as "Inafecta", '+
	'TO_DECIMAL(ROUND(IFNULL(((TO_DECIMAL(CASE  T0."U_AB_GRE" WHEN \'Y\' THEN 0 ELSE '+
	'ROUND((select sum("LineTotal") from '+dbname+'.INV1 where "DocEntry"=T0."DocEntry" and IFNULL("U_SYP_FECAT07",\'\') IN (\'10\',\'11\',\'12\',\'13\',\'14\',\'15\',\'16\')),2)*(1-IFNULL(T0."DiscPrcnt",0)/100) '+  
	'END,12,2) - TO_DECIMAL(IFNULL((select ROUND(SUM(I9."DrawnSum"),2) from '+dbname+'."INV9" I9 where T0."DocEntry" = I9."DocEntry"),0),12,2))*0.18),0),2),12,2) as "TotalIgv", '+
	'TO_DECIMAL(ROUND((Select IFNULL(SUM(I1."LineTotal"),0) FROM '+dbname+'."INV1" I1 where I1."DocEntry" = T0."DocEntry"  AND I1."U_SYP_FECAT07" NOT IN (\'10\',\'20\',\'30\',\'40\')),2) '+
	',12,2) AS "Gratuitas",0 as "TotalIsc", '+
	'ROUND((Select IFNULL(SUM(I1."LineTotal"),0) FROM '+dbname+'."INV1" I1 where I1."DocEntry" = T0."DocEntry" AND I1."U_SYP_FECAT07" = \'20\')* (1-IFNULL(T0."DiscPrcnt",0)/100),2) '+
	'AS "Exoneradas",To_DECIMAL(ROUND(case when IFNULL(T0."DiscPrcnt",0) = 100 then 0 else '+
    'ROUND(IFNULL(T0."DiscSum",0),2) end,2),12,2) AS "DescuentoGlobal",0 as "TotalOtros", '+
    'TO_DECIMAL(TO_DECIMAL(ROUND(CASE T0."U_AB_GRE" WHEN \'Y\' THEN 0 ELSE T0."DocTotal"-ifnull("RoundDif",0) END,2),12,2),12,2) AS "TotalVenta", '+
    '0 AS "DetraccionMonto",0 as "DetraccionPorcentaje",\'2003\' AS "CodDetraccion", \'\' as "Banco",1 as "MedioPago",\'1001\' as "TipoOp", '+
    '\'false\' as "Anulado",\'\' as "GuiaRem",\'\' as "GuiaTrans", '+
    'T3."PymntGroup" as "TipoPago", '+
    '0 as "Anticipo",4 as "CodRa",\'\' as "NotaCod",\'\' as "NotaDes", '+
    '\'\' as "NotaCC",\'\' as "NotaCV",IFNULL(T0."U_SYP_MDSD",\'\') as "Serie", '+
    'SUBSTRING(\'00000000\', 1, 8 - (LENGTH(IFNULL(CAST(T0."U_SYP_MDCD" AS VARCHAR(20)),\'0\')))) || IFNULL(CAST(T0."U_SYP_MDCD" AS VARCHAR(20)),\'0\') as "Correla" '+
'from '+dbname+'.OINV T0 inner join '+dbname+'.OCRD T1 on T0."CardCode"=T1."CardCode" '+
	'inner join '+dbname+'.INV12 T2 on T0."DocEntry"=T2."DocEntry" '+
	'inner join '+dbname+'.OCTG T3 on T0."GroupNum"=T3."GroupNum" '+
'where T0."U_SYP_MDTD"=\''+tip+'\' and T0."DocDate" between \''+fini+'\' and \''+ffin+'\' and T0."CANCELED"=\'N\' and T0."U_AB_SUCURSAL"=\''+suc+'\';';
	                        
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
    			mIncomingPayment += '"RUC": "'+rs[i].RUC+'",';
        		mIncomingPayment += '"Tipo": '+rs[i].Tipo+',';
        		mIncomingPayment += '"Raz": "'+rs[i].Raz+'",';
        		mIncomingPayment += '"Comercial": "'+rs[i].Comercial+'",';
        		mIncomingPayment += '"Dire": "'+rs[i].Dire+'",';
        		mIncomingPayment += '"Cod": "'+rs[i].Cod+'",';
        		mIncomingPayment += '"Prov": "'+rs[i].Prov+'",';
        		mIncomingPayment += '"Url": "'+rs[i].Url+'",';
        		mIncomingPayment += '"DocRecep": "'+rs[i].DocRecep+'",';
        		mIncomingPayment += '"TipoCli": '+rs[i].TipoCli+',';
        		mIncomingPayment += '"NombreRep": "'+rs[i].NombreRep+'",';
        		mIncomingPayment += '"DirRep": "'+rs[i].DirRep+'",';
        		mIncomingPayment += '"CodComp": '+rs[i].CodComp+',';
        		mIncomingPayment += '"CodVenta": "'+rs[i].CodVenta+'",';
        		mIncomingPayment += '"Emis": "'+rs[i].Emis +'",';
        		mIncomingPayment += '"Venc": "'+rs[i].Venc+'",';
        		mIncomingPayment += '"Hora": "'+rs[i].Hora+'",';
        		mIncomingPayment += '"Moneda": "'+rs[i].Moneda+'",';
        		mIncomingPayment += '"Gravada": '+rs[i].Gravada+',';
        		mIncomingPayment += '"Inafecta": '+rs[i].Inafecta+',';
        		mIncomingPayment += '"TotalIgv": '+rs[i].TotalIgv+',';
        		mIncomingPayment += '"Gratuitas": '+rs[i].Gratuitas+',';
        		mIncomingPayment += '"TotalIsc": '+rs[i].TotalIsc+',';
        		mIncomingPayment += '"Exoneradas": '+rs[i].Exoneradas+',';
        		mIncomingPayment += '"DescuentoGlobal": '+rs[i].DescuentoGlobal+',';
        		mIncomingPayment += '"TotalOtros": '+rs[i].TotalOtros+',';
        		mIncomingPayment += '"TotalVenta": '+rs[i].TotalVenta+',';
        		mIncomingPayment += '"DetraccionMonto": '+rs[i].DetraccionMonto+',';
        		mIncomingPayment += '"DetraccionPorcentaje": '+rs[i].DetraccionPorcentaje+',';
        		mIncomingPayment += '"CodDetraccion": "'+rs[i].CodDetraccion+'",';
        		mIncomingPayment += '"Banco": "'+rs[i].Banco+'",';
        		mIncomingPayment += '"MedioPago": "'+rs[i].MedioPago+'",';
        		mIncomingPayment += '"TipoOp": "'+rs[i].TipoOp+'",';
        		mIncomingPayment += '"Anulado": "'+rs[i].Anulado+'",';
        		mIncomingPayment += '"GuiaRem": "'+rs[i].GuiaRem+'",';
        		mIncomingPayment += '"GuiaTrans": "'+rs[i].GuiaTrans+'",';
        		mIncomingPayment += '"TipoPago": "'+rs[i].TipoPago+'",';
        		mIncomingPayment += '"Anticipo": '+rs[i].Anticipo+',';
        		mIncomingPayment += '"CodRa": "'+rs[i].CodRa+'",';
        		mIncomingPayment += '"NotaCod": "'+rs[i].NotaCod+'",';
        		mIncomingPayment += '"NotaDes": "'+rs[i].NotaDes+'",';
        		mIncomingPayment += '"NotaCC": "'+rs[i].NotaCC+'",';
        		mIncomingPayment += '"NotaCV": "'+rs[i].NotaCV+'",';
        		mIncomingPayment += '"Serie": "'+rs[i].Serie+'",';
        		mIncomingPayment += '"Correla": "'+rs[i].Correla+'",';

        		    mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].CodComp, dbname) + ']';
        		    mIncomingPayment += "}";
        		
        		
        		
        		
        		try{
        		    mResult.push(JSON.parse(mIncomingPayment));
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