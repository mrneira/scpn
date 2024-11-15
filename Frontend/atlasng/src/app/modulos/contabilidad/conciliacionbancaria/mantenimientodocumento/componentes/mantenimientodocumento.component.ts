import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCuentasContablesComponent } from "../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component";


@Component({
  selector: 'app-mantenimientodocumento',
  templateUrl: 'mantenimientodocumento.html'
})
export class MantenimientodocumentoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lingreso: SelectItem[] = [{ label: '...', value: null }];
  public ccuenta: string;
  public ncuenta: string;
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public documentob: boolean;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconlibrobancos', 'BANCOSDOCUMENTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mfiltros.cmodulo = sessionStorage.getItem("m");
    this.documentob=true;
    this.mcampos.finicio = new Date();
    this.mcampos.ffin = new Date();

    this.consultar();  // para ejecutar consultas automaticas.
   
  }



  ngAfterViewInit() {
  }
  validaFiltrosConsulta(): boolean {
    return true;
  }
  crearNuevo() {


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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.clibrobanco', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgentransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion=t.ctransaccion and i.cmodulo=t.cmodulo');
    consulta.addSubquery('tconcomprobante', 'comentario', 'ncomentario', 'i.ccomprobante=t.ccomprobante');
    consulta.addSubquery('tconbanco', 'nombre', 'nbanco', 'i.ccuentabanco=t.cuentabanco');
    consulta.cantidad = 5000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    
    if(this.documentob){
      this.mfiltrosesp.documento = 'is null';
      }
    if(!this.documentob && this.estaVacio(this.mfiltros.documento)){
        this.mfiltrosesp.documento = 'is not null';
      }

      if(!this.documentob && !this.estaVacio(this.mfiltros.documento)){
        this.mfiltrosesp.documento = '= ' + this.mfiltros.documento;
      }
      if (this.estaVacio(this.mcampos.finicio)) {
        super.mostrarMensajeError('FECHA INICIO REQUERIDA');
        return;
      }
      if (this.estaVacio(this.mcampos.ffin)) {
        super.mostrarMensajeError('FECHA FIN REQUERIDA');
        return;
      }

      this.mfiltrosesp.fcontable = 'between ' + this.fechaToInteger(this.mcampos.finicio) + ' and ' +  this.fechaToInteger(this.mcampos.ffin) + ' ';
  
  }



  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

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

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if(resp.cod==='OK')
    this.recargar();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
  }

}
