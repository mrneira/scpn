import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovDescuentoComponent } from '../../../lov/descuento/componentes/lov.descuento.component';
import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
@Component({
  selector: 'app-saldovacacion',
  templateUrl: 'saldovacacion.html'
})
export class SaldoVacacion extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(LovDescuentoComponent)
  private lovDescuento: LovDescuentoComponent;

  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomsaldovacaciones', 'VACACIONES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
   
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
   
    
    //this.registro.optlock = 0;
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
  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;
    }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.csaldovacaciones', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesccatalogo and i.cdetalle=t.mescdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.tipoccatalogo and i.cdetalle=t.tipocdetalle');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');

    consulta.cantidad = 300;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  
  }

  validaFiltrosConsulta(): boolean {
    return true;
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

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1162 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOMOVIMIENTO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;


    }
  }
  descargarReporte(reg:any): void {

    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'SALDO-VACACIONES';
    this.jasper.formatoexportar=reg;
  


    // Agregar parametros
    this.jasper.parametros['@i_cfuncionario'] = (!this.estaVacio(this.mfiltros.cfuncionario))?this.mfiltros.cfuncionario:-1;
    this.jasper.parametros['@i_canio'] = (!this.estaVacio(this.mfiltros.anio))?this.mfiltros.anio:-1;
    this.jasper.parametros['@i_ctipocdetalle'] = (!this.estaVacio(this.mfiltros.tipocdetalle))?this.mfiltros.tipocdetalle:"-";
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthSaldoVacacionesGeneral';
    this.jasper.generaReporteCore();
  }
  mostrarLovDescuento(): void {
    this.lovDescuento.mfiltrosigual.asignacion = true;

    this.lovDescuento.showDialog();

  }

  /**Retorno de lov de funcionarios. */
  fijarLovDescuentoSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ndescuento = reg.registro.nombre;
      this.registro.cdescuento = reg.registro.cdescuento;


    }
  }
}
