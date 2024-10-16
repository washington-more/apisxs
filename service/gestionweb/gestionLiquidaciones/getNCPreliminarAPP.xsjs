$.import("AB_MOBILE.Functions", "Functions");
$.import("AB_MOBILE.Constants", "Constants");
const Constants = $.AB_MOBILE.Constants;
const functions = $.AB_MOBILE.Functions;
let localCurrency = null;
var objResponse;
var objResult;
var objType;
var query = '';

function obtenerLotes(database, docEntry, lineNum, mConn) {
    try {
        if (docEntry === null || docEntry === 'null' || lineNum === null || lineNum === 'null') {
            return [];
        }
        const mQuery = '' +
            'SELECT DISTINCT T3."BatchNum" as "NroLote", ' +
            'T3."Quantity" as "Cantidad", ' +
            'T3."BaseLinNum" as "LineaBase" ' +
            'FROM ' + database + '.ODLN T0 ' +
            'INNER JOIN ' + database + '.DLN1 T2 ON T0."DocEntry" = T2."DocEntry" ' +
            'LEFT OUTER JOIN ' + database + '.IBT1 T3 ON T0."DocNum" = T3."BaseNum" AND T3."ItemCode" = T2."ItemCode" ' +
            'WHERE T0."DocEntry" = ' + docEntry + ' AND T3."BaseLinNum" = ' + lineNum + ' AND T3."Quantity" > 0';

        const mRS = mConn.executeQuery(mQuery);
        var lotes = [];

        for (var i = 0; i < mRS.length; i++) {
            lotes.push({
                Lote: mRS[i].NroLote,
                Cantidad: mRS[i].Cantidad,
                LineaBase: mRS[i].LineaBase
            });
        }

        return lotes;
    } catch (e) {
        return [];
    }
    return [];
}

function obtenerLineas(clave, database, relacionado, mConn) {
    try {
        if (relacionado === null || relacionado === 'null' || clave === null || clave === 'null') {
            return [];
        }
        const mQuery = '' +
            'SELECT T0."LineNum" AS "Linea", ' +
            'T0."BaseLine" AS "LineaBase", ' +
            'T0."BaseEntry" AS "ClaveBase", ' +
            'T0."ItemCode" AS "Articulo", ' +
            'CASE T2."UgpEntry" WHEN -1 THEN -1 ELSE T0."UomEntry" END AS "UnidadMedida", ' +
            'T0."WhsCode" AS "Almacen", ' +
            'T0."Quantity" AS "Cantidad", ' +
            'T0."PriceBefDi" AS "PrecioUnitario", ' +
            'IFNULL(T0."DiscPrcnt",0) AS "PorcentajeDescuento", ' +
            'T0."TaxCode" AS "Impuesto", ' +
            'IFNULL(T0."LineTotal",0) AS "TotalLinea", ' +
            'IFNULL(T0."VatSum",0) AS "MontoImpuesto", ' +
            'T0."AcctCode" AS "Cuenta" ' +
            'FROM ' + database + '.DRF1 T0 ' +
            'INNER JOIN ' + database + '.OITM T2 ON T2."ItemCode" = T0."ItemCode" ' +
            'WHERE T0."DocEntry" = ' + clave + ';';

        const mRS = mConn.executeQuery(mQuery);
        var lineas = [];

        for (var i = 0; i < mRS.length; i++) {
            lineas.push({
                Linea: mRS[i].Linea,
                LineaBase: mRS[i].LineaBase,
                ClaveBase: mRS[i].ClaveBase,
                Articulo: mRS[i].Articulo,
                UnidadMedida: mRS[i].UnidadMedida,
                Almacen: mRS[i].Almacen,
                Cantidad: mRS[i].Cantidad,
                PrecioUnitario: mRS[i].PrecioUnitario,
                PorcentajeDescuento: mRS[i].PorcentajeDescuento,
                Impuesto: mRS[i].Impuesto,
                TotalLinea: mRS[i].TotalLinea,
                MontoImpuesto: mRS[i].MontoImpuesto,
                Cuenta: mRS[i].Cuenta,
                Lotes: []
                // Lotes: obtenerLotes(database, relacionado, mRS[i].Linea, mConn)
            });
        }

        return lineas;
    } catch (e) {
        return [];
    }
}

