import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-archivos-descuentos',
  templateUrl: 'archivosDescuentos.html'
})
export class ArchivosDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  selectedRegistros;
  public ltotales: any = [];
  public ldescuentos: any = [];
  public lparticion: SelectItem[] = [{ label: "...", value: null }];
  public ltipoarchivo: SelectItem[] = [{ label: "...", value: null }];
  public lbancos: any = [];
  public ldetallebancos: any = [];
  public ldetalle: any = [];
  public mostrarDialogoDetalle = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarDescuentosArchivo', 'ARCHIVOSDESCUENTOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.ffin = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.archivoinstituciondetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'narchivo', 'i.ccatalogo = t.archivoinstitucioncodigo and i.cdetalle = t.archivoinstituciondetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nestado', 'i.ccatalogo = t.ccatalogoestado and i.cdetalle = t.cdetalleestado');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.ltipoarchivo = [];
    this.ltotales = [];
    this.lbancos = [];
    this.ldetallebancos = [];
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.particion)) {
      super.mostrarMensajeError("FECHA ES REQUERIDO")
      return false;
    }
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.ltipoarchivo = [];
    if (resp.cod === "OK") {
      this.ltipoarchivo.push({ label: '...', value: null });
      for (const i in resp.ARCHIVOSDESCUENTOS) {
        if (resp.ARCHIVOSDESCUENTOS.hasOwnProperty(i)) {
          const reg = resp.ARCHIVOSDESCUENTOS[i];
          this.ltipoarchivo.push({ label: reg.mdatos.narchivo, value: { archivo: reg.archivoinstituciondetalle, estado: reg.cdetalleestado } });
        }
      }
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    // Archivo seleccionado
    this.registro = this.lregistros.find(x => x.archivoinstituciondetalle === this.mcampos.cinstitucion.archivo);
    this.registro.cdetalleestado = 'GEN';
    this.registro.farchivo = this.dtoServicios.mradicacion.fcontable;
    this.registro.cusuarioarchivo = this.dtoServicios.mradicacion.cusuario;
    this.selectRegistro(this.registro);
    this.actualizar();

    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }
  // Fin MANTENIMIENTO *********************

  imprimir(resp: any): void {
    if (!this.validarFiltrosImprimir()) {
      return;
    }
    this.jasper.nombreArchivo = this.mfiltros.particion + ' - ' + this.mcampos.cinstitucion.archivo;

    // Agregar parametros
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['@i_FIni'] = this.mfiltros.particion;
    this.jasper.parametros['@i_archivocdetalle'] = this.mcampos.cinstitucion.archivo;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoDescuentos';
    this.jasper.generaReporteCore();
  }

  imprimirArchivo(): void {
    if (!this.validarFiltrosImprimir()) {
      return;
    }

    const linkElement1 = document.createElement('a');
    let data = "";
    const separador = ('\t');
    const salto = ('\r\n');

    for (const i in this.ldescuentos) {
      if (this.ldescuentos.hasOwnProperty(i)) {
        const reg = this.ldescuentos[i];

        switch (this.mcampos.cinstitucion.archivo) {
          case 'COM':
            data = data + i + separador +
              reg.coperacion + separador +
              reg.identificacion + separador +
              reg.nombre + separador +
              reg.monto.toFixed(2) + separador +
              reg.TipoProducto + salto;
            break;
          case 'ISP':
            data = data + reg.identificacion + separador +
              (reg.nombre.substring(0, 30) + String(' ').repeat(30)).substr(0, 30) + separador +
              super.rellenaCaracteres(reg.monto.toFixed(2), '0', 8) + salto;
            break;
          case 'BAN':
            data = data + reg.coperacion + separador +
              reg.identificacion + separador +
              reg.nombre + separador +
              reg.ctipoproducto + separador +
              '02' + separador +
              reg.monto + separador +
              '69' + separador +
              reg.fgeneracion + separador +
              reg.TipoProducto + separador +
              'NA' + separador +
              '0' + separador +
              'NA' + separador +
              reg.tipopersona + separador +
              reg.NomProducto + salto;
            break;
        }
      }
    }

    const blob = new Blob([data], { type: 'application/octet-stream' });
    const bloburl = URL.createObjectURL(blob);
    linkElement1.href = bloburl;
    var Fecha = new Date();
    var mes = Fecha.getMonth() + 1;
    var dia = Fecha.getDate();
    var respmes = '';
    var respdia = '';
    if (mes < 10) {
      respmes = '0'
    }
    if (dia < 10) {
      respdia = '0'
    }
    linkElement1.download = this.mfiltros.particion + ' - ' + this.mcampos.cinstitucion.archivo;
    //linkElement.click();
    const clickEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': false
    });
    linkElement1.dispatchEvent(clickEvent);
  }

  validarFiltrosImprimir(): boolean {
    if (this.estaVacio(this.mfiltros.particion)) {
      super.mostrarMensajeError('SELECCIONE LA FECHA DE GENERACIÓN DE ARCHIVOS');
      return false;
    }
    if (this.estaVacio(this.mcampos.cinstitucion)) {
      super.mostrarMensajeError('SELECCIONE LA INSTITUCIÓN');
      return false;
    }
    if (this.estaVacio(this.ltotales)) {
      super.mostrarMensajeError('NO EXISTEN DATOS PARA GENERAR ARCHIVO');
      return false;
    }
    return true;
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosPar: any = { 'pagoaplicado': false };
    const consultaPar = new Consulta('TcarDescuentos', 'Y', 't.particion', {}, {});
    consultaPar.cantidad = 500;
    this.addConsultaCatalogos("DESCUENTOS", consultaPar, null, this.llenarParticion, null, this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarParticion(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];
        const anio = reg.particion.toString().substring(0, 4);
        const inimes = reg.particion.toString().substring(4, 5);
        let mes = '';
        if (inimes === "0") {
          mes = this.componentehijo.lmeses.find(x => x.value === reg.particion.toString().substring(5, 6)).label;
        } else {
          mes = this.componentehijo.lmeses.find(x => x.value === reg.particion.toString().substring(4, 6)).label;
        }
        const nombre: string = anio + ' - ' + mes;
        componentehijo.lparticion.push({ label: nombre, value: reg.particion });
      }
    }
  }

  cambiarDescuento(): any {
    if (this.estaVacio(this.mfiltros.particion) || this.estaVacio(this.mcampos.cinstitucion)) {
      return;
    }
    this.ltotales = [];
    this.lbancos = [];
    this.ldetallebancos = [];
    this.fijarDescuento();
  }

  fijarDescuento() {
    this.rqConsulta.CODIGOCONSULTA = 'DESCUENTOSARCHIVO';
    this.rqConsulta.storeprocedure = "sp_CarConListadoDescuentos";
    this.rqConsulta.parametro_fini = this.mfiltros.particion;
    this.rqConsulta.parametro_archivocdetalle = this.mcampos.cinstitucion.archivo;
    this.dtoServicios.ejecutarConsultaRest(this.rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.ldescuentos = resp.DESCUENTOSARCHIVO;

          // Totalizador de datos
          this.ltotales = [];
          this.lbancos = [];
          if (this.ldescuentos.length > 0) {
            let montoTotal = 0;
            for (const i in resp.DESCUENTOSARCHIVO) {
              if (resp.DESCUENTOSARCHIVO.hasOwnProperty(i)) {
                const reg = resp.DESCUENTOSARCHIVO[i];
                montoTotal = montoTotal + reg.monto;

                // Bancos
                if (this.mcampos.cinstitucion.archivo === 'BAN') {
                  if (this.lbancos.some(x => x.institucion === reg.nombrebanco)) {
                    const ban = this.lbancos.find(x => x.institucion === reg.nombrebanco);
                    ban.cantidad += 1;
                    ban.monto += reg.monto;
                  } else {
                    this.lbancos.push({ institucion: reg.nombrebanco, cantidad: 1, monto: reg.monto });
                  }
                }
              }
            }
            this.ltotales.push({ numero: resp.DESCUENTOSARCHIVO.length, monto: montoTotal });
          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  // Consulta detalle de bancos
  consultaDetalle(registro: any) {
    this.mostrarDialogoDetalle = true;
    this.mcampos.institucion = registro.institucion;
    for (const i in this.ldescuentos) {
      if (this.ldescuentos.hasOwnProperty(i)) {
        const reg = this.ldescuentos[i];
        if (reg.nombrebanco === registro.institucion) {
          this.ldetallebancos.push(reg);
        }
      }
    }
    this.llenarDetalle();
  }

  llenarDetalle() {
    this.ldetalle = [];
    this.ldetalle = this.ldetallebancos;
  }

  cerrarDialogoDetalle() {
    this.mostrarDialogoDetalle = false;
    this.ldetallebancos = [];
  }

}
