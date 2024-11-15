import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-autorizarmodificacionspi',
  templateUrl: 'autorizarmodificacionspi.html'
})
export class AutorizarModificacionSpiComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  selectedRegistros;
  public ldestino: any[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'ELIMINARSPI', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo.grabar.false;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;

    }
    this.crearDtoConsulta();
    super.consultar();
    //this.consultarDocumentos();
    //super.consultar();
  }

  //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
  grabar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.RegistrosAutorizar();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.observacion = this.mcampos.observacion;
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
      this.recargar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosDes: any = { cmodulodestino: sessionStorage.getItem('m'), ctransacciondestino: sessionStorage.getItem('t'), tipomapeo: 'AUT' };
    const conDestino = new Consulta('TtesRetroalimentacion', 'Y', 't.cretroalimentacion', mfiltrosDes, {});
    conDestino.cantidad = 50;
    this.addConsultaCatalogos('RETROALIMENTACION', conDestino, this.ldestino, this.llenarRetroalimentacion, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarRetroalimentacion(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ldestino = pListaResp;
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 7;
    this.mfiltros.tipotransaccion = 'P';
    //this.mfiltrosesp.cmodulo = ' IN (' + sessionStorage.getItem('m') + ')';
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'modulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ctransaccion = this.ldestino[0].ctransaccionoriginal;
    this.mfiltros.cmodulo = this.ldestino[0].cmoduloriginal;
  }

  RegistrosAutorizar() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        for (const j in this.selectedRegistros) {
          if (this.selectedRegistros.hasOwnProperty(j)) {
            const mar: any = this.selectedRegistros[j];
            if (reg !== undefined && mar !== undefined && reg.ctestransaccion === mar.ctestransaccion) {
              reg.cestado = 1;
              reg.comentario = this.mcampos.detalleobservacion + '-' + this.dtoServicios.mradicacion.cusuario;
            }
          }
        }
      }
    }
  }
}
