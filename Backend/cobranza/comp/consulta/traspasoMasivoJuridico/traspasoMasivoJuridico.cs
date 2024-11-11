using core.componente;
using System;
using dal.cobranzas;
using dal.cartera;
using dal.persona;
using dal.generales;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using util.dto;
using modelo;

namespace cobranza.comp.consulta.traspasoMasivoJuridico
{
    public class TraspasoMasivoJuridico : ComponenteConsulta
    {
        /// <summary>
        /// Consulta si la operacion tiene acciones de cobranza.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            string  cestatus = rqconsulta.Mdatos["cestatus"].ToString();
            IList<tcobcobranza> tcobcobranzaEstado = TcobCobranzaDal.FindEstado(cestatus);
            IList<tcobcobranza> respcob = new List<tcobcobranza>();

            
            foreach (tcobcobranza cob in tcobcobranzaEstado)
            {

                String coperacion = cob.coperacion;
                long Acciones = 0;
                Acciones = (long)TcobAccionDal.FinAccion(coperacion);

                if (Acciones > 0)
                {
                   
                        long cpersona = (int)cob.cpersona;
                        int ccompania = (int)cob.ccompania;
                        tperpersonadetalle tperpersonadetalle = TperPersonaDetalleDal.Find(cpersona, ccompania);
                        tcaroperacion tcaroperacion = TcarOperacionDal.FindWithLock(coperacion);
                        int cproducto = (int)tcaroperacion.cproducto;
                        int ctipoproducto = (int)tcaroperacion.ctipoproducto;
                        tcarproducto tcarproducto = TcarProductoDal.FindInDataBase(7, cproducto, ctipoproducto);
                        tgentipoproducto tgentipoproducto = TgenTipoProductoDal.Find(7, cproducto, ctipoproducto);

                        Dictionary<string, object> moperacion = new Dictionary<string, object>();

                        cob.Mdatos.Add("nnombre", tperpersonadetalle.nombre);
                        cob.Mdatos.Add("producto", tgentipoproducto.nombre + "-" + tcarproducto.nombre);
                        cob.Esnuevo = false;
                        cob.Actualizar = true;
                            
                        respcob.Add(cob);
                }
            }
            resp["TRASPASO"] = respcob;
        }
    }
}
