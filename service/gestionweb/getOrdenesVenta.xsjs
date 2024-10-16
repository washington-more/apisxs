$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
var Constants = $.AB_MOBILE.Constants;
var functions = $.AB_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;
var localCurrency;

function obtenerLotes(database, docEntry, lineNum) {

	var lstLotes = [];
	var lote = '';

	try {
		var mQuery = 'SELECT DISTINCT  T3."BatchNum" as "NroLote", ' +
			'   				T3."Quantity" as "Cantidad", ' +
			'   				T3."BaseLinNum" as "LineaBase" ' +
			'   FROM ' + database + '.OINV T0 INNER JOIN ' + database + '.INV1 T2 ON T0."DocEntry" = T2."DocEntry" ' +
			'   LEFT OUTER JOIN ' + database + '.IBT1 T3 ON T0."DocNum" = T3."BaseNum" AND T3."ItemCode" = T2."ItemCode" ' +
			'   WHERE T0."DocEntry" = ' + docEntry + ' AND T3."BaseLinNum" = ' + lineNum;

		//var mConn = $.hdb.getConnection();
		var mRS = mConn.executeQuery(mQuery);
		//mConn.close();

		if (mRS.length > 0) {
			var j;
			for (j = 0; j < mRS.length; j++) {
				lote = '{';
				lote += '"Lote": "' + mRS[j].NroLote + '",';
				lote += '"Cantidad": ' + mRS[j].Cantidad + ',';
				lote += '"LineaBase": ' + mRS[j].LineaBase;
				lote += "}";

				lstLotes.push(lote);
			}
		} else {
			return '';
		}

	} catch (e) {
		return '';
	}

	return lstLotes.join(",");
}

function ObtenerLineas(clave, database) {

	try {

		var mQuery = 'select T0."LineNum" as "Linea", ' +
			'	 T0."ItemCode" as "Articulo", ' +
			'  T0."Dscription" as "Descrip", ' +
			'	 T0."UomEntry" as "UnidadMedida", ' +
			'  T0."UomCode" as "NomUnid", ' +
			'	 T0."WhsCode" as "Almacen", ' +
			'	 T0."Quantity" as "Cantidad", ' +
			'	 T0."OpenQty" as "Disponible", ' +
			'	 T0.U_JA_CODPRECIO as "ListaPrecio", ' +
			'	 T0."Price" as "PrecioUnitario", ' +
			'	 T0."DiscPrcnt" as "PorcentajeDescuento", ' +
			'	 T0."TaxCode" as "Impuesto" ' +
			' from ' + database + '.RDR1 T0 where T0."DocEntry" = ' + clave;

		//var mConn = $.hdb.getConnection();
		var mRS = mConn.executeQuery(mQuery);
		//mConn.close();

		var j;
		var mIncomingPaymentLine = '';
		var mLines = [];

		if (mRS.length > 0) {
			for (j = 0; j < mRS.length; j++) {
				mIncomingPaymentLine = '{';
				mIncomingPaymentLine += '"Linea": "' + mRS[j].Linea + '",';
				mIncomingPaymentLine += '"Articulo": "' + mRS[j].Articulo + '",';
				mIncomingPaymentLine += '"Descrip": "' + mRS[j].Descrip + '",';
				mIncomingPaymentLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
				mIncomingPaymentLine += '"NomUnid": "' + mRS[j].NomUnid + '",';
				mIncomingPaymentLine += '"Almacen": "' + mRS[j].Almacen + '",';
				mIncomingPaymentLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
				mIncomingPaymentLine += '"Disponible": "' + mRS[j].Disponible + '",';
				mIncomingPaymentLine += '"ListaPrecio": "' + mRS[j].ListaPrecio + '",';
				mIncomingPaymentLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
				mIncomingPaymentLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
				mIncomingPaymentLine += '"Impuesto": "' + mRS[j].Impuesto + '",';
				//	mIncomingPaymentLine += '"Lotes": [' + obtenerLotes(database,clave, mRS[j].Linea) + ']';
				mIncomingPaymentLine += '"Lotes": []';
				mIncomingPaymentLine += "}";

				mLines.push(mIncomingPaymentLine);
			}
		} else {
			return '';
		}

		//	mConn.close();
		return mLines.join(",");

	} catch (e) {
		return '';
	}
}

