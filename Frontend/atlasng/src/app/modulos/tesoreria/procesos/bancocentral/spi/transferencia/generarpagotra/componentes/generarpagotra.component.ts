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
  selector: 'app-reporte-generarpagotra',
  templateUrl: 'generarpagotra.html'
})
export class GenerarPagoTraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  comportamiento: boolean = false;
  public lempresa: SelectItem[] = [{ label: '...', value: null }];
  public lempresatotal: any[];
  graba: boolean = false;
  selectedRegistros;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'GENERARPAGOSINV', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.mfiltros.esproveedor = false;
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    this.crearDtoConsulta();
    super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.selectedRegistros = [];
      this.enproceso = false;
      this.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'modulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 1;
    this.mfiltros.tipotransaccion = 'I';
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

  AprobarPago() {
    if (this.estaVacio(this.mcampos.cempresa)) {
      this.mostrarMensajeError('INSTITUCIÓN DE ORIGEN DE PAGO REQUERIDA');
      return;
    }
    if (!this.RegistrosAprobar()) {
      this.mostrarMensajeError('DEBE SELECCIONAR REGISTROS PARA APROBACIÓN ');
    }
    else {
      this.grabar();
    }
  }

  grabar(): void {


    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.cempresa = this.mcampos.cempresa;
    this.rqMantenimiento.mdatos.GENERARPAGOSINV = this.lregistros;
    this.rqMantenimiento.mdatos.generar = true;
    this.rqMantenimiento.mdatos.proveedor = this.mfiltros.esproveedor;

    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  RegistrosAprobar(): boolean {
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

}
