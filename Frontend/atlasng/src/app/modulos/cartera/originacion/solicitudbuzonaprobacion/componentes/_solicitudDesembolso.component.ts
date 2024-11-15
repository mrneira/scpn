import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-desembolso',
  templateUrl: '_solicitudDesembolso.html'
})
export class SolicitudDesembolsoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public mostrarDialogoDesembolso = false;
  public mostrarDialogoDesembolsoNuevo = false;
  public msueldo: any = [];
  public checkedsueldo = false;
  public codCatalogoTipoIdentificacion = 303;
  public codCatalogoInstitucion = 305;
  public codCatalogoTipoCuenta = 306;
  public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public consolidado = false;
  public saldo: any;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudDesembolso', 'SOLICITUDDESEMBOLSO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

  }

  ngAfterViewInit() {

  }

  crearNuevo() {
    this.consultaConsolidado();
    if (this.estaVacio(this.saldo) || this.estaVacio(this.consolidado)) {
      return;
    }
    super.crearNuevo();
    this.registro.csolicitud = this.mfiltros.csolicitud;
    this.registro.tipo = 'T';
    this.registro.crubro = 1;
    this.registro.csaldo = this.saldo;
    this.registro.fregistro = this.dtoServicios.mradicacion.fcontable;
    this.registro.tipoidentificacionccatalogo = this.codCatalogoTipoIdentificacion;
    this.registro.tipoinstitucionccatalogo = this.codCatalogoInstitucion;
    this.registro.tipocuentaccatalogo = this.codCatalogoTipoCuenta;
    this.checkedsueldo = false;
    this.registro.transferencia = !this.consolidado;
    this.registro.pagado = false;
    this.registro.comentario="";
    this.mostrarDialogoDesembolsoNuevo = true;

  }
  consultaConsolidado() {
    this.rqConsulta.CODIGOCONSULTA = 'CONSOLIDADO';
    this.rqConsulta.mdatos.csolicitud = this.mfiltros.csolicitud;
    this.rqConsulta.mdatos.operacion = false;
    this.rqConsulta.Ctransaccion = 137;
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
      this.consolidado = resp.consolidado;
      this.saldo = resp.saldo;
    } else {
      super.mostrarMensajeError(resp.msgusu);
    }

  }


  actualizar() {
    this.registro.fregistro = this.dtoServicios.mradicacion.fcontable;
    super.actualizar();
    this.mostrarDialogoDesembolsoNuevo = false;
    this.sumar();
  }

  eliminar() {
    super.eliminar();
    this.mostrarDialogoDesembolsoNuevo = false;
    this.sumar();
  }

  cancelar() {
    super.cancelar();
    this.mostrarDialogoDesembolsoNuevo = false;
    this.sumar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoDesembolsoNuevo = true;
    this.checkedsueldo = registro.cuentacliente;
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.csolicitud)) {
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    this.rqConsulta.CODIGOCONSULTA = 'DATOSAPROBACION';
    this.rqConsulta.mdatos.csolicitud = this.mfiltros.csolicitud;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    this.manejaRespuestaDatosAprobacion(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    if (this.mcampos.diferencia !== 0) {
      this.mostrarMensajeError('EXISTE DIFERENCIA EN LOS VALORES DE DESEMBOLSO [' + this.mcampos.diferencia + ']');
      return;
    }

    //this.validaRegistros();
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      super.encerarMensajes();
      this.mostrarDialogoDesembolso = false;
    }
  }
  // Fin MANTENIMIENTO *********************

  manejaRespuestaDatosAprobacion(respuesta: any) {
    if (respuesta.cod === 'OK') {
      const msaldo = respuesta.SALDOAPROBACION[0];
      this.mcampos.montodesembolsar = super.redondear(Number(msaldo.montodesembolsar), 2);
      this.mcampos.descuento = super.redondear(Number(msaldo.descuento), 2);
      this.mcampos.montoabsorcion = super.redondear(Number(msaldo.montoabsorcion), 2);
      this.mcampos.montoreincorporado = super.redondear(Number(msaldo.montoreincorporado), 2);
      this.mcampos.montoanticipo = super.redondear(Number(msaldo.montoanticipo), 2);
      this.mcampos.monto = super.redondear(Number(msaldo.monto), 2);
      this.consolidado = respuesta.consolidado;

      if (!this.estaVacio(respuesta.REFERENCIABANCARIA)) {
        this.msueldo = respuesta.REFERENCIABANCARIA[0];
      }

      this.msgs = [];
      this.encerarConsulta();
      this.rqConsulta.CODIGOCONSULTA = null;
      const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ninstitucion', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
      consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
      this.addConsultaPorAlias(this.alias, consulta);

      this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
          resp => {
            this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
            if (resp.cod === 'OK') {
              this.postQueryEntityBean(resp);
              this.sumar();
            }
          },
          error => {
            this.dtoServicios.manejoError(error);
          });
    }
    this.lconsulta = [];
  }

  marcarCuenta(value: boolean): void {
    this.checkedsueldo = value;
    if (value) {
      if (!this.estaVacio(this.msueldo)) {
        this.registro.tipoidentificacioncdetalle = this.mcampos.tipoidentificacion;
        this.registro.identificacionbeneficiario = this.mcampos.identificacion;
        this.registro.nombrebeneficiario = this.mcampos.npersona;
        this.registro.tipoinstitucioncdetalle = this.msueldo.tipoinstitucioncdetalle;
        this.registro.tipocuentacdetalle = this.msueldo.tipocuentacdetalle;
        this.registro.numerocuentabancaria = this.msueldo.numero;
        super.registrarEtiqueta(this.registro, this.lbancos, "tipoinstitucioncdetalle", "ninstitucion");
        super.registrarEtiqueta(this.registro, this.ltipocuenta, "tipocuentacdetalle", "ntipocuenta");
      } else {
        super.mostrarMensajeError('SOCIO NO REGISTRA INFORMACIÓN DE CUENTA');
        return;
      }
    } else {
      super.encerarMensajes();
      this.registro.tipoidentificacioncdetalle = null;
      this.registro.identificacionbeneficiario = null;
      this.registro.nombrebeneficiario = null;
      this.registro.tipoinstitucioncdetalle = null;
      this.registro.tipocuentacdetalle = null;
      this.registro.numerocuentabancaria = "";
    }
    this.registro.cuentacliente = this.checkedsueldo;
  }

  validaRegistros() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.actualizar = true;
        super.selectRegistro(reg);
        this.actualizar();
      }
    }
  }

  sumar() {
    this.mcampos.montospi = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (!this.estaVacio(reg.valor)) {
          this.mcampos.montospi = this.mcampos.montospi + reg.valor;
        }
      }
    }

  }

  calculaDiferencia() {
    const montodiferencia = super.redondear(Number(super.redondear(Number(this.mcampos.montodesembolsar), 2) - super.redondear(Number(this.mcampos.montospi), 2)), 2);
    this.mcampos.diferencia = montodiferencia;
    return montodiferencia;
  }

  montoTotal(reg: any) {
    this.mcampos.montoprevio = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (!this.estaVacio(reg.valor)) {

          this.mcampos.montoprevio = this.mcampos.montoprevio + reg.valor;
        }
      }
    }
    let montoregistro = this.estaVacio(reg.valor) ? 0 : reg.valor;
    let total = 0;
    total = this.redondear(Number(this.mcampos.montodesembolsar), 2) - this.redondear(this.mcampos.montoprevio, 2) + this.redondear(montoregistro, 2);
    reg.valor = this.redondear(total, 2);
  }

}