function ObtenerDirecciones(codigo, database) {

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
			' WHERE T0."CardCode" = \'' + codigo + '\'';
		//')Q where "Ruta"<>\'\';';

		var mConn = $.hdb.getConnection();
		var mRS = mConn.executeQuery(mQuery);
		mConn.close();

		var j;
		var mBusinessPartnerDirection = '';
		var mLines = [];

		if (mRS.length > 0) {
			for (j = 0; j < mRS.length; j++) {

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
		} else {
			return '';
		}

		return mLines.join(",");

	} catch (e) {
		return '';
	}
}

var query;
try {

	var empId = $.request.parameters.get('empId');
	var cove = $.request.parameters.get('cove');

	if (empId !== undefined && cove !== undefined) {
		var dbname = functions.GetDataBase(empId);
		localCurrency = functions.GetLocalCurrency(dbname);
		query = 'SELECT T0."U_AB_SUCURSAL" AS "Sucursal", ' +
			'T0."DocEntry" AS "Clave", ' +
			'T0."DocNum" AS "Numero", ' +
			'IFNULL(T0."U_SYP_MDSD",\'\') || \'-\' || LPAD(IFNULL(T0."U_SYP_MDCD",0),7, \'0\') AS "Referencia", ' +
			'T0."CardCode" AS "SocioNegocio", ' +
			'T0."CardName" AS "Razon", ' +
			'IFNULL(T2."ListNum",-99) AS "ListaPrecio", ' +
			'T0."DocCur" AS "Moneda", ' +
			'T0."SlpCode" AS "EmpleadoVenta", ' +
			'DAYS_BETWEEN(T0."TaxDate",CURRENT_DATE) AS "Dias", ' +
			'substring(IFNULL(T0."Comments",\'\'),0,98) AS "Comentario", ' +
			'TO_VARCHAR(T0."DocDate",\'YYYYMMDD\') AS "FechaContable", ' +
			'TO_VARCHAR(T0."DocDueDate", \'YYYYMMDD\') AS "FechaVencimiento", ' +
			'IFNULL(T0."PayToCode",\'\') AS "DireccionFiscal", ' +
			'T2."Address" AS "DireccionEntrega", ' +
			'T0."GroupNum" AS "CondicionPago", ' +
			'IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
			'(T0."DocTotal" - T0."VatSum" + T0."DiscSum") AS "SubTotal", ' +
			'(T0."DocTotalFC" - T0."VatSumFC" + T0."DiscSumFC")  AS "SubTotalFC", ' +
			'T0."DiscSum" AS "Descuento", ' +
			'T0."DiscSumFC" AS "DescuentoFC", ' +
			'T0."VatSum" AS "Impuesto", ' +
			'T0."VatSumFC" AS "ImpuestoFC", ' +
			'T0."DocTotal" AS "Total", ' +
			'T0."DocTotalFC" AS "TotalFC", ' +
			'(T0."DocTotal"-T0."PaidToDate") AS "Saldo", ' +
			'(T0."DocTotalFC"-T0."PaidFC") AS "SaldoFC", ' +
			'T0."U_AB_CRUTA" as "Ruta" '+
			'FROM ' + dbname + '.ORDR T0 ' +
			'INNER JOIN ' + dbname + '.OCRD T2 ON T0."CardCode" = T2."CardCode" ' +
			'WHERE T0."DocStatus"=\'O\' ' +
			'AND T0."CANCELED" = \'N\' ' +
			'AND T0."SlpCode" =' + cove;

		mConn = $.hdb.getConnection();
		var rs = mConn.executeQuery(query);
		//conn.close();

		if (rs.length > 0) {
			var mIncomingPayment = '';
			var mResult = [];
			var i;

			for (i = 0; i < rs.length; i++) {
				mIncomingPayment = '{';
				mIncomingPayment += '"Sucursal": "' + rs[i].Sucursal + '",';
				mIncomingPayment += '"Clave": ' + rs[i].Clave + ',';
				mIncomingPayment += '"Numero": ' + rs[i].Numero + ',';
				mIncomingPayment += '"Referencia": "' + rs[i].Referencia + '",';
				mIncomingPayment += '"SocioNegocio": "' + rs[i].SocioNegocio + '",';
				mIncomingPayment += '"Razon": "' + rs[i].Razon + '",';
				mIncomingPayment += '"ListaPrecio": ' + rs[i].ListaPrecio + ',';
				mIncomingPayment += '"Moneda": "' + rs[i].Moneda + '",';
				mIncomingPayment += '"EmpleadoVenta": "' + rs[i].EmpleadoVenta + '",';
				mIncomingPayment += '"Comentario": "' + functions.CleanChars(rs[i].Comentario) + '",';
				mIncomingPayment += '"FechaContable": "' + rs[i].FechaContable + '",';
				mIncomingPayment += '"FechaVencimiento": "' + rs[i].FechaVencimiento + '",';
				mIncomingPayment += '"Dias": "' + rs[i].Dias + '",';
				mIncomingPayment += '"DireccionFiscal": "' + rs[i].DireccionFiscal + '",';
				mIncomingPayment += '"DireccionEntrega": "' + rs[i].DireccionEntrega + '",';
				mIncomingPayment += '"CondicionPago": "' + rs[i].CondicionPago + '",';
				mIncomingPayment += '"Indicador": "' + rs[i].Indicador + '",';
				mIncomingPayment += '"Ruta": "' + rs[i].Ruta + '",';

				if (localCurrency !== rs[i].Moneda) {
					mIncomingPayment += '"SubTotal": "' + rs[i].SubTotalFC + '",';
					mIncomingPayment += '"Descuento": "' + rs[i].DescuentoFC + '",';
					mIncomingPayment += '"Impuesto": "' + rs[i].ImpuestoFC + '",';
					mIncomingPayment += '"Total": "' + rs[i].TotalFC + '",';
					mIncomingPayment += '"Saldo": "' + rs[i].SaldoFC + '",';
				} else {
					mIncomingPayment += '"SubTotal": "' + rs[i].SubTotal + '",';
					mIncomingPayment += '"Descuento": "' + rs[i].Descuento + '",';
					mIncomingPayment += '"Impuesto": "' + rs[i].Impuesto + '",';
					mIncomingPayment += '"Total": "' + rs[i].Total + '",';
					mIncomingPayment += '"Saldo": "' + rs[i].Saldo + '",';
				}



				mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname) + '],';

				mIncomingPayment += '"Direcciones": [' + ObtenerDirecciones(rs[i].SocioNegocio, dbname) + ']';




				mIncomingPayment += "}";




				try {
					mResult.push(JSON.parse(mIncomingPayment));
				} catch (e) {
					throw new functions.buildException(mIncomingPayment);
				}
			}

			objType = Constants.SUCCESS_OBJECT_RESPONSE;
			objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
			objResponse = functions.CreateResponse(objType, objResult, mResult.length);
			functions.DisplayJSON(objResponse, objType);

		} else {
			objType = "MessageError";
			objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. (" + empId + ")");
			objResponse = functions.CreateResponse(objType, objResult, 0);
			functions.DisplayJSON(objResponse, objType);
		}

	} else {
		objType = "MessageError";
		objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
		objResponse = functions.CreateResponse(objType, objResult, 0);
		functions.DisplayJSON(objResponse, objType);
	}

} catch (e) {
	objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse, objType);
} finally {
	mConn.close();
}