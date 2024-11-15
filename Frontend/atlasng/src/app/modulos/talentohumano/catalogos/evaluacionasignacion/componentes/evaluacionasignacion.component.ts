import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovPeriodoComponent } from '../../../lov/periodo/componentes/lov.periodo.component';
import { LovPlantillaEvaluacion } from '../../../lov/plantilla/componentes/lov.plantillaevaluacionmrl.component'

import { ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-evaluacionasignacion',
  templateUrl: 'evaluacionasignacion.html'
})
export class EvaluacionasignacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovFuncionario')
  private lovfuncionario: LovFuncionariosComponent;

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
  public lparametro: any = [];
  public lplantilla: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tthasignacion', 'EVALASIGNACION', false, false);
    this.componentehijo = this;
  }
  asignacion: boolean = false;
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cperiodo)) {
      this.mostrarMensajeError("ELIJA PRIMERO UN PERÍODO PARA REALIZAR LA ASIGNACIÓN");
      return;
    }

    super.crearNuevo();
    this.registro.cperiodo = this.mcampos.cperiodo;
    this.registro.finalizada = false;
    this.registro.estado = true;
    this.registro.optlock=0;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cperiodo)) {
      this.mostrarMensajeInfo("ELIJA PRIMERO UN PERÍODO PARA REALIZAR LA ASIGNACIÓN");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cevaluacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'njefefuncionario', 'i.cfuncionario= t.jefecfuncionario and i.verreg = 0');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cperiodo = this.mcampos.cperiodo;
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
    if (this.estaVacio(this.mcampos.cperiodo)) {
      this.mostrarMensajeError("ELIJA PRIMERO UN PERÍODO PARA REALIZAR EL MANTENIMIENTO");
      return;
    }
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

  mostrarLovFuncionarios(): void {
    this.lovfuncionario.showDialog();
  }

  mostrarLovJefeFuncionarios(): void {
    this.lovjefefuncionario.showDialog();
  }

  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {

      let diaseval = this.lparametro[0].value;
      if (this.estaVacio(diaseval)) {
        super.mostrarMensajeError("NO SE HAN DEFINIDO LOS DIAS DE PRUEBA");
        return;
      }
      if (this.estaVacio(reg.registro.mdatos.fvinculacion)) {
        super.mostrarMensajeError("EL FUNCIONARIO SELECCIONADO NO TIENE UN CONTRATO CON FECHA DE VINCULACIÓN");
        return;
      }
      this.registro.mdatos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.cfuncionario = reg.registro.cfuncionario;

      var fvinculacion = new Date(reg.registro.mdatos.fvinculacion);
      this.registro.fingresof = fvinculacion;
      this.registro.periodoprueba = this.calcularEdad(fvinculacion);
    }
  }

  public calcularEdad(fecha: any): boolean {
    // Si la fecha es correcta, calculamos la edad
    if (fecha === null) {
      return false;
    }
    var values = new Date(fecha);
    var fechaInicio = new Date(values).getTime();
    var fechaFin = this.fechaactual.getTime();

    var diff = fechaFin - fechaInicio;

    let total = diff / (1000 * 60 * 60 * 24);
    let diaseval = this.lparametro[0].value;

    return (total > diaseval) ? false : true;
  }

  fijarLovJefeFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.njefefuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.jefecfuncionario = reg.registro.cfuncionario;
      var fvinculacion = new Date(reg.registro.mdatos.fvinculacion);
      this.registro.fingresof = fvinculacion;
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

  consultaAsignacion() {
    this.asignacion = true;
  }

  enviarmail() {

    if (this.asignarDatos()) {
      this.rqMantenimiento = [];
      this.rqMantenimiento.mdatos = {};
      this.rqMantenimiento.mdatos.enviarcorreo = true;
      this.rqMantenimiento.mdatos.ldatos = this.ldatos;
      super.grabar();
    } else {
      this.mostrarMensajeError("NO SE HA SELECCIONADO ASIGNACIONES A ENVIAR");

    }
  }
  asignarDatos() {

    this.ldatos = [];

    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        if (reg.jefecfuncionario != null && reg.cfuncionario) {
          this.ldatos.push(reg);
        }
      }
    }
    if (this.ldatos.length == 0) {
      return false;

    }
    return true;
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosparam = { 'codigo': 'TACTIVACIONEVALMRL' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TABL', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'numero', false, false);

    this.ejecutarConsultaCatalogos();
  }

  private manejaRespuestaDatos(resp: any) {
    if (resp.cod === 'OK') {
      this.confirmationService.confirm({
        message: 'Se agregaran nuevos registros desea continuar ?',
        header: 'Confirmación',
        accept: () => {
          //METODO PARA AGREGAR REGISTROS NUEVOS DE LA PLANTILLA A LAS TABLAS
          this.AgregarNuevo(resp.ASIGNACION);
        }
      });

    }
  }
  buscarFuncionario(cfuncionario: any): boolean {

    if (this.lregistros.length > 0) {
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const reg = this.lregistros[i];
          if (reg.cfuncionario === cfuncionario) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private AgregarNuevo(lista: any[]) {
    if (lista.length > 0) {
      for (const i in lista) {
        if (lista.hasOwnProperty(i)) {
          const registronuevo = this.clone(this.registroNuevo);
          const reg = lista[i];
          registronuevo.mdatos.nfuncionario = reg.nfuncionario;
          registronuevo.mdatos.njefefuncionario = reg.njefefuncionario;
          registronuevo.mdatos.nplantilla = reg.nplantilla;
          registronuevo.cfuncionario = reg.cfuncionario;
          registronuevo.jefecfuncionario = reg.jefecfuncionario;
          registronuevo.cperiodo = this.mcampos.cperiodo;
          registronuevo.cplantilla = reg.cplantilla;
          registronuevo.comentario = "";
          registronuevo.estado = true;
          registronuevo.finalizada = false;
          registronuevo.fingresof = reg.fingresof;
          registronuevo.idreg = Math.floor((Math.random() * 100000) + 1);
          if (!this.buscarFuncionario(registronuevo.cfuncionario)) {
            this.selectRegistro(registronuevo);
            this.actualizar();
          }
        }
      }
    }
  }
}
