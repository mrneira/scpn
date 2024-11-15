import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-vectorprecios',
  templateUrl: 'vectorprecios.html'
})
export class VectorpreciosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lCalificacion: SelectItem[] = [{label: '...', value: null}];
  fecha = new Date();

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvvectorprecios', 'VECTORPRECIOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    
    this.consultarCatalogos();
    //this.consultar();
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
   
    this.registro.optlock=0;
    let lfvaloracion: number = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();
    this.registro.fvaloracion = lfvaloracion;

    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso=new Date();    
    this.registro.calificacionriesgoccatalogo=1207;

    }
  }

  validarCabecera(): string {

    let lmensaje: string = "";
      
    return lmensaje;
  }

  actualizar() {
    let lfvaloracion: number = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();
    this.registro.fvaloracion = lfvaloracion;
    this.registro.cinversion=this.mcampos.cinversion;
    this.registro.codigotitulo=this.mcampos.codigotitulo;
   
    
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
  llenarConsultaCatalogos(): void {

    const mfiltrosCalificacion = {'ccatalogo': 1207};
    const consCalificacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCalificacion, {});
    consCalificacion.cantidad = 100;
    this.addConsultaPorAlias('Calificacion', consCalificacion);

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

   /**Manejo respuesta de consulta de catalogos. */
   private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lCalificacion, resp.Calificacion, 'cdetalle'); 
    }
    this.lconsulta = [];
  }


  public crearDtoConsulta(): Consulta {

    this.fijarFiltrosConsulta();
    
    let lfvaloracion: number = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();
    this.mfiltros.fvaloracion = lfvaloracion;

    const consulta = new Consulta(this.entityBean, 'Y', 't.calificacionriesgocdetalle', this.mfiltros, this.mfiltrosesp);
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nCalificacion', ' t.calificacionriesgoccatalogo=i.ccatalogo and t.calificacionriesgocdetalle=i.cdetalle');
     consulta.addSubqueryPorSentencia('select cast(str(a.fvaloracion,8) as date) from tinvvectorprecios a where a.cinvvectorprecios = t.cinvvectorprecios', 'nfvaloracion');
    this.addConsulta(consulta);
    return consulta;
  }

  mostrarLovInversiones(): void {
    
    this.lovInversiones.pEliminarContabilidadAnulada = true;
    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "FIJA";
    this.lovInversiones.showDialog();
  }

    // fijar lov inversiones
    fijarLovInversionesSelec(reg: any): void {
      if (reg.registro !== undefined) {
        this.msgs = [];
        this.mcampos.cinversion = reg.registro.cinversion;
        this.mcampos.codigotitulo = reg.registro.codigotitulo;
        this.registro.cinversion=this.mcampos.cinversion;
        this.registro.codigotitulo=this.mcampos.codigotitulo;
        this.consultar();
      }
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
    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA REALIZADO SELECCIONADO LAS OPCIONES DE CABECERA";
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

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return true;

  }

}


