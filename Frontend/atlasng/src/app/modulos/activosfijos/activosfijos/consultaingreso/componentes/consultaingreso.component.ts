import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovIngresosComponent } from '../../../lov/ingresos/componentes/lov.ingresos.component';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

@Component({
  selector: 'app-consulta-ingreso',
  templateUrl: 'consultaingreso.html'
})
export class ConsultaIngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(JasperComponent)
  public jasper1: JasperComponent;

  @ViewChild(JasperComponent)
  public jasper2: JasperComponent;


  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  @ViewChild(GestorDocumentalComponent)
  private lovGestor: GestorDocumentalComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoingresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcargocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lareacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];
  public lestadoingresocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public tienekardex = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREARINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
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
    // Consulta datos.
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    conComprobante.addSubquery('tperpersonadetalle', 'nombre', 'npersonaavala', 't.cusuarioavala = i.cpersona and i.verreg = 0');
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
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;
  }

  // Fin CONSULTA *********************

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
  }


  /**Muestra lov de ingresos */
  mostrarlovingresos(): void {  
    this.lovingresos.mfiltrosesp.tipoingresocdetalle = 'not in(\'DEVFUN\')'
    this.lovingresos.consultar();
    this.lovingresos.showDialog(true);
  }


  /**Retorno de lov de ingresos. */
  fijarLovIngresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.detalleComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.msgs = [];
      this.consultar();
    }

  }
  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }
  /**Retorno de lov de Gestión Documental. */
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.cabeceraComponent.registro.cgesarchivo = reg.cgesarchivo;
      this.cabeceraComponent.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();

      this.grabar();


    }
  }
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const conUsuarios = new Consulta('tperpersonadetalle', 'Y', 't.nombre', {}, {});
    conUsuarios.addSubquery('tsegusuariodetalle', 'ccompania', 'ncompania', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.ccompania=1 AND i.optlock = i.veractual and t.verreg = i.verreg and i.verreg=0')
    conUsuarios.cantidad = 100;
    this.addConsultaCatalogos('USUARIOS', conUsuarios, this.lcusuariorecibe, super.llenaListaCatalogo, 'cpersona');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1303;
    const conTipoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoIngreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOINGRESO', conTipoIngreso, this.ltipoingresocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1304;
    const conEstadoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoIngreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOINGRESO', conEstadoIngreso, this.lestadoingresocdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cingreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }
    if (this.cabeceraComponent.registro.tipoingresocdetalle === 'DEVSUM' || this.cabeceraComponent.registro.tipoingresocdetalle === 'DEVFUN' || this.cabeceraComponent.registro.tipoingresocdetalle === 'DEVBOD') {
      // Agregar parametros

      this.jasper.parametros['@i_cingreso'] = this.cabeceraComponent.registro.cingreso;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteDevolucionBodega';
      this.jasper.generaReporteCore();
    }
    else {
      this.jasper.parametros['@i_cingreso'] = this.cabeceraComponent.registro.cingreso;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteIngresoBodega';
      this.jasper.generaReporteCore();
    }   
  }
  //#endregion
}
