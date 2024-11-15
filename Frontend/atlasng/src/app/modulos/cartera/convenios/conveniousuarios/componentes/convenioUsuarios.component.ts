import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovUsuariosComponent } from '../../../../seguridad/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-convenio',
  templateUrl: 'convenioUsuarios.html'
})
export class ConvenioUsuariosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovusuarios')
  private lovusuarios: LovUsuariosComponent;

  public lconvenios: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarConvenioUsuario', 'CONVENIOUSUARIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cconvenio = this.mfiltros.cconvenio;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable);
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cusuario', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select p.nombre from tsegusuariodetalle u, tperpersonadetalle p ' +
      'where u.cpersona = p.cpersona and u.ccompania = p.ccompania and u.verreg = p.verreg and u.verreg = 0 ' +
      'and u.cusuario = t.cusuario', 'npersona');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
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
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaConvenios = new Consulta('TcarConvenio', 'Y', 't.nombre', {}, {});
    consultaConvenios.cantidad = 100;
    this.addConsultaCatalogos('CONVENIOS', consultaConvenios, this.lconvenios, super.llenaListaCatalogo, 'cconvenio');

    this.ejecutarConsultaCatalogos();
  }

  /**Muestra lov de usuarios */
  mostrarLovUsuarios(): void {
    this.lovusuarios.showDialog();
  }

  /**Retorno de lov de usuarios. */
  fijarLovUsuarios(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.registro.mdatos.npersona = reg.registro.mdatos.npersona;
      this.registro.cusuario = reg.registro.mdatos.cusuario;
    }
  }

  cambiarConvenio(event: any): any {
    if (this.estaVacio(this.mfiltros.cconvenio)) {
      return;
    }
    this.consultar();
  }
}
