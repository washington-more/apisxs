$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants","Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var q;

function GetDataSales(codigo, database){
    try{
        
        var mQuery = 'select TOP 1 T0."U_SYP_MDSD"||'-'||T0."U_SYP_MDCD" as "Codigo",T0."DocDate",T0."DocTotal" '+
                    ' from ' + database + '.OINV T0 '+
                    ' where T0."CANCELED"=\'N\' and T0."CardCode"=\''+codigo+'\' and T0."DocDate"= '+
                    ' (select max(T5."DocDate") from ' + database + '.OINV T5 where T5."CardCode"=T0."CardCode" and T5."CANCELED"=\'N\')';
                     
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();             
        
        if (mRS.length > 0)
    	{
    	    return mRS[0];
    	}else{
    	    return undefined;
    	}
        
    }catch(e){
        return undefined;
    }
}

function ObtenerContactos(codigo, database,vend){
    
    try {
        
        var mQuery = 'SELECT T0."U_AB_PCCV" AS "Codigo", ' +
                       ' 	T0."Name" AS "Nombre", ' +
                       ' 	T0."U_AB_PCLU" AS "VisitaLunes", ' +
                       ' 	T0."U_AB_PCMA" AS "VisitaMartes", ' +
                       ' 	T0."U_AB_PCMI" AS "VisitaMiercoles", ' +
                       ' 	T0."U_AB_PCJU" AS "VisitaJueves", ' +
                       ' 	T0."U_AB_PCVI" AS "VisitaViernes", ' +
                       ' 	T0."U_AB_PCSA" AS "VisitaSabado", ' +
                       ' 	T0."U_AB_PCDO" AS "VisitaDomingo", ' +
                       ' 	T0."U_AB_PCFR" AS "Frecuencia", ' +
                       ' 	TO_VARCHAR (TO_DATE(T0."U_AB_PCFV"), \'YYYY-MM-DD\') AS "InicioVisitas", ' +
                       ' 	T0."CardCode" AS "SocioNegocio" ' +
                     '   FROM ' + database + '.OCPR T0 ' +
                     '   WHERE T0."Active" = \'Y\' AND T0."CardCode" = \'' +codigo+ '\' and T0."U_AB_PCCV"='+vend+';';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mBusinessPartnerContact = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mBusinessPartnerContact = '{'; 
        		mBusinessPartnerContact += '"Codigo": "' + mRS[j].Codigo + '",';
        		mBusinessPartnerContact += '"Nombre": "' + functions.ReplaceInvalidChars(mRS[j].Nombre) + '",';
        		mBusinessPartnerContact += '"VisitaLunes": "' + mRS[j].VisitaLunes + '",';
        		mBusinessPartnerContact += '"VisitaMartes": "' + mRS[j].VisitaMartes + '",';
        		mBusinessPartnerContact += '"VisitaMiercoles": "' + mRS[j].VisitaMiercoles + '",';
        		mBusinessPartnerContact += '"VisitaJueves": "' + mRS[j].VisitaJueves + '",';
        		mBusinessPartnerContact += '"VisitaViernes": "' + mRS[j].VisitaViernes + '",';
        		mBusinessPartnerContact += '"VisitaSabado": "' + mRS[j].VisitaSabado + '",';
        		mBusinessPartnerContact += '"VisitaDomingo": "' + mRS[j].VisitaDomingo + '",';
        		mBusinessPartnerContact += '"Frecuencia": "' + mRS[j].Frecuencia + '",';
        		mBusinessPartnerContact += '"InicioVisitas": "' + mRS[j].InicioVisitas + '"';
        		mBusinessPartnerContact += "}";
        		
        		mLines.push(mBusinessPartnerContact);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

function ObtenerDirecciones(codigo, database){
    
    try {
        
        var mQuery = //'select * from('+
        'SELECT T0."Address" AS "Codigo", ' +
                    	'	IFNULL(T0."Country",\'\') AS "Pais", ' +
                    	'	IFNULL(T0."State",\'\') AS "Departamento", ' +
                    	'	IFNULL(T0."County",\'\') AS "Provincia", ' +
                    	'	IFNULL(T0."City",\'\') AS "Distrito", ' +
                    	'	IFNULL(T0."Street",\'\') AS "Calle", ' +
                    	'	T0."AdresType" AS "Tipo", ' +
                    	'	IFNULL(T0."U_AB_LAT",\'\') AS "Latitud", ' +
                    	'	IFNULL(T0."U_AB_LONG",\'\') AS "Longitud", ' +
                    	'	IFNULL(T0."U_AB_RUTA",\'\') AS "Ruta", ' +
                    	'	IFNULL(T0."U_AB_ZONA",\'\') AS "Zona" ' +
                    '	FROM ' + database + '.CRD1 T0 ' +
                   ' WHERE T0."CardCode" = \'' +codigo+ '\' and T0."U_AB_SNDA"=\'Y\' ';
                   //')Q where "Ruta"<>\'\';';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mBusinessPartnerDirection = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    
    		    mBusinessPartnerDirection = '{'; 
        		mBusinessPartnerDirection += '"Codigo": "' + mRS[j].Codigo + '",';
        		mBusinessPartnerDirection += '"Pais": "' + mRS[j].Pais + '",';
        		mBusinessPartnerDirection += '"Departamento": "' + mRS[j].Departamento + '",';
        		mBusinessPartnerDirection += '"Provincia": "' + mRS[j].Provincia + '",';
        		mBusinessPartnerDirection += '"Distrito": "' + mRS[j].Distrito + '",';
        		mBusinessPartnerDirection += '"Calle": "' + functions.ReplaceInvalidChars(mRS[j].Calle).replace(/(\\n|\n|\r)/g, '') + '",';
        		mBusinessPartnerDirection += '"Tipo": "' + mRS[j].Tipo + '",';
        		mBusinessPartnerDirection += '"Latitud": "' + mRS[j].Latitud + '",';
        		mBusinessPartnerDirection += '"Longitud": "' + mRS[j].Longitud + '",';
        		mBusinessPartnerDirection += '"Ruta": "' + mRS[j].Ruta + '",';
        		mBusinessPartnerDirection += '"Zona": "' + mRS[j].Zona + '"';
        		mBusinessPartnerDirection += "}";
        		
        		mLines.push(mBusinessPartnerDirection);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}
function limpiarComentarioss(comentario) {
    // Reemplazar cualquier caracter especial por una cadena vacía
    // Por ejemplo, eliminar todos los caracteres que no sean letras, números o espacios
    var comentarioLimpio = comentario.replace(/[^a-zA-Z0-9\s]/g, '');
    return comentarioLimpio;
}
function obtenerProdcutos(codigo, database){
    try{
        if (codigo === null|| codigo === "null") {
            return null;
        }
        var mQuery = 'select '+
                    'REPLACE_REGEXPR(\'(\n|\r)\' IN T0."Dscription" WITH \'\')  as "Descripcion", '+
                    //'T0."Dscription" as "Descripcion",'+
                    'T0."Quantity" as "Cantidad",T0."UomCode" as "Unidad", T0."LineTotal" as "Total"'+
                    ' from ' + database + '.INV1 T0 '+
                    ' where T0."DocEntry"='+codigo+'';
                     
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();  
    	
        var j;
        var mBusinessProducto = '';
    	var mfinal = [];
        if (mRS.length > 0)
    	{
    	    for (j = 0; j < mRS.length ; j++) {
    	        mBusinessProducto = '{'; 
    	        mBusinessProducto += '"Descripcion": "' + limpiarComentarioss(mRS[j].Descripcion) + '",';
        		//mBusinessProducto += '"Descripcion": "' + mRS[j].Descripcion + '",';
        		mBusinessProducto += '"Cantidad": "' + mRS[j].Cantidad + '",';
        		mBusinessProducto += '"Unidad": "' + mRS[j].Unidad + '",';
        		mBusinessProducto += '"Total": "' + mRS[j].Total + '"';
        		mBusinessProducto += '}';
    	        mfinal.push(mBusinessProducto);
    	    }
    	    return mfinal.join(",");
    	}else{
    	    return null;
    	}
        
    }catch(e){
        return null;
    }
}

function Obtener3Ultimos(codigo, database){
    
    try {
        
        /**var mQuery = 
        'select top 3 T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD"||Case when T0."CANCELED"=\'N\' then \'\' else \'(A)\' end as "Documento", '+
        'TO_VARCHAR (TO_DATE(T0."DocDate"), \'YYYY-MM-DD\') as "Fecha", '+
        'T0."DocTotal" as "Total" ,'+
        'T0."Series", '+
        'T0."CardName" as "Nombre", '+
        // 'Case when T0."Address" is null then \'NOT_DATA\' else T0."Address" end as "Direccion", ' +
        'T0."TaxDate" as "TaxFecha" '+
        'from ' + database + '.OINV T0 '+
        'where T0."CardCode"= \'' +codigo+ '\' '+
        'order by "DocDate" desc';**/
        var mQuery = 
        'select top 3 T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD"||Case when T0."CANCELED"=\'N\' then \'\' else \'\' end as "Documento", '+
        // 'select top 3 T0."U_SYP_MDSD"||\'-\'||T0."U_SYP_MDCD"||Case when T0."CANCELED"=\'N\' then \'\' else \'(A)\' end as "Documento", '+
        'case when T0."U_SYP_MOTNCND" is null then \'NOT_DATA\' else t0."U_SYP_MOTNCND" end as "Motivo", ' +
        'T0."DocEntry" as "Codigo", '+
        'TO_VARCHAR (TO_DATE(T0."DocDate"), \'YYYY-MM-DD\') as "Fecha", '+
        'T0."DocTotal" as "Total" ,'+
        'T0."Series", '+
        'T1."CardName" as "Nombre", '+
        // 'Case when T0."Address" is null then \'NOT_DATA\' else T0."Address" end as "Direccion", ' +
        'T0."TaxDate" as "TaxFecha" '+
        'from ' + database + '.OINV T0 '+
        'INNER JOIN ' + database + '.OCRD T1 ON T1."CardCode"=T0."CardCode"'+
        'where T0."CardCode"= \'' +codigo+ '\' '+
        'order by "DocDate" desc';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mBusinessPartnerDirection = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    
    		    mBusinessPartnerDirection = '{'; 
        		mBusinessPartnerDirection += '"Documento": "' + mRS[j].Documento + '",';
        		mBusinessPartnerDirection += '"Motivo": "' + mRS[j].Motivo + '",';
        		mBusinessPartnerDirection += '"Fecha": "' + mRS[j].Fecha + '",';
        		mBusinessPartnerDirection += '"Total": "' + mRS[j].Total + '",';
        		mBusinessPartnerDirection += '"Series": "' + mRS[j].Series + '",';
        		mBusinessPartnerDirection += '"Nombre": "' + mRS[j].Nombre + '",';
        	    //mBusinessPartnerDirection += '"Productos": [],';
         		mBusinessPartnerDirection += '"Productos": [' + obtenerProdcutos(mRS[j].Codigo, database) + '],';
        		mBusinessPartnerDirection += '"TaxFecha": "' + mRS[j].TaxFecha + '"';
        		//mBusinessPartnerDirection += '"Productos": [' + obtenerProdcutos(mRS[j].Codigo, database) + ']';
        		mBusinessPartnerDirection += '}';
        		
        		mLines.push(mBusinessPartnerDirection);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

function ObtenerEmpleados(supervisor, database){
    var emp = [];
    try{
        q = 'SELECT T0."SlpCode" FROM '+database+'.OSLP T0  '  +
                    ' where T0."U_MSS_SUPE" = (SELECT DISTINCT "Code" ' + 
                    ' FROM '+database+'."@MSS_SUPER" where "U_MSS_EVEN" = \'' + supervisor + '\')';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(q);
    	mConn.close();
    	emp.push(supervisor);
    	
    	var j;
        
        if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    emp.push(mRS[j].SlpCode);
    		}
    		
    	}
    	
    	return emp.join(",");
    	
    }catch(e){
        q = e.message;
        return undefined;
    }
}

var mBusinessPartner = '';
var query = '';

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined && cove !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    var emps = ObtenerEmpleados(cove, dbname);
	    
	    if(emps !== undefined){
            query = 'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                            // '	IFNULL(T0."OrdersBal",0) AS "Pedidos", ' +
                             ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         ' T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' + 
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCLU"=\'Y\' then 2 else 0 end)=DayOfWeek(CURRENT_DATE) ' +
	'	union all '+
	'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                             ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         '  T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' +
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCMA"=\'Y\' then 3 else 0 end)=DayOfWeek(CURRENT_DATE)' +
     '	union all '+
	'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                             ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         ' T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' +
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCMI"=\'Y\' then 4 else 0 end)=DayOfWeek(CURRENT_DATE)' +
        '	union all '+
	'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                             ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         ' T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' +
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCJU"=\'Y\' then 5 else 0 end)=DayOfWeek(CURRENT_DATE)' +
      '	union all '+
	'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                             ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         ' T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' +
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCVI"=\'Y\' then 6 else 0 end)=DayOfWeek(CURRENT_DATE)' +
    '	union all '+
	'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                            ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         ' T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' +
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCSA"=\'Y\' then 7 else 0 end)=DayOfWeek(CURRENT_DATE)' +
        '	union all '+
	'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."U_SYP_BPTP" AS "TipoPersona", ' +
                            '	T0."U_SYP_BPTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            //'	T0."ListNum" AS "ListaPrecio", ' +
                            'case when T0."U_AB_MUSE"=\'Y\' then '+ 
                            '(select T3."U_AB_MTCP" from ' + dbname + '."@AB_CLMT" T3 where T3."U_AB_MTCC"=T0."CardCode" and T3."U_AB_MTSC"= '+
                            '(select T4."U_AB_SUCURSAL" from ' + dbname + '.OSLP T4 where T4."SlpCode"='+cove+')) '+
                            'else T0."ListNum" end as "ListaPrecio", '+
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                            ' IFNULL((select sum(T2."DocTotal") from ' + dbname + '.ORDR T2 where T2."DocStatus"=\'O\' and T2."CardCode"=T0."CardCode" and T2."SlpCode"='+cove+'),0) AS "Pedidos", '+
                            '   T0."Currency" AS "Moneda",ifnull(T0."U_AB_SNLC",0)-ifnull(T0."U_AB_SNLQ",0) as "Linea", '+  //V3.0
                            'ifnull(T0."U_AB_SNLR",0)-ifnull(T0."U_AB_SNRQ",0) as "LineaRegular" '+
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON ' +
                         ' T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         ' join ' + dbname + '.OCPR T2 on T0."CardCode"=T2."CardCode" '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  T2."U_AB_PCCV" = '+emps+' ' +
                     '   AND T0."frozenFor" = \'N\' and (case when T2."U_AB_PCDO"=\'Y\' then 1 else 0 end)=DayOfWeek(CURRENT_DATE);';
    	        
    	        
        	var conn = $.hdb.getConnection();
        	var rs = conn.executeQuery(query);
        	conn.close();
    	    
    	    if (rs.length > 0)
        	{
        	    
        		var mResult = [];
        		var i;
        		
        		for(i = 0; i < rs.length ; i++)
        		{
        		    var dataSales= GetDataSales(rs[i].Codigo, dbname);
        		    
        			mBusinessPartner = '{';   
        			mBusinessPartner += '"Codigo": "'+rs[i].Codigo+'",';
            		mBusinessPartner += '"TipoPersona": "'+rs[i].TipoPersona+'",';
            		mBusinessPartner += '"TipoDocumento": "'+rs[i].TipoDocumento+'",';
            		mBusinessPartner += '"NumeroDocumento": "'+rs[i].NumeroDocumento+'",';
            		mBusinessPartner += '"NombreRazonSocial": "'+functions.ReplaceInvalidChars(rs[i].NombreRazonSocial)+'",';
            		mBusinessPartner += '"GrupoSocio": '+rs[i].GrupoSocio+',';
            		mBusinessPartner += '"ListaPrecio": '+rs[i].ListaPrecio+',';
            		mBusinessPartner += '"CondicionPago": '+rs[i].CondicionPago+',';
            		mBusinessPartner += '"Indicador": "'+rs[i].Indicador+'",';
            		mBusinessPartner += '"DireccionFiscalCodigo": "'+rs[i].DireccionFiscalCodigo+'",';
            		mBusinessPartner += '"SaldoCuenta": '+rs[i].SaldoCuenta+',';
                        mBusinessPartner += '"Pedidos": '+rs[i].Pedidos+',';
            		mBusinessPartner += '"Moneda": "'+rs[i].Moneda+'",';        //V3.0
            		//mBusinessPartner += '"LineaCampania": "'+rs[i].Linea+'",';// descomentado w
            		//mBusinessPartner += '"LineaRegular": "'+rs[i].LineaRegular+'",';// descomentado w
            		if(dataSales !== undefined){
        		        mBusinessPartner += '"CodigoUltimaCompra": "'+dataSales.Codigo+'",';    
            		    mBusinessPartner += '"FechaUltimaCompra": "'+dataSales.DocDate+'",';    
            		    mBusinessPartner += '"MontoUltimaCompra": "'+dataSales.DocTotal+'",';    
            		}else{
            		    mBusinessPartner += '"CodigoUltimaCompra": "",';    
            		    mBusinessPartner += '"FechaUltimaCompra": "",';    
            		    mBusinessPartner += '"MontoUltimaCompra": "",'; 
            		}
            		mBusinessPartner += '"Contactos": [' + ObtenerContactos(rs[i].Codigo, dbname,cove) + '],';
            		mBusinessPartner += '"Direcciones": [' + ObtenerDirecciones(rs[i].Codigo, dbname) + '],';
            		mBusinessPartner += '"Documentos": [' + Obtener3Ultimos(rs[i].Codigo, dbname) + ']';
            		mBusinessPartner += "}";
            		
            		mResult.push(JSON.parse(mBusinessPartner));
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
    	    objResult = functions.CreateJSONMessage(-99, "El usuario supervisor no tiene empleados asignados. U("+q+")");
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