import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-inversiondetalle',
  templateUrl: 'inversiondetalle.html'
})
export class InversiondetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lCompraCupon: SelectItem[] = [{ label: '...', value: null }];
  public lCentrocostos: SelectItem[] = [{ label: '...', value: null }];
  public lTipoDividendo: SelectItem[] = [{ label: '...', value: null }];
  public lEstado: SelectItem[] = [{ label: '...', value: null }];
  
  fecha = new Date();

  public pEditable: number = 0;
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvinversionrentavariable', 'DETALLERENTAVARIABLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.asignarCatalogoInicial();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    super.crearNuevo();

    this.mcampos.ccuentacon = null;
    this.mcampos.ncuentacon = null;

    this.registro.cinversion = this.mfiltros.cinversion;
    this.asignarCatalogoInicial();
    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  }

  actualizar() {

    this.encerarMensajes();

    if (this.estaVacio(this.registro.fcolocacion) || this.registro.fcolocacion <= 0) {
      this.mostrarMensajeError("FECHA DE COLOCACIÓN OBLIGATORIA");
      return;
    }

    if (this.estaVacio(this.registro.compracuponcdetalle)) {
      this.mostrarMensajeError("TIPO DE CUPÓN DE COMPRA OBLIGATORIO");
      return;
    }

    if (this.estaVacio(this.registro.centrocostocdetalle)) {
      this.mostrarMensajeError("CENTRO DE COSTOS OBLIGATORIO");
      return;
    }

    if (this.estaVacio(this.registro.valoracciones) || this.registro.valoracciones <= 0) {
      this.mostrarMensajeError('EL VALOR DE LAS ACCIONES DEBE SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.registro.preciounitarioaccion) || this.registro.preciounitarioaccion <= 0) {
      this.mostrarMensajeError('EL PRECIO UNITARIO DEBE SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.registro.numeroacciones) || this.registro.preciounitarioaccion <= 0) {
      this.mostrarMensajeError('EL NÚMERO DE ACCIONES DEBE SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.registro.preciocompra) || this.registro.preciocompra <= 0) {
      this.mostrarMensajeError('EL PRECIO DE COMPRA SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.registro.tipodividendocdetalle)) {
      this.mostrarMensajeError("TIPO DE DIVIDENDO OBLIGATORIO");
      return;
    }



    if (this.estaVacio(this.registro.porcentajeparticipacioncupon) || this.registro.porcentajeparticipacioncupon <= 0) {
      this.mostrarMensajeError('EL PORCENTAJE DE PARTICIPACIÓN DEBE SER MAYOR A CERO');
      return;
    }

    if (!this.estaVacio(this.mcampos.comisiontotal) && this.mcampos.comisiontotal < 0) 
    {
      this.mostrarMensajeError('EL TOTAL DE LAS COMISIONES NO DEBE SER NEGATIVO');
      return;
    }

    this.registro.ccuenta = this.mcampos.ccuentacon;
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
    this.lregistros = [];
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcolocacion DESC', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select cast(str(a.fcolocacion,8) as date) from tinvinversionrentavariable a where a.cinversionrentavariable = t.cinversionrentavariable', 'nfcolocacion');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nCompraCupon', 'i.ccatalogo = t.compracuponccatalogo and i.cdetalle = t.compracuponcdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nCentroCostos', 'i.ccatalogo = t.centrocostoccatalogo and i.cdetalle = t.centrocostocdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nTipoDividendo', 'i.ccatalogo = t.tipodividendoccatalogo and i.cdetalle = t.tipodividendocdetalle');
    
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.totalizaComisiones();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.cargaarchivo = '';
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);

      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  asignarCatalogoInicial() {
      this.registro.compracuponccatalogo = 1216;
      this.registro.centrocostoccatalogo = 1002;
      this.registro.tipodividendoccatalogo = 1221;
      this.registro.estadoccatalogo = 1204;
      }
    

  llenarConsultaCatalogos(): void {

    const mfiltrosOpe: any = { 'ccatalogo': this.registro.compracuponccatalogo };
    const consultaOpe = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosOpe, {});
    consultaOpe.cantidad = 50;
    this.addConsultaPorAlias('COMPRACUPON', consultaOpe);

    const mfiltrosCentroCosto: any = { 'ccatalogo': this.registro.centrocostoccatalogo };
    const consultaCentroCosto = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosCentroCosto, {});
    consultaCentroCosto.cantidad = 100;
    this.addConsultaPorAlias('CENTROCOSTO', consultaCentroCosto);

    const mfiltrosTipoDividendo: any = { 'ccatalogo': this.registro.tipodividendoccatalogo };
    const consultaTipoDividendo = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosTipoDividendo, {});
    consultaTipoDividendo.cantidad = 100;
    this.addConsultaPorAlias('TIPODIVIDENDO', consultaTipoDividendo);

    const mfiltrosEstado: any = { 'ccatalogo': this.registro.estadoccatalogo };
    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    consultaEstado.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaEstado);
    
  }

  calcularTotalAPagar() {
    
        let ltotal: number = 0;
        if (!this.estaVacio(this.registro.efectivonegociado)) {
          ltotal = Number(this.registro.efectivonegociado);
        }
    
        if (!this.estaVacio(this.registro.interesesnegociacion)) {
          ltotal = ltotal + Number(this.registro.interesesnegociacion);
        }
    
        if (!this.estaVacio(this.registro.comisionretencion)) {
          ltotal = ltotal - Number(this.registro.comisionretencion);
        }
        this.registro.totalapagar = ltotal;
    
      }
    

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lCompraCupon, resp.COMPRACUPON, 'cdetalle');
      this.llenaListaCatalogo(this.lCentrocostos, resp.CENTROCOSTO, 'cdetalle');
      this.llenaListaCatalogo(this.lTipoDividendo, resp.TIPODIVIDENDO, 'cdetalle');
      this.llenaListaCatalogo(this.lEstado, resp.ESTADO, 'cdetalle');
      
    }
    this.lconsulta = [];
  }

  actualizarFecha() {
    this.registro.fcolocacion = (this.registro.mdatos.nfcolocacion.getFullYear() * 10000) + ((this.registro.mdatos.nfcolocacion.getMonth() + 1) * 100) + this.registro.mdatos.nfcolocacion.getDate();
  }

  totalizaComisiones() {

    let ltotal: number = 0;
    if (!this.estaVacio(this.registro.comisionbolsavalores)) {
      ltotal = Number(this.registro.comisionbolsavalores);
    }

    if (!this.estaVacio(this.registro.comisionoperador)) {
      ltotal = ltotal + Number(this.registro.comisionoperador);
    }

    if (!this.estaVacio(this.registro.comisionretencion)) {
      ltotal = ltotal - Number(this.registro.comisionretencion);
    }
    this.mcampos.comisiontotal = ltotal;

  }
}
