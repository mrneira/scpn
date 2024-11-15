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
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovEgresosComponent } from '../../../lov/egresos/componentes/lov.egresos.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { CabeceraRoutingModule } from 'app/modulos/activosfijos/activosfijos/consultaegreso/submodulos/cabecera/cabecera.routing';

@Component({
  selector: 'app-asignar-producto-funcionarios',
  templateUrl: 'asignarproductofuncionarios.html'
})
export class AsignarProductoFuncionariosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovEgresosComponent)
  private lovegresos: LovEgresosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoegresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcargocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lareacdetalle: SelectItem[] = [{ label: '...', value: null }];

  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'ASIGNARPRODUCTO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.mcampos.fecha = this.fechaactual;
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
    // Consulta datos.
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

  finalizarIngreso(): void {
    this.grabar();
  }

  eliminarComprobante(): void {
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    let mensaje = this.validarIngreso();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    this.rqMantenimiento.mdatos.fecha = this.fechaactual;
    this.rqMantenimiento.mdatos.tipomovimiento = this.cabeceraComponent.registro.tipoegresocdetalle;
    this.rqMantenimiento.mdatos.kardexproductocodificado = true;
    this.rqMantenimiento.mdatos.cegreso = this.cabeceraComponent.registro.cegreso;
    this.rqMantenimiento.mdatos.cusuarioasignado = this.cabeceraComponent.registro.cusuariorecibe;
    this.rqMantenimiento.mdatos.infoadicional = this.detalleComponent.lregistros;
    this.lmantenimiento = []; // Encerar Mantenimiento
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
      this.grabo = true;
    }
    this.router.navigate([''], {skipLocationChange: true});
     }


  /**Muestra lov de egresos */
  mostrarlovegresos(): void {
    this.lovegresos.mfiltros.tienekardex = true;
    this.lovegresos.mfiltros.estadocdetalle = "EGRESA";
    this.lovegresos.mfiltros.movimiento = 'A';
    this.lovegresos.showDialog(true);
  }


  /**Retorno de lov de concepto contables. */
  fijarLovEgresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.detalleComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.msgs = [];
      this.consultar();
    }

  }


  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1305;
    const conTipoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoEgreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOEGRESO', conTipoEgreso, this.ltipoegresocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1306;
    const conEstadoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoEgreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOEGRESO', conEstadoEgreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    const consultaFuncionarios = new Consulta('tthfuncionariodetalle', 'Y', 't.primernombre + t.primerapellido', { verreg: 0 }, {});
    consultaFuncionarios.cantidad = 500;
    this.addConsultaCatalogos('FUNCIONARIO', consultaFuncionarios, this.detalleComponent.lcusuariorecibe, this.llenaListaUsuarioRecibe, 'cpersona', null);

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaUsuarioRecibe(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    while (pLista.length > 0) {
      pLista.pop();
    }
    if (agregaRegistroVacio) {
      pLista.push({ label: '...', value: null });
    }
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];
        pLista.push({ label: reg.primernombre + ' ' + reg.primerapellido, value: reg.cpersona });
      }
    }
  }

  validarIngreso(): string {
    let contadorRegistros = 0;
    let contadorNoIngresados = 0;

    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      contadorRegistros++;
      if (reg.mdatos.serial === '' || reg.mdatos.serial === undefined || reg.mdatos.cbarras === '' || reg.mdatos.cbarras === undefined
        || reg.mdatos.cusuariorecibe === '' || reg.mdatos.cusuariorecibe === undefined ) {
        contadorNoIngresados++;
      }
    }
    if (contadorNoIngresados > 0) {
      return 'Existen ' + contadorNoIngresados.toString() + ' productos que no tienen número de serie y/o código de barras, Usuarios asignados';
    } else { return ''; }

  }
 
  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cegreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cegreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';

    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_cegreso'] = this.cabeceraComponent.registro.cegreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteEgresoDeBodega';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
