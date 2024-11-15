import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';


@Component({
  selector: 'app-aseguradora',
  templateUrl: 'aseguradora.html'
})
export class AseguradoraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(GestorDocumentalComponent)
  private lovGestor: GestorDocumentalComponent;

  public visible = true;
  public tipodocumento = 'R';
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public codCatalogoInstitucion = 305;
  public codCatalogoTipoCuenta = 306;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsAseguradora', 'ASEGURADORA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.tipoinstitucionccatalogo = this.codCatalogoInstitucion;
    this.registro.tipocuentaccatalogo = this.codCatalogoTipoCuenta;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.caseguradora', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ninstitucion', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
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

    // if (resp.cod === "OK") {
    //   this.enproceso = false;
    //   this.consultar();
    // }
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosBanc: any = { 'ccatalogo': this.codCatalogoInstitucion };
    const consultaBanc = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosBanc, {});
    consultaBanc.cantidad = 100;
    this.addConsultaCatalogos('BANCOS', consultaBanc, this.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTcta: any = { 'ccatalogo': this.codCatalogoTipoCuenta };
    const consultaTcta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosTcta, {});
    consultaTcta.cantidad = 100;
    this.addConsultaCatalogos('TIPOCUENTA', consultaTcta, this.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

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
      this.visible = true;

    }
  }

  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }

}
