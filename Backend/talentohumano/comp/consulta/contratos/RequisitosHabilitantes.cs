using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.componente;
using util.dto.consulta;
using util.dto;
using modelo.servicios;
using util.servicios.ef;
using modelo;
using dal.talentohumano;
using dal.gestordocumental;
using util;

namespace talentohumano.comp.consulta.contratos
{
    /// <summary>
    /// Entrega una lista de funcionarios de la aplicacion.
    /// </summary>
    /// <author>jcuenca</author>

    class RequisitosHabilitantes : ComponenteConsulta
    {
        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            long cfuncionario = long.Parse(rqconsulta.Mdatos["cfuncionario"].ToString());
            long ccontrato = long.Parse(rqconsulta.Mdatos["ccontrato"].ToString());
            long ctiporelacionlaboral = long.Parse(rqconsulta.Mdatos["ctiporelacionlaboral"].ToString());

            IList<tthrequisitorelacionlaboral> ltthrequisitorelacionlaboral = TthRequisitoContratoDal.FindByTipoRelacionLaboral(ctiporelacionlaboral);
            List<tthrequisitohabilitante> tthrequisitohabilitante = new List<tthrequisitohabilitante>();
            List<tthrequisitohabilitante> tthrequisitohabilitanteOpcional = new List<tthrequisitohabilitante>();
            tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(cfuncionario);
            int total = TthRequisitoHabilitanteDal.Find(cfuncionario);

            foreach (tthrequisitorelacionlaboral requisito in ltthrequisitorelacionlaboral)
            {
                tthrequisitohabilitante habilitante = TthRequisitoHabilitanteDal.FindByRequisitoAndFuncionario(requisito.crequisitorelacionlaboral, cfuncionario);
                Boolean lreg = true;
                if (habilitante == null)
                {
                    habilitante = new tthrequisitohabilitante();
                    habilitante.crequisitorelacionlaboral = requisito.crequisitorelacionlaboral;
                    habilitante.cfuncionario = cfuncionario;
                    habilitante.fechaentrega = cd.fvinculacion;
                    habilitante.fechamaxentrega = cd.fvinculacion;
                    lreg = Convert.ToBoolean(requisito.obligatorio);
                    habilitante.entregado = false;
                    habilitante.verificado = false;
                    habilitante.comentario = "";

                }
                else
                {
                    string nombre = "";
                    tgesarchivo arch = TgesGestorDocumentalDal.FindByCodigoArchivo(Convert.ToInt64(habilitante.cgesarchivo));

                    if (arch == null)
                    {
                        nombre = "";
                    }
                    else
                    {
                        nombre = arch.nombrearchivo;
                    }
                    habilitante.Mdatos.Add("ndocumento", nombre);
                }

                habilitante.Mdatos.Add("nrequisito", requisito.Mdatos["nombrerequisito"]);
                habilitante.Mdatos.Add("nfase", requisito.fase);
                habilitante.Mdatos.Add("cobligatorio", requisito.obligatorio);

                if (lreg)
                {
                    tthrequisitohabilitante.Add(habilitante);
                }
                else
                {
                    tthrequisitohabilitanteOpcional.Add(habilitante);
                }
            }

            rqconsulta.Response["lregistros"] = tthrequisitohabilitante;
            rqconsulta.Response["lregistrosOpcional"] = tthrequisitohabilitanteOpcional;
            rqconsulta.Response["iniciado"] = false;
        }
    }
}