try {
    const empId = $.request.parameters.get('empId');
    const consolidado = $.request.parameters.get('consolidado');

    if (empId && consolidado) {
        const dbname = functions.GetDataBase(empId);
        localCurrency = functions.GetLocalCurrency(dbname);

        query = '' +
            'SELECT T0."DocEntry" AS "Clave", T0."DocNum" AS "Numero", T0."TaxDate" AS "FechaEmision", ' +
            'T0."DocDate" AS "FechaConta", T0."CardName" AS "CodCliente", T0."CardCode" AS "NomCliente", ' +
            'T0."SlpCode" AS "CodVendedor", T1."SlpName" AS "Vendedor", T0."U_SYP_MDTO" AS "TipoOrig", ' +
            'T0."U_SYP_MDSO" AS "SerieOrig", T0."U_SYP_MDCO" AS "CorrelaOrig", T0."U_SYP_FECHAREF" AS "FechaOrig", ' +
            'T0."U_SYP_MOTNCND" AS "Motivo", T0."U_SYP_FECAT09" AS "MotivoSunat", T0."U_AB_DMER" AS "Relacionado", ' +
            '(T0."DocTotal" - T0."VatSum" + T0."DiscSum") AS "SubTotal", T0."VatSum" AS "Impuesto", ' +
            'T0."DocTotal" AS "Total", T0."U_AB_DMER" AS "Relacionado", ' +
            'CASE WHEN T0."U_SYP_STATUS"=\'A\' THEN \'ANULADO\' ELSE \'NC\' END AS "Estado" ' +
            'FROM ' + dbname + '.ODRF T0 ' +
            'INNER JOIN ' + dbname + '.OSLP T1 ON T1."SlpCode" = T0."SlpCode" ' +
            'INNER JOIN ' + dbname + '.OCRD T2 ON T0."CardCode" = T2."CardCode" ' +
            'WHERE T0."ObjType" = \'14\' ' +
            'AND T0."DocStatus" = \'O\' ' +
            'AND T0."DocType" = \'I\' ' +
            'AND T0."WddStatus" NOT IN (\'N\', \'C\') ' +
            'AND T0."U_AB_CODCON" = \'' + consolidado + '\'';

        const conn = $.hdb.getConnection();
        const rs = conn.executeQuery(query);
        if (rs.length > 0) {
            var mResult = [];

            for (var i = 0; i < rs.length; i++) {
                mResult.push({
                    Clave: rs[i].Clave,
                    Numero: rs[i].Numero,
                    FechaEmision: rs[i].FechaEmision,
                    FechaConta: rs[i].FechaConta,
                    CodCliente: rs[i].CodCliente,
                    NomCliente: rs[i].NomCliente,
                    CodVendedor: rs[i].CodVendedor,
                    Vendedor: rs[i].Vendedor,
                    TipoOrig: rs[i].TipoOrig,
                    SerieOrig: rs[i].SerieOrig,
                    CorrelaOrig: rs[i].CorrelaOrig,
                    FechaOrig: rs[i].FechaOrig,
                    Motivo: rs[i].Motivo,
                    MotivoSunat: rs[i].MotivoSunat,
                    Relacionado: rs[i].Relacionado,
                    SubTotal: rs[i].SubTotal,
                    Impuesto: rs[i].Impuesto,
                    Total: rs[i].Total,
                    Estado: rs[i].Estado,
                    Lineas: obtenerLineas(rs[i].Clave, dbname, rs[i].Relacionado, conn)
                });
            }

            objType = Constants.SUCCESS_OBJECT_RESPONSE;
            objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
            objResponse = functions.CreateResponse(objType, objResult, mResult.length);
            functions.DisplayJSON(objResponse, objType);
        } else {
            objType = "MessageError";
            objResult = functions.CreateJSONMessage(-101, 'No se han encontrado registros con los parámetros indicados. (\'empId\')');
            objResponse = functions.CreateResponse(objType, objResult, 0);
            functions.DisplayJSON(objResponse, objType);
        }

        conn.close();
    } else {
        objType = "MessageError";
        objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
        objResponse = functions.CreateResponse(objType, objResult, 0);
        functions.DisplayJSON(objResponse, objType);
    }
} catch (e) {
    objType = "MessageError";
    // objResponse = functions.CreateJSONMessage(-9703000, query);
    objResponse = functions.CreateJSONMessage(-9703000, e.message);
    objResponse = functions.CreateResponse(objType, objResponse, 0);
    functions.DisplayJSON(objResponse, objType);
}