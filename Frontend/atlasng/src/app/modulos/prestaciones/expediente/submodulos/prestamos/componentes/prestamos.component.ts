import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-prestamos',
  templateUrl: 'prestamos.html'
})
export class PrestamosComponent extends BaseComponent implements OnInit, AfterViewInit {

  totalmonto = 0;
  totalvencido = 0;
  nsaldo = 0;
  public OPERACIONESGARANTE: any;
  hipotecario = false;

  @Output() eventoCliente = new EventEmitter();

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'PRESTAMOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************

  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mcampos.montopago = registro.valorpagominimo;
    this.mcampos.comentario = "";
  }

  cancelar() {
    super.cancelar();
  }

  actualizar() {
    this.registro.pagototal = false;
    this.registro.pagoextraordinario = false;
    if (this.mcampos.montopago < this.registro.valorpagominimo) {
      this.mostrarMensajeError("EL VALOR A PAGAR NO PUEDE SER MENOR QUE: " + this.registro.valorpagominimo.toLocaleString('es'));
      return;
    }
    if (this.mcampos.montopago > this.registro.saldo) {
      this.mostrarMensajeError("EL VALOR A PAGAR NO PUEDE SER MAYOR QUE: " + this.registro.saldo.toLocaleString('es'));
      return;
    }

    if (this.mcampos.montopago === this.registro.saldo) {
      this.registro.pagototal = true;
    } else {
      if (this.mcampos.montopago >= this.registro.valorextraordinario) {
        this.registro.pagoextraordinario = true;
      }
    }

    super.actualizar();
    this.liquidar();
  }

  public crearDtoConsulta() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 204;
    this.rqConsulta.CODIGOCONSULTA = 'EXPEDIENTEPRESTAMOS';
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            super.postQueryEntityBean(resp);
            this.OPERACIONESGARANTE = resp.OPERACIONESGARANTE;
            this.obtenertotal();
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {

  }
  // Fin CONSULTA *********************
  public obtenertotal(): number {
    let valor = 0;
    let vencido = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        valor += this.lregistros[i].saldo;
        vencido += this.lregistros[i].valorvencido;
      }
    }
    this.totalmonto = valor;
    this.totalvencido = vencido;
    return valor
  }

  public limpiar() {
    this.lregistros = [];
    this.OPERACIONESGARANTE = [];
  }


  public liquidar() {
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = 37;
    this.rqMantenimiento.cpersona = this.mfiltros.cpersona;
    this.rqMantenimiento.monto = this.mcampos.montopago;
    this.rqMantenimiento.coperacion = this.registro.coperacion;
    this.rqMantenimiento.comentario = this.mcampos.comentario;
    this.rqMantenimiento.mdatos.pagototal = this.registro.pagototal;
    this.rqMantenimiento.mdatos.pagoextraordinario = this.registro.pagoextraordinario
    this.rqMantenimiento.mdatos.cjerarquia = this.mcampos.cjerarquia;
    this.encerarMensajes();
    // super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
    // super.grabar();
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        this.enproceso = false;
        this.grabo = true;
        if (resp.cod === 'OK') {
          this.eventoCliente.emit({ registro: this.mcampos.bandeja, error: false });
        } else {
          this.eventoCliente.emit({ registro: this.mcampos.bandeja, error: true });
        }

      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
      // finalizacion
    );


  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

  }

  descargaReporte(registro: any) {
    this.jasper.parametros['@i_coperacion'] = this.registro.coperacion;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDocumentoAutorizacionAceptacionDescuentosIsspol';
    this.jasper.formatoexportar = 'pdf';
    this.jasper.generaReporteCore();
  }

  descargaReporteHipotecario(registro: any) {
    this.jasper.parametros['@i_coperacion'] = this.registro.coperacion;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDocumentoAutorizacionPrestamoHipotecario';
    this.jasper.formatoexportar = 'pdf';
    this.jasper.generaReporteCore();
  }


}
