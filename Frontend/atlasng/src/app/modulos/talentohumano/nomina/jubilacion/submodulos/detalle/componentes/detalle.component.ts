import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCapacitacionComponent } from '../../../../../lov/capacitacion/componentes/lov.capacitacion.component';

import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @Output() eventoReferencia = new EventEmitter();
  public registroLiquidacion: any = [];
  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomjubilaciondetalle', 'DETALLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cjubilacion)) {
      this.mostrarMensajeError("ELIJA PRIMERO UNA JUVILACIÓN ");
      return;
    }
    super.crearNuevo();
    this.registro.cjubilacion = this.mcampos.cjubilacion;

    this.registro.ccatalogo = 1163;
    this.registro.fingreso=this.fechaactual;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
  }

  actualizar() {
    super.actualizar();
    this.eventoReferencia.emit();
  }

  eliminar() {
    super.eliminar();
    this.eventoReferencia.emit();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cjubilacion)) {
      this.mostrarMensajeError('ELIJA UNA JUVILACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cjubilacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.ccatalogo and i.cdetalle=t.cdetalle');
   

    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cnomina = this.mcampos.cnomina;

  }
  public diferenciaEntreDiasEnDias() {
    let a = this.registro.finicio;
    let b = this.registro.ffin;
    this.rqConsulta.CODIGOCONSULTA = 'FECHAEMPRESAS_TTH'; 
    this.rqConsulta.mdatos.finicio =this.fechaToInteger(a);
    this.rqConsulta.mdatos.ffin= this.fechaToInteger(b);;
    
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaProducto(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = undefined;

  }


  manejaRespuestaProducto(resp: any) {
    if (resp.cod === 'OK') {
      this.registro.tiempo= resp.total;
    } else {
      super.mostrarMensajeError(resp.msgusu);
    }

  }


  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  seleccionaRegistro(evento: any) {
    this.eventoReferencia.emit({ registro: evento });

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




}
