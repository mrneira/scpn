import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { LovTransaccionesComponent } from '../../../../generales/lov/transacciones/componentes/lov.transacciones.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-movimientos-contables',
  templateUrl: 'movimientosContables.html'
})
export class MovimientosContablesCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  public lmovimientos: any = [];
  public mostrarDialogoMovContable = false;
  public mensaje = '';
  public sumadebitos = 0;
  public sumacreditos = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionTransaccion', 'MOVIMIENTO', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }


  crearNuevo() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    if (this.estaVacio(this.mcampos.fcontable)) {
      super.mostrarMensajeError('FECHA CONTABLE REQUERIDA');
      return;
    }
    this.mfiltros.fcontable = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.mdatos.fechacontable = this.mfiltros.fcontable;
    this.rqConsulta.CODIGOCONSULTA = 'REVERSOCARTERA';

    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.setCantidad(50);
    this.addConsulta(consulta);
    super.consultar();
  }

  consultaMovimientos(registro: any) {
    this.rqConsulta.mensajeaconsultar = registro.mensaje;
    this.mcampos.mensaje = registro.mensaje;

    this.rqConsulta.CODIGOCONSULTA = 'MOVIMIENTOSCONTABLESCARTERA';
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.rqConsulta.CODIGOCONSULTA === 'MOVIMIENTOSCONTABLESCARTERA') {
      this.lmovimientos = resp.MOVIMIENTOS;
      this.mostrarDialogoMovContable = true;

      this.sumadebitos = 0;
      this.sumacreditos = 0;
      for (const i in this.lmovimientos) {
        if (this.lmovimientos.hasOwnProperty(i)) {
          const item = this.lmovimientos[i];
          if (!this.estaVacio(item.debito)) {
            this.sumadebitos += item.debito;
          } else if (!this.estaVacio(item.credito)) {
            this.sumacreditos += item.credito;
          }

        }
      }
    } else {
      super.postQueryEntityBean(resp);
    }
  }

  imprimir(registro: any) {
    this.descargarReporte();
  }

  cerrarDialogoMovContable() {
    this.mostrarDialogoMovContable = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones */
  mostrarlovoperacion(): void {
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }


  /**Retorno de lov de operaciones. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacion = reg.registro.coperacion;
      this.mensaje = reg.registro.mensaje;

      this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    }
  }

  descargarReporte(): void {
    // Agregar parametros
    this.jasper.parametros['@i_coperacion'] = this.mfiltros.coperacion;
    this.jasper.parametros['@i_mensaje'] = this.mensaje;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaOperacionMovimientosContables';

    this.jasper.generaReporteCore();
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
      this.mfiltros.mensaje = reg.registro.mensaje;
    }
  }

}
