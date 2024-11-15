import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { LovCompromisoComponent } from '../../../lov/compromiso/componentes/lov.compromiso.component';
import { LovPartidaGastoComponent } from '../../../lov/partidagasto/componentes/lov.partidagasto.component';
import { JasperComponent } from 'app/util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-anularcompromiso',
  templateUrl: 'anularcompromiso.html'
})
export class AnularCompromisoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCompromisoComponent)
  private lovcompromiso: LovCompromisoComponent;

  public nuevo = true;
  public eliminado = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREARCOMPROMISO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.cabeceraComponent.mcampos.fingreso = this.fechaactual;
    super.init(this.formFiltros);
    this.consultarCatalogos();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);

    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);

  }

  private fijarFiltrosConsulta() {
    this.cabeceraComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.cabeceraComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
  }

  // Fin CONSULTA *********************
  guardarCambios(): void {
    this.grabar();
  }


  anularCompromiso(): void {
    if (this.cabeceraComponent.registro.estadocdetalle != 'CERTIF') {
      super.mostrarMensajeError('NO SE PUEDE ANULAR REGISTRO CON ESTADO DIFERENTE DE INGRESO');
      return;
    }
    else {
      this.grabar();
    }
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.cabeceraComponent.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario ;
    this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    this.cabeceraComponent.registro.estadocdetalle = 'LIBERA';
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.msgs = [];
      this.descargarReporte();
    }
  }

  validarRegistrosDetalle(): boolean {
    return true;
  }

  validarGrabar(): string {
    let mensaje: string = '';
    return mensaje;
  }


  /**Muestra lov de compromiso */
  mostrarlovCompromiso(): void {
    this.lovcompromiso.mfiltros.estadocdetalle = 'CERTIF';
    this.lovcompromiso.showDialog(true);
  }

  /**Retorno de lov de Compromiso presupuestario. */
  fijarLovCompromisoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.ccompromiso = reg.registro.ccompromiso;
      this.detalleComponent.mfiltros.ccompromiso = reg.registro.ccompromiso;
      this.msgs = [];
      this.consultar();
    }

  }

  consultarCatalogos(): void {
  }

  calcularTotales() {
  }

  descargarReporte(): void {
    this.jasper.parametros['@i_ccompromiso'] = this.cabeceraComponent.registro.ccompromiso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAnulacionPresupuestaria';
    this.jasper.generaReporteCore();
  }

}
