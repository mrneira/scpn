using core.componente;
using core.servicios;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    /// <summary>
    /// Clase que se encarga de realizar el manteniminto del rol de pagos
    /// </summary>
    public class RecalcularRol : ComponenteMantenimiento

       
    {

        /// <summary>
        /// Genera los valores del rol de pagos
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            long? cnomina = rm.GetLong("cnomina");
            if (cnomina == 0 || cnomina == null) {
                return;
            }
            if (rm.Mdatos.ContainsKey("cerrada"))
            {
                return;
            }
            tnomnomina lnom = new tnomnomina();

            if (rm.GetTabla("NOMINA") == null || !rm.GetTabla("NOMINA").Lregistros.Any())
            {
                lnom = TnomNominaDal.Find(cnomina);
            }
            else
            {
                lnom = rm.GetTabla("NOMINA").Lregistros.Cast<tnomnomina>().Single();
                
            }
             
            
            rm.Mtablas["NOMINA"] = null;
            tnomparametrodetalle param = TnomparametroDal.Find((long)lnom.anio);
            IList<tnomrol> rolPagos = TnomRolDal.FindNomina(lnom.cnomina);
            IList<Rol> rolPagosGenerados = new List<Rol>();
            IList<tnomrol> ltnr = new List<tnomrol>();



            foreach (tnomrol ls in rolPagos)
            {
                Rol rolPago = new Rol();
                tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(ls.cfuncionario);

                tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(ls.cfuncionario.Value);
                if (cd == null)
                {
                    throw new AtlasException("TTH-019", "NO SE HA DEFINIDO UN CONTRATO PARA EL FUNCIONARIO {0}", (fun.primernombre + " " + fun.primerapellido));

                }

                tnomdecimos tnd = TnomDecimosDal.FindAnio((long)lnom.anio, cd.cfuncionario);

                if (tnd == null)
                {
                    throw new AtlasException("TTH-020", "NO SE HA PARAMETRIZADO LA ACUMULACIÓN O MENSUALIZACIÓN DE DÉCIMOS, FONDOS DE RESERVA DEL FUNCIONARIO: {0}", (fun.primernombre + " " + fun.primerapellido));

                }

                tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(lnom.anio, cd.regioncdetalle);
                if (pdecimo == null)
                {
                    throw new AtlasException("TTH-021", "NO SE HA PARAMETRIZADO LAS FECHAS DE PAGO DE LOS DÉCIMOS EN EL SISTEMA");

                }
                rolPago = new Rol(lnom.finicio.Value, lnom.ffin.Value, rm.Ccompania, lnom.cnomina, (long)lnom.anio, lnom.mescdetalle, cd, param, pdecimo, tnd);
                //DATOS
                rolPago.setDetalles();
                //CALCULOS GENERALES
                rolPago.setDatosGenerales();
               
                ls.total = rolPago.Rolpagos.total;
                ls.totalley = rolPago.Rolpagos.totalley;
                ls.singresos = rolPago.Rolpagos.singresos;
                ls.segresos = rolPago.Rolpagos.segresos;
                ls.sueldobase = rolPago.Rolpagos.sueldobase;
                ls.acumulacionbeneficiosley = rolPago.Rolpagos.acumulacionbeneficiosley;
                ls.ccargo = rolPago.Rolpagos.ccargo;
                ls.ccontrato = rolPago.Rolpagos.ccontrato;
                ls.cdepartamento = rolPago.Rolpagos.cdepartamento;
                ls.cproceso = rolPago.Rolpagos.cproceso;
                ls.diascalculo = rolPago.Rolpagos.diascalculo;
                ls.diastrabajados = rolPago.Rolpagos.diastrabajados;
                ls.estado = true;
                ls.fmodificacion = rm.Freal;
                ls.mdcuarto = rolPago.Rolpagos.mdcuarto;
                ls.mdtercero = rolPago.Rolpagos.mdtercero;
                ls.mfondos = rolPago.Rolpagos.mfondos;
                ls.saportepatrono = rolPago.Rolpagos.saportepatrono;
                ls.sbeneficiosley = rolPago.Rolpagos.sbeneficiosley;
                ls.sdescuentosley = rolPago.Rolpagos.sdescuentosley;
                ls.totalley = rolPago.Rolpagos.totalley;
                ls.cusuariomod = rm.Cusuario;
               
            }
            rm.AdicionarTabla("TNOMN", lnom, false);
          
            rm.Response["RECALCULADO"] = true;

        }
    }
}
