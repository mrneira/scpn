import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-liquidacion',
  templateUrl: 'liquidacion.html'
})
export class LiquidaciomComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: '...', value: null }];
  devolucion = false;
  cesantia = false;
  fecha = new Date();
  mensaje = "";
  private ntotal = "";
  public edited = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TpreExpediente', 'LIQUIDACION', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    //this.mfiltros.cpersona = 0;
  }

  crearNuevo() {

  }

  actualizar() {

  }


  cancelar() {

  }


  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 't.ccatalogoestado = i.ccatalogo and t.cdetalleestado = i.cdetalle');
    consulta.addSubquery('tpreliquidacion', 'vbonificacion', 'vbonificacion', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'vcuantiabasica', 'vcuantiabasica', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'dnovedades', 'dnovedades', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'dprestamos', 'dprestamos', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'dretencion', 'dretencion', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'daportes', 'daportes', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'vinteres', 'vinteres', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'taportes', 'taportes', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tpreliquidacion', 'porcentajeanticipo', 'porcentaje', 't.secuencia = i.secuencia and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'identificacion', 'cedula', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'netapa', 't.ccatalogoetapa = i.ccatalogo and t.cdetalleetapa = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', 't.ccatalogotipoexp = i.ccatalogo and t.cdetalletipoexp = i.cdetalle');
    this.addConsulta(consulta);

    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania
    this.mfiltros.anticipo = false;
    // this.mfiltros.cdetalleestado = 'ACT';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    const mliquidacion = resp.LIQUIDACION[0];
    if (this.estaVacio(mliquidacion)) {
      this.limpiarCampos();
      return;
    }
    if (mliquidacion.cdetalletipoexp === 'CES' || mliquidacion.cdetalletipoexp === 'CEF') {
      if(mliquidacion.cdetalletipoexp === 'CEF'){
        this.mcampos.porcentaje = mliquidacion.mdatos.porcentaje > 0 ? '('+ mliquidacion.mdatos.porcentaje+')%':'';
       // this.registro.subtotal = this.redondear(this.registro.subtotal * mliquidacion.mdatos.porcentaje / 100,2);
      }
      this.cesantia = true;
      this.devolucion = false;
    } else {
      this.cesantia = false;
      this.devolucion = true;
    }

    if (this.cesantia) {
      this.ntotal = 'Total Cesantia:';
    } else {
      this.ntotal = 'Total Devolución:';
      this.registro.subtotal = this.registro.subtotal - this.registro.mdatos.daportes;
    }

    
    this.mcampos.taportesd = this.redondear(this.registro.mdatos.daportes * 100 / 20, 2);
    this.mcampos.taportesi = this.redondear(this.registro.mdatos.taportes - this.mcampos.taportesd, 2);
    this.mcampos.valordescuentossim = this.registro.mdatos.dprestamos + this.registro.mdatos.dnovedades + this.registro.mdatos.dretencion;// + this.registro.mdatos.daportes;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

  }

  public limpiarCampos() {
    this.registro.totalliquidacion = 0;
    this.registro.mdatos.vcuantiabasica = 0;
    this.registro.mdatos.vbonificacion = 0;
    this.registro.mdatos.vinteres = 0;
    this.registro.mdatos.daportes = 0;
    this.registro.mdatos.taportes = 0;
    this.registro.subtotal = 0;
    this.registro.mdatos.dprestamos = 0;
    this.registro.mdatos.dnovedades = 0;
    this.registro.mdatos.dretencion = 0;
    this.mcampos.valordescuentossim = 0;
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

  }
}
