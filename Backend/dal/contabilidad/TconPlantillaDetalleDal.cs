using dal.generales;
using dal.monetario;
using modelo;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad {

    public class TconPlantillaDetalleDal {
        
        public static List<tconplantilladetalle> Find(int cplantila, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconplantilladetalle> lista = new List<tconplantilladetalle>();
            lista = contexto.tconplantilladetalle.AsNoTracking().Include("tconplantilla").Where(x => x.cplantilla == cplantila &&
                                                        x.ccompania == ccompania).OrderBy(x => x.orden).ToList();
            return lista;
        }

        public static List<tconplantilladetalle> FindXCuenta(int cplantila, int ccompania, string ccuenta)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconplantilladetalle> lista = new List<tconplantilladetalle>();
            lista = contexto.tconplantilladetalle.AsNoTracking().Include("tconplantilla").Where(x => x.cplantilla == cplantila &&
                                                        x.ccompania == ccompania &&
                                                        x.ccuenta == ccuenta).OrderBy(x => x.orden).ToList();
            return lista;
        }
    }

}
