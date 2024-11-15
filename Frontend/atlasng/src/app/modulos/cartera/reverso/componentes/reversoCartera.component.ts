import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';

import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../lov/operacion/componentes/lov.operacionCartera.component';
import { LovTransaccionesComponent } from '../../../generales/lov/transacciones/componentes/lov.transacciones.component';


@Component({
  selector: 'app-reverso',
  templateUrl: 'reverso.html'
})
export class ReversoCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'TcarOperacionTransaccion', 'MOVIMIENTO', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.mfiltros.coperacion === undefined) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    this.rqConsulta.CODIGOCONSULTA = 'REVERSOCARTERA';

    const consulta = new Consulta(this.entityBean, 'Y', 'freal', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.setCantidad(50);
    this.addConsulta(consulta);
    super.consultar();
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
    const lregistrosaux = [...this.lregistros];
    lregistrosaux.splice(this.lregistros.indexOf(this.registroSeleccionado), 1);
    this.lregistros = lregistrosaux;
  }


  reversar(registro: any) {
    this.confirmationService.confirm({
      message: 'Está seguro que desea reversar el movimiento. ?',
      header: 'Confirmación',
      accept: () => {
        this.rqMantenimiento.reverso = 'Y';
        this.rqMantenimiento.mensajereverso = registro.mensaje;
        super.grabar();
      }
    });
  }

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.mostrarlovoperacion();
    }
  }

  /**Muestra lov de operaciones */
  mostrarlovoperacion(): void {
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.consultar();
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operaciones. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacion = reg.registro.coperacion;
      this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    }
  }

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.mfiltrosesp.ruta = 'is not null'
    this.lovtransacciones.showDialog(7);
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nmodulo = reg.registro.mdatos.nmodulo;
      this.mcampos.ntransaccion = reg.registro.nombre;
      this.mfiltros.cmodulo = reg.registro.cmodulo;
      this.mfiltros.ctransaccion = reg.registro.ctransaccion;
    }
  }

}
