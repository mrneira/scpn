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

@Component({
  selector: 'app-consulta-egreso',
  templateUrl: 'consultaegreso.html'
})
export class ConsultaEgresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(JasperComponent)
  public jasper1: JasperComponent;

  @ViewChild(JasperComponent)
  public jasper2: JasperComponent;


  @ViewChild(LovEgresosComponent)
  private lovegresos: LovEgresosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoegresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcargocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lareacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public tienekardex = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREAREGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
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
    // Consulta datos.
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    conComprobante.addSubquery('tperpersonadetalle', 'nombre', 'nfuncionario', 't.cusuariorecibe = i.cpersona and i.verreg = 0');
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);

    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);

  }

  consultarDatosFuncionario() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_OBTDATFUNCIONARIO';
    this.rqConsulta.storeprocedure = "sp_AcfConObtenerDatosFuncionario";
    this.rqConsulta.parametro_cegreso = this.cabeceraComponent.registro.cegreso;

    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaFuncionario(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaFuncionario(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_OBTDATFUNCIONARIO;
      this.registro.mdatos.ccargo = resp.AF_OBTDATFUNCIONARIO[0].ccargo;
      this.registro.mdatos.ncargo = resp.AF_OBTDATFUNCIONARIO[0].ncargo;
      this.registro.mdatos.cproceso = resp.AF_OBTDATFUNCIONARIO[0].cproceso;
      this.registro.mdatos.nproceso = resp.AF_OBTDATFUNCIONARIO[0].nproceso;
    }
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
    this.detalleComponent.calcularTotales();
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;
    this.consultarDatosFuncionario();
  }

  // Fin CONSULTA *********************
  
  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
  }


  /**Muestra lov de egresos */
  mostrarlovegresos(): void {   
    this.lovegresos.mfiltrosesp.cusuariorecibe = 'not in (\'CUSTODIOAF\')';
    this.lovegresos.consultar();
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

    const conUsuarios = new Consulta('tperpersonadetalle', 'Y', 't.nombre', {}, {});
    conUsuarios.addSubquery('tsegusuariodetalle', 'ccompania', 'ncompania', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.ccompania=1 AND i.optlock = i.veractual and t.verreg = i.verreg and i.verreg=0')
    conUsuarios.cantidad = 100;
    this.addConsultaCatalogos('USUARIOS', conUsuarios, this.lcusuariorecibe, super.llenaListaCatalogo, 'cpersona');

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
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1308;
    const conCargo = this.catalogoDetalle.crearDtoConsulta();
    conCargo.cantidad = 50;
    this.addConsultaCatalogos('CARGOS', conCargo, this.lcargocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cegreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un egreso');
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
