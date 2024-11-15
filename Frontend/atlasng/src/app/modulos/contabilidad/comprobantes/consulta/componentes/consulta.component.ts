import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import {AppService} from 'app/util/servicios/app.service';

@Component({
  selector: 'app-consulta',
  templateUrl: 'consulta.html'
})
export class ConsultaComponent extends BaseComponent implements OnInit, AfterViewInit {

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
  public ltipopersona: SelectItem[] = [{ label: '...', value: null }, { label: 'CLIENTE', value: 'CL' }, { label: 'PROVEEDOR', value: 'PR' }, { label: 'PERSONA', value: 'PE' }];
  public grabo = false;
  public tipodocumentoselecc: string;
  public totalesComprobanteDebito = 0;
  public totalesComprobanteCredito = 0;
  public actualizosaldo = false;
  public cuadrado = false;
  public persona = false;
  public proveedor = false;
  public cliente = false;
  vienedelibromayor = false;

  constructor(router: Router, dtoServicios: DtoServicios,public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREANATURALES', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
      this.route['queryParams'].subscribe((p: any) => {
        if (p.comprobante) {
          const comprobante = JSON.parse(p.comprobante);
          this.vienedelibromayor = true;
          this.mcampos.anioi = comprobante.anioi;
          this.mcampos.aniof = comprobante.aniof;
          this.mcampos.mesi = comprobante.mesi;
          this.mcampos.mesf = comprobante.mesf;
          this.mcampos.ccuenta = comprobante.ccuenta;
          this.mcampos.tipo = comprobante.tipo;
          this.mcampos.ncuenta = comprobante.ncuenta;
          //this.comprobanteComponent.mfiltros.ccomprobante = comprobante.ccomprobante;
          this.comprobanteComponent.mfiltrosesp.ccomprobante = " = " + comprobante.ccomprobante;
          this.comprobanteComponent.mfiltros.ccompania = comprobante.ccompania;
          this.comprobanteComponent.mfiltros.fcontable = comprobante.fcontable;
          this.comprobanteComponent.mfiltros.particion = comprobante.particion;
          this.detalleComponent.mfiltrosesp.ccomprobante = " = " + comprobante.ccomprobante;
          //this.detalleComponent.mfiltros.ccomprobante = comprobante.ccomprobante;
          this.detalleComponent.mfiltros.ccompania = comprobante.ccompania;
          this.detalleComponent.mfiltros.fcontable = comprobante.fcontable;
          this.detalleComponent.mfiltros.particion = comprobante.particion;
          this.consultar();
        }
      });
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
  codigoBlur(event) {
    if (this.comprobanteComponent.registro.ccomprobante === undefined ) {
      return;
    }
    this.consultaComprobante(this.comprobanteComponent.registro.ccomprobante);
  }

  consultaComprobante(ccomprobante){
    const conComprobante = new Consulta('tconcomprobante','N','ccomprobante',{ccomprobante:ccomprobante},{ccomprobante: " = '" + ccomprobante + "'"});
    this.addConsultaPorAlias('TCONCOMPROBANTE', conComprobante);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any) {
    let reg = resp.TCONCOMPROBANTE;
    if (reg === undefined || reg === null ) {
      super.mostrarMensajeError("NO EXISTE COMPROBANTE");
      return;      
    }else{
      reg.registro = reg;
      this.fijarLovComprobantesSelec(reg);
    }
  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conComprobante = this.comprobanteComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.comprobanteComponent.alias, conComprobante);
    if (this.persona) {
      conComprobante.addSubquery('tperpersonadetalle', 'nombre', 'npersonarecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
      conComprobante.addSubquery('tperpersonadetalle', 'identificacion', 'nidentificacionrecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    } else if (this.proveedor || this.cliente) {
      conComprobante.addSubquery('tperproveedor', 'nombre', 'npersonarecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
      conComprobante.addSubquery('tperproveedor', 'identificacion', 'nidentificacionrecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    }
    conComprobante.addSubquery('tconconcepto', 'nombre', 'nconcepto', 'i.cconcepto = t.cconcepto');
    conComprobante.addSubquery('tconplantilla', 'nombre', 'pnombre', 'i.cplantilla = t.cplantilla');
    conComprobante.addSubquery('tgensucursal', 'nombre', 'nsucursal', 't.csucursal = i.csucursal');
    conComprobante.addSubquery('tgenagencia', 'nombre', 'nagencia', 't.cagencia = i.cagencia   AND t.csucursal = i.csucursal');
    conComprobante.addSubquery('tgencatalogodetalle', 'nombre', 'ntipodocumento', 't.tipodocumentoccatalogo = i.ccatalogo and t.tipodocumentocdetalle = i.cdetalle and t.tipodocumentoccatalogo = 1003');
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
  }

  // Fin CONSULTA *********************

  /**Muestra lov de concepto contables */
  mostrarlovcomprobantes(): void {
    this.lovcomprobantes.mfiltros.ccomprobante = undefined;
    this.lovcomprobantes.mfiltros.numerocomprobantecesantia = undefined;
    this.lovcomprobantes.showDialog();
    //this.lovcomprobantes.consultar();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovComprobantesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      if (typeof reg.registro.fcontable !== 'number') {
        reg.registro.fcontable = reg.registro.fcontable.replace(/-/g, "");
      }
      
      this.comprobanteComponent.mfiltrosesp.ccomprobante = " = " + reg.registro.ccomprobante;
      this.comprobanteComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.comprobanteComponent.mfiltros.particion = reg.registro.particion;
      this.comprobanteComponent.mfiltros.ccompania = reg.registro.ccompania;

      if (reg.registro.tipopersona === 'CL') { this.cliente = true; this.persona = false; this.proveedor = false; }
      else if (reg.registro.tipopersona === 'PR') { this.proveedor = true; this.persona = false; this.cliente = false; }
      else if (reg.registro.tipopersona == 'PE') { this.persona = true; this.proveedor = false; this.cliente = false; }
      else { this.persona = false; this.proveedor = false; this.cliente = false; }

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

    // Agregar parametros
    let tipoComprobante = '';
    if (this.comprobanteComponent.registro.tipodocumentocdetalle === 'INGRES') {
      tipoComprobante = 'Ingreso';
    } else if (this.comprobanteComponent.registro.tipodocumentocdetalle === 'EGRESO') {
      tipoComprobante = 'Egreso';
    } else {
      tipoComprobante = 'Diario';
    }
    this.jasper.parametros['@i_ccomprobante'] = this.comprobanteComponent.registro.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }

  regresarALibroMayor(): void{
    const opciones = {};
    const tran = 205 ;
    opciones['path'] = sessionStorage.getItem('m') + '-'+ tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-'+ tran + ' Acciones';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {skipLocationChange: true, 
                                              queryParams: {comprobante: JSON.stringify({
                                                                                        cmodulo: 10, 
                                                                                        anioi: this.mcampos.anioi,
                                                                                        aniof: this.mcampos.anioi,
                                                                                        mesi: this.mcampos.mesi,
                                                                                        mesf: this.mcampos.mesf,
                                                                                        ccuenta: this.mcampos.ccuenta,
                                                                                        ncuenta: this.mcampos.ncuenta,
                                                                                        tipo: this.mcampos.tipo})}});
    this.appService.titulopagina = opciones['tit'];
  }
  //#endregion
}
