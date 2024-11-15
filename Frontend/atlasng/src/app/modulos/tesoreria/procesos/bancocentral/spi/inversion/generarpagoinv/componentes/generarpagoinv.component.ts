import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-reporte-generarpagoinv',
  templateUrl: 'generarpagoinv.html'
})
export class GenerarPagoInvComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  comportamiento: boolean = false;
  public lempresa: SelectItem[] = [{ label: '...', value: null }];
  selectedRegistros;
  public lempresatotal: any[];
  public lhistoricopagos: any[];
  graba: boolean = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'GENERARPAGOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    //super.init(this.formFiltros);
    this.mfiltros.esproveedor = true;
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    //this.rqConsulta = { 'mdatos': {} };
    //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    // if (!this.validaFiltrosConsulta()) {
    //   return;

    // }
    this.crearDtoConsulta();
    super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }


  public crearDtoConsulta(): Consulta {
    //this.fijarFiltrosConsulta();
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 1;
    this.mfiltros.tipotransaccion = 'I';
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'modulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    //  this.mfiltros.activo = 0;
  }


  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    const mfiltrosEmpresa: any = { verreg: 0, integracion: true };
    const conEmpresa = new Consulta('ttesempresa', 'Y', 't.nombre', mfiltrosEmpresa, {});
    conEmpresa.cantidad = 10;
    this.addConsultaCatalogos('EMPRESA', conEmpresa, this.lempresatotal, this.llenarEmpresa, '', this.componentehijo);
    var x = location.hostname;
    this.ejecutarConsultaCatalogos();
  }

  public llenarEmpresa(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lempresatotal = pListaResp;
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];
        if (!this.componentehijo.estaVacio(reg)) {
          this.componentehijo.lempresa.push({ label: reg.cuentaorigen + ' - ' + reg.nombre, value: reg.cempresa });
        }
      }
    }
  }

  seleccionarEmpresa(event: any): any {
    if (this.estaVacio(this.mcampos.cempresa)) {
      this.mcampos.cuentaorigen = null;
      this.mcampos.nombre = null;
      this.mcampos.localidad = null;
      return;
    }
    var detalle = this.lempresatotal.find(x => x.cempresa === event.value);
    this.mcampos.cuentaorigen = detalle.cuentaorigen;
    this.mcampos.nombre = detalle.nombre;
    this.mcampos.localidad = detalle.localidad;
    this.mcampos.cempresa = detalle.cempresa;
    this.mcampos.subcuenta = detalle.subcuenta;
  }

  Historico(registro: any) {
    this.obtnerhistorialpagos(registro);
    this.mostrarDialogoGenerico = true;
  }

  obtnerhistorialpagos(registro) {

    this.rqConsulta.CODIGOCONSULTA = 'HISTORICOPAGO';
    this.rqConsulta.storeprocedure = "sp_TesConObtenerHistorialPagos";
    this.rqConsulta.parametro_ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.parametro_verreg = -1;
    this.rqConsulta.parametro_tipotransaccion = 'P';
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaHistorial(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaHistorial(resp: any) {

    this.lhistoricopagos = [];
    if (resp.cod === 'OK') {
      this.lhistoricopagos = resp.HISTORICOPAGO;
      this.rqConsulta = { 'mdatos': {} };
    }
  }

  grabar(): void {


    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.cempresa = this.mcampos.cempresa;
    this.rqMantenimiento.mdatos.proveedor = this.mfiltros.esproveedor;
    this.rqMantenimiento.mdatos.GENERARPAGOS = this.lregistros;
    this.rqMantenimiento.mdatos.generar = true;

    //this.rqMantenimiento.mdatos["INFORMACIONEMPRESA"] = this.lempresa;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.selectedRegistros = [];
      this.registro.nombre = resp.spigenerado.nombre;
      this.registro.tipo = resp.spigenerado.tipo;
      this.registro.archivoDescarga = resp.spigenerado.contenido;
      this.registro.extension = resp.spigenerado.extension;
      this.descargaAdjunto(this.registro);
      this.enproceso = false;
      this.consultar();
    }
  }

  descargaAdjunto(registro: any) {
    const linkElement = document.createElement('a');
    let bytes = registro.archivoDescarga;
    let base = this.arrayBufferToBase64(bytes);
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.tipo });
    const bloburl = URL.createObjectURL(blob);
    if (registro.extension === 'pdf') {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombre;
      //  linkElement.click();
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);
    }
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  tomarRegistrosReenviar(): boolean {
    this.graba = false;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        for (const j in this.selectedRegistros) {
          if (this.selectedRegistros.hasOwnProperty(j)) {
            const mar: any = this.selectedRegistros[j];
            if (reg !== undefined && mar !== undefined && reg.ctestransaccion === mar.ctestransaccion) {
              reg.mdatos.pagar = true;
              this.graba = true;
            }
          }
        }
      }
    }
    if (this.selectedRegistros === undefined || this.selectedRegistros === null) {
      this.graba = false;
    }
    return this.graba;
  }

  GenerarArchivo() {
    if (this.estaVacio(this.mcampos.cempresa)) {
      this.mostrarMensajeError('INSTITUCIÓN DE ORIGEN DE PAGO REQUERIDA');
      return;
    }
    if (!this.tomarRegistrosReenviar()) {
      this.mostrarMensajeError('DEBE SELECCIONAR REGISTROS PARA GENERACIÓN');
    }
    else {
      this.grabar();
    }
  }
}
