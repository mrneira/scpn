
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';

@Component({
  selector: 'app-mantenimientovectorprecios',
  templateUrl: 'mantenimientovectorprecios.html'
})
export class MantenimientoVectorPreciosComponent extends BaseComponent implements OnInit, AfterViewInit {

  fecha = new Date();


  @ViewChild('formFiltros') formFiltros: NgForm;

  public lCalificacion: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;

  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvvectorprecios', 'VECTORPRECIOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {



    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }
    else {
      super.crearNuevo();

      this.registro.cinversion = this.mcampos.cinversion;

      this.registro.codigotitulo = this.mcampos.codigotitulo;

      this.actualizarDatos();

      this.registro.optlock = 0;


    }
  }

  actualizarDatos()
  {

    if (!this.estaVacio(this.registro.mdatos.nfvaloracion))
    {

      try
      {
        this.registro.fvaloracion = (this.registro.mdatos.nfvaloracion.getFullYear() * 10000) + ((this.registro.mdatos.nfvaloracion.getMonth() + 1) * 100) + this.registro.mdatos.nfvaloracion.getDate();
      }
      catch (ex) {
        let anio: number = Number(this.registro.mdatos.nfvaloracion.substring(0, 4));
        let mes: number = Number(this.registro.mdatos.nfvaloracion.substring(5, 7));
        let dia: number = Number(this.registro.mdatos.nfvaloracion.substring(8, 10));
        this.registro.fvaloracion = (anio * 10000) + (mes * 100) + dia;
      }
    }
    
    if (!this.estaVacio(this.registro.calificacionriesgocdetalle))
    {
      this.registro.calificacionriesgoccatalogo = 1207;
    }
    else
    {
      this.registro.calificacionriesgoccatalogo = null;
    }

    if (this.estaVacio(this.registro.tasainterescuponvigente)) this.registro.tasainterescuponvigente = null;
    if (this.estaVacio(this.registro.tasareferencia)) this.registro.tasareferencia = null;
    if (this.estaVacio(this.registro.margen)) this.registro.margen = null;
    if (this.estaVacio(this.registro.tasadescuento)) this.registro.tasadescuento = null;
    if (this.estaVacio(this.registro.rendimientoequivalente)) this.registro.rendimientoequivalente = null;

    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

/*
      ,[porcentajeprecio]
*/


  }

  validarCabecera(): string {

    let lmensaje: string = "";

    if (this.estaVacio(this.mcampos.cinversion)) {
      lmensaje = "DEBE ESCOGER UNA INVERSIÓN";
    }

    return lmensaje;
  }

  actualizar() {

    this.actualizarDatos();

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

    //this.registro.mdatos.nfvaloracion = registro.mdatos.nfvaloracion;

    //this.registro.mdatos.nfvaloracion = this.fecha;

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    if (this.estaVacio(this.validarCabecera())) {
      this.crearDtoConsulta();
      super.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.cinversion = this.mcampos.cinversion;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fvaloracion desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select cast(str(a.fvaloracion,8) as date) from tinvvectorprecios a where a.cinvvectorprecios = t.cinvvectorprecios', 'nfvaloracion');

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

    const mfiltrosrubro = { 'ccatalogo': 1207 };
    const consRubro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosrubro, {});
    consRubro.cantidad = 1000;
    this.addConsultaPorAlias('RUBRO', consRubro);


    this.ejecutarConsultaCatalogos();
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lCalificacion, resp.RUBRO, 'cdetalle');

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
    return super.validaFiltrosRequeridos();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA SELECCIONADO LAS OPCIONES DE CABECERA";
    }

    if (!this.estaVacio(lmensaje)) {
      this.mostrarMensajeError(lmensaje);
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  mostrarLovInversiones(): void {

    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = 'FIJA';

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
