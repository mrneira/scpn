import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'
import { LovUsuariosComponent } from '../../../../seguridad/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-traspaso-juridico-reporte',
  templateUrl: 'juridicoCobranzaReporte.html'
})
export class JuridicoCobranzaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  public lestacobranza: SelectItem[] = [{ label: '...', value: null }];
  public persona;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTETRASPASOJURIDICO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteTraspadoJuridico';

    if ((this.mcampos.fIngreso != null && this.mcampos.fFinIngreso == null) || (this.mcampos.fIngreso == null && this.mcampos.fFinIngreso != null) || (this.mcampos.fIngreso > this.mcampos.fFinIngreso) ||
      (this.mcampos.fIniAsignacion != null && this.mcampos.fFinAsignacion == null) || (this.mcampos.fIniAsignacion == null && this.mcampos.fFinAsignacion != null) || (this.mcampos.fIniAsignacion > this.mcampos.fFinAsignacion) ||
      (this.mcampos.fIniLegal != null && this.mcampos.fFinLegal == null) || (this.mcampos.fIniLegal == null && this.mcampos.fFinLegal != null) || (this.mcampos.fIniLegal > this.mcampos.fFinLegal)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
    } else {
      if (this.mfiltros.cpersona === undefined || this.mfiltros.cpersona === null) {
        this.persona = -1;
      }

      if (this.mfiltros.cusuario === undefined || this.mfiltros.cusuario === null) {
        this.mfiltros.cusuario = ''
      }

      if (this.mcampos.fIngreso === undefined || this.mcampos.fIngreso === null) {
        this.mcampos.fIngreso = null
      }

      if (this.mcampos.fFinIngreso === undefined || this.mcampos.fFinIngreso === null) {
        this.mcampos.fFinIngreso = null
      }
      if (this.mcampos.fIniAsignacion === undefined || this.mcampos.fIniAsignacion === null) {
        this.mcampos.fIniAsignacion = null
      }

      if (this.mcampos.fFinAsignacion === undefined || this.mcampos.fFinAsignacion === null) {
        this.mcampos.fFinAsignacion = null
      }

      if (this.mcampos.fIniLegal === undefined || this.mcampos.fIniLegal === null) {
        this.mcampos.fIniLegal = null
      }

      if (this.mcampos.fFinLegal === undefined || this.mcampos.fFinLegal === null) {
        this.mcampos.fFinLegal = null
      }

      // Agregar parametros
      this.jasper.parametros['@i_fIngreso'] = this.mcampos.fIngreso;
      this.jasper.parametros['@i_fFinIngreso'] = this.mcampos.fFinIngreso;
      this.jasper.parametros['@i_fIniModificacion'] = this.mcampos.fIniAsignacion;
      this.jasper.parametros['@i_fFinModificacion'] = this.mcampos.fFinAsignacion;
      this.jasper.parametros['@i_fIniLegal'] = this.mcampos.fIniLegal;
      this.jasper.parametros['@i_fFinLegal'] = this.mcampos.fFinLegal;
      this.jasper.parametros['@i_cpersona'] = this.persona;
      this.jasper.parametros['@i_cusuarioasignado'] = this.mfiltros.cusuario;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Cobranzas/TraspasoJuridico';

      this.jasper.generaReporteCore();
    }
  }

  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.nombre = reg.registro.nombre;
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.persona = this.mfiltros.cpersona;
    }
  }

  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cusuario = reg.registro.mdatos.cusuario;
      this.mfiltros.npersona = reg.registro.mdatos.npersona;
    }
  }

  mostrarLovUsuarios(): void {
    this.lovusuariosregistro.showDialog();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

}
