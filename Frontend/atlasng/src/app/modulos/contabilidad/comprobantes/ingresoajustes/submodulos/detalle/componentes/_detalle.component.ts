import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovConceptoContablesComponent } from '../../../../../lov/conceptocontables/componentes/lov.conceptoContables.component';
import { LovPlantillasComprobanteComponent } from '../../../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { LovCuentasContablesComponent } from '../../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { DetallePlantillasComprobanteComponent } from '../../../../../parametros/detalleplantillascomprobante/componentes/detallePlantillasComprobante.component';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPlantillasComprobanteComponent)
  private lovplantillasComprobante: LovPlantillasComprobanteComponent;

  @ViewChild(LovConceptoContablesComponent)
  private lovconceptoContables: LovConceptoContablesComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  @Output() calcularTotalesDebitoCreditoEvent = new EventEmitter();

  public lregplantilla: any = [];
  public totalDebito = 0;
  public totalCredito = 0;
  indice: number;
  ccuenta = '';
  ccompromiso = '';
  cpartidagasto = '';
  centrocostoscdetalle = '';
  public ldatos: any = [];

  public lcentrocostoscdetalle: SelectItem[] = [{ label: '...', value: null }];

  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconComprobanteDetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.centrocostosccatalogo = 1002;
    this.registro.centrocostoscdetalle = this.centrocostoscdetalle !== ''? this.centrocostoscdetalle: null;
    this.registro.debito = true;
  }

  agregarCuenta() {
    super.crearnuevoRegistro();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.centrocostosccatalogo = 1002;
    this.registro.centrocostoscdetalle = this.centrocostoscdetalle !== ''? this.centrocostoscdetalle: null;    
    this.registro.debito = true;
    this.actualizar();
  }

  cuentaFocus(reg: any, index: number) {
    this.indice = index;
    this.ccuenta = reg.ccuenta;
  }

  cuentaBlur(reg: any, index: number) {

    if (reg.ccuenta === '') {
      return;
    }

    if (reg.ccuenta === this.ccuenta) {
      return;
    }

    this.rqConsulta.CODIGOCONSULTA = 'CONSULTACUENTACONTABLE';
    this.rqConsulta.storeprocedure = "sp_ConConsultarCuentaContable";
    this.rqConsulta.parametro_ccuenta = reg.ccuenta;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  private manejaRespuesta(resp: any) {
    if (resp.cod === 'OK')
    {
      if (resp.ldatos == null && resp.ldatos == undefined ) {  
        super.mostrarMensajeError('NO SE CARGARON REGISTROS');                
        return;
      }
    }
    else{
      super.mostrarMensajeError(resp.msgusu);
    }
    
    this.lregistros = resp.ldatos;
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  cpartidagastoFocus(reg: any, index: number) {
    this.indice = index;
    this.cpartidagasto = reg.cpartidagasto;
  }

  ccompromisoFocus(reg: any, index: number) {
    this.indice = index;
    this.ccompromiso = reg.ccompromiso;
  }

  presupuestoBlur(reg: any, index: number) {

    if ((reg.ccompromiso === this.ccompromiso) && (reg.cpartidagasto === this.cpartidagasto)) {
      return;
    }

    if (reg.ccuenta === undefined) {
      this.lregistros[index].ccompromiso = undefined;
      this.lregistros[index].cpartidagasto = undefined;
      return;
    }

    if (reg.ccompromiso === undefined || reg.cpartidagasto === undefined || reg.ccompromiso === '' || reg.cpartidagasto === '') {
      return;
    }


    delete this.rqConsulta.parametro_ccuenta;
    this.rqConsulta.CODIGOCONSULTA = 'PPT_COMPROMISOPARTIDAGASTO';
    this.rqConsulta.storeprocedure = "sp_PptConCompromisoPartidaGasto";
    this.rqConsulta.parametro_ccompromiso = reg.ccompromiso;
    this.rqConsulta.parametro_cpartidagasto = reg.cpartidagasto;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCompromiso(resp, index);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  private manejaRespuestaCompromiso(resp: any, index: number) {
    let compromiso;
    if (resp.PPT_COMPROMISOPARTIDAGASTO.length === 1) {
      compromiso = resp.PPT_COMPROMISOPARTIDAGASTO[0];
      this.lregistros[index].ccompromiso = compromiso.ccompromiso;
      this.lregistros[index].cpartidagasto = compromiso.cpartidagasto;
    }
    else {
      this.lregistros[index].ccompromiso = undefined;
      this.lregistros[index].cpartidagasto = undefined;
    }
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  debitoChange(reg: any, index: number, value: boolean) {
    this.cambiarMonto();
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.calcularTotalesDebitoCreditoEvent.emit();
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccomprobante', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalogo', 'tipoplancdetalle', 'tipoplancdetalle', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tgencatalogodetalle', 'cdetalle', 'ncentrocostoscdetalle', 'i.ccatalogo = 1002 and i.cdetalle = t.centrocostoscdetalle');
    consulta.cantidad = 2000;
    this.addConsulta(consulta);

    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    let registros: any;

    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      if (reg.monto !== 0) {
        registros.push(reg);
      }
    }

    this.lregistros = registros;
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);

  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de concepto contables */
  mostrarlovconceptoContable(): void {
    this.lovconceptoContables.showDialog();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovConceptoContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;

    }
  }

  /**Muestra lov de plantillas comprobante */
  mostrarlovplantillasComprobante(): void {
    this.lovplantillasComprobante.showDialog();
  }

  crearNuevoRegistro() {
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    super.crearnuevoRegistro();

  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovcuentasContables.mfiltros.activa = true;
    this.lovcuentasContables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.tipoplancdetalle = reg.registro.tipoplancdetalle;
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuenta = reg.registro.ccuenta;
      this.registro.cmoneda = reg.registro.cmoneda;
    }

  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1002;
    const conCentroCostos = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CENTROCOSTOS', conCentroCostos, this.lcentrocostoscdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  private cerrarDialogo(): void {
    this.setCentroCostos();
    this.calcularTotalesDebitoCreditoEvent.emit();
  }

  setCentroCostos(): void{
    this.centrocostoscdetalle = this.registro.centrocostoscdetalle;
  }

  cambiarMonto(): void {
    this.calcularTotalesDebitoCreditoEvent.emit();
  }

  uploadHandler(event) {
    const file = event.files[0];
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivo);
    fReader.readAsDataURL(file);
    this.rqConsulta.CODIGOCONSULTA = 'MASIVOCOMPROBANTESAJUSTES';
    this.rqConsulta.mdatos.narchivo = file.name;
    this.rqConsulta.mdatos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.rqConsulta.mdatos.tipo = file.type;
    this.rqConsulta.mdatos.tamanio = file.size / 1000; // bytes/1000
    this.rqConsulta.mdatos.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.rqConsulta.mdatos.cargaajstes = "cargaajstes";
    
  }
  ejecutarConsultaCarga(){
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
    resp => {
      this.manejaRespuesta(resp);
    },
    error => {
      this.dtoServicios.manejoError(error);
    });
  }
  actualizaArchivo = (event) => {
    this.rqConsulta.mdatos.archivo = event.srcElement.result.split('base64,')[1];
    this.ejecutarConsultaCarga();
  }

  
}
