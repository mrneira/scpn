import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { RadioButtonModule, SelectItem } from 'primeng/primeng';
import { DocumentoDirective } from '../../../../../util/directivas/documento.directive';

@Component({
  selector: 'app-desembolso-transferencia',
  templateUrl: '_desembolsoTransferencia.html'
})
export class DesembolsoTransferenciaComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public lsueldo: any = [];
  public montospi = 0;
  public checkedsueldo = false;
  public codCatalogoInstitucion = 305;
  public codCatalogoTipoCuenta = 306;
  public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];
  public codCatalogoTipoIdentificacion = 303;
  public consolidado=false;
  public saldo:any;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionDesembolso', 'TRANSFERENCIA', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
    
  }

  ngAfterViewInit() {
   
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError('OPERACION ES REQUERIDA');
      return;
    }
    this.consultaConsolidado();
    if (this.estaVacio(this.saldo) || this.estaVacio(this.consolidado)) {
      return;
    }
    super.crearNuevo();
    this.registro.coperacion = this.mfiltros.coperacion;
    this.registro.tipo = 'T';
    this.registro.crubro = 1;
    this.registro.csaldo=this.saldo;
    this.registro.tipoinstitucionccatalogo = this.codCatalogoInstitucion;
    this.registro.tipocuentaccatalogo = this.codCatalogoTipoCuenta;
    this.registro.transferencia=!this.consolidado;
    this.registro.pagado= false;
    this.registro.comentario="";
    this.checkedsueldo = false;
  }

  actualizar() {
    super.actualizar();
    this.sumar();
  }

  eliminar() {
    super.eliminar();
    this.sumar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.checkedsueldo = registro.cuentacliente;
  }

  // Inicia CONSULTA *********************
  consultar() {
    super.consultar();
  }
  
  consultaConsolidado() {
    this.rqConsulta.CODIGOCONSULTA = 'CONSOLIDADO'; 
    this.rqConsulta.mdatos.coperacion = this.mfiltros.coperacion;
    this.rqConsulta.mdatos.operacion= true;
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

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltroTIPOIDENTIF: any = { 'ccatalogo': this.codCatalogoTipoIdentificacion };
    const consultaTIPOIDENTIF = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroTIPOIDENTIF, {});
    consultaTIPOIDENTIF.cantidad = 200;
    this.addConsultaCatalogos('TIPOIDENTIFICACION', consultaTIPOIDENTIF, this.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  public crearDtoConsulta(coperacion: any): Consulta {
    this.fijarFiltrosConsulta(coperacion);
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    consulta.cantidad = 20;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta(coperacion: any) {
    this.mfiltros.coperacion = coperacion;
    this.mfiltros.tipo = 'T';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.sumar();
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

  sumar() {
    this.montospi = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.valor !== undefined && reg.valor !== null) {
          this.montospi = this.montospi + reg.valor;
        }
      }
    }
  }

  marcarCuenta(value: boolean): void {
    this.checkedsueldo = value;
    if (value) {

      if (this.lsueldo !== undefined && this.lsueldo.length > 0) {
        this.registro.tipoinstitucioncdetalle = this.lsueldo[0].tipoinstitucioncdetalle;
        this.registro.tipocuentacdetalle = this.lsueldo[0].tipocuentacdetalle;
        this.registro.numerocuentabancaria = this.lsueldo[0].numero;
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
