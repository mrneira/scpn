import { Radicacion } from './../../../../../util/servicios/dto.servicios';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { EmpresaComponent } from '../componentes/_empresa.component';
import { ReferenciaComponent } from '../componentes/_referencia.component';
@Component({
  selector: 'app-experiencialaboral',
  templateUrl: 'experiencialaboral.html'
})
export class ExperienciaLaboralComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;


  @ViewChild(EmpresaComponent)
  tablaEmpresaComponent: EmpresaComponent;

  @ViewChild(ReferenciaComponent)
  tablaReferenciaComponent: EmpresaComponent;
  private cfuncionario = 0;



  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'EXPERIENCIALABORAL', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.mcampos.mostrarReferencia= false;
    this.consultar();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    if(this.estaVacio(this.registro.cfuncionario)){
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }
  validaFiltrosConsulta(): boolean {
    return true;
  }
  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conInsFormal = this.tablaEmpresaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEmpresaComponent.alias, conInsFormal);

    // consultar Tabla amortizacion
    this.tablaEmpresaComponent.mcampos.cfuncionario = this.mcampos.cfuncionario;
    this.tablaEmpresaComponent.consultar();

  }

  private fijarFiltrosConsulta() {
    this.tablaEmpresaComponent.mfiltros.cfuncionario = this.mcampos.cfuncionario;
    this.tablaEmpresaComponent.fijarFiltrosConsulta();

  }
   /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaEmpresaComponent.postQuery(resp);
   this.tablaReferenciaComponent.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.cfuncionario)){
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA MANTENIMIENTO");    
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    //asignar los codigos actuales si el registro es nuevo
    this.tablaEmpresaComponent.registro.cfuncionario = this.registro.cfuncionario;
    
   super.addMantenimientoPorAlias(this.tablaEmpresaComponent.alias, this.tablaEmpresaComponent.getMantenimiento(1));
   super.addMantenimientoPorAlias(this.tablaReferenciaComponent.alias, this.tablaReferenciaComponent.getMantenimiento(2));
   super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
       this.tablaEmpresaComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaEmpresaComponent.alias));
       this.tablaReferenciaComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaReferenciaComponent.alias));
       }
  }

  /**Muestra lov de personas */
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nombre = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario=reg.registro.cfuncionario;
      this.tablaEmpresaComponent.mcampos.cfuncionario=  reg.registro.cfuncionario;
      this.tablaReferenciaComponent.mcampos.cfuncionario= reg.registro.cfuncionario;
      this.consultar();
    }
  }
  private buscarDetalleReferencia(reg:any) {
    this.mcampos.mostrarReferencia= true;
    this.tablaReferenciaComponent.mfiltros.cexperiencia=reg.registro.cexperiencia;
    this.tablaReferenciaComponent.mcampos.cexperiencia =reg.registro.cexperiencia;
    const conInsFormal = this.tablaReferenciaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaReferenciaComponent.alias, conInsFormal);
    this.tablaReferenciaComponent.consultar();

  }


}
