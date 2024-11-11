using cartera.enums;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.tesoreria;
using general.archivos.bulkinsert;
using modelo;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using tesoreria.enums;
using util;
using util.dto.mantenimiento;
using util.enums;

namespace cartera.comp.mantenimiento.descuentos {

    /// <summary>
    /// Clase que se encarga de ejecutar el envio de descuentos a Bancos (OCP).
    /// </summary>
    public class EnvioBancos : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("ARCHIVOSDESCUENTOS") == null) {
                throw new AtlasException("CAR-0076", "NO EXISTEN ARCHIVOS PARA PROCESAR");
            }

            tcardescuentosarchivo archivo = (tcardescuentosarchivo)rqmantenimiento.GetTabla("ARCHIVOSDESCUENTOS").Lregistros.ElementAt(0);

            if (archivo.archivoinstituciondetalle.Equals(EnumDescuentos.BANCOS.Cinstitucion)) {

                try {
                    List<ttestransaccion> lcobros = new List<ttestransaccion>();
                    DataTable dt = TcarDescuentosDetalleDal.FindDescuentos(archivo.particion, EnumDescuentos.BANCOS.Cinstitucion);
                    long secuencia = TtesTransaccionDal.GetSecuencia();
                    foreach (DataRow row in dt.Rows) {

                        // Registra OCP
                        ttestransaccion bce = new ttestransaccion();
                        secuencia += 1;
                        bce.ctestransaccion = secuencia;
                        bce.verreg = Constantes.CERO;
                        bce.optlock = Constantes.CERO;
                        bce.cmodulo = rqmantenimiento.Cmodulo;
                        bce.ctransaccion = rqmantenimiento.Ctransaccion;
                        bce.mensaje = rqmantenimiento.Mensaje;
                        bce.identificacionbeneficiario = row.Field<string>("identificacion");
                        bce.nombrebeneficiario = row.Field<string>("nombre").Replace(",", string.Empty).Replace("Ñ", "N").Replace("Á", "A").Replace("É", "E").Replace("Í", "I").Replace("Ó", "O").Replace("Ú", "U").ToUpper();
                        if (bce.nombrebeneficiario.Length > 29) {
                            bce.nombrebeneficiario = bce.nombrebeneficiario.Substring(0, 29);
                        }
                        bce.numerocuentabeneficiario = row.Field<string>("numero");
                        bce.codigobeneficiario = row.Field<long>("cpersona");
                        bce.tipocuentacdetalle = row.Field<string>("tipocuentacdetalle");
                        bce.tipocuentaccatalogo = row.Field<int>("tipocuentaccatalogo");
                        bce.institucioncdetalle = row.Field<string>("tipoinstitucioncdetalle");
                        bce.institucionccatalogo = row.Field<int>("tipoinstitucionccatalogo");
                        bce.valorpago = row.Field<decimal>("monto");
                        bce.detalle = string.Format("{0}-{1}", TgentransaccionDal.Find(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion).nombre, row.Field<string>("coperacion"));
                        bce.cestado = ((int)EnumEstadoPagoBce.EstadoPagoBce.AutorizacionCobro).ToString();
                        bce.referenciainterna = row.Field<string>("coperacion");
                        bce.secuenciainterna = row.Field<int>("particion");
                        bce.email = row.Field<string>("email");
                        bce.telefono = row.Field<string>("celular");
                        bce.tipotransaccion = EnumTesoreria.COBRO.Cpago;
                        bce.esproveedor = false;
                        bce.fingreso = rqmantenimiento.Freal;
                        bce.cusuarioing = rqmantenimiento.Cusuario;
                        bce.fcontable = rqmantenimiento.Fconatable;
                        bce.esmanual = false;

                        lcobros.Add(bce);
                    }
                    BulkInsertHelper.Grabar(lcobros, "ttestransaccion");
                }
                catch (AtlasException) {
                    throw new AtlasException("BCAR-0029", "OPERACIONES DE CARTERA PARA DESCUENTOS NO EXISTEN");
                }
            }
        }
    }
}
