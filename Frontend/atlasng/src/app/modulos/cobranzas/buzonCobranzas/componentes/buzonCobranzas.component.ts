import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { AppService } from '../../../../util/servicios/app.service';
import { LovPersonasComponent } from 'app/modulos/personas/lov/personasprestaciones/componentes/lov.personas.component'; //NCH 20220810
import { SelectItem } from 'primeng/primeng';//NCH 20220810

@Component({
  selector: 'app-buzon-cobranzas',
  templateUrl: 'buzonCobranzas.html'
})
export class BuzonCobranzasComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;//NCH 20220810

  @ViewChild('formFiltros') formFiltros: NgForm;

  lrelacionDeuda: SelectItem[] = [];//NCH 20220810

  public nomproducto;
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
    this.consultarCatalogos();//NCH 20220810
  }

  crearNuevo() {
    //super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    //super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    this.cargarPagina(registro);
    super.selectRegistro(registro);//NCH 20220810
    this.mostrarDialogoGenerico = true;//NCH 20220810
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltrosesp.coperacion = "IN(select coperacion from tcaroperacionpersona r where crelacion = '" +this.mcampos.relaciondeuda+ "' )";
    const consulta = new Consulta(this.entityBean, 'Y', 't.diasvencidos, t.fultmodificacion, t.fasignacion, cpersona', this.mfiltros, this.mfiltrosesp);
    //const consulta = new Consulta(this.entityBean, 'Y', 't.diasvencidos DESC,t.fultmodificacion, t.fasignacion', this.mfiltros, this.mfiltrosesp);
    /*consulta.addSubquery('tperpersonadetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'celular', 'celular', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'email', 'email', 'i.cpersona = t.cpersona and i.verreg = 0');*/
    //NCH 20220810
    if (this.mcampos.relaciondeuda == 2){
      consulta.addSubqueryPorSentencia(`SELECT p.nombre FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion = 2`, 'npersona');
      consulta.addSubqueryPorSentencia(`SELECT p.celular FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion = 2`, 'celular');
      consulta.addSubqueryPorSentencia(`SELECT p.email FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion = 2`, 'email');
      consulta.addSubqueryPorSentencia(`SELECT p.identificacion FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion = 2`, 'identificacion');
      consulta.addSubqueryPorSentencia(`SELECT a.nombre FROM tperpersonadetalle p ,tcaroperacionpersona r, tcarrelacionpersona a ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion = 2 and a.crelacion = r.crelacion`, 'estado');
    }
    if (this.mcampos.relaciondeuda == 3){
      consulta.addSubqueryPorSentencia(`SELECT p.nombre FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1, 3)`, 'npersona');
      consulta.addSubqueryPorSentencia(`SELECT p.celular FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1, 3)`, 'celular');
      consulta.addSubqueryPorSentencia(`SELECT p.email FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1, 3)`, 'email');
      consulta.addSubqueryPorSentencia(`SELECT p.identificacion FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1, 3)`, 'identificacion');
      consulta.addSubqueryPorSentencia(`SELECT a.nombre FROM tperpersonadetalle p ,tcaroperacionpersona r, tcarrelacionpersona a ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1, 3) and a.crelacion = r.crelacion`, 'estado');
    }
    if (this.mcampos.relaciondeuda == 1){ //NCH 20220916
      consulta.addSubqueryPorSentencia(`SELECT p.nombre FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1)`, 'npersona');
      consulta.addSubqueryPorSentencia(`SELECT p.celular FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1)`, 'celular');
      consulta.addSubqueryPorSentencia(`SELECT p.email FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1)`, 'email');
      consulta.addSubqueryPorSentencia(`SELECT p.identificacion FROM tperpersonadetalle p ,tcaroperacionpersona r ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1)`, 'identificacion');
      consulta.addSubqueryPorSentencia(`SELECT a.nombre FROM tperpersonadetalle p ,tcaroperacionpersona r, tcarrelacionpersona a ` +
      `WHERE r.coperacion = t.coperacion AND r.cpersona = p.cpersona AND p.verreg = 0 AND r.crelacion in (1) and a.crelacion = r.crelacion`, 'estado');
    }
    //consulta.addSubqueryPorSentencia(`SELECT tp.nombre +' - '+p.nombre FROM tcaroperacion o, tcarproducto p ,tgentipoproducto tp ` +
    consulta.addSubqueryPorSentencia(`SELECT tp.nombre FROM tcaroperacion o, tcarproducto p ,tgentipoproducto tp ` +
      `WHERE o.coperacion = t.coperacion AND p.ctipoproducto = o.ctipoproducto ` +
      `AND p.cproducto = o.cproducto ` +
      `AND p.verreg = 0 ` +
      `AND tp.ctipoproducto = o.ctipoproducto ` +
      `AND tp.cproducto = o.cproducto AND p.cmodulo = 7 AND tp.cmodulo = 7 `, 'nproducto');
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    //this.mfiltros.cusuarioasignado = this.dtoServicios.mradicacion.cusuario;
    this.mfiltros.cestatus = 'ASI';
    this.mfiltrosesp.diasvencidos = '>'+0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;//NCH 20220810
    this.lovPersonas.validaRegimen = true;
    this.lovPersonas.showDialog();
  }
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
    const tran = 2;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Acciones';
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

    const ncobranza = reg.coperacion + ' - ' + reg.mdatos.nproducto;
    this.router.navigate([opciones['path']], {
      skipLocationChange: true,
      queryParams: {
        cob: JSON.stringify({
          /*cpersona: reg.cpersona, npersona: reg.mdatos.npersona, identificacion: reg.mdatos.identificacion,
          celular: reg.mdatos.celular, email: reg.mdatos.email,
          ccobranza: reg.ccobranza, ncobranza: ncobranza, coperacion: reg.coperacion, cuotasvencidas: reg.cuotasvencidas,
          diasvencidos: reg.diasvencidos, montovencido: reg.montovencido*/
          cpersona: reg.cpersona, 
          npersona: reg.mdatos.npersona,    
          identificacion: reg.mdatos.identificacion,
          celular: reg.mdatos.celular, 
          email: reg.mdatos.email,
          ccobranza: reg.ccobranza, 
          ncobranza: ncobranza, 
          coperacion: reg.coperacion, 
          cuotasvencidas: reg.cuotasvencidas,
          diasvencidos: reg.diasvencidos, 
          montovencido: reg.montovencido,
          estado: reg.mdatos.estado //NCH 20220810
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

//NCH 20220810
 private manejaRespuestaCatalogos(resp: any) {
  const msgs = [];
  if (resp.cod === 'OK') {
    this.llenaListaCatalogo(this.lrelacionDeuda, resp.RELACIONDEUDA, 'crelacion');    
  }
  this.lconsulta = [];
}

llenarConsultaCatalogos(): void {
  const consultaRelacionDeuda = new Consulta('tcarrelacionpersona', 'Y', 't.nombre', {}, {});
  consultaRelacionDeuda.cantidad = 3;
  this.addConsultaPorAlias('RELACIONDEUDA', consultaRelacionDeuda);
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

}
