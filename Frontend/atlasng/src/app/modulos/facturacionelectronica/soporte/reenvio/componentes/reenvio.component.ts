import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-reenvio',
  templateUrl: 'reenvio.html'
})

export class ReenvioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodoc: SelectItem[] = [{ label: '...', value: null }];
  public existedatos = false;
  public documentosReenviados: number = 0;
  selectedRegistros;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcellogdocumentos', 'LOGDOCUMENTOS', false, false);
    this.componentehijo = this;
  }
  registroarchivo: any;
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    let lfechainicial: string = super.calendarToFechaString(this.mcampos.fdesde) + ' 00:00:00';
    let lfechafinal: string = super.calendarToFechaString(this.mcampos.fhasta) + ' 23:59:59';
    this.mfiltrosesp.fingreso = 'between \'' + lfechainicial + '\' and \'' + lfechafinal + '\'';
    this.mfiltros.esreenvio = true;
    const consulta = new Consulta(this.entityBean, 'Y', 't.clog', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);

    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    //No aplica
  }

  actualizar() {
    //No aplica
  }

  eliminar() {
    //No aplica 
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.existedatos = this.lregistros.length > 0;
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipodoc, resp.TIPODOC, 'cdetalle');
    }
    this.lconsulta = [];
  }

  llenarConsultaCatalogos(): void {
    const mfiltroTIPODOC: any = { 'ccatalogo': 1018 };
    const consultaTIPODOC = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPODOC, {});
    consultaTIPODOC.cantidad = 10;
    this.addConsultaPorAlias('TIPODOC', consultaTIPODOC);
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  grabar(): void {
    this.tomarRegistrosReenviar();
    this.rqMantenimiento.mdatos.tipodocumento=this.mfiltros.tipodocumento;

    this.rqMantenimiento.mdatos.claveacceso=this.lregistros[0].clavedeacceso;
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  tomarRegistrosReenviar() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];

        for (const j in this.selectedRegistros) {
          if (this.selectedRegistros.hasOwnProperty(j)) {
            const mar: any = this.selectedRegistros[j];
            if (reg !== undefined && mar !== undefined && reg.clog === mar.clog) {
              reg.esnuevo = true;
              this.documentosReenviados = this.documentosReenviados + 1;
            }
          }
        }
      }
    }
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.documentosReenviados = 0;
      this.selectedRegistros = [];
      this.enproceso = false;
      this.consultar();
    }
  }

}

