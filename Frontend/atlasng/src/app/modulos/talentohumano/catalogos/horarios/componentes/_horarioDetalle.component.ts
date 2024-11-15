import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-horario-detalle',
  templateUrl: '_horarioDetalle.html'
})
export class HorarioDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {
  public ldias: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthhorariodetalle', 'HORARIODETALLE', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mfiltros.chorario === undefined || this.mfiltros.chorario === null) {
      this.mostrarMensajeError('SELECCIONE UN HORARIO PADRE');
      return;
    }
    super.crearNuevo();
    this.registro.chorario = this.mfiltros.chorario;
    this.registro.diaccatalogo = 5;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.chorariodetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ndia', 'i.ccatalogo = t.diaccatalogo and i.cdetalle = t.diacdetalle');

    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if (this.mfiltros.chorario === undefined) {
      this.mostrarMensajeError('HORARIO REQUERIDO');
      return false;
    }
    return true;
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

  public consultarCatalogoDetalle(pLista: any, chorario: number, agregaRegistroVacio: boolean): any {
    while (pLista.length > 0) {
      pLista.pop();
    }
    if (this.estaVacio(chorario)) {
      return;
    }

    this.mfiltros.chorario = chorario;
    this.crearDtoConsulta();
    const rq = this.getRequestConsulta('C');
    return this.dtoServicios.ejecutarConsultaRest(rq).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          if (agregaRegistroVacio) {
            pLista.push({ label: '...', value: '-1' });
          }
          const lista = resp[this.alias];
          for (let i in lista) {
            let reg = lista[i];
            pLista.push({ label: reg.nombre, value: reg.secuencia });
          }
        } else {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        }
      }, error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }
  public cfingreso() {
    this.registro.ijornadaint = Number(this.registro.ijornada.replace(/:/g, ""));
    if(this.registro.ijornadaint>2359){
      this.registro.ijornadaint=2359;
      this.registro.ijornada=this.horaMaxDia;
    }
  }
  public cfsalidaa() {
     this.registro.ialmuerzoint = Number(this.registro.ialmuerzo.replace(/:/g, ""));
     if(this.registro.ialmuerzoint>2359){
      this.registro.ialmuerzoint=2359;
      this.registro.ialmuerzo=this.horaMaxDia;
    }
  }
  public cfingresoa() {
    this.registro.falmuerzoint = Number(this.registro.falmuerzo.replace(/:/g, ""));
    if(this.registro.falmuerzoint>2359){
      this.registro.falmuerzoint=2359;
      this.registro.falmuerzo=this.horaMaxDia;
    }
  }
  public cfsalida() {
    this.registro.fjornadaint = Number(this.registro.fjornada.replace(/:/g, ""));
    if(this.registro.fjornadaint>2359){
      this.registro.fjornadaint=2359;
      this.registro.fjornada=this.horaMaxDia;
    }
  }


  public formatoHora($event: any, num: number): void {
    var temp = new Date($event);
    var hours = ("0" + temp.getHours()).slice(-2);
    var minutes = ("0" + temp.getMinutes()).slice(-2);
    var res = [hours, minutes].join(":");
    var tot = hours + "" + minutes;


    switch (num) {
      case 1: {
        this.registro.ijornada = res;
        this.registro.ijornadaint = Number(tot);
        break;
      }
      case 2: {
        this.registro.ialmuerzo = res;
        this.registro.ialmuerzoint = Number(tot);
        break;
      }
      case 3: {
        this.registro.falmuerzo = res;
        this.registro.falmuerzoint = Number(tot);
        break;
      }
      case 4: {
        this.registro.fjornada = res;
        this.registro.fjornadaint = Number(tot);
        break;
      }


    }
  }
}
