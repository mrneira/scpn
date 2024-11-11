using modelo;
using modelo.helper;
using System.Linq;
using util;
using util.servicios.ef;
using System;
using System.Collections.Generic;

namespace dal.contabilidad
{
    public class TperProveedorDal {

        /// <summary>
        /// Entrega datos vigentes de una persona natural.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tperproveedor Find(long cpersona, int ccompania)
        {
            tperproveedor obj;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tperproveedor.AsNoTracking().Where(
                    x => x.cpersona == cpersona && x.ccompania == ccompania
                    ).SingleOrDefault();
                EntityHelper.SetActualizar(obj);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-017", "PROVEEDOR NO DEFINIDO EN TPERPROVEEDOR CPERSONA: {0} COMPANIA: {1}", cpersona, ccompania);
            }
            return obj;
        }

        /// <summary>
        /// encuentra un proveedor por identificación
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns></returns>
        public static List<tperproveedor> FindByIdentificacion(string identificacion)
        {
            List<tperproveedor> lista = new List<tperproveedor>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                lista = contexto.tperproveedor.AsNoTracking().Where(
                    x => x.identificacion == identificacion
                    ).ToList();
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-017", "PROVEEDOR NO DEFINIDO EN TPERPROVEEDOR IDENTIFICACION: {0}", identificacion);
            }
            return lista;
        }
        public static List<tperproveedor> FindByIdentificacion(string identificacion, bool cliente)
        {
            List<tperproveedor> lista = new List<tperproveedor>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                lista = contexto.tperproveedor.AsNoTracking().Where(
                    x => x.identificacion == identificacion
                    && x.cliente== cliente
                    ).ToList();
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-017", "PROVEEDOR NO DEFINIDO EN TPERPROVEEDOR IDENTIFICACION: {0}", identificacion);
            }
            return lista;
        }

        /// <summary>
        /// Devuelve un proveedor mediante la identificación y el tipo (cuando es cliente el valor es true caso contrario false)
        /// </summary>
        /// <param name="identificacion"></param>
        /// <param name="cliente"></param>
        /// <returns></returns>
        public static tperproveedor FindByIdentificacionAndTipo(string identificacion, bool cliente ) {
            tperproveedor obj;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tperproveedor.Where(
                    x => x.identificacion == identificacion && x.cliente.Value == cliente).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Devuelve el código de cuenta contable de un proveedor/cliente 
        /// </summary>
        public static string FindCuentaContableProveedorCliente(long cpersona, int ccompania, int verreg) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string ccuenta = "";
            tperproveedor obj;
            obj = contexto.tperproveedor.Where(x => x.cpersona == cpersona &&
                                                    x.ccompania == ccompania &&
                                                    x.verreg == verreg).SingleOrDefault();
            if (obj != null) {
                ccuenta = obj.ccuenta == null ? "": obj.ccuenta;
            }   
            return ccuenta;
        }

        public static tperproveedor FindId(string identificacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperproveedor obj = null;
            obj = contexto.tperproveedor.Where(x => x.identificacion == identificacion).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }
}
