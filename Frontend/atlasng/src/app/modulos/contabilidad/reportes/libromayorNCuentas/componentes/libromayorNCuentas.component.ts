import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-libromayorNCuentas',
  templateUrl: 'libromayorNCuentas.html'
})
export class LibromayorNCuentasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  lcuentas: SelectItem[] = [];
  selectedCuentas: string[] = [];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcatalogo', 'CUENTASCONTABLES', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
    this.consultarCatalogosGenerales();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    //this.fijarFiltrosConsulta();
    this.mfiltros.movimiento = true;
    this.mfiltros.activa = true;
    //this.mfiltros.tipoplancdetalle = "PC-FA";
    
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 3000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoCcostoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoCcostoDetalle.mfiltros.ccatalogo = 1002;
    // const Ccosto = this.catalogoCcostoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('CENTROCOSTO', Ccosto, this.lCcostocdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();

    //this.ejecutarConsultaCatalogos();

  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    //super.postQueryEntityBean(resp);
    for(const i in resp.CUENTASCONTABLES){
      const reg = resp.CUENTASCONTABLES[i];
      this.lcuentas.push({label: reg.ccuenta + ' - ' + reg.nombre , value: reg.ccuenta });
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  imprimir(resp: any): void {
    this.mcampos.aniof = this.mcampos.anioi;
    if (!this.estaVacio(this.mcampos.anioi) &&
      !this.estaVacio(this.mcampos.aniof) &&
      !this.estaVacio(this.mcampos.mesi) &&
      !this.estaVacio(this.mcampos.mesf) &&
      !this.estaVacio(this.selectedCuentas)) {
      this.jasper.nombreArchivo = 'rptConLibroMayorNcuentas';
      const Finicio = this.mcampos.anioi + '-' + this.mcampos.mesi + '-' + "01";

      var d = new Date(this.mcampos.anioi, (this.mcampos.mesf), 0)
      //d.setDate(d.getDate() - 1);
      const FFin = this.mcampos.anioi + '-' + this.mcampos.mesf + '-' + d.getDate();

      this.jasper.parametros['@i_ccuentas'] = this.selectedCuentas;
      this.jasper.parametros['@i_finicio'] = (Finicio);
      this.jasper.parametros['@i_ffin'] = (FFin);
      this.jasper.parametros['@i_ccosto'] = (this.registro.centrocostoscdetalle === undefined) ? "" : this.registro.centrocostoscdetalle;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConLibroMayorNCuentas';

      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();
    } else {

      super.mostrarMensajeError("NO SE HAN DEFINIDO LOS FILTROS DE BUSQUEDA");
    }

  }

}
