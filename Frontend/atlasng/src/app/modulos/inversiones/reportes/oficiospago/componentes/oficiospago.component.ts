
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-oficiospago',
  templateUrl: 'oficiospago.html'
})
export class OficiospagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  fecha = new Date();

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];
  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvtablaamortizacion', 'INVERSIONPAGO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }

  crearNuevo() {


      super.crearNuevo();


  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
      this.crearDtoConsulta();
      super.consultar();
  }

  public crearDtoConsulta(): Consulta {


    let lFiltroEmisor: string = null;
    let lFiltroInstrumento: string = null;

    if (!this.estaVacio(this.mcampos.emisorcdetalle))
    {
      
      lFiltroEmisor = ' in (select cinversion from tinvinversion where emisorcdetalle = \'' + this.mcampos.emisorcdetalle + '\'' + ')';
    }

    if (!this.estaVacio(this.mcampos.instrumentocdetalle))
    {
      lFiltroInstrumento = ' in (select cinversion from tinvinversion where instrumentocdetalle = \'' + this.mcampos.instrumentocdetalle + '\'' + ')';
    }

    if (!this.estaVacio(lFiltroEmisor) && !this.estaVacio(lFiltroInstrumento))
    {
      this.mfiltrosesp.cinversion = lFiltroEmisor + ' and t.cinversion ' + lFiltroInstrumento;
    }
    else if (!this.estaVacio(lFiltroEmisor))
    {
      this.mfiltrosesp.cinversion = lFiltroEmisor;
    }
    else if (!this.estaVacio(lFiltroInstrumento))
    {
      this.mfiltrosesp.cinversion = lFiltroInstrumento;
    }

    let lfecinicio: number = 0;
    let lfecfin: number = 99999999;

    if (!this.estaVacio(this.mcampos.fdesde))
    {
      lfecinicio = (this.mcampos.fdesde.getFullYear() * 10000) + ((this.mcampos.fdesde.getMonth() + 1) * 100) + this.mcampos.fdesde.getDate();
    }

    if (!this.estaVacio(this.mcampos.fdesde))
    {
      lfecfin = (this.mcampos.fhasta.getFullYear() * 10000) + ((this.mcampos.fhasta.getMonth() + 1) * 100) + this.mcampos.fhasta.getDate();
    }

    this.mfiltrosesp.fvencimiento = 'between ' + lfecinicio + ' and ' + lfecfin + ' ';

    const consulta = new Consulta(this.entityBean, 'Y', 't.fvencimiento desc', this.mfiltros, this.mfiltrosesp);

    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.emisorccatalogo = j.ccatalogo and i.emisorcdetalle = j.cdetalle where t.cinversion = i.cinversion', 'nEmisor');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.instrumentoccatalogo = j.ccatalogo and i.instrumentocdetalle = j.cdetalle where t.cinversion = i.cinversion', 'nInstrumento');
    consulta.addSubqueryPorSentencia('select ed.nombrescontacto2 from tinvinversion i inner join tinvbancodetalle ed on i.bancopagoccatalogo = ed.bancoccatalogo and i.bancopagocdetalle = ed.bancocdetalle where i.cinversion = t.cinversion', 'nombreContacto2');

    consulta.addSubqueryPorSentencia("select case when i.calendarizacioncdetalle = '360' and isnull(j.clegal,'') = 'OBLIGA' and t.plazo < 370 then case when t.plazo between 23 and 39 then 30 when t.plazo between 53 and 69 then 60 when t.plazo between 83 and 99 then 90 when t.plazo between 113 and 129 then 120 when t.plazo between 143 and 159 then 150 when t.plazo between 173 and 189 then 180 when t.plazo between 203 and 219 then 210 when t.plazo between 233 and 249 then 240 when t.plazo between 263 and 279 then 270 when t.plazo between 293 and 309 then 300 when t.plazo between 323 and 339 then 330 when t.plazo between 353 and 369 then 360 else t.plazo end when isnull(j.clegal,'') = 'CDP' then i.plazo else case when i.calendarizacioncdetalle = '360' then dbo.sp_InvConRestaDias360(cast(str(t.finicio,8) as date), cast(str(t.fvencimiento,8) as date)) else t.plazo end end from tinvinversion i inner join tgencatalogodetalle j on j.ccatalogo = i.instrumentoccatalogo and j.cdetalle = i.instrumentocdetalle where i.cinversion = t.cinversion", 'nPlazo360');

    consulta.addSubqueryPorSentencia("select case when isnull(j.clegal,'') = 'CDP' then i.codigotitulo else '' end from tinvinversion i inner join tgencatalogodetalle j on j.ccatalogo = i.instrumentoccatalogo and j.cdetalle = i.instrumentocdetalle where i.cinversion = t.cinversion", 'nCodigoTitulo');

    this.addConsulta(consulta);
    return consulta;
  }


  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
   
    const mfiltrosrubro = { 'ccatalogo': 1213 };
    const consEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosrubro, {});
    consEmisor.cantidad = 100;
    this.addConsultaPorAlias('EMISOR', consEmisor);

    const mfiltrosinstrumento = { 'ccatalogo': 1202 };
    const consInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosinstrumento, {});
    consInstrumento.cantidad = 100;
    this.addConsultaPorAlias('INSTRUMENTO', consInstrumento);
    
    this.ejecutarConsultaCatalogos();
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');

    }
    this.lconsulta = [];
  }


  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }


  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return true;
  
  }


  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  imprimir(resp: any): void {

    //if (this.estaVacio(this.registro.comentariosanulacion))

    if (this.estaVacio(this.registro.mdatos.nCodigoTitulo))
    {
      this.mostrarMensajeError("INGRESE EL NÚMERO DE INSTRUMENTO FINANCIERO");
      return;
    }

    this.jasper.nombreArchivo = 'rptInvOficioPagoUnContacto';

    // Agregar parametros
    this.jasper.parametros['@icinvtablaamortizacion'] = this.registro.cinvtablaamortizacion;
    this.jasper.parametros['@numeroOficio'] = this.registro.numerooficiopago;
    this.jasper.parametros['@numeroInstrumento'] = this.registro.mdatos.nCodigoTitulo;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOficioPagoUnContacto';

  

    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();

    this.actualizar(); 
  }

}
