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
  selector: 'app-reporte-aprobarcomprobante',
  templateUrl: 'aprobarcomprobante.html'
})
export class AprobarComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

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
    super(router, dtoServicios, 'ttestransaccion', 'APLICARPAGOTRANSFERENCIA', false);
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
    this.getTotal();
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

 public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'modulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle ');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  getTotal(): Number {
    let total = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        total = super.redondear(total + reg.valorpago, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.ccomprobante != undefined) {
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
      this.enproceso = false;
    }
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 7;
    this.mfiltros.tipotransaccion = 'I';
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
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

  AplicarPago() {
    
    if (!this.RegistrosAprobar()) {
      this.mostrarMensajeError('DEBE SELECCIONAR REGISTROS A PAGAR ');
    }
    else {
      this.grabar();
    }
  }

  grabar(): void {


    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.APLICARPAGOTRANSFERENCIA = this.lregistros;
    this.rqMantenimiento.mdatos.tipotransaccion = 'I';

    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }
}
