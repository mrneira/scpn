import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-gastodeducible',
  templateUrl: 'gastodeducible.html'
})
export class GastodeducibleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  private catalogoDetalle: CatalogoDetalleComponent;
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public lparametro: any[];
  public registroval: any;
  public registrov: any = { 'mdatos': {} };
  public parametroAnual: any = { 'mdatos': {} };



  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomimpuestorenta', 'GASTODEDUCIBLE', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
    this.ConsultaCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cfuncionario = sessionStorage.getItem('cfuncionario');
    if (this.estaVacio(this.registro.cfuncionario)) {
      super.mostrarMensajeError("NO SE PUEDE PARAMETRIZAR SUS GASTOS DEDUCIBLES USUARIO ERRONEO")
      return;
    }
    //this.registro.cfuncionario = 7;

    this.registro.anio = this.fechaactual.getFullYear();
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.vvivienda = 0;
    this.registro.vsalud = 0;
    this.registro.veducacion = 0;
    this.registro.vvestimenta = 0;
    this.registro.valimentacion = 0;
    this.registro.vtotal = 0;
    this.registro.totingresoexternos = 0;
    this.registro.cpagado = 0;

  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }
  totalIngresosGravados() {
    if (Number(this.registro.totingresoempresa) >= 0 || Number(this.registro.totingresoexternos) >= 0) {
      let total = Number(this.registro.totingresoempresa) + Number(this.registro.totingresoexternos);
      this.registro.totingresos = total;
    }
    this.vtotalingresosProyectados();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.anio', this.mfiltros, this.mfiltrosesp);

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.anio = this.fechaactual.getFullYear();
    this.mfiltros.cfuncionario = sessionStorage.getItem('cfuncionario');
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  ConsultaCatalogos() {
    this.encerarConsultaCatalogos();

    let aniofiltro = this.fechaactual.getFullYear();
    const consultaDestreza = new Consulta('tnomgastodeducible', 'Y', 't.anio', { anio: aniofiltro }, {});
    consultaDestreza.cantidad = 1;
    this.addConsultaCatalogos('REGVALIDACION', consultaDestreza, this.lparametro, this.llenarDto, '', this.componentehijo);

    const consultaParametrosAnuales = new Consulta('tnomparametrodetalle', 'Y', 't.anio', { anio: aniofiltro, verreg: 0 }, {});
    consultaParametrosAnuales.cantidad = 1;
    this.addConsultaCatalogos('REGPARAMETROANUAL', consultaParametrosAnuales, this.parametroAnual, this.llenarParametrosAnuales, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();

  }
  public llenarDto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {

    for (let i in pListaResp) {
      const reg = pListaResp[i];
      this.componentehijo.registrov = reg;
    }
  }

  public llenarParametrosAnuales(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {

    for (let i in pListaResp) {
      const reg = pListaResp[i];
      this.componentehijo.parametroAnual = reg;
    }
  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
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
  valVivienda() {
    if (Number(this.registro.vvivienda) > Number(this.registrov.vvivienda)) {
      this.mostrarMensajeError("EL VALOR DE VIVIENDA NO PODRÁ SER MAYOR A " + this.registrov.vvivienda);
      this.registro.vvivienda = 0;
    }
    this.vtotalingresosProyectados();
    if (this.vvalidaTotales()) {
      this.registro.vvivienda = 0;
    }
  }
  valSalud() {
    if (Number(this.registro.vsalud) > Number(this.registrov.vsalud)) {
      this.mostrarMensajeError("EL VALOR DE SALUD NO PODRÁ SER MAYOR A " + this.registrov.vsalud);
      this.registro.vsalud = 0;
    }
    this.vtotalingresosProyectados();
    if (this.vvalidaTotales()) {
      this.registro.vsalud = 0;
    }
  }
  valAlimentacion() {
    if (Number(this.registro.valimentacion) > Number(this.registrov.valimentacion)) {
      this.mostrarMensajeError("EL VALOR DE ALIMENTACIÓN NO PODRÁ SER MAYOR A " + this.registrov.valimentacion);
      this.registro.valimentacion = 0;
    }
    this.vtotalingresosProyectados();
    if (this.vvalidaTotales()) {
      this.registro.valimentacion = 0;
    }
  }
  valEducacion() {
    if (Number(this.registro.veducacion) > Number(this.registrov.veducacion)) {
      this.mostrarMensajeError("EL VALOR DE EDUCACIÓN NO PODRÁ SER MAYOR A " + this.registrov.veducacion);
      this.registro.veducacion = 0;
    }
    this.vtotalingresosProyectados();
    if (this.vvalidaTotales()) {
      this.registro.veducacion = 0;
    }
  }
  valVestimenta() {
    if (Number(this.registro.vvestimenta) > Number(this.registrov.vvestimenta)) {
      this.mostrarMensajeError("EL VALOR DE VESTIMENTA NO PODRÁ SER MAYOR A" + this.registrov.vvestimenta);
      this.registro.vvestimenta = 0;
    }
    this.vtotalingresosProyectados();
    if (this.vvalidaTotales()) {
      this.registro.vvestimenta = 0;
    }

  }

  vtotalingresosProyectados() {

    let total = Number(this.registro.vvivienda) + Number(this.registro.vsalud) + Number(this.registro.veducacion) + Number(this.registro.vvestimenta) + Number(this.registro.valimentacion);
    this.registro.vtotal = total;
    this.selectRegistro(this.registro);
  }
  vvalidaTotales(): boolean {
    let mitatIngresos = (Number(this.registro.totingresos) / 2);
    if ((Number(this.registro.vtotal) > mitatIngresos) || (Number(this.registro.vtotal) > Number(this.parametroAnual.bimponiblegp))) {
      this.mostrarMensajeError("EL TOTAL DE GASTOS PROYECTADOS NO PODRA SER SUPERIOR A 50% DE" + this.registro.totingresos + " Y NO PODRÁ SER SUPERIOR A " + this.parametroAnual.bimponiblegp);
      return true;
    }
    return false;
  }
}
