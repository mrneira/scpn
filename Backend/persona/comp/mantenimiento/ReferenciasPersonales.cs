using core.componente;
using dal.persona;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace persona.comp.mantenimiento {
    class ReferenciasPersonales :ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("REFERENCIAPERSONAL") == null || rm.GetTabla("REFERENCIAPERSONAL").Lregistros.Count() <= 0) {
                return;
            }

            if(bool.Parse(rm.GetDatos("desvincular").ToString())) {
                return;
            }

            tperreferenciapersonales refact = (tperreferenciapersonales)rm.GetTabla("REFERENCIAPERSONAL").Lregistros.ElementAt(0);
            tperreferenciapersonales refold = (tperreferenciapersonales)refact.GetDatos("BEANORIGINAL");

            // 1. Cambio Vinculacion de policia a civil 
            if(refold != null && refold.cpersonaconyugue != null && refact.cpersonaconyugue == null) {
                tperreferenciapersonales refexiste = TperReferenciaPersonalesDal.FindByCpersona(refold.cpersonaconyugue ?? 0, rm.Ccompania);
                TperReferenciaPersonalesDal.Delete((int)refexiste.cpersona, refexiste.ccompania);
               // Sessionef.Eliminar(refexiste);
                validarConyugue(rm, refact, null);
            }

            // 1. Nueva Vinculacion a policia
            // 2. Cambio Vinculacion civil a policia
            if(refold == null) {
                validarConyugueNuevo(rm, refact);
                tperreferenciapersonales refnuevo = new tperreferenciapersonales();
                if(refact.cpersonaconyugue != null) {
                    refnuevo.identificacion = null;
                    refnuevo.genero = null;
                    refnuevo.nombre = null;
                    refnuevo.cpersona = refact.cpersonaconyugue ?? 0;
                    refnuevo.ccompania = rm.Ccompania;
                    refnuevo.secuencia = 1;
                    refnuevo.verreg = 0;
                    refnuevo.ctipovinculacion = 5;
                    refnuevo.cpersonaconyugue = refact.cpersona;
                    rm.GetTabla("REFERENCIAPERSONAL").Lregistros.Add(refnuevo);
                }
            } else {
                if(refold.cpersonaconyugue == null && refact.cpersonaconyugue != null) {
                    tperreferenciapersonales refcony = TperReferenciaPersonalesDal.FindByCpersona(refact.cpersonaconyugue ?? 0, rm.Ccompania);
                    // Nuevo conyugue no asociado
                    if(refcony == null) {
                        validarConyugue(rm, refact, refcony);
                        tperreferenciapersonales refnuevo = new tperreferenciapersonales();
                        refnuevo.identificacion = null;
                        refnuevo.genero = null;
                        refnuevo.nombre = null;
                        refnuevo.cpersona = refact.cpersonaconyugue ?? 0;
                        refnuevo.ccompania = rm.Ccompania;
                        refnuevo.secuencia = 1;
                        refnuevo.verreg = 0;
                        refnuevo.ctipovinculacion = 5;
                        refnuevo.cpersonaconyugue = refact.cpersona;
                        rm.GetTabla("REFERENCIAPERSONAL").Lregistros.Add(refnuevo);
                    } else {
                        // Conyugue ya vinculado a un policia, y se asocia a otro policia
                        refcony.identificacion = null;
                        refcony.genero = null;
                        refcony.nombre = null;
                        refcony.cpersonaconyugue = refact.cpersona;
                    }
                }
            }


            // Cambio Vinculacion de un policia a otro policia
            if(refold != null && refold.cpersonaconyugue != null && refact.cpersonaconyugue != null) {
                tperreferenciapersonales refconyold = TperReferenciaPersonalesDal.FindByCpersona(refold.cpersonaconyugue ?? 0, rm.Ccompania);
                TperReferenciaPersonalesDal.Delete((int)refconyold.cpersona, refconyold.ccompania);
                //Sessionef.Eliminar(refconyold);

                tperreferenciapersonales refcony = TperReferenciaPersonalesDal.FindByCpersona(refact.cpersonaconyugue ?? 0, rm.Ccompania);
                // Nuevo conyugue no asociado
                if(refcony == null) {
                    tperreferenciapersonales refnuevo = new tperreferenciapersonales();
                    refnuevo.identificacion = null;
                    refnuevo.genero = null;
                    refnuevo.nombre = null;
                    refnuevo.cpersona = refact.cpersonaconyugue ?? 0;
                    refnuevo.ccompania = rm.Ccompania;
                    refnuevo.secuencia = 1;
                    refnuevo.verreg = 0;
                    refnuevo.ctipovinculacion = 5;
                    refnuevo.cpersonaconyugue = refact.cpersona;
                    rm.GetTabla("REFERENCIAPERSONAL").Lregistros.Add(refnuevo);
                } else {
                    // Conyugue ya vinculado a un policia, y se asocia a otro policia
                    refcony.identificacion = null;
                    refcony.genero = null;
                    refcony.nombre = null;
                    refcony.cpersonaconyugue = refact.cpersona;
                }
                validarConyugue(rm, refact, refcony);
            }
            // Cambio Vinculacion de un policia al mismo policia que ingresa los datos
            if (refold != null && refold.cpersonaconyugue == null && refact.cpersonaconyugue != null)
            {
                //tperreferenciapersonales refconyold = TperReferenciaPersonalesDal.FindByCpersona(refold.cpersonaconyugue ?? 0, rm.Ccompania);
                //TperReferenciaPersonalesDal.Delete((int)refconyold.cpersona, refconyold.ccompania);
                //Sessionef.Eliminar(refconyold);
                tperreferenciapersonales refcony = TperReferenciaPersonalesDal.FindByCpersona(refact.cpersonaconyugue ?? 0, rm.Ccompania);
                // Nuevo conyugue no asociado
                if (refcony != null)
                {
                    validarConyugue(rm, refact, refcony);
                    refcony.identificacion = null;
                    refcony.genero = null;
                    refcony.nombre = null;
                    refcony.cpersonaconyugue = refact.cpersona;
                }
                validarConyugue(rm, refact, refcony);
            }
        }

        public void validarConyugue(RqMantenimiento rq, tperreferenciapersonales refactual, tperreferenciapersonales refcony) {
            tpernatural refactnat = TperNaturalDal.Find(refactual.cpersona, refactual.ccompania);
            if(refcony != null) {
                tpernatural refconynat = TperNaturalDal.Find(refcony.cpersona, refcony.ccompania);
                if(refactnat.genero == refconynat.genero)
                    throw new AtlasException("BPER-016", "EL CÓNYUGE NO PUEDE SER DEL MISMO SEXO");

                if(refactual.cpersona == refactual.cpersonaconyugue)
                    throw new AtlasException("BPER-012", "EL CÓNYUGE INGRESADO {0} NO PUEDE SER LA MISMA PERSONA QUE SE ESTA EDITANDO", refactual.nombre);

                if(refcony.cpersonaconyugue != null)
                    throw new AtlasException("BPER-013", "EL CÓNYUGE INGRESADO {0} YA ESTA REGISTRADO COMO CÓNYUGE DE OTRA PERSONA", refactual.nombre);
            } else {
                if(refactual.genero == refactnat.genero)
                    throw new AtlasException("BPER-016", "EL CÓNYUGE NO PUEDE SER DEL MISMO SEXO");
            }
        }

        public void validarConyugueNuevo(RqMantenimiento rq, tperreferenciapersonales refactual) {
            tpernatural refnat = TperNaturalDal.Find((int)refactual.cpersona, refactual.ccompania);
            tpernatural refconynat = null;
            tperreferenciapersonales refcony = null;
            if(refactual.cpersonaconyugue != null) {
                refconynat = TperNaturalDal.Find((int)refactual.cpersonaconyugue, refactual.ccompania);
                refcony = TperReferenciaPersonalesDal.FindByCpersona((long)refactual.cpersonaconyugue, refactual.ccompania);
            }

            if(refconynat != null) {
                if(refnat.genero == refconynat.genero)
                    throw new AtlasException("BPER-016", "EL CÓNYUGE NO PUEDE SER DEL MISMO SEXO");

                if(refnat.cpersona == refconynat.cpersona)
                    throw new AtlasException("BPER-012", "EL CÓNYUGE INGRESADO {0} NO PUEDE SER LA MISMA PERSONA QUE SE ESTA EDITANDO", refactual.nombre);
                if(refcony != null) {
                    if(refcony.cpersonaconyugue != null)
                        throw new AtlasException("BPER-013", "EL CÓNYUGE INGRESADO {0} YA ESTA REGISTRADO COMO CÓNYUGE DE OTRA PERSONA", refactual.nombre);
                }

            } else {
                if(refnat.genero == refactual.genero)
                    throw new AtlasException("BPER-016", "EL CÓNYUGE NO PUEDE SER DEL MISMO SEXO");
            }




        }
    }
}