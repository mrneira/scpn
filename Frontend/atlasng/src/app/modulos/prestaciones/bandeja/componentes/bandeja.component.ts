import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { AppService } from '../../../../util/servicios/app.service';


@Component({
  selector: 'app-bandeja',
  templateUrl: 'bandeja.html'
})
export class BandejaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;
  public lflujonormal: any = [];
  public sortF: string = '';

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'TpreExpediente', 'BANDEJA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();

  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.buz) {

      }
      this.consultar();
    });
  }

  crearNuevo() {
    super.crearNuevo();
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
    //  super.selectRegistro(registro);
    this.cargarPagina(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 'npersona', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 't.ccatalogoestado = i.ccatalogo and t.cdetalleestado = i.cdetalle');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'identificacion', 'cedula', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'netapa', 't.ccatalogoetapa = i.ccatalogo and t.cdetalleetapa = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', 't.ccatalogotipoexp = i.ccatalogo and t.cdetalletipoexp = i.cdetalle');
    consulta.cantidad = 200;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    const ctransaccionorg = sessionStorage.getItem('t');
    let cdetalleetapa: string;
    let cdetalleestado: string;
    cdetalleestado = `not in ('CAN','NEG')`;
    switch (ctransaccionorg) {
      case '1':
        cdetalleetapa = '1';
        break;
      case '26':
        cdetalleetapa = '2';
        break;
      case '27':
        cdetalleetapa = '3';
        break;
      case '28':
        cdetalleetapa = '4';
        this.mfiltrosesp.comprobantecontable = 'in (SELECT i.ccomprobante FROM tconcomprobante i ' +
          'WHERE i.anulado = 0 AND i.aprobadopresupuesto = 1)';
        break;
      case '29':
        cdetalleetapa = '5';
        cdetalleestado = `='CAN'`;
    }
    this.mfiltros.cdetalleetapa = cdetalleetapa;
    this.mfiltrosesp.cdetalleestado = cdetalleestado;
    this.mfiltrosesp.fingreso = 'IS NOT NULL';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  mostrarLovPersonas(): void {
    this.lovSocios.mfiltros.csocio = 1;
    //this.lovSocios.mfiltros.identificacion;
    this.lovSocios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.npersona = reg.registro.nombre;
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.consultar();

    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosFlujoNormal: any = { 'ccatalogo': 2806 };
    const consultaFlujoNormal = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoNormal, {});
    consultaFlujoNormal.cantidad = 100;
    this.addConsultaCatalogos('FLUJONORMAL', consultaFlujoNormal, null, this.llenarFlujo, 'normal', this.componentehijo);

    this.ejecutarConsultaCatalogos();

  }

  public llenarFlujo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];
        this.componentehijo.lflujonormal.push({ label: reg.nombre, value: { paso: Number(reg.cdetalle), estado: reg.cdetalle } });
      }
    }

  }

  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 21;
    let ac = 'false';
    let ins = 'false';
    let del = 'false';
    let upd = 'false';
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Flujo Expedientes';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    switch (reg.cdetalleetapa) {
      case '1':
        ins = 'true';
        del = 'true';
        upd = 'true';
        break;
      case '2':
        ins = 'true';
        del = 'true';
        upd = 'true';
        break;
    }
    opciones['ac'] = ac;
    opciones['ins'] = ins;
    opciones['del'] = del;
    opciones['upd'] = upd

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {
      skipLocationChange: true,
      queryParams: {
        exp: JSON.stringify({
          cpersona: reg.cpersona, npersona: reg.mdatos.npersona,
          mfiltros: this.mfiltros,
          lflujonormal: this.lflujonormal,
          ntipo: reg.mdatos.ntipo,
          cdetalletipoexp: reg.cdetalletipoexp,
          identificacion: reg.mdatos.cedula,
          cexpediente: reg.cexpediente
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

  changeSort(event) {
    if (!event.order) {
      this.sortF = 'mdatos.npersona';
    } else {
      this.sortF = event.field;
    }
  }

}
