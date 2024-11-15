import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { AppService } from 'app/util/servicios/app.service';

@Component({
  selector: 'app-buzon-cobranzas-Legal',
  templateUrl: 'buzonCobranzasLegal.html'
})
export class BuzonCobranzasLegalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'TcobCobranza', 'BUZONCOBRANZAS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.buz) {

      }
      this.consultar();
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
    this.cargarPagina(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fultmodificacion, t.fasignacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubqueryPorSentencia("select p.nombre from " + this.obtenerBean("tgenproducto") + " p, " + this.obtenerBean("tcaroperacion") + " o where " + "p.cmodulo = o.cmodulo and t.coperacion = o.coperacion and p.cproducto = o.cproducto and o.cmodulo = 7", "nproducto");
    consulta.addSubqueryPorSentencia("select tp.nombre from " + this.obtenerBean("tgentipoproducto") + " tp, " + this.obtenerBean("tcaroperacion") + " o where " + "tp.cmodulo = o.cmodulo and t.coperacion = o.coperacion and tp.cproducto = o.cproducto and tp.ctipoproducto = o.ctipoproducto and o.cmodulo = 7", "ntipoproducto");
    consulta.addSubqueryPorSentencia(`SELECT tp.nombre +' - '+p.nombre FROM tcaroperacion o, tcarproducto p ,tgentipoproducto tp ` +
      `WHERE o.coperacion = t.coperacion AND p.ctipoproducto = o.ctipoproducto ` +
      `AND p.cproducto = o.cproducto ` +
      `AND p.verreg = 0 ` +
      `AND tp.ctipoproducto = o.ctipoproducto ` +
      `AND tp.cproducto = o.cproducto AND p.cmodulo = 7 AND tp.cmodulo = 7 `, 'nproductopan');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cestatus = 'JUD';
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
    const opciones = {};
    const tran = 21;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Etapa Judicial';
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

    const ncobranza = reg.coperacion + ' - ' + reg.mdatos.nproducto + ' - ' + reg.mdatos.ntipoproducto;
    this.router.navigate([opciones['path']], {
      skipLocationChange: true,
      queryParams: {
        cob: JSON.stringify({
          cpersona: reg.cpersona, npersona: reg.mdatos.npersona,
          celular: reg.mdatos.celular, email: reg.mdatos.email,
          ccobranza: reg.ccobranza, ncobranza: ncobranza, coperacion: reg.coperacion
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

}
