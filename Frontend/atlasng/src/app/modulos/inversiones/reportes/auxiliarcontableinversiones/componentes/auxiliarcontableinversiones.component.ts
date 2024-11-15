
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-auxiliarcontableinversiones',
  templateUrl: 'auxiliarcontableinversiones.html'
})
export class AuxiliarcontableinversionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovCuentasContables: LovCuentasContablesComponent;
 
 
  public regconsulta: any = [];
 

  public lEmisor: SelectItem[] = [{label: '...', value: null}];
  public lInstrumento: SelectItem[] = [{label: '...', value: null}];
  public lProceso: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvinversion', 'AUXILIARCONTABLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
  
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.finicio = finicio;
    this.mfiltros.ffin = this.fechaactual;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }


  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lEmisor, resp.Emisor, 'cdetalle'); 
      this.llenaListaCatalogo(this.lInstrumento, resp.Instrumento, 'cdetalle');
      this.llenaListaCatalogo(this.lProceso, resp.Proceso, 'cdetalle');
    }
    this.lconsulta = [];
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.emisorcdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nEmisor', ' t.emisorccatalogo=i.ccatalogo and t.emisorcdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nInstrumento', ' t.instrumentoccatalogo=i.ccatalogo and t.instrumentocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nProceso', ' t.procesoccatalogo=i.ccatalogo and t.procesocdetalle=i.cdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  llenarConsultaCatalogos(): void {
    
        const mfiltrosEmisor = {'ccatalogo': 1213};
        const consEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
        consEmisor.cantidad = 100;
        this.addConsultaPorAlias('Emisor', consEmisor);

        const mfiltrosInstrumento = {'ccatalogo': 1202};
        const consInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosInstrumento, {});
        consInstrumento.cantidad = 100;
        this.addConsultaPorAlias('Instrumento', consInstrumento);
    
        const mfiltrosProceso = {'ccatalogo': 1220};

        const mfiltrosOpeEsp: any = { 'cdetalle': " in ('RECUP','COMPRA','ACCINT') " };
        const consProceso = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProceso, mfiltrosOpeEsp);
        consProceso.cantidad = 100;
        this.addConsultaPorAlias('Proceso', consProceso);

        this.ejecutarConsultaCatalogos();
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

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true);
  }

  fijarLovCuentasContablesSelec(reg: any): void {
    
        if (reg.registro !== undefined) {
          this.msgs = [];
    
          this.mcampos.ccuentacon = reg.registro.ccuenta;
          this.mcampos.ncuentacon = reg.registro.nombre;
          this.registro.mdatos.ncuentacon = reg.registro.nombre;
        }
  }

  private fijarFiltrosConsulta() {

  }
  descargarReporte(reg: any): void {
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptInvAuxiliarContable';
    let lfemisor: string = this.estaVacio(this.mfiltros.emisorcdetalle) ? "All":this.mfiltros.emisorcdetalle;
    let lfinstrumento: string = this.estaVacio(this.mfiltros.instrumentocdetalle) ? "All":this.mfiltros.instrumentocdetalle;
    let lfdesde: number = this.estaVacio(this.mfiltros.finicio) ? 0 : (this.mfiltros.finicio.getFullYear() * 10000) + ((this.mfiltros.finicio.getMonth() + 1) * 100) + this.mfiltros.finicio.getDate();
    let lfhasta: number = this.estaVacio(this.mfiltros.ffin) ? 99999999 : (this.mfiltros.ffin.getFullYear() * 10000) + ((this.mfiltros.ffin.getMonth() + 1) * 100) + this.mfiltros.ffin.getDate();
    let lcontable: string = this.estaVacio(this.mcampos.ccuentacon) ? "All":this.mcampos.ccuentacon;
    let lProceso: string = this.estaVacio(this.mfiltros.procesocdetalle) ? "All":this.mfiltros.procesocdetalle;

    // Agregar parametros
    this.jasper.parametros = new Object();
    this.jasper.parametros['@i_emisor'] = lfemisor;
    this.jasper.parametros['@i_instrumento'] = lfinstrumento;
    this.jasper.parametros['@i_finicio'] = lfdesde;
    this.jasper.parametros['@i_ffin'] = lfhasta;
    this.jasper.parametros['@i_ccuenta'] = lcontable;
    this.jasper.parametros['@i_proceso'] = lProceso;

    /*
    @i_emisor VARCHAR(6) = 'All'
    ,@i_instrumento VARCHAR(6)='All'
    , @i_finicio int = 0
    , @i_ffin int=99999999
    , @i_ccuenta VARCHAR(20)='All'
   */

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvAuxiliarContable';
    this.jasper.generaReporteCore();
  }

 
  
}
