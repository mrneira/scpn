import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';
import { LovNominaComponent } from '../../../lov/nomina/componentes/lov.nomina.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-rolprovision',
  templateUrl: 'rolprovision.html'
})
export class RolprovisionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovNominaComponent)
  private lovNomina: LovNominaComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomrolprovicion', 'ROLPROVISION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {


  }

  actualizar() {

  }

  eliminar() {

  }

  cancelar() {

  }

  public selectRegistro(registro: any) {
    //Reporte
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.crolprovicion', this.mfiltros, this.mfiltrosesp);
     consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cfuncionario= t.cfuncionario and i.verreg = 0' );
    consulta.addSubquery('tthcargo','nombre','ncargo','i.ccargo= t.ccargo' );
    consulta.addSubquery('tthdepartamento','nombre','ndepartamento','i.cdepartamento= t.cdepartamento' );
    consulta.addSubqueryPorSentencia("SELECT tgc.nombre FROM tgencatalogodetalle tgc,tthcontratodetalle ccd WHERE tgc.ccatalogo =ccd.regimenccatalogo AND tgc.cdetalle=ccd.regimencdetalle AND ccd.ccontrato= t.ccontrato AND ccd.verreg=0","nregimen");
    consulta.addSubqueryPorSentencia("SELECT tgcd.nombre FROM tgencatalogodetalle tgcd,tthcontratodetalle ccdd WHERE tgcd.ccatalogo =ccdd.regionccatalogo AND tgcd.cdetalle=ccdd.regioncdetalle AND ccdd.ccontrato= t.ccontrato AND ccdd.verreg=0","nregion");
    
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }
  descargarReporte(reg: any): void { 
    if(this.registro.cnomina===undefined || this.registro.cnomina===null){
      this.registro.cnomina=-1;
    }  
    this.jasper.nombreArchivo = 'rptTthRolProvision';
    // Agregar parametros
    this.jasper.parametros['@i_cnomina'] = this.registro.cnomina;
     this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthRolProvision';
    this.jasper.generaReporteCore();
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cnomina=this.mcampos.cnomina;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
   
    
  }
  // Fin CONSULTA *********************
 mostrarLovNomina(): void {
   this.lovNomina.mfiltros.cerrada=true;
    this.lovNomina.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovNominaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cnomina = reg.registro.cnomina;
      this.consultar();
    }
  }
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

    const mfiltrosTipo: any = { 'ccatalogo': 1144 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOBENEFICIO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;


    }
  }

  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;
   
      this.consultar();
    }
  }
 
}
