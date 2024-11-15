import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-desembolsos-cartera',
  templateUrl: 'consultaCancelacionCartera.html'
})
export class ConsultaCancelacionCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmovimientos: any = [];
  public mostrarDialogoMovContable = false;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild('tblapagos')
  public jasper2: JasperComponent;


  public fapertura: string;

  public total = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcaroperaciontransaccion', 'MOVIMIENTOSCANCELACION', true, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.mcampos.finicio = new Date();
    this.mcampos.ffin = new Date();
    this.mcampos.coperaciondatos = '';
    this.mcampos.imprimirdetalle = 0;
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para el padre
  }

  consultar() {
    if (this.estaVacio(this.mcampos.finicio)) {
      super.mostrarMensajeError('FECHA INICIO REQUERIDA');
      return;
    }
    if (this.estaVacio(this.mcampos.ffin)) {
      super.mostrarMensajeError('FECHA FIN REQUERIDA');
      return;
    }

    let lfechainicial: number = (this.mcampos.finicio.getFullYear() * 10000) + ((this.mcampos.finicio.getMonth() + 1) * 100) + this.mcampos.finicio.getDate();
    let lfechafinal: number = (this.mcampos.ffin.getFullYear() * 10000) + ((this.mcampos.ffin.getMonth() + 1) * 100) + this.mcampos.ffin.getDate();
    this.mfiltrosesp.fcontable = 'between ' + lfechainicial + ' and ' + lfechafinal + ' ';
    this.mfiltrosesp.ctransaccion = 'in (select cdetalle from tgencatalogodetalle where ccatalogo = 702)';
    this.mfiltros.reverso = 'N';

    const consulta = new Consulta(this.entityBean, 'Y', 'fcontable', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgentransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');

    this.addConsulta(consulta);
    super.consultar();
  }

  public postCommit(resp: any, dtoext = null) {
    if (resp.hasOwnProperty('reg.fcontable')) {
      this.fapertura = super.integerToFormatoFecha(resp.fapertura);
    }
    super.postCommitEntityBean(resp, dtoext);
  }

  descargarReporteTablaPagos(): void {
    this.mcampos.imprimirdetalle = 1;
  }


  imprimir(registro: any) {
    this.mcampos.coperaciondatos = registro.coperacion;
    this.mcampos.mensaje = registro.mensaje;

    this.jasper2.parametros['@i_coperacion'] = this.mcampos.coperaciondatos;
    this.jasper2.parametros['@i_mensaje'] = this.mcampos.mensaje;
    this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaOperacionCancelacion';
    this.jasper2.formatoexportar = 'pdf';
    this.jasper2.generaReporteCore();
  }

  imprimir2() {
    if (this.lregistros.length <= 0) {
      super.mostrarMensajeWarn("NO EXISTEN REGISTROS PARA FECHAS ASIGNADAS");
      return;
    }
    // tslint:disable-next-line:label-position
    if (this.mcampos.finicio.toJSON() <= this.mcampos.ffin.toJSON()) {

      this.jasper.parametros['@i_FIni'] = this.fechaToInteger(this.mcampos.finicio);
      this.jasper.parametros['@i_FFin'] = this.fechaToInteger(this.mcampos.ffin);
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoCancelacion';
      this.jasper.formatoexportar = 'xls';
      this.jasper.generaReporteCore();
      this.cerrarDialogoMovContable();
    } else {
      this.mostrarMensajeError("LA FECHA HASTA DEBE SER MAYOR A LA FECHA DESDE.");
    }
  }

  consultaMovimientos(registro: any) {
    const rqConsulta: any = new Object();
    rqConsulta.coperacion = registro.coperacion;
    rqConsulta.mensajeaconsultar = registro.mensaje;
    rqConsulta.CODIGOCONSULTA = 'MOVIMIENTOSCANCELACION';

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod === 'OK') {
            this.lmovimientos = resp.MOVIMIENTOS;
            this.total = 0;
            for (const k in this.lmovimientos) {
              if (this.lmovimientos.hasOwnProperty(k)) {
                const item = this.lmovimientos[k];
                this.total += item.monto;
              }
            }
            this.mostrarDialogoMovContable = true;
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  cerrarDialogoMovContable() {
    this.mostrarDialogoMovContable = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }


}
