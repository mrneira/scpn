import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { AppService } from 'app/util/servicios/app.service';
import { SolicitudEtapaComponent } from './_solicitudEtapas.component';

@Component({
  selector: 'app-solicitud-buzon',
  templateUrl: 'solicitudBuzon.html'
})
export class SolicitudBuzonComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(SolicitudEtapaComponent)
  solicitudEtapa: SolicitudEtapaComponent;

  private tranpagina;
  private opcionespagina = 'false';

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'TcarSolicitud', 'SOLICITUDBUZON', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.consultar()
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.buz) {
        this.consultar();
      }
    });
  }

  crearNuevo() {
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    if (this.estaVacio(registro.csolicitud)) {
      return;
    }
    super.selectRegistro(registro);

    this.solicitudEtapa.lregistros = [];
    this.solicitudEtapa.fijarFiltrosConsulta(registro.csolicitud);
    this.solicitudEtapa.consultar();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.csolicitud', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('TgenProducto', 'nombre', 'nproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto');
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('TcarEstadoOperacion', 'nombre', 'nestadooperacion', 'i.cestadooperacion = t.cestadooperacion');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.tranpagina = sessionStorage.getItem('t');
    switch (this.tranpagina) {
      case '101':
        this.opcionespagina = 'true';
        this.mfiltros.cusuarioingreso = this.dtoServicios.mradicacion.cusuario;
        this.mfiltros.cestatussolicitud = 'ING';
        break;
      case '102':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'PRE';
        break;
      case '103':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'JUR';
        break;
      case '104':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'PER';
        break;
      case '105':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'TEC';
        break;
      case '106':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'INV';
        break;
      case '107':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'RIE';
        break;
      case '108':
        this.opcionespagina = 'false';
        this.mfiltros.cestatussolicitud = 'CGA';
        break;
    }
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  public cargarPagina(reg: any) {
    const transaccion = "7-100";
    const valores = transaccion.split("-");
    const regService = this.appService.menutransaccion.find(x => x.modulo == Number(valores[0]) && x.transaccion == Number(valores[1]));
    if (regService !== undefined){
        const opciones: any =[];
        opciones.mod = valores[0];
        opciones.tran = valores[1];
        opciones.tit = transaccion + " " +  regService.nombre;
        opciones.ins = regService.crear;
        opciones.upd = regService.editar;
        opciones.del = regService.eliminar;
        opciones.ac = regService.ac;
        opciones.path = "/" + transaccion;
        sessionStorage.setItem('m', opciones.mod);
        sessionStorage.setItem('t', opciones.tran);
        sessionStorage.setItem('titulo', opciones.tit);
        sessionStorage.setItem('ins', opciones.ins);
        sessionStorage.setItem('upd', opciones.upd);
        sessionStorage.setItem('del', opciones.del);
        sessionStorage.setItem('ac', opciones.ac);
        sessionStorage.setItem('path', "/" + transaccion);
        this.appService.titulopagina = opciones['tit'];
        this.appService.router.navigate([opciones['path']], {
          skipLocationChange: true, queryParams: {
            sol: JSON.stringify({
              mfiltros: reg.mfiltros, cpersona: reg.cpersona, identificacion: reg.mdatos.identificacion, npersona: reg.mdatos.npersona, csolicitud: reg.csolicitud,
              nsolicitud: reg.mdatos.nproducto + ' - ' + reg.mdatos.ntipoproducto, tran: this.tranpagina, tit: this.titulo
            })
          }
        });
    }else { 
      this.mostrarMensajeError("LA TRANSACCIÓN " + transaccion + " NO EXISTE.");
    }
  }

}
