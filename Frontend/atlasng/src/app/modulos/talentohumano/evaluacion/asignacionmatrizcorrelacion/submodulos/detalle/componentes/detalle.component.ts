import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Output() calcularTotalesEvent = new EventEmitter();

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;


  private catalogoDetalle: CatalogoDetalleComponent;
  public lcdepartamento: SelectItem[] = [{ label: '...', value: null }];
  public lcdepartamentod: any = [];
  public lcmetadetalle: SelectItem[] = [{ label: '...', value: null }];

  @Output() calcularTotalesQuejas = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthmatrizcorrelaciondetalle', 'DETALLE', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
   
  }

  ngAfterViewInit() {
  }
  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.cdepartamento)) {
          return 'NO SE HA DEFINIDO LAS UNIDADES / PROCESOS INTERNOS ' + (Number(i) + 1) + ' DE LA MATRIZ DE CORRELACIÓN';
        }
        if (this.estaVacio(reg.cmetadetalle)) {
          return 'NO SE HA DEFINIDO EL PRODUCTO O SERVICIO ' + (Number(i) + 1) + ' DE LA MATRIZ DE CORRELACIÓN';
        }
        
      }
    }
    return "";
  }
  crearNuevo() {

    if (this.estaVacio(this.mcampos.cmatriz)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA MATRIZ DE CORRELACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.cmatriz = this.mcampos.cmatriz;
    
    this.registro.aplica = true;
  }

  agregarlinea() {

    if (this.estaVacio(this.mcampos.cmatriz)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA MATRIZ DE CORRELACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.cmatriz=this.mcampos.cmatriz;
    this.registro.cmeta = this.mcampos.cmeta;
    this.registro.aplica = true;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.actualizar();
  

  }
  actualizar() {
    super.actualizar();

  }
  buscarFuncionario(index:any, regi:any){
    for (const i in this.lcdepartamentod) {
      if (this.lcdepartamentod.hasOwnProperty(i)) {
        const reg = this.lcdepartamentod[i];
        if (reg.cdepartamento === regi.cdepartamento ) {
         this.lregistros[index].cfuncionario =reg.cfuncionario;
         return;
        }
        
      }
    }

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

    this.crearDtoConsulta();
    super.consultar();
  } klm

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmatrizdetalle', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

 

  public fijarFiltrosConsulta() {
    //  this.mfiltros.cfuncionario= this.mcampos.cfuncionario;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }
  aplicaAdelanto() {
    this.calcularTotalesEvent.emit();
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

  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.sancionadocfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nombre = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.nombre = this.mcampos.nombre;
    }
  }
 

}
