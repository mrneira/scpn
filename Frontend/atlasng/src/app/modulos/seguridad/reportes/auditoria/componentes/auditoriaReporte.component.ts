import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovUsuariosComponent } from '../../../lov/usuarios/componentes/lov.usuarios.component';
import { VisorPdfComponent } from '../../../../../util/componentes/pdfViwer/componentes/visorPdf.component';
import { LovTransaccionesComponent } from '../../../../generales/lov/transacciones/componentes/lov.transacciones.component';
@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'auditoriaReporte.html'
})
export class AuditoriaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  @ViewChild(VisorPdfComponent)
  public visor: VisorPdfComponent;

  public lperfiles: SelectItem[] = [{ label: '...', value: null }];
  public ltipo: SelectItem[] = [{ label: '...', value: null }, { label: 'CONSULTA', value: 'C' }, { label: 'MANTENIMIENTO', value: 'M' }];
  public maxDate;
  public minDate;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEAUDITORIA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.finicio.setDate(this.mcampos.camposfecha.finicio.getDate() - 15);
    this.mcampos.camposfecha.ffin = new Date();
    this.maxDate = new Date();
    this.minDate= this.mcampos.camposfecha.finicio;

    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar() {
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.setCantidad(50);
    this.addConsulta(consulta);
    super.consultar();
  }

  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteAuditoria';

    if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      return;
    } else {
      if (this.mfiltros.cusuario === undefined || this.mfiltros.cusuario === null) {
        this.mfiltros.cusuario = '';
      }

      if (this.mcampos.finicio === undefined || this.mcampos.finicio === null) {
        this.mcampos.finicio = null
      }

      if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
        this.mcampos.ffin = null
      }

      if (this.mfiltros.ctransaccion === undefined || this.mfiltros.ctransaccion === null) {
        this.mfiltros.ctransaccion = -1
      }

      if (this.mfiltros.cmodulo === undefined || this.mfiltros.cmodulo === null) {
        this.mfiltros.cmodulo = -1
      }

      //calculo de fecha y resta de tres dia

      // Agregar parametros
      this.jasper.parametros['@i_usuario'] = this.mfiltros.cusuario;
      this.jasper.parametros['@i_fInicio'] = this.mcampos.camposfecha.finicio;
      this.jasper.parametros['@i_fFin'] = this.mcampos.camposfecha.ffin;
      this.jasper.parametros['@i_transaccion'] = this.mfiltros.ctransaccion;
      this.jasper.parametros['@i_modulo'] = this.mfiltros.cmodulo;
      this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguridad/Auditoria';
      this.jasper.generaReporteCore();
    }

  }

  /**Muestra lov de usuarios */
  mostrarLovUsuarios(): void {
    this.lovusuariosregistro.showDialog();
  }

  /**Retorno de lov de usuarios. */
  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cusuario = reg.registro.mdatos.cusuario;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
      this.mfiltros.cusuario = reg.registro.mdatos.cusuario;
    }
  }

  mostrarLovTransacciones(): void {
    this.lovtransacciones.mfiltrosesp.ruta = 'is not null'
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nmodulo = reg.registro.mdatos.nmodulo;
      this.mcampos.ntransaccion = reg.registro.nombre;
      this.mfiltros.cmodulo = reg.registro.cmodulo;
      this.mfiltros.ctransaccion = reg.registro.ctransaccion;
      this.mfiltros.mensaje = reg.registro.mensaje;
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {

    const consultaRol = new Consulta('TsegRol', 'Y', 't.nombre', {}, {});
    consultaRol.cantidad = 100;
    this.addConsultaPorAlias('PERFILES', consultaRol);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lperfiles, resp.PERFILES, 'crol');
    }
    this.lconsulta = [];
  }
}
