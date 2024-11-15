import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovDesignacionesComponent } from '../../../lov/designaciones/componentes/lov.designaciones.component';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

@Component({
  selector: 'app-requisitoshabilitantes',
  templateUrl: 'requisitoshabilitantes.html'
})
export class RequisitosHabilitantesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formcampos') formcampos: NgForm;
  @ViewChild(LovDesignacionesComponent) private lovDesignaciones: LovDesignacionesComponent;
  @ViewChild(GestorDocumentalComponent) private lovGestor: GestorDocumentalComponent;

  lregistrosOpcional = [];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthrequisitohabilitante', 'REQUISITOSHABILITANTES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formcampos);
  }

  ngAfterViewInit() {
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
    registro.fechaentrega= new Date (registro.fechaentrega)
    super.selectRegistro(registro);

  }

  public fijarFiltrosConsulta() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.mcampos.ccontrato == undefined) {
      super.mostrarMensajeError("DEBE ELEGIR UN CONTRATO");
      return;
    }
    this.rqConsulta.mdatos.cfuncionario = this.mcampos.cfuncionario;
    this.rqConsulta.mdatos.ccontrato = this.mcampos.ccontrato;
    this.rqConsulta.mdatos.ctiporelacionlaboral = this.mcampos.ctiporelacionlaboral;

    this.rqConsulta.CODIGOCONSULTA = 'BUSQUEDAREQCONFUNCIONARIO';
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {

        if(resp.cod==="OK"){
          this.lregistros = resp.lregistros;
          this.lregistrosOpcional = resp.lregistrosOpcional;

          if (this.lregistros.length > 0) {
            for (const i in this.lregistros) {
              if (this.lregistros.hasOwnProperty(i)) {
               
                const reg = this.lregistros[i];
                if (reg.crequisitohabilitante == 0) {
                  delete reg.crequisitohabilitante;
                  reg.esnuevo = true;
                } else {
                  reg.esnuevo = false;
                }
               reg.fechaentrega = new Date(reg.fechaentrega);
               reg.fechamaxentrega = new Date(reg.fechamaxentrega);
                reg.idreg = Math.floor((Math.random() * 100000) + 1);
            
                this.selectRegistro(reg);
                this.actualizar();
              }

            }
            for (const i in this.lregistrosOpcional) {
              if (this.lregistrosOpcional.hasOwnProperty(i)) {
               
                const reg = this.lregistrosOpcional[i];
                if (reg.crequisitohabilitante == 0) {
                  delete reg.crequisitohabilitante;
                  reg.esnuevo = true;
                } else {
                  reg.esnuevo = false;
                }
                reg.fechaentrega = new Date(reg.fechaentrega);
                reg.fechamaxentrega = new Date(reg.fechamaxentrega);
                reg.idreg = Math.floor((Math.random() * 100000) + 1);
                 this.selectRegistro(reg);
              // this.actualizar();
              }
              
            }
          }
        }
      
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    // super.postQueryEntityBean(resp);
  }

  // Fin CONSULTA *********************
  validaFiltrosConsulta(): boolean {
    return true;
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.mcampos.ccontrato == undefined) {
      super.mostrarMensajeError("DEBE ELEGIR UN CONTRATO");
      return;
    }
    var flag = true;

    for (var i = 0, len = this.lregistros.length; i < len; i++) {
      if (this.lregistros[i].mdatos.cobligatorio) {
        if (!this.lregistros[i].entregado)
          flag = false;
      }
    }

    if (!flag) {
      super.mostrarMensajeWarn("NO SE HAN AGREGADO TODOS LOS REQUERIMIENTOS SOLICITADOS.");
    //  return;
    }

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
  }

  mostrarLovDesignaciones(): void {
    this.lovDesignaciones.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovDesignaciones(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.ccontrato = reg.registro.ccontrato;
      this.mcampos.ctiporelacionlaboral = reg.registro.ctiporelacionlaboral;
      this.mcampos.ndesignacion = reg.registro.mdatos.ndesignacion;
      this.consultar();
    }
  }

  AddToList(reg: any){
    let rowIndex = this.lregistrosOpcional.indexOf(reg);
    this.lregistros.push(reg);
    this.lregistrosOpcional.splice(rowIndex, 1);
  }
  
  RemoveFromList(reg: any){
    let rowIndex = this.lregistrosOpcional.indexOf(reg);
    this.lregistrosOpcional.push(reg);
    this.lregistros.splice(rowIndex, 1);
  }
  // originalEvent.currentTarget.rowIndex
  verificar() {
    this.registro.cusuarioverifica = this.dtoServicios.mradicacion.cusuario;
  }

  /**Despliega el lov de Gestión Documental. */
  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }
  /**Retorno de lov de Gestión Documental. */
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.registro.cgesarchivo = reg.cgesarchivo;
      this.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();
      this.grabar();
    }
  }
  /**Realiza la descarga desde el lov de Gestión Documental. */
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }
}