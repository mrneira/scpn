import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'
import { LovUsuariosComponent } from '../../../../seguridad/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-acciones-cobranza-reporte',
  templateUrl: 'accionesCobranzaReporte.html'
})
export class AccionesCobranzaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  public lestacobranza: SelectItem[] = [{ label: '...', value: null }];
  public persona;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEACCIONCOBRANZA', false);
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
    this.jasper.nombreArchivo = 'ReporteAccionesCobranza';

    if ((this.mcampos.fIngreso != null && this.mcampos.fFinIngreso == null) || (this.mcampos.fIngreso == null && this.mcampos.fFinIngreso != null) || (this.mcampos.fIngreso > this.mcampos.fFinIngreso) ||
      (this.mcampos.fIniCompromisopago != null && this.mcampos.fFinCompromisopago == null) || (this.mcampos.fIniCompromisopago == null && this.mcampos.fFinCompromisopago != null) || (this.mcampos.fIniCompromisopago > this.mcampos.fFinCompromisopago)) {
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
      if (this.mcampos.fIniCompromisopago === undefined || this.mcampos.fIniCompromisopago === null) {
        this.mcampos.fIniCompromisopago = null
      }

      if (this.mcampos.fFinCompromisopago === undefined || this.mcampos.fFinCompromisopago === null) {
        this.mcampos.fFinCompromisopago = null
      }

      // Agregar parametros
      this.jasper.parametros['@i_fIngreso'] = this.mcampos.fIngreso;
      this.jasper.parametros['@i_fFinIngreso'] = this.mcampos.fFinIngreso;
      this.jasper.parametros['@i_fIniCompromisopago'] = this.mcampos.fIniCompromisopago;
      this.jasper.parametros['@i_fFinCompromisopago'] = this.mcampos.fFinCompromisopago;
      this.jasper.parametros['@i_cpersona'] = this.persona;
      this.jasper.parametros['@i_cusuarioasignado'] = this.mfiltros.cusuario;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Cobranzas/AcicionesCobranza';

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
