import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ComprobanteComponent } from '../submodulos/comprobante/componentes/_comprobante.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { LovComprobantesComponent } from '../../../lov/comprobante/componentes/lov.comprobantes.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-anular',
  templateUrl: 'anular.html'
})
export class AnularComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovComprobantesComponent)
  private lovcomprobantes: LovComprobantesComponent;

  @ViewChild(ComprobanteComponent)
  comprobanteComponent: ComprobanteComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public lsucursales: SelectItem[] = [{ label: '...', value: null }];

  public lagenciastotal: any = [];

  public lagencias: SelectItem[] = [{ label: '...', value: null }];

  public lregplantilla: any = [];
  public ltipopersona: SelectItem[] = [{ label: '...', value: null },{ label: 'CLIENTE', value: 'CL'},{label:'PROVEEDOR', value:'PR'},{label:'PERSONA',value:'PE'}];
  public grabo = false;
  public tipodocumentoselecc: string;
  public totalesComprobanteDebito = 0;
  public totalesComprobanteCredito = 0;
  public actualizosaldo = false;
  public anulado = false;
  public persona = false;
  public proveedor = false;
  public cliente = false;  

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREANATURALES', false);
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
    const conComprobante = this.comprobanteComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.comprobanteComponent.alias, conComprobante);
    if (this.persona){
      conComprobante.addSubquery('tperpersonadetalle', 'nombre', 'npersonarecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
      conComprobante.addSubquery('tperpersonadetalle', 'identificacion', 'nidentificacionrecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    } else if (this.proveedor || this.cliente){
      conComprobante.addSubquery('tperproveedor', 'nombre', 'npersonarecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
      conComprobante.addSubquery('tperproveedor', 'identificacion', 'nidentificacionrecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    }
    conComprobante.addSubquery('tconconcepto', 'nombre', 'nconcepto', 'i.cconcepto = t.cconcepto');
    conComprobante.addSubquery('tconplantilla', 'nombre', 'pnombre', 'i.cplantilla = t.cplantilla');
    conComprobante.addSubquery('tgensucursal','nombre','nsucursal','t.csucursal = i.csucursal');
    conComprobante.addSubquery('tgenagencia','nombre','nagencia','t.cagencia = i.cagencia   AND t.csucursal = i.csucursal');
    conComprobante.addSubquery('tgencatalogodetalle','nombre','ntipodocumento','t.tipodocumentoccatalogo = i.ccatalogo and t.tipodocumentocdetalle = i.cdetalle and t.tipodocumentoccatalogo = 1003');
    this.addConsultaPorAlias(this.comprobanteComponent.alias, conComprobante);

    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);

  }

  private fijarFiltrosConsulta() {
    this.comprobanteComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.comprobanteComponent.validaFiltrosRequeridos() && this.detalleComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.comprobanteComponent.postQuery(resp);
    const compro = resp.CABECERA;
    this.detalleComponent.postQuery(resp);
    this.calcularTotalesDebitoCredito();
    if (this.comprobanteComponent.registro.actualizosaldo === true) {
      this.actualizosaldo = true;
    }
    else {
      this.actualizosaldo = false;
    }
    if (this.comprobanteComponent.registro.anulado === true) {
      this.anulado = true;
    }
    else {
      this.anulado = false;
    }
  }

  // Fin CONSULTA *********************

  anular(): void {
    this.confirmationService.confirm({
      message: 'Está seguro de anular el comprobante?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.anular = true;
        this.grabar();
      },
      reject: () => {
      }
    });
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.rqMantenimiento.mdatos.ccomprobante = this.comprobanteComponent.registro.ccomprobante;
    this.rqMantenimiento.mdatos.fcontable = this.comprobanteComponent.registro.fcontable;
    this.rqMantenimiento.mdatos.ccompania = this.comprobanteComponent.registro.ccompania;
    this.rqMantenimiento.mdatos.actualizarsaldos = true;

    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.comprobanteComponent.alias, this.comprobanteComponent.getMantenimiento(1));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.registro.mdatos.ccomprobanteEspejo = resp.ccomprobanteEspejo;
    this.registro.mdatos.numerocomprobantecesantiaEspejo = resp.numerocomprobantecesantiaEspejo;
    this.actualizosaldo = false;
    if (resp.cod === 'OK') {
      this.comprobanteComponent.registro.anulado = true;
    }
    else {
      this.comprobanteComponent.registro.anulado = false;
    }
  }


  /**Muestra lov de concepto contables */
  mostrarlovcomprobantes(): void {
    this.lovcomprobantes.mfiltros.anulado = false;
    this.lovcomprobantes.mfiltros.actualizosaldo = true;
    this.lovcomprobantes.mfiltros.eliminado = false;
    this.lovcomprobantes.mfiltros.automatico = false;
    this.lovcomprobantes.mfiltros.ccomprobante = undefined;
    this.lovcomprobantes.mfiltros.numerocomprobantecesantia = undefined;
    this.lovcomprobantes.mfiltros.fcontable = this.dtoServicios.mradicacion.fcontable;


    this.lovcomprobantes.mfiltrosesp.ccomprobante = 'NOT IN (SELECT ccomprobanteanulacion	 FROM tconcomprobante WHERE ccomprobanteanulacion IS not null)';
    this.lovcomprobantes.mfiltros.particion = this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)
                                            + this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6);
    this.lovcomprobantes.showDialog();
    //this.lovcomprobantes.consultar();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovComprobantesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      reg.registro.fcontable = reg.registro.fcontable.replace(/-/g, "");
      this.comprobanteComponent.mfiltrosesp.ccomprobante = " = " + reg.registro.ccomprobante;
      this.comprobanteComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.comprobanteComponent.mfiltros.particion = reg.registro.particion;
      this.comprobanteComponent.mfiltros.ccompania = reg.registro.ccompania;

      if (reg.registro.tipopersona === 'CL'){ this.cliente = true; this.persona = false; this.proveedor = false; }
      else if (reg.registro.tipopersona === 'PR'){this.proveedor = true; this. persona = false; this.cliente = false;}
      else if (reg.registro.tipopersona == 'PE'){ this.persona = true; this.proveedor = false; this.cliente = false;}
      else {this.persona = false; this.proveedor = false; this.cliente = false;}

      this.detalleComponent.mfiltrosesp.ccomprobante = " = " + reg.registro.ccomprobante;
      this.detalleComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.detalleComponent.mfiltros.particion = reg.registro.particion;
      this.detalleComponent.mfiltros.ccompania = reg.registro.ccompania;

      this.msgs = [];
      this.consultar();
    }

  }

  consultarCatalogos(): void {
  }



  public calcularTotalesDebitoCredito() {
    let sumatoriodebito = 0;
    let sumatoriocredito = 0;
    let totalesdebito = 0;
    let totalescredito = 0;
    let monto = 0;

    //Fondos administrados
    // tslint:disable-next-line:forin
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.monto !== null || reg.monto !== undefined) {
        monto = 0
      } else {
        monto = reg.monto;
      }

      if (reg.debito == true) {
        sumatoriodebito = sumatoriodebito + reg.monto;
      } else {
        sumatoriocredito = sumatoriocredito + reg.monto;
      }
    }
    this.detalleComponent.totalCreditoFA = sumatoriocredito;
    this.detalleComponent.totalDebitoFA = sumatoriodebito;

    totalesdebito = totalesdebito + sumatoriodebito;
    totalescredito = totalescredito + sumatoriocredito;

    //Administradora de Fondos
    sumatoriodebito = 0;
    sumatoriocredito = 0;
    monto = 0;

    //Totales
    totalesdebito = totalesdebito + sumatoriodebito;
    totalescredito = totalescredito + sumatoriocredito;
    this.totalesComprobanteCredito = totalescredito;
    this.totalesComprobanteDebito = totalesdebito;

  }

  //#region Reporte
  descargarReporte(): void {
    if (this.comprobanteComponent.registro.ccomprobante === undefined) {
      super.mostrarMensajeError('Por favor seleccione un comprobante');
      return;
    }

    this.jasper.nombreArchivo = this.comprobanteComponent.registro.numerocomprobantecesantia;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    let tipoComprobante = '';
    if (this.comprobanteComponent.registro.tipodocumentocdetalle === 'INGRES') {
      tipoComprobante = 'Ingreso';
    } else if (this.comprobanteComponent.registro.tipodocumentocdetalle === 'EGRESO') {
      tipoComprobante = 'Egreso';
    } else {
      tipoComprobante = 'Diario';
    }
    // Agregar parametros
    this.jasper.parametros['@i_ccomprobante'] = this.comprobanteComponent.registro.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
  //#endregion
}
