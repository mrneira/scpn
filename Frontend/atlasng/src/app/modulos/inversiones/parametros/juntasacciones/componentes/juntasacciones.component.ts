import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';


@Component({
  selector: 'app-juntasacciones',
  templateUrl: 'juntasacciones.html'
})
export class JuntasaccionesComponent extends BaseComponent implements OnInit, AfterViewInit {


  fecha = new Date();

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lEmisor: SelectItem[] = [{label: '...', value: null}];


  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvjuntaaccionistas', 'JUNTASACCIONES', false, false);
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
    
    this.registro.cinvagentebolsa = this.mcampos.cinvagentebolsa;
    
    this.registro.emisorccatalogo = 1213;
    this.registro.emisorcdetalle = this.mfiltros.emisorcdetalle;
    
    try {
      let lfjunta: number = (this.mcampos.nfjunta.getFullYear() * 10000) + ((this.mcampos.nfjunta.getMonth() + 1) * 100) + this.mcampos.nfjunta.getDate();
      this.registro.fjunta = lfjunta;
    }
    catch (ex) {
      if(this.mcampos.nfjunta!=undefined){
      this.registro.fjunta = Number(this.mcampos.nfjunta.toString().substring(0, 4) +
      this.mcampos.nfjunta.toString().substring(5, 7) +
      this.mcampos.nfjunta.toString().substring(8, 10));
      }
    }
    
    this.registro.fingreso=new Date();
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

    this.registro.porcentajeefectivo = this.mfiltros.pefectivo;
    this.registro.porcentajeacciones = this.mfiltros.pacciones;
    }
  }

  validarCabecera(): string {

    let lmensaje: string = "";

      
      if (this.estaVacio(this.mfiltros.emisorcdetalle)) {
        lmensaje = "DEBE ESCOGER UN EMISOR";
      }
      
    return lmensaje;
  }

  actualizar() {
    this.registro.emisorccatalogo = 1213;
    this.registro.emisorcdetalle = this.mfiltros.emisorcdetalle;

    try {
      let lfjunta: number = (this.mcampos.nfjunta.getFullYear() * 10000) + ((this.mcampos.nfjunta.getMonth() + 1) * 100) + this.mcampos.nfjunta.getDate();
      this.registro.fjunta = lfjunta;
    }
    catch (ex) {
      if(this.registro.fjunta!=undefined){
      this.registro.fjunta = Number(this.mcampos.nfjunta.toString().substring(0, 4) +
      this.mcampos.nfjunta.toString().substring(5, 7) +
      this.mcampos.nfjunta.toString().substring(8, 10));
      }
    }
    this.registro.fmodificacion=new Date();
    this.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
    this.registro.porcentajeefectivo = this.mfiltros.pefectivo;
    this.registro.porcentajeacciones = this.mfiltros.pacciones;
    
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

    const mfiltrosEmisor = {'ccatalogo': 1213};
    const consEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consEmisor.cantidad = 100;
    this.addConsultaPorAlias('Emisor', consEmisor);

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
      this.llenaListaCatalogo(this.lEmisor, resp.Emisor, 'cdetalle'); 
    }
    this.lconsulta = [];
  }


  public crearDtoConsulta(): Consulta {

    this.fijarFiltrosConsulta();
    
    const consulta = new Consulta(this.entityBean, 'Y', 't.emisorcdetalle', this.mfiltros, this.mfiltrosesp);
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nEmisor', ' t.emisorccatalogo=i.ccatalogo and t.emisorcdetalle=i.cdetalle');
     consulta.addSubqueryPorSentencia('select cast(str(a.fjunta,8) as date) from tinvjuntaaccionistas a where a.cinvjuntaaccionistas = t.cinvjuntaaccionistas', 'nfjunta');
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
    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA REALIZADO SELECCIONADO LAS OPCIONES DE CABECERA";
    }

    if (!this.estaVacio(lmensaje)) {
      this.mostrarMensajeError(lmensaje);
      return;
    }
    
    this.lmantenimiento = []; 
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


