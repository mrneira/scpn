import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-desembolso',
  templateUrl: '_desembolso.html'
})
export class DesembolsoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public lsueldo: any = [];
  public montospi = 0;
  public checkedsueldo = false;
  public codCatalogoTipoIdentificacion = 303;
  public codCatalogoInstitucion = 305;
  public codCatalogoTipoCuenta = 306;
  public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public consolidado = false;
  public saldo:any;
  public arreglopago = false;
  public statusBtnPago = false;
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
    }else{
    }
    if(this.arreglopago){
      this.statusBtnPago = true;
      super.crearNuevo();
      this.registro.csolicitud = this.mfiltros.csolicitud;
      this.registro.tipo = 'T';
      this.registro.crubro = 1;
      this.registro.csaldo = this.saldo;
      this.registro.fregistro = this.dtoServicios.mradicacion.fcontable;
      this.registro.tipoidentificacionccatalogo = this.codCatalogoTipoIdentificacion;
      this.registro.tipoinstitucionccatalogo = this.codCatalogoInstitucion;
      this.registro.tipocuentaccatalogo = this.codCatalogoTipoCuenta;
      this.registro.transferencia= !this.consolidado;
      this.registro.pagado= false;
      this.registro.comentario="";
      this.registro.valor = 0;
      this.marcarCuenta(true);
      this.actualizar();
    }else{
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
      this.registro.transferencia= !this.consolidado;    
      this.registro.pagado= false;
      this.registro.comentario="";
    }
  }
  consultaConsolidado() {
    this.rqConsulta.CODIGOCONSULTA = 'CONSOLIDADO'; 
    this.rqConsulta.mdatos.csolicitud = this.mfiltros.csolicitud;
    this.rqConsulta.mdatos.operacion= false;
    this.rqConsulta.ctransaccion=137;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ninstitucion', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.csolicitud = this.mcampos.csolicitud;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    if(
      this.arreglopago &&
      resp &&
      resp instanceof Object &&
      resp['SOLICITUDDESEMBOLSO'] &&
      Array.isArray(resp['SOLICITUDDESEMBOLSO']) &&
      (resp['SOLICITUDDESEMBOLSO']).length > 0
    ){
      this.statusBtnPago = true;
    }
    this.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  validaGrabar() {
    if (this.lregistros.length <= 0) {
      super.mostrarMensajeError('SE REQUIERE EL INGRESO DE LA FORMA DE PAGO [DESEMBOLSO]');
      return false;
    }
    return true;
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  marcarCuenta(value: boolean): void {
    this.checkedsueldo = value;
    if (value) {
      if (!this.estaVacio(this.lsueldo) && this.lsueldo.length > 0) {
        this.registro.tipoidentificacioncdetalle = this.mcampos.tipoidentificacion;
        this.registro.identificacionbeneficiario = this.mcampos.identificacion;
        this.registro.nombrebeneficiario = this.mcampos.npersona;
        this.registro.tipoinstitucioncdetalle = this.lsueldo[0].tipoinstitucioncdetalle;
        this.registro.tipocuentacdetalle = this.lsueldo[0].tipocuentacdetalle;
        this.registro.numerocuentabancaria = this.lsueldo[0].numero;
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
}