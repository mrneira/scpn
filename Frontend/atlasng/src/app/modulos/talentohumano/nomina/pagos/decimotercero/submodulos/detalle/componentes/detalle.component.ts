import { Component, OnInit, AfterViewInit, ViewChild ,Output,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovFuncionariosComponent } from '../../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoReferencia = new EventEmitter();
  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomdecimotercero', 'DECIMO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cnomina)){
      this.mostrarMensajeError("ELIJA PRIMERO UNA NÓMINA PARA AGREGAR LOS FUNCIONARIOS");
      return;
    }
    super.crearNuevo();
    this.registro.cnomina= this.mcampos.cnomina;
    
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
    if (this.estaVacio(this.mcampos.cnomina)) {
      this.mostrarMensajeError('ELIJA UNA NÓMINA PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.crol', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle','primerapellido+ \' \'+ primernombre + \' \' + segundonombre','nfuncionario','i.cfuncionario= t.cfuncionario and i.verreg = 0' );
    consulta.addSubquery('tthfuncionariodetalle','documento','ndocumento','i.cfuncionario= t.cfuncionario and i.verreg = 0' );
    
    consulta.addSubquery('tthcargo','nombre','ncargo','i.ccargo= t.ccargo' );
    consulta.addSubquery('tthdepartamento','nombre','ndepartamento','i.cdepartamento= t.cdepartamento' );
    consulta.addSubquery('tthproceso','nombre','nproceso','i.cproceso= t.cproceso' );
    
    consulta.addSubqueryPorSentencia("SELECT tgc.nombre FROM tgencatalogodetalle tgc,tthcontratodetalle ccd WHERE tgc.ccatalogo =ccd.regimenccatalogo AND tgc.cdetalle=ccd.regimencdetalle AND ccd.ccontrato= t.ccontrato AND ccd.verreg=0","nregimen");
    consulta.addSubqueryPorSentencia("SELECT tgcd.nombre FROM tgencatalogodetalle tgcd,tthcontratodetalle ccdd WHERE tgcd.ccatalogo =ccdd.regionccatalogo AND tgcd.cdetalle=ccdd.regioncdetalle AND ccdd.ccontrato= t.ccontrato AND ccdd.verreg=0","nregion");
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cnomina = this.mcampos.cnomina;
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
    seleccionaRegistro(evento: any) {
      this.eventoReferencia.emit({ registro: evento.data });
    
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
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;
      this.registro.mdatos.nnombre =  reg.registro.primernombre;
      this.registro.mdatos.napellido =reg.registro.primerapellido;
    }
  }



}
