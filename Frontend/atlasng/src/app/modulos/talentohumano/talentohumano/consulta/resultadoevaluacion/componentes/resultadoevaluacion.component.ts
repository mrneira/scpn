import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovPeriodoComponent } from '../../../../lov/periodo/componentes/lov.periodo.component';
import { LovPlantillaEvaluacion } from '../../../../lov/plantilla/componentes/lov.plantillaevaluacionmrl.component'
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component'

import { ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-resultadoevaluacion',
  templateUrl: 'resultadoevaluacion.html'
})
export class ResultadoEvaluacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovFuncionario')
  private lovfuncionario: LovFuncionariosComponent;

  @ViewChild(JasperComponent)
  public reporte: JasperComponent;

  @ViewChild('listado')
  public reporte2: JasperComponent;

  @ViewChild('lovJefeFuncionario')
  private lovjefefuncionario: LovFuncionariosComponent;

  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;

  @ViewChild(LovPlantillaEvaluacion)
  private lovPlantilla: LovPlantillaEvaluacion;

  @ViewChild(LovPlantillaEvaluacion)
  private LovPlantillaGenerada: LovPlantillaEvaluacion;
  selectedRegistros;
  public ldatos: any = [];
  public lplantilla: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'EVALUACION', false, false);
    this.componentehijo = this;
  } asignacion: boolean = false;
  ngOnInit() {
    super.init(this.formFiltros);

  }
  fechaactual = new Date();
  fmin = new Date();
  factiva = false;


  validarFecha() {
    if (!this.estaVacio(this.mcampos.finicio)) {
      this.fmin = new Date(this.mcampos.finicio);
      this.fmin.setDate(this.fmin.getDate());
      this.factiva = true;
    }
    this.mcampos.ffin = null;
  }
  ngAfterViewInit() {
  }
  Descargar(reg: any) {
    this.reporte.nombreArchivo = 'ReporteEvaluacion';
    // Agregar parametros
    this.reporte.parametros['@i_casignacion'] = reg.casignacion;
    if (reg.periodoprueba) {
      this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthEvaluacionAsignacionResponsabilidadesPeriodoPrueba';

    } else {
      this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthEvaluacionAsignacionResponsabilidades';

    }

    this.reporte.generaReporteCore();
  }
  descargarreporte(reg: any) {
    this.reporte.nombreArchivo = 'ReporteEvaluacion';
    // Agregar parametros
    this.reporte2.parametros['@i_cfuncionario'] = this.mcampos.cfuncionario;
    this.reporte2.parametros['@i_finicio'] = this.mcampos.finicio;
    this.reporte2.parametros['@i_ffin'] = this.mcampos.ffin;

    this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthFormularioEvaluaciones';
    this.reporte.generaReporteCore();
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
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************

  mostrarLovFuncionarios(): void {
    this.lovfuncionario.showDialog();
  }
  consultar() {
    if (this.mcampos.finicio === undefined || this.mcampos.finicio === null) {
      this.mcampos.finicio = null;
    }
    if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
      this.mcampos.ffin = null;
      this.mcampos.finicio = null;

    }
    let consulta;
    if (this.mcampos.cfuncionario === undefined || this.mcampos.cfuncionario === null) {

      consulta = -1;

    } else {
      consulta = this.mcampos.cfuncionario;
    }
    this.rqConsulta.CODIGOCONSULTA = 'TTHEVALRESULTADO';
    this.rqConsulta.storeprocedure = "sp_TthRptConResultadoEvaluacion";
    this.rqConsulta.parametro_cfuncionario = consulta;
    this.rqConsulta.parametro_finicio = this.mcampos.finicio;
    this.rqConsulta.parametro_ffin = this.mcampos.ffin;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaDatos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaDatos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.TTHEVALRESULTADO;
    }
  }


  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
    }
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }



  mostrarLovJefeFuncionarios(): void {
    this.lovjefefuncionario.showDialog();
  }



  fijarLovJefeFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.njefefuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.jefecfuncionario = reg.registro.cfuncionario;
    }
  }
  /**Muestra lov de periodos */
  mostrarLovPeriodo(): void {
    this.lovPeriodo.showDialog();
  }
  /**Retorno de lov de Periodo. */
  fijarLovPeriodoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cperiodo = reg.registro.cperiodo;
      this.registro.cperiodo = reg.registro.cperiodo;
      this.mcampos.nperiodo = reg.registro.nombre;
      this.mcampos.fdesde = reg.registro.fdesde;
      this.mcampos.fhasta = reg.registro.fhasta;
      this.consultar();
    }
  }
  mostrarLovEvaluacion(): void {
    this.lovPlantilla.showDialog();

  }
  fijarLovEvaluacion(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cplantilla = reg.registro.cplantilla;
      this.registro.mdatos.nplantilla = reg.registro.nombre;


    }
  }
  consultaAsignacion() {
    this.asignacion = true;
  }

}
