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
  templateUrl: 'consultaDesembolsoCartera.html'
})
export class ConsultaDesembolsoCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmovimientos: any = [];
  public mostrarDialogoMovContable = false;
  public total = 0;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild('tblapagos')
  public jasper2: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcaroperacion', 'OPERACIONDESEMBOLSO', true, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.mcampos.finicio = new Date();
    this.mcampos.ffin = new Date();
    this.mcampos.coperaciondatos = '';
    this.consultar();
  }

  ngAfterViewInit() {
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
    //OPERACIONES CON FECHA DE PAGO EN DESEMBOLSO
    this.mfiltrosesp.coperacion  ="in (SELECT coperacion FROM tcaroperaciondesembolso WHERE fpago between " + lfechainicial + " and " + lfechafinal + ") ";
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgensucursal', 'nombre', 'nsucursal', 'i.csucursal = t.csucursal');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('TcarEstadoOperacion', 'nombre', 'nestadooperacion', 'i.cestadooperacion = t.cestadooperacion');
    this.addConsulta(consulta);
    super.consultar();
  }

  imprimir(registro: any) {
    this.mcampos.coperaciondatos = registro.coperacion;
    this.jasper2.parametros['@i_coperacion'] = this.mcampos.coperaciondatos;
    this.jasper2.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
    this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaDesembolso';
    this.jasper2.formatoexportar = 'pdf';
    this.jasper2.generaReporteCore();
  }

  imprimir2() {
    if (this.lregistros.length <= 0) {
      super.mostrarMensajeWarn("NO EXISTEN REGISTROS PARA FECHAS ASIGNADAS");

      return;
    }

    if (this.mcampos.finicio.toJSON() <= this.mcampos.ffin.toJSON()) {
      this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
      this.jasper.parametros['@i_FIni'] = this.fechaToInteger(this.mcampos.finicio);
      this.jasper.parametros['@i_FFin'] = this.fechaToInteger(this.mcampos.ffin);
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoDesembolsoDetalle';
      this.jasper.formatoexportar = 'xls';
      this.jasper.generaReporteCore();
      this.cerrarDialogoMovContable();
    } else {
      this.mostrarMensajeError("LA FECHA HASTA DEBE SER MAYOR A LA FECHA DESDE.");
    }
  }

  imprimir3() {
    if (this.lregistros.length <= 0) {
      super.mostrarMensajeWarn("NO EXISTEN REGISTROS PARA FECHAS ASIGNADAS");

      return;
    }

    if (this.mcampos.finicio.toJSON() <= this.mcampos.ffin.toJSON()) {
      this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
      this.jasper.parametros['@i_FIni'] = this.fechaToInteger(this.mcampos.finicio);
      this.jasper.parametros['@i_FFin'] = this.fechaToInteger(this.mcampos.ffin);
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoDesembolsoDetalle';
      this.jasper.formatoexportar = 'pdf';
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
    rqConsulta.CODIGOCONSULTA = 'MOVIMIENTOSDESEMBOLSO';

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod === 'OK') {
            this.lmovimientos = resp.MOVIMIENTOSD;
            this.total = 0;
            for (const k in this.lmovimientos) {
              if (this.lmovimientos.hasOwnProperty(k)) {
                const item = this.lmovimientos[k];
                this.total += item.valor;
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
    const lregistrosaux = this.lregistros;
    this.lregistros = [];
    for (const i in lregistrosaux) {
      if (lregistrosaux.hasOwnProperty(i)) {
        const item = lregistrosaux[i];
        item.fapertura = this.integerToFormatoFecha(item.fapertura);
        lregistrosaux.push(item);

      }
    }
    this.lregistros = lregistrosaux;
    super.postQueryEntityBean(resp);
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */

  cerrarDialogoMovContable() {
    this.mostrarDialogoMovContable = false;
  }
  // Fin CONSULTA *********************


}
