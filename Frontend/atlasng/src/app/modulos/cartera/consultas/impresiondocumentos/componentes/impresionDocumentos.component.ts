import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { AccionesReporteComponent } from './../../../../../util/shared/componentes/accionesReporte.component';


@Component({
  selector: 'app-impresion-documentos',
  templateUrl: 'impresionDocumentos.html'
})
export class ImpresionDocumentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(AccionesReporteComponent)
  accionesReporteComponent: AccionesReporteComponent;

  public lmovimientos: any = [];
  public mostrarDialogoMovContable = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionDocumentos', 'DOCUMENTOS', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }


  crearNuevo() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tcarproductodocumentos', 'ensolicitud', 'nsolicitud', 't.cdocumento = i.cdocumento and verreg = 0 and i.cproducto = ' + this.mcampos.cproducto + ' and i.ctipoproducto = ' + this.mcampos.ctipoproducto);
    consulta.addSubquery('tgendocumentos', 'nombre', 'nreporte', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.addSubquery('tgendocumentos', 'descripcion', 'ndescripcion', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.addSubquery('tgendocumentos', 'reporte', 'reporte', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.addSubquery('tgendocumentos', 'nombredescarga', 'nombredescarga', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones */
  mostrarlovoperacion(): void {
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
    this.lovOperacion.showDialog();
  }


  /**Retorno de lov de operaciones. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacion = reg.registro.coperacion;
      this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
      this.mcampos.csolicitud = reg.registro.csolicitud;
      this.mcampos.cproducto = reg.registro.cproducto;
      this.mcampos.ctipoproducto = reg.registro.ctipoproducto;
      this.consultar();
    }
  }

  descargarReporte(reg: any): void {
    this.accionesReporteComponent.parametros['@i_csolicitud'] = undefined;
    this.accionesReporteComponent.parametros['@i_usuario'] = undefined;
    this.accionesReporteComponent.parametros['@i_coperacion'] = undefined;
    this.accionesReporteComponent.nombreArchivo = this.mfiltros.coperacion + '-' + reg.mdatos.nombredescarga;
    this.accionesReporteComponent.cdocumento = reg.cdocumento;
    this.accionesReporteComponent.coperacion = reg.coperacion;

    if (reg.mdatos.nsolicitud) {
      this.accionesReporteComponent.parametros['@i_csolicitud'] = this.mcampos.csolicitud;
      this.accionesReporteComponent.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    } else {
      this.accionesReporteComponent.parametros['@i_coperacion'] = this.mfiltros.coperacion;
      this.accionesReporteComponent.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    }
    this.accionesReporteComponent.parametros['archivoReporteUrl'] = reg.mdatos.reporte;
    this.accionesReporteComponent.generaReporteCore(sessionStorage.getItem('m'), sessionStorage.getItem('t'));
  }

}
