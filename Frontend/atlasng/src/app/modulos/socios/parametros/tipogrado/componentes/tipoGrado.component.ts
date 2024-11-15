import {Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'; 
import {Router } from '@angular/router'; 
import {NgForm } from '@angular/forms'; 
import {DtoServicios } from '../../../../../util/servicios/dto.servicios'; 
import {Consulta } from '../../../../../util/dto/dto.component'; 
import {Mantenimiento } from '../../../../../util/dto/dto.component'; 
import {BaseComponent } from '../../../../../util/shared/componentes/base.component'; 
import {CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component'; 
import {SelectItem } from 'primeng/primeng'; 

@Component( {
  selector:'app-tipo-grado', 
  templateUrl:'tipoGrado.html'
})
export class TipoGradoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros')formFiltros:NgForm; 
  public lestado:SelectItem[] = [ {label:'...', value:null}]; 

  private CATALOGO_JERARQUIA = 2701;
  private catalogoDetalle:CatalogoDetalleComponent; 
  public ljerarquia:SelectItem[] = [ {label:'...', value:null}]; 


  constructor(router:Router, dtoServicios:DtoServicios) {
    super(router, dtoServicios, 'TsocTipoGrado', 'TSOCTIPOGRADO', false, false); 
    this.componentehijo = this; 
  }

  ngOnInit() {
    super.init(this.formFiltros); 
    this.consultarCatalogos(); 
    //this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mfiltros.cdetallejerarquia === undefined || this.mfiltros.cdetallejerarquia === null) {
      super.mostrarMensajeError("FILTROS DE CONSULTA REQUERIDOS");
      return;
    }

    super.crearNuevo(); 
    this.registro.ccatalogojerarquia = this.CATALOGO_JERARQUIA;
    this.registro.cdetallejerarquia = this.mfiltros.cdetallejerarquia;
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

  public selectRegistro(registro:any) {
    super.selectRegistro(registro); 
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta(); 
    super.consultar(); 
  }


  private fijarFiltrosConsulta() {
   // this.mfiltros.verreg = 0;
    this.mfiltros.ccatalogojerarquia = this.CATALOGO_JERARQUIA; 

  }

  public crearDtoConsulta():Consulta {
    this.fijarFiltrosConsulta(); 
    const consulta = new Consulta(this.entityBean, 'Y', 't.cgrado', this.mfiltros, this.mfiltrosesp); 
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'njerarquia', 'i.ccatalogo = t.ccatalogojerarquia and i.cdetalle = t.cdetallejerarquia'); 
    consulta.cantidad = 50; 
    this.addConsulta(consulta); 
    return consulta; 
  }

  validaFiltrosConsulta():boolean {
    return super.validaFiltrosConsulta(); 
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp:any) {
    super.postQueryEntityBean(resp); 
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar():void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento(); 
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar(); 
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1); 
    super.addMantenimientoPorAlias(this.alias, mantenimiento); 
  }

  public postCommit(resp:any) {
    super.postCommitEntityBean(resp); 
  }

  consultarCatalogos():void {
    this.encerarConsultaCatalogos(); 
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios); 

    this.catalogoDetalle.mfiltros.ccatalogo = this.CATALOGO_JERARQUIA; 
    const conJerarquia = this.catalogoDetalle.crearDtoConsulta(); 
    this.addConsultaCatalogos("TGENJERARQUIAS", conJerarquia, this.ljerarquia, super.llenaListaCatalogo, 'cdetalle'); 
    this.catalogoDetalle.mfiltrosesp.cdetalle = null; 

    this.ejecutarConsultaCatalogos(); 
  }

  mostrar(event: any): any {
    if (this.mfiltros.cdetallejerarquia === undefined || this.mfiltros.cdetallejerarquia === null) {
      return;
    }
    this.consultar();
  }

}
