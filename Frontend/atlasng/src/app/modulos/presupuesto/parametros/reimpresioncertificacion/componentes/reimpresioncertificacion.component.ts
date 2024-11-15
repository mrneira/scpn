import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovCertificacionComponent } from '../../../lov/certificacion/componentes/lov.certificacion.component';
import { JasperComponent } from 'app/util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-certificacion',
  templateUrl: 'reimpresioncertificacion.html'
})
export class ReimpresioncertificacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCertificacionComponent)
  private lovcertificacion: LovCertificacionComponent;

  public nuevo = true;
  public eliminado = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREARCERTIFICACION', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.cabeceraComponent.mcampos.fingreso = this.fechaactual;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }
  

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);

  }

  private fijarFiltrosConsulta() {
    this.cabeceraComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
     return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.cabeceraComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    this.detalleComponent.calcularTotales();
    this.nuevo = false;
    this.eliminado = this.cabeceraComponent.registro.eliminado;
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.grabar();
  }


  eliminarCompromiso(): void {
    if (this.cabeceraComponent.registro.estadocdetalle != 'CERTIF') {
      super.mostrarMensajeError('NO SE PUEDE ELIMINAR REGISTRO CON ESTADO DIFERENTE DE INGRESO');
      return;
    }
    else {
      this.rqMantenimiento.mdatos.eliminar = true;
      this.grabar();
    }
  }

  certificar(): void { 
    if(this.cabeceraComponent.getMantenimiento(1).tieneCambios() || this.detalleComponent.getMantenimiento(2).tieneCambios() ) {
        super.mostrarMensajeError('EXISTE CAMBIOS PENDIENTES DE GRABAR, GUARDE LOS CAMBIOS ANTES DE GENERAR LA CERTIFICACION');
        return;
    }
    this.cabeceraComponent.registro.estadocdetalle = 'CERTIF';
    this.rqMantenimiento.mdatos.certificar = true;
    this.grabar();
  }

  

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.cabeceraComponent.mfiltros.ccertificacion = resp.ccertificacion;
      this.detalleComponent.mfiltros.ccertificacion = resp.ccertificacion;
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;

      if (this.cabeceraComponent.registro.estadocdetalle === 'CERTIF'){
        this.descargarReporte();
        this.recargar();
      }

    }
  }

 
  /**Muestra lov de certificacion */
  mostrarlovCertificacion(): void {
    this.lovcertificacion.filtrasporfingreso = true;
    //this.lovcertificacion.mfiltros.estadocdetalle = 'INGRES';
    this.lovcertificacion.showDialog(true);
  }

  /**Retorno de lov de certificacion presupuestario. */
  fijarLovCertificacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.ccertificacion = reg.registro.ccertificacion;
      this.detalleComponent.mfiltros.ccertificacion = reg.registro.ccertificacion;
      this.msgs = [];
      this.consultar();
    }

  }

  consultarCatalogos(): void {
  }

   descargarReporte(): void {
    let ccertificacion = this.cabeceraComponent.registro.ccertificacion != null ? this.cabeceraComponent.registro.ccertificacion :this.cabeceraComponent.mfiltros.ccertificacion;
    this.jasper.parametros['@i_ccertificacion'] = ccertificacion;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;//CCA 20240827
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptCertificacion';
    this.jasper.generaReporteCore();
  }

}
