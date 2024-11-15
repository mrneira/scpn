import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-calendario',
  templateUrl: 'calendario.html'
})
export class CalendarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lanios: SelectItem[] = [{ label: '...', value: null }];
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  public codCatalogoMeses = 4;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcardescuentoscalendario', 'CALENDARIODESCUENTOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llenaranios();
    this.consultarCatalogos();
    this.mcampos.camposfecha.fejecucion = null;
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.generaCamposFechaRegistro(this.registro);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.mesccatalogo = this.codCatalogoMeses;
    this.mostrarDialogoGenerico = true;
  }

  consultar(): void {
    this.crearDtoConsulta();
    super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    const mensajeError = this.validarConfiguracion();
    if (mensajeError !== '') {
      this.mostrarDialogoGenerico = true;
      super.mostrarMensajeError(mensajeError);
      return;
    }
    super.actualizar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 't.mescdetalle', this.mfiltros, {});
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'mes', 'i.ccatalogo = t.mesccatalogo and i.cdetalle = t.mescdetalle ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosIns: any = { 'ccatalogo': this.codCatalogoMeses };
    const conmes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosIns, {});
    conmes.cantidad = 100;
    this.addConsultaCatalogos('MESES', conmes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  grabar(): void {
    this.encerarMensajes();
    this.registro.fejecucion = super.integerToFormatoFecha(this.mcampos.fejecucion);
    this.lmantenimiento = []; // Encerar Mantenimiento
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  llenaranios() {
    let anioActualdateDay = new Date().getFullYear();
    let anios = 7;
    for (var i = anioActualdateDay; i < anioActualdateDay + anios; i++) {
      this.lanios.push({ label: i.toString(), value: i });
    }
  }

  validarConfiguracion(): string {
    let mensaje = '';
    if (this.registro.esnuevo) {
      if (!this.estaVacio(this.registro.mescdetalle) && !this.estaVacio(this.registro.anio)) {
        let regaux: any;
        regaux = this.lregistros.find(x => x.mescdetalle === this.registro.mescdetalle && x.anio === this.registro.anio)
        let mes = this.lmeses.find(x => x.value === this.registro.mescdetalle)
        if (regaux !== undefined) {
          mensaje += 'YA EXISTE REGISTRO DE DESCUENTO PARA EL MES ' + mes.label + ' Y AÑO ' + this.registro.anio + '<br />';
        }
      }
    }

    if (this.registro.esnuevo) {
      if (!this.estaVacio(this.registro.mescdetalle) && !this.estaVacio(this.registro.anio) && !this.estaVacio(this.registro.mdatos.fejecucion)) {
        let fecha = this.registro.mdatos.fejecucion;
        let anio = fecha.getFullYear();
        let mes = fecha.getMonth() + 1;
        let mesformat = super.rellenaCaracteresIzquierda(mes, 2, 0);
        if (this.registro.anio !== anio || this.registro.mescdetalle !== mesformat)
          mensaje += 'FECHA DE DESCUENTO NO CORRESPONDE AL MES Y AÑO SELECCIONADO' + '<br />';
      }
    }

    if (!this.registro.esnuevo) {
      if (!this.estaVacio(this.registro.mescdetalle) && !this.estaVacio(this.registro.anio) && !this.estaVacio(this.registro.mdatos.fejecucion)) {
        let fecha = this.registro.mdatos.fejecucion;
        let anio = fecha.getFullYear();
        let mes = fecha.getMonth() + 1;
        let mesformat = super.rellenaCaracteresIzquierda(mes, 2, 0);
        if (this.registro.anio !== anio || this.registro.mescdetalle !== mesformat)
          mensaje += 'FECHA DE DESCUENTO NO CORRESPONDE AL MES Y AÑO SELECCIONADO' + '<br />';
      }
    }

    if (!this.estaVacio(this.registro.mdatos.fejecucion)) {
      let fcontable = super.integerToDate(this.dtoServicios.mradicacion.fcontable);
      let anio = fcontable.getFullYear();
      let mes = fcontable.getMonth() + 1;
      let dia = fcontable.getDay();
      let mesformat = super.rellenaCaracteresIzquierda(mes, 2, 0);
      if (anio === this.registro.anio && this.registro.mescdetalle === mesformat && this.registro.mdatos.fejecucion < fcontable)
        mensaje += 'LA FECHA DE DESCUENTO NO PUEDE SER MENOR A LA FECHA ACTUAL' + '<br />';
    }
    return mensaje;
  }

  fijarconsulta() {
    this.consultar();
  }

  cerrarDialogo() {
    this.mostrarDialogoGenerico = false;
  }
}


