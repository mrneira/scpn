import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-estadopatrimonio',
  templateUrl: 'estadopatrimonio.html'
})

export class EstadopatrimonioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodocumentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  secuenciaactual: number;
  duplicado = false;

  public lperfiles: SelectItem[] = [{label: '...', value: null}];

  public lestadoscatalogo: SelectItem[] = [{ label: '...', value: null }];
  public lestadoscuenta: SelectItem[] = [{ label: '...', value: null }];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconestadopatrominio', 'EstadoPatrimonio', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
    this.secuenciaactual = this.registro.secuenciaactual;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuentapatrimonio', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalagopatrimonio', 'descripcion', 'nnombre', 'i.ccatalogopatrimonio=t.ccatalogopatrimonio');
    
    consulta.addSubquery('tconcuentapatrimonio', 'ccuenta', 'ncuenta', 'i.ccuentapatrimonio=t.ccuentapatrimonio');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
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

  cerrarDialogo() {
  }


  consultarCatalogos(): void {
  

    this.encerarConsultaCatalogos();
    const consultacuentas = new Consulta('tconcuentapatrimonio', 'Y', 't.ccuentapatrimonio', {}, {});
    consultacuentas.cantidad = 500;
    this.addConsultaCatalogos('CUENTAPATRIMONIO', consultacuentas, this.lestadoscuenta, this.llenarCuenta, '', this.componentehijo);
    
    const consultaCatalogos = new Consulta('tconcatalagopatrimonio', 'Y', 't.descripcion', {}, {});
    consultaCatalogos.cantidad = 500;
    this.addConsultaCatalogos('CATALOGOPATRIMONIO', consultaCatalogos, this.lestadoscatalogo, this.llenarCatalogo, '', this.componentehijo);
    
    
    this.ejecutarConsultaCatalogos();
  }

  public llenarCuenta(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.lestadoscuenta.push({ label: reg.ccuenta, value: reg.ccuentapatrimonio });
      
    }
  }

  public llenarCatalogo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.lestadoscatalogo.push({ label: reg.descripcion, value: reg.ccatalogopatrimonio });
      
    }
  }

}
