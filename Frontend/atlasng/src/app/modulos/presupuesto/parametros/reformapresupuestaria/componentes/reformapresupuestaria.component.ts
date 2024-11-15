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
import { LovPartidaGastoComponent } from '../../../lov/partidagasto/componentes/lov.partidagasto.component';
import { JasperComponent } from 'app/util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-reformapresupuestaria', 
  templateUrl: 'reformapresupuestaria.html'
})
export class ReformaPresupuestariaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  
  @ViewChild(LovPartidaGastoComponent)
  private lovpartidagasto: LovPartidaGastoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REFORMA', false);
  }

  esnuevo = true;
  
  ngOnInit() {
    this.componentehijo = this;
    this.cabeceraComponent.registro.freforma = this.fechaactual;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    //Consulta datos.
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


  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    this.cabeceraComponent.registro.valor = this.detalleComponent.totaldecremento;
    this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
    this.cabeceraComponent.actualizar();
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
      const creforma = resp.creforma;
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.esnuevo = false;
      this.msgs = [];
      this.descargarReporte(creforma);
    }
  }

  validarGrabar(): string {
    let mensaje: string = '';
  
    if (this.cabeceraComponent.registro.infoadicional === null || this.cabeceraComponent.registro.infoadicional === undefined) {
      mensaje = 'INGRESE COMENTARIO';
    }
    //CCA cambios en reforma para que permita el Incremento o Decremento 20200416
    /*if (this.detalleComponent.totaldecremento !== this.detalleComponent.totalincremento){
      mensaje += '<BR> TOTAL DE VALORES POR DECREMENTO ES DIFERENTE A TOTAL DE VALORES POR INCREMENTO';
    }*/
   
    return mensaje;
  }


  /**Muestra lov de compromiso */
  mostrarlovpartidagasto(): void {
    this.lovpartidagasto.mfiltros.movimiento = true;
    this.lovpartidagasto.showDialog();
  }

  /**Retorno de lov de Compromiso presupuestario. */
  fijarLovPartidaGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cpartidabeneficiaria = reg.registro.cpartidagasto;
      this.mcampos.vasignacioninicial = reg.registro.vasignacioninicial;
      this.mcampos.vmodificado = reg.registro.vmodificado;
      this.mcampos.vcodificado = reg.registro.vcodificado;
      this.mcampos.vcertificado = reg.registro.vcertificado;
      this.mcampos.vcomprometido = reg.registro.vcomprometido;
      this.mcampos.vdevengado = reg.registro.vdevengado;
      this.mcampos.npartida = reg.registro.nombre;
    }

  }

  consultarCatalogos(): void {
  }

  descargarReporte(creforma): void {

    // Agregar parametros
    this.jasper.parametros['@i_creforma'] = creforma;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptReformaPresupuestaria';
    this.jasper.generaReporteCore();
  }

}
