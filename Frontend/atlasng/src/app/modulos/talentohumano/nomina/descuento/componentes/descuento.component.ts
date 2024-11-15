import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovDescuentoComponent } from '../../../lov/descuento/componentes/lov.descuento.component';
import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';
@Component({
  selector: 'app-descuento',
  templateUrl: 'descuento.html'
})
export class DescuentoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(LovDescuentoComponent)
  private lovDescuento: LovDescuentoComponent;

  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomdescuentopersona', 'DESCUENTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
   
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.anio)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN AÑO VALIDO");
      return;
    }
    if (this.estaVacio(this.mfiltros.mescdetalle)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN MES");
      return;
    }
    super.crearNuevo();
    this.registro.anio = this.mfiltros.anio;
    this.registro.mescdetalle = this.mfiltros.mescdetalle;
    this.registro.mesccatalogo = 4;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.estado= true;
    //this.registro.optlock = 0;
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
  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;
    }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cdescuentop', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesccatalogo and i.cdetalle=t.mescdetalle');
    consulta.addSubquery('tnomdescuento', 'nombre', 'ndescuento', 'i.cdescuento=t.cdescuento');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');

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

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1144 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOBENEFICIO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;


    }
  }
  mostrarLovDescuento(): void {
    this.lovDescuento.mfiltrosigual.asignacion = true;

    this.lovDescuento.showDialog();

  }

  /**Retorno de lov de funcionarios. */
  fijarLovDescuentoSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ndescuento = reg.registro.nombre;
      this.registro.cdescuento = reg.registro.cdescuento;


    }
  }
}
