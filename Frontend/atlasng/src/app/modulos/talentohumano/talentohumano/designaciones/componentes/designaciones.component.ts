import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component'

import { LovDesignacionesComponent } from '../../../../talentohumano/lov/designaciones/componentes/lov.designaciones.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';
import { LovCargoComponent } from '../../../lov/cargo/componentes/lov.cargo.component';
import { LovGrupoOcupacionalComponent } from '../../../lov/grupoocupacional/componentes/lov.grupoocupacional.component';
import { LovHorarioComponent } from '../../../lov/horario/componentes/lov.horario.component';
import { LovTipoVinculacionComponent } from '../../../lov/tipovinculacion/componentes/lov.tipovinculacion.component';
import { LovTipoRelacionLaboralComponent } from '../../../lov/tiporelacionlaboral/componentes/lov.tiporelacionlaboral.component';
import { Editor } from 'primeng/primeng';
import { LovPartidaGastoComponent } from '../../../../presupuesto/lov/partidagasto/componentes/lov.partidagasto.component';

@Component({
  selector: 'app-tth-designaciones',
  templateUrl: 'designaciones.html'
})
export class DesignacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovDesignacionesComponent) private lovDesignaciones: LovDesignacionesComponent;
  @ViewChild(LovCargoComponent) private lovCargos: LovCargoComponent;
  @ViewChild(LovGrupoOcupacionalComponent) private lovGrupos: LovGrupoOcupacionalComponent;
  @ViewChild(LovHorarioComponent) private lovHorarios: LovHorarioComponent;
  @ViewChild(LovTipoVinculacionComponent) private lovTipoVinculacion: LovTipoVinculacionComponent;
  @ViewChild(LovTipoRelacionLaboralComponent) private lovTipoRelacionLaboral: LovTipoRelacionLaboralComponent;
 
  @ViewChild(LovPartidaGastoComponent)
  private lovPartidaGasto: LovPartidaGastoComponent;
  
  @ViewChild(JasperComponent)
    public reporte: JasperComponent;

  @ViewChild(Editor) editor: Editor;
  @ViewChild('lov1') private lovFuncionario: LovFuncionariosComponent;
  @ViewChild('lov2') private lovFuncionarioReemplazado: LovFuncionariosComponent;
  
  public ltipopersonal: SelectItem[] = [{ label: '...', value: null }];
  public lestadocontrato: SelectItem[] = [{ label: '...', value: null }];
  public lregion: SelectItem[] = [{ label: '...', value: null }];
  public lregimen: SelectItem[] = [{ label: '...', value: null }];
  public lTipoVinculacion: SelectItem[] = [{ label: '...', value: null }];
  public lTipoDocumento: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthcontratodetalle', 'CONTRATOS', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.crearNuevo();
  }
  descargarReporte() {
    
    this.reporte.nombreArchivo = 'ReporteEvaluacion';
    // Agregar parametros
    this.reporte.parametros['@i_ccontrato'] = this.mcampos.ccontrato;
    this.reporte.formatoexportar="word";
    this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthContratoServiciosOcasionales';
    this.reporte.generaReporteCore();
           
    
}

  ngAfterViewInit() {
  }
  crearNuevo() {
    super.crearNuevo();
    this.registro.cfuncionario = this.mfiltros.cfuncionario;
    this.registro.mdatos.nfuncionario = this.mcampos.nfuncionario

    this.registro.estadocontratoccatalogo = 1129;
    this.registro.regionccatalogo = 1130;
    this.registro.regimenccatalogo = 1114;

    this.registro.verreg = 0;
    this.registro.optlock = 0;
  }

  actualizar() {
    super.actualizar();
    this.editor.quill.enable(this.editable);
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
    this.editor.quill.enable(this.editable);
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.editor.quill.enable(this.editable);
  }

  public fijarFiltrosConsulta() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccontrato', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia("select concat(o.primerapellido, ' ', o.primernombre) from " + this.obtenerBean("tthfuncionariodetalle") + " o where o.cfuncionario=t.cfuncionario and o.verreg=0", "nfuncionario");
    consulta.addSubquery('tthcargo', 'nombre', 'ncargo', 'i.ccargo = t.ccargo');
    consulta.addSubquery('tthcargo', 'cdepartamento', 'cdepartamento', 'i.ccargo = t.ccargo');
    consulta.addSubquery('tthgrupoocupacional', 'nombre', 'ngrupo', 'i.cgrupo = t.cgrupo');
    consulta.addSubquery('tthhorario', 'nombre', 'nhorario', 'i.chorario = t.chorario');
    consulta.addSubquery('tthtipovinculacion', 'nombre', 'ntipovinculacion', 'i.ctipovinculacion   = t.ctipovinculacion');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestadocontrato', 't.estadocontratocdetalle = i.cdetalle and t.estadocontratoccatalogo = i.ccatalogo');
    consulta.addSubquery('tthtiporelacionlaboral', 'nombre', 'ntiporelacionlaboral', 'i.ctiporelacionlaboral = t.ctiporelacionlaboral');        
    consulta.addSubquery('tpptclasificador', 'nombre', 'npartida', 't.partidapresupuesto = i.cclasificador');
    
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  mostrarlovPartidaGasto(): void {
    this.lovPartidaGasto.mfiltros.movimiento = true;
    this.lovPartidaGasto.showDialog();
  }

  /**Retorno de lov de Partida Gasto. */
  fijarLovPartidaGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.partidapresupuesto = reg.registro.cpartidagasto;
      this.registro.mdatos.vasignacioninicial = reg.registro.vasignacioninicial;
      this.registro.mdatos.vmodificado = reg.registro.vmodificado;
      this.registro.mdatos.vcodificado = reg.registro.vcodificado;
      this.registro.mdatos.vcertificado = reg.registro.vcertificado;
      this.registro.mdatos.vcomprometido = reg.registro.vcomprometido;
      this.registro.mdatos.vdevengado = reg.registro.vdevengado;
      this.registro.mdatos.npartida = reg.registro.nombre;
     
    }

  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  // Fin CONSULTA *********************
  validaFiltrosConsulta(): boolean {
    return true;
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

    this.registro.ccontrato = resp.ccontrato;
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosTipoPersonal: any = { 'ccatalogo': 1113 };
    const consultaTipoPersonal = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoPersonal, {});
    consultaTipoPersonal.cantidad = 50;
    this.addConsultaPorAlias('TIPPER', consultaTipoPersonal);

    const mfiltrosEstadoContrato: any = { 'ccatalogo': 1129 };
    const consultaEstadoContrato = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstadoContrato, {});
    consultaEstadoContrato.cantidad = 500;
    this.addConsultaPorAlias('ESTCON', consultaEstadoContrato);

    const mfiltrosRegion: any = { 'ccatalogo': 1130 };
    const consultaRegion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosRegion, {});
    consultaRegion.cantidad = 500;
    this.addConsultaPorAlias('REGION', consultaRegion);

    const mfiltroREGIMEN: any = { 'ccatalogo': 1114 };
    const consultaREGIMEN = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroREGIMEN, {});
    consultaREGIMEN.cantidad = 500;
    this.addConsultaPorAlias('REGIMEN', consultaREGIMEN);

    
    const DocumentoVinculacion = new Consulta('tthtipovinculacion', 'Y', 't.nombre', {}, {});
    DocumentoVinculacion.cantidad = 500;
    this.addConsultaPorAlias('DOCVINCULACION', DocumentoVinculacion);

    const TipoVinculacion = new Consulta('tthtipovinculacion', 'Y', 't.nombre', {}, {});
    TipoVinculacion.cantidad = 500;
    this.addConsultaPorAlias('DOCVINCULACION', TipoVinculacion);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lestadocontrato, resp.ESTCON, 'cdetalle');
      this.llenaListaCatalogo(this.lregion, resp.REGION, 'cdetalle');
      this.llenaListaCatalogo(this.lTipoVinculacion, resp.DOCVINCULACION, 'cdetalle');
      this.llenaListaCatalogo(this.lregimen,resp.REGIMEN,'cdetalle');      
    }
    this.lconsulta = [];
  }

  mostrarLovDesignaciones(): void {
    this.lovDesignaciones.showDialog();
  }

  /**Retorno de lov de tipos de contrato. */
  fijarLovDesignaciones(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.ccontrato = reg.registro.ccontrato;
      this.mcampos.ccontrato = reg.registro.ccontrato;
      
      this.mfiltros.verreg = 0;
      this.mcampos.ccontrato=reg.registro.ccontrato;
      this.mcampos.ndesignacion = reg.registro.mdatos.ndesignacion;
      this.consultar();
    }
  }

  /**Muestra lov de funcionarios */
  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionario(reg: any): void {
    this.registro.cfuncionario = reg.registro.cfuncionario;
    this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
    if(this.registro.esnuevo) this.mostrarLovCargos();
  }

  mostrarLovCargos(): void {
    this.lovCargos.consultar();
    this.lovCargos.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovCargos(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccargo = reg.registro.ccargo;
      this.registro.mdatos.ncargo = reg.registro.nombre;
      this.registro.mdatos.cdepartamento = reg.registro.cdepartamento;
      this.registro.funciones = reg.registro.funciones;
      if(this.registro.esnuevo) this.mostrarLovGrupos();
    }
  }

  mostrarLovGrupos(): void {
    this.lovGrupos.consultar();
    this.lovGrupos.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovGrupos(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cgrupo = reg.registro.cgrupo;
      this.registro.mdatos.ngrupo = reg.registro.nombre;
      this.registro.remuneracion = reg.registro.rmu;
      if(this.registro.esnuevo) this.mostrarLovHorarios();
    }
  }

  mostrarLovHorarios(): void {
    this.lovHorarios.consultar();
    this.lovHorarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovHorarios(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.chorario = reg.registro.chorario;
      this.registro.mdatos.nhorario = reg.registro.nombre;
      if(this.registro.esnuevo) this.mostrarLovTipoVinculacion();
    }
  }

  mostrarLovTipoVinculacion(): void {
    this.lovTipoVinculacion.consultar();
    this.lovTipoVinculacion.showDialog();
  }

  /**Retorno de lov de tipos de contrato. */
  fijarLovTipoVinculacion(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ctipovinculacion = reg.registro.ctipovinculacion;
      this.registro.mdatos.ntipovinculacion = reg.registro.nombre;
      if(this.registro.esnuevo) this.mostrarLovTipoRelacionLaboral();
    }
  }

  mostrarLovTipoRelacionLaboral(): void {
    this.lovTipoRelacionLaboral.consultar();
    this.lovTipoRelacionLaboral.showDialog();
  }

  /**Retorno de lov de tipos de contrato. */
  fijarLovTipoRelacionLaboral(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ctiporelacionlaboral = reg.registro.ctiporelacionlaboral;
      this.registro.mdatos.ntiporelacionlaboral = reg.registro.nombre;
    }
  }

  /**Muestra lov de funcionarios */
  mostrarLovFuncionarioReemplazado(): void {
    this.lovFuncionarioReemplazado.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionarioReemplazado(reg: any): void {
    this.registro.reemplazadocfuncionario = reg.registro.cfuncionario;
    this.registro.mdatos.nreemplazadocfuncionario = reg.registro.mdatos.nombre;
  }

  borrarGrupoOcupacional(evento: any): void {
    if(evento != '1157'){
      delete this.registro.cgrupo;
      delete this.registro.mdatos.ngrupo;    
    }
  }
}