import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CanalesComponent } from '../../../generales/canales/componentes/canales.component';
import { AreasComponent } from '../../../generales/areas/componentes/areas.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { SucursalesComponent } from '../../../generales/sucursales/componentes/sucursales.component';
import { AgenciasComponent } from '../../../generales/agencias/componentes/agencias.component';
import { PerfilesComponent } from '../../../seguridad/perfiles/componentes/perfiles.component';


@Component({
  selector: 'app-usuario-rol',
  templateUrl: '_usuarioRol.html'
})
export class UsuarioRolComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  private perfilesComponent: PerfilesComponent;

  public lperfiles: SelectItem[] = [{ label: '...', value: null }];

  public desabilita = false;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegUsuarioRol', 'PERFILUSUARIO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.verreg = 0;
  }

  actualizar() {
    const nrol = this.buscarNombreRol(this.registro.crol);
    this.registro.mdatos.nrol = nrol;
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
  consultar(cusuario: any = null) {
    this.crearDtoConsulta(cusuario);
    super.consultar();
  }

  public crearDtoConsulta(cusuario: any): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.crol', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsegRol', 'nombre', 'nrol', 'i.crol = t.crol and i.ccompania = t.ccompania');
    if (!this.estaVacio(cusuario)) {
      consulta.addFiltroCondicion('cusuario', cusuario, '=');
    }
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    if (this.mfiltros.cusuario === undefined) {
      this.mostrarMensajeError('USUARIO REQUERIDO');
      return false;
    }
    return true;
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

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.consultar();
    }
  }

  buscarNombreRol(crol) {
    for (const i in this.lperfiles) {
      if (this.lperfiles.hasOwnProperty(i)) {
        const item = this.lperfiles[i];
        if (crol === item.value) {
          return item.label;
        }
      }
    }
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

    const consultaRol = new Consulta('TsegRol', 'Y', 't.nombre', {}, {});
    consultaRol.cantidad = 1000; //CCA 20221018
    this.addConsultaPorAlias('PERFILES', consultaRol);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lperfiles, resp.PERFILES, 'crol');
    }
    this.lconsulta = [];
  }

}
