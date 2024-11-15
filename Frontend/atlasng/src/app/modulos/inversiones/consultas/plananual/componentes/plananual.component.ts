import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AppService } from 'app/util/servicios/app.service';

import { ConfirmationService } from 'primeng/primeng';
import { isNull } from 'util';
@Component({
  selector: 'app-plananual',
  templateUrl: 'plananual.html'
})
export class PlanAnualComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];


  public ltipoplan: any = [];
  public asignacion = false;
  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tinvplananual', 'PLANANUAL', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    let fecha = new Date(this.fechaactual);
   
    this.mcampos.anio= fecha.getFullYear();
    this.consultar();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if(this.estaVacio(this.mcampos.anio) || (this.mcampos.anio<1990 && this.mcampos.anio>2100) ){
     this.mostrarMensajeError("NO SE HA INGRESADO UN AÑO VALIDO");
      return 0;
    }
    super.crearNuevo();
    this.registro.anio = this.mcampos.anio;
    this.mfiltros.anio=this.mcampos.anio;
    this.registro.fingreso = this.fechaactual;
    this.registro.estado = true;
    this.registro.tipoccatalogo=1226;
    this.registro.pparticipaciontotal = 0;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;


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

  public seleccionarDetalle(registro: any) {
    this.cargarPagina(registro);
  }
  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.anio desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', 't.tipoccatalogo = i.ccatalogo and i.cdetalle = t.tipocdetalle');
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.cantidad = 30;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.anio=this.mcampos.anio;
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
    let total=0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.pmontototal)
          total = total + reg.pmontototal;
      }
    }
    if(total>100){
      super.mostrarMensajeError("NO SE PUEDE SUPERAR DEL 100% DEL PORCENTAJE ANUAL");
      return;
    }
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
    if (resp.ELIMINADA) {
      this.recargar();
    }
  }
  seleccionarModulo(registro:any){
    for (const i in this.ltipoplan) {
      if (this.ltipoplan.hasOwnProperty(i)) {
        const reg = this.ltipoplan[i];
        if (registro.tipocdetalle===reg.cdetalle)
          this.registro.cmodulo= Number(reg.clegal);
      }
    }
    this.registrarEtiqueta(this.registro,this.lmodulos,"cmodulo","nmodulo")
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = {};
    const consultaMes = new Consulta('tgenmodulo', 'Y', 't.cmodulo', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MODULO', consultaMes, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    const mfiltrosTipo: any = { 'ccatalogo': 1226 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle', this, false);

    const mfiltrosparamcalif = { 'ccatalogo': 1226 };
    const consultaParametrosCalificacion = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosparamcalif, {});
    consultaParametrosCalificacion.cantidad = 500;
    this.addConsultaCatalogos('TIPOPRODUCTOGEN', consultaParametrosCalificacion, this.ltipoplan, this.llenarCalidad, '', this.componentehijo, false);


    this.ejecutarConsultaCatalogos();
  }


  public llenarCalidad(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ltipoplan = pListaResp;

  }
  

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;

      this.consultar();
    }
  }
  consultaAsignacion() {
    this.asignacion = true;
  }
  listaNomina() {
    const opciones = {};
    const tran = 38;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
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
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          tipocdetalle: null,
          anio: null,
          nuevaNomina: true,
          cerrada: false,
          cmodulo: null,
          pparticipacion: 0,
          pmontototal: 0
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  public eliminarPlanAnual(reg: any) {


    this.confirmationService.confirm({
      message: 'Está seguro de eliminar la planificación anual selecionada?',
      header: 'PLAN ANUAL',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.mdatos.reg = reg;
        this.grabar();
      },
      reject: () => {
      }
    });

  }
  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 38;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
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
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          tipocdetalle: reg.tipocdetalle,
          anio:reg.anio,
          nuevaNomina: false,
          cerrada: false,
          cmodulo: reg.cmodulo,
          pparticipacion: reg.pparticipacion,
          pmontototal: reg.pmontototal
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
}
