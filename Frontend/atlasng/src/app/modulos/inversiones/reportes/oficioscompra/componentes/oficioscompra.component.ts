
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';

@Component({
  selector: 'app-oficioscompra',
  templateUrl: 'oficioscompra.html'
})
export class OficioscompraComponent extends BaseComponent implements OnInit, AfterViewInit {

  fecha = new Date();

  private mIdBancoOficioAccion: string = "";

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];
  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  private catalogoDetalle: CatalogoDetalleComponent;

  @Input()
  natural: BaseComponent;

  @Input()
  detalle: BaseComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvinversion', 'OFICIOINVERSIONES', false);
    this.componentehijo = this;
  }

  ngOnInit() {

    this.obtenerParametros();


    this.componentehijo = this;

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

    //this.mfiltrosesp.estadocdetalle = ' in (\'APR\',\'PAG\',\'FINAPR\,\'ENVPAG\')' + ' ';

    this.mfiltrosesp.estadocdetalle = ' in (\'APR\',\'PAG\',\'FINAPR\',\'ENVPAG\')' + ' ';

    if (!this.estaVacio(this.mcampos.cinversion)) this.mfiltros.cinversion = this.mcampos.cinversion;

    if (!this.estaVacio(this.mcampos.emisorcdetalle))
    {
      this.mfiltros.emisorcdetalle = this.mcampos.emisorcdetalle;
    }

    if (!this.estaVacio(this.mcampos.instrumentocdetalle))
    {
      this.mfiltros.instrumentocdetalle = this.mcampos.instrumentocdetalle;
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

    this.mfiltrosesp.femision = 'between ' + lfecinicio + ' and ' + lfecfin + ' ';

    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nEmisor', 't.emisorccatalogo = i.ccatalogo and t.emisorcdetalle = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nInstrumento', 't.instrumentoccatalogo = i.ccatalogo and t.instrumentocdetalle = i.cdetalle');
    consulta.addSubqueryPorSentencia("select cast(str(i.fresolucioncompra,8) as date) from tinvinversion i where i.cinversion = t.cinversion","nFresolucion");
    consulta.addSubquery('tinvbancodetalle', 'nombrescontacto2', 'nombreContacto2', 't.bancopagoccatalogo = i.bancoccatalogo and t.bancopagocdetalle = i.bancocdetalle');
    
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
    //return super.validaFiltrosRequeridos();
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

    let lfecharesolucion: number;

    try
    {
      lfecharesolucion = (this.registro.mdatos.nFresolucion.getFullYear() * 10000) + ((this.registro.mdatos.nFresolucion.getMonth() + 1) * 100) + this.registro.mdatos.nFresolucion.getDate();
    }
    catch (ex)
    {
      lfecharesolucion = Number(this.registro.mdatos.nFresolucion.toString().substring(0, 4) +
        this.registro.mdatos.nFresolucion.toString().substring(5, 7) +
        this.registro.mdatos.nFresolucion.toString().substring(8, 10));
    }

    if (!this.estaVacio(this.mIdBancoOficioAccion) && this.mIdBancoOficioAccion == this.registro.bancopagocdetalle)
    {
      if (this.estaVacio(this.registro.mdatos.nombreContacto2))
      {
        this.jasper.nombreArchivo = 'rptInvOficioAccionUnContacto';
      }
      else
      {
        this.jasper.nombreArchivo = 'rptInvOficioAccion';
      }

    }
    else if (this.registro.mercadotipocdetalle == "BURSAT")
    {

      if (this.estaVacio(this.registro.mdatos.nombreContacto2))
      {
        this.jasper.nombreArchivo = 'rptInvOfiComBursatilUnContacto';
      }
      else
      {
        this.jasper.nombreArchivo = 'rptInvOfiComBursatil';
      }
  

    }
    else if (this.estaVacio(this.registro.mdatos.nombreContacto2))
    {
      this.jasper.nombreArchivo = 'rptInvOficioCompraUnContacto';
    }
    else
    {
      this.jasper.nombreArchivo = 'rptInvOficioCompra';
    }


    // Agregar parametros
    this.jasper.parametros['@icinversion'] = this.registro.cinversion;
    this.jasper.parametros['@numeroOficio'] = this.registro.numerooficiocompra;
    this.jasper.parametros['@fresolucion'] = lfecharesolucion;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;

    if (!this.estaVacio(this.mIdBancoOficioAccion) && this.mIdBancoOficioAccion == this.registro.bancopagocdetalle)
    {

      //if (this.estaVacio(this.registro.mdatos.nombreContacto2))
      //{

        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOficioAccionUnContacto';
      //}
      //else
      //{
        //this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOficioAccion';
      //}
    }

    else if (this.registro.mercadotipocdetalle == "BURSAT")
    {

      //if (this.estaVacio(this.registro.mdatos.nombreContacto2))
      //{
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOfiComBursatilUnContacto';
      //}
      //else
      //{
      //  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOfiComBursatil';
      //}
    }
    //else if (this.estaVacio(this.registro.mdatos.nombreContacto2))
    else
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOficioCompraUnContacto';
    }
    //else
    //{
    //  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvOficioCompra';
    //}

    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();

    this.actualizar(); 
  }

  obtenerParametros()
  {

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    
    rqConsulta.inversion = 12;
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }

          this.mIdBancoOficioAccion = resp.ID_BANCO_OFICIO;

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  mostrarLovInversiones(): void {

    //this.lovInversiones.mfiltrosesp.estadocdetalle = ' in (\'APR\',\'PAG\',\'FINAPR\')' + ' ';

    this.lovInversiones.mfiltrosesp.estadocdetalle = ' in (\'APR\',\'PAG\',\'FINAPR\',\'ENVPAG\')' + ' ';

    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinversion = reg.registro.cinversion;
      this.mcampos.codigotitulo = reg.registro.codigotitulo;
      this.consultar();

    }

  }

}
