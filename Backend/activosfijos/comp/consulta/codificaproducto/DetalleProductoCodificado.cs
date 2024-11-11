using core.componente;
using dal.activosfijos;
using dal.cartera;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using util;
using util.dto.consulta;
using static activosfijos.comp.consulta.cargas.CargaProducto;

namespace activosfijos.comp.consulta.codificaproducto
{

    public class DetalleProductoCodificado : ComponenteConsulta
    {

        /// <summary>
        /// Metodo que entrega el detalle de ingreso y su codificacion de producto.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            string codigoconsulta = rqconsulta.Mdatos["CODIGOCONSULTA"].ToString();
            string storeprocedure = rqconsulta.Mdatos["storeprocedure"].ToString();
            int cingreso = int.Parse(rqconsulta.Mdatos["cingreso"].ToString());
            List<secuencia> lista = new List<secuencia>();
            IList<tacfproductocodificado> pce = TacfProductoCodificadoDal.FindxCIngreso(cingreso);
            

            
            if (pce.Count > 0)
            {
            foreach (tacfproductocodificado pc in pce) {
                    pc.Esnuevo = false;
                    pc.Actualizar = true;
                    tacfproducto p = TacfProductoDal.Find(pc.cproducto);
                    tacfproducto pb = TacfProductoDal.FindGrCodificable(p.cproducto);
                    pc.Mdatos.Add("codigo", pb.codigo);
                    pc.Mdatos.Add("nombre", p.nombre);

                }
                rqconsulta.Response[codigoconsulta] = pce;
            }
            else
            {
                IList<tacfproductocodificado> pcn = new List<tacfproductocodificado>();
                IList<tacfingresodetalle> ing = TacfIngresoDetalleDal.FindIngreso(cingreso);

                var result = ing.GroupBy(Saldo => Saldo.cproducto)
                    .Select(Saldogby => Saldogby.First())
                    .ToList();
                int a = 0;


                foreach (tacfingresodetalle ingd in result) {
                    tacfproducto p = TacfProductoDal.Find(ingd.cproducto);
                    tacfproducto pb = TacfProductoDal.FindGrCodificable(p.cproducto);
                    //tacfproducto pb = TacfProductoDal.FindGrCodificable(cb.cproducto); 
                    if(p.codificable==null)
                    throw new AtlasException("ACF-001", "PRODUCTO {0} NO TIENE DEFINIDO SI SE CODIFICA, VALIDAR EN EL CATÁLOGO DE PRODUCTOS",((p==null)?"NO DEFINIDO " : p.nombre) );

                    if (p.codificable.Value)
                    {
                        int total = (int)(ing.Where(x => x.cproducto == ingd.cproducto).Sum(y => y.cantidad.Value))- (int)(ing.Where(x => x.cproducto == ingd.cproducto).Sum(y => y.cantidaddevuelta.Value));
                       
                           
                        for (int i = 1; i <= total; i++)
                        {
                            tacfproductocodificado pc = new tacfproductocodificado();
                            pc.Mdatos.Add("codigo", pb.codigo);
                            pc.Mdatos.Add("nombre", p.nombre);
                            pc.serial = "";
                            List<secuencia> nuevase = null;
                            int valor = 0;
                            try
                            {

                                foreach (secuencia resultado in lista)
                                {
                                    if (resultado.codigo.Equals(pb.codigo))
                                    {
                                        valor = resultado.valor;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {

                            }
                            string cbarras = "";
                            int sec = 0;
                            if (valor == 0)
                            {
                                sec = TacfProductoCodificadoDal.FindxCproducto(pb.codigo);
                                sec++;
                                secuencia nse = new secuencia();
                                nse.valor = sec;
                                nse.codigo = pb.codigo;
                                lista.Add(nse);
                                cbarras = pb.codigo + "." + sec;
                            }
                            else
                            {
                                sec = valor;
                                sec++;
                                cbarras = pb.codigo + "." + sec;
                                secuencia nse = new secuencia();
                                nse.valor = sec;
                                nse.codigo = pb.codigo;
                                lista.Add(nse);
                            }
                            pc.cbarras = cbarras;

                           // pc.cbarras = pb.codigo + "." + sec;
                            pc.cingreso = cingreso;
                            pc.cproducto = ingd.cproducto;
                            pc.centrocostosccatalogo = p.centrocostosccatalogo;
                            pc.centrocostoscdetalle = p.centrocostoscdetalle;
                            pc.marcaccatalogo = p.marcaccatalogo;
                            pc.marcacdetalle = p.marcacdetalle;
                            pc.modelo = p.modelo;
                            pc.valorlibros = p.valorlibros;
                            pc.valorresidual = p.valorresidual;
                            pc.vunitario = ingd.vunitario;
                            pc.ccuenta = (p.ccuenta == null) ? null : p.ccuenta;
                            pc.ccuentadepreciacion = (p.ccuentadepreciacion == null) ? null : p.ccuentadepreciacion;
                            pc.ccuentadepreciacionacum = (p.ccuentadepreciacionacum == null) ? null : p.ccuentadepreciacionacum;
                            pc.ccuentagasto = (p.ccuentagasto == null) ? null : p.ccuentagasto;
                            pc.cusuarioasignado = "BODEGA";
                            pc.Esnuevo = true;
                            pc.Actualizar = false;
                            pc.Idreg = a++;
                            pcn.Add(pc);
                        }
                    }

                }
                rqconsulta.Response[codigoconsulta] = pcn;

            }

        }
        



    }
}
