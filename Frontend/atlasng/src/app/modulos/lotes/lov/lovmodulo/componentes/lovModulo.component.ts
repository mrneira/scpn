import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-modulo',
  templateUrl: 'lovModulo.html'
})
export class LovModuloComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  public lmodulo: SelectItem[] = [{label: '...', value: null}];
  @Input() modelCombo: any; 
  @Input() disabled: any; 
  @Output() eventoCliente = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'ABSTRACT', 'MODULO', false, false); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
  }

  actualizar() { // Cuando doy confirmar se ejecuta
  }

  eliminar() {
  }

  cancelar() {
  }

  // Inicia CONSULTA *********************
  consultar() {
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
  }

  public postCommit(resp: any) {
  }
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', {}, {});
    consultaModulo.cantidad = 50;
    this.addConsultaCatalogos('MODULO', consultaModulo, this.lmodulo, this.llenarModulo, 'cmodulo', this.componentehijo);
    this.ejecutarConsultaCatalogos();
  }
  public llenarModulo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, true, componentehijo);
    //componentehijo.mfiltros.pk_cmodulo = pLista[0].value;
    // componentehijo.modelCombo = pLista[0].value;
//    componentehijo.eventoCliente.emit({ registro: pLista[0].value });
    if(pLista[0].value !== null){
      componentehijo.seleccionaRegistro(pLista[0].value);
      this.selectLabel(pLista[0].value);
    }
  }
  seleccionaRegistro(evento: any) {
    
    //this.mfiltros.pk_cmodulo = evento;
    if(evento.value !== null){
      this.selectLabel(evento.value);
    }
  }
  selectLabel(value:any){
    const label = this.buscarModulo(value);
    this.eventoCliente.emit({ registro: {value:value, label:label} });
  }
  buscarModulo(idModulo:any):string{
    let valor;
    for(const i in this.lmodulo){
      if(this.lmodulo[i].value === Number(idModulo)){
        valor= this.lmodulo[i].label;
      }
    }
    return valor;
  }
}
