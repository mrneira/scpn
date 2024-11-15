import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';

import { ConfirmationService } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-horasextras',
  templateUrl: 'horasextras.html'
})
export class HorasExtrasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  


  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;

  private catalogoDetalle: CatalogoDetalleComponent;

  constructor(router: Router, dtoServicios: DtoServicios,private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tnomhoraextra', 'HOREXTRA', true);
  }

  solicitar(){
    if(!this.validaGrabar()){
      return;
    }
     this.confirmationService.confirm({
          message: 'Usted está generando una solicitud de horas extras, está seguro de enviarla?',
          header: 'Confirmación',
          accept: () => {
            this.grabar();
          }
        });
  }
  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS SOLICITUD]');
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  this.registro.tipoccatalogo=1140;
  this.registro.estado= true;  
  this.registro.cfuncionario = sessionStorage.getItem("cfuncionario");
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.mcampos.fmin = new Date(this.registro.finicio);
    }
    this.registro.ffin=null;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cinstruccion)) {
      this.mostrarMensajeError('ELIJA UNA CAPACITACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }
  private fijarFiltrosConsulta() {
  }



  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.nuevo = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    
      this.lmantenimiento = []; // Encerar Mantenimiento
      this.crearDtoMantenimiento();
      if (this.nuevo) {
        this.selectRegistro(this.registro);
        this.actualizar();
        this.registro.fingreso= this.fechaactual;
        this.registro.cusuarioing=this.dtoServicios.mradicacion.cusuario;
      } else {
      }
      super.grabar();
    }
  

 
  public postCommit(resp: any) {

    if (resp.cod === 'OK') {
      this.grabo = true;
    }
   
   
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }
  


}
