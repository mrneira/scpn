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

import { LovDepartamentosComponent } from '../../../lov/departamentos/componentes/lov.departamentos.component';

import { LovEvaluacionversionComponent } from '../../../lov/evaluacionversion/componentes/lov.evaluacionversion.component'

import { ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-evaluacionmeta',
  templateUrl: 'evaluacionmeta.html'
})
export class EvaluacionmetaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovFuncionario')
  private lovfuncionario: LovFuncionariosComponent;



  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;

  @ViewChild(LovDepartamentosComponent) 
  private lovDepartamentos: LovDepartamentosComponent;
  

  @ViewChild(LovEvaluacionversionComponent) 
  private lovEvaluacionVersion: LovEvaluacionversionComponent;
  selectedRegistros;
  public ldatos: any = [];
  public lplantilla: SelectItem[] = [{ label: '...', value: null }];
  public lparametro: any = [];
  public lversion: any = [];
  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tthmeta', 'EVALMETA', false, false);
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
   
    if(this.estaVacio(this.lparametro[1])){
      this.mostrarMensajeError("NO SE HA DEFINIDO UNA INSTITUCIÓN EN LOS PARAMETROS GENERALES");
      return;
    }
    let codempresa = this.lparametro[1].value;
    super.crearNuevo();
    this.registro.cinfoempresa= codempresa;
    this.registro.cperiodo = this.mcampos.cperiodo;
    this.registro.finalizada = false;
    this.registro.estado = true;
    this.registro.fingreso= this.fechaactual;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    this.registro.fdefinicion= this.fechaactual;
   
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmeta', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
     consulta.addSubquery('tthdepartamento', 'nombre', 'ndepartamento', 'i.cdepartamento= t.cdepartamento');
    
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

  

  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
    if(this.estaVacio(reg.registro.mdatos.fvinculacion)){
      super.mostrarMensajeError("EL FUNCIONARIO SELECCIONADO NO TIENE UN CONTRATO CON FECHA DE VINCULACIÓN");
      return;
    }
      this.registro.mdatos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.cfuncionario = reg.registro.cfuncionario;
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
  asignar(reg: any) {
    this.mcampos.cplantilla = reg.value;

  }
  enviarmail() {

    if (this.asignarDatos()) {
      this.rqMantenimiento = [];
      this.rqMantenimiento.mdatos = {};
      this.rqMantenimiento.mdatos.enviarcorreo = true;
      this.rqMantenimiento.mdatos.ldatos = this.ldatos;
      super.grabar();
    } else {
      this.mostrarMensajeError("NO SE HA SELECCIONADO PERSONAS A ENVIAR NOTIFICACIONES");

    }
  }
  mostrarLovDepartamentos(): void {
    this.lovDepartamentos.mfiltros.gestion=true;
    this.lovDepartamentos.showDialog();
}

/**Retorno de lov de personas. */
fijarLovDepartamentos(reg: any): void {
    if (reg.registro !== undefined) {
   
        this.registro.mdatos.ndepartamento = reg.registro.nombre;
        this.mcampos.ndepartamento = reg.registro.nombre;
        this.registro.cdepartamento= reg.registro.cdepartamento;
        this.mcampos.cdepartamento= reg.registro.cdepartamento;
        this.registro.cfuncionario=reg.registro.cfuncionario;
        this.registro.mdatos.nfuncionario=reg.registro.mdatos.nfuncionario
        
        
       
    }
}

mostrarLovVersion(): void {
  this.lovEvaluacionVersion.showDialog();
}

/**Retorno de lov de personas. */
fijarLovVersion(reg: any): void {
  if (reg.registro !== undefined) {
     
      this.registro.mdatos.nversion = reg.registro.nombre;
      this.mcampos.nversion = reg.registro.nombre;
      this.registro.cversion= reg.registro.cversion;
      this.mcampos.cversion= reg.registro.cversion;
     
  }
}
  asignarDatos() {

    this.ldatos = [];

    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
     
          this.ldatos.push(reg);
        
      }
    }
    if (this.ldatos.length == 0 ) {
      return false;

    }
    return true;
  }
  generarDatos() {
    this.asignacion = false;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSASIGNACION';
    this.rqConsulta.mdatos.cplantilla = this.mcampos.cplantilla;
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
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
 
    //CONSULTA CÓDIGO DE EMPRESA ACTUAL
    const mfiltrosparam = { 'codigo': 'CODIGO-EMPRESA' };
    const consultarParametroEmpresa = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametroEmpresa.cantidad = 1;
    this.addConsultaCatalogos('TABL', consultarParametroEmpresa, this.lparametro, super.llenaListaCatalogo, 'numero');
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
