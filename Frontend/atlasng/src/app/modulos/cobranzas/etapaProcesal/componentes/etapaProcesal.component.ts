import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { AppService } from '../../../../util/servicios/app.service';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovOperacionCobranzaComponent } from '../../lov/operacion/componentes/lov.operacionCobranza.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-etapa-procesal',
  templateUrl: 'etapaProcesal.html'
})
export class EtapaProcesalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public letapa: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCobranzaComponent)
  private lovOperacion: LovOperacionCobranzaComponent;

  habilitagrabar = true;

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'TcobCobranzaLegal', 'INGRESOACCIONESLEGALES', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.cob) {
        const cob = JSON.parse(p.cob);
        this.mcampos.cpersona = cob.cpersona;
        this.mcampos.nombre = cob.npersona;
        this.registro.mdatos.nombre = cob.npersona;
        this.registro.ccobranza = cob.ccobranza;
        this.registro.coperacion = cob.coperacion;
        this.mcampos.ntipoprod = cob.ncobranza;
      }
    });
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.cusuarioetapa = this.dtoServicios.mradicacion.cusuario;
    this.registro.ccatalogoetapa = 801;
  }

  actualizar() {
    this.registro.fingreso = this.fechaToInteger(this.mcampos.fingreso);
    super.actualizar();
  }

  habilitarEdicion() {
    if (this.registro.ccobranza === undefined || this.registro.ccobranza === null) {
      super.mostrarMensajeWarn("SELECCIONE PERSONA Y COBRANZA");
    } else {
      super.habilitarEdicion();
    }
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.registro.comentario = null;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.crearDtoMantenimiento();
    this.rqMantenimiento.coperacion = this.registro.coperacion;
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.mdatos.ccobranza = this.registro.ccobranza;

    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.habilitagrabar = false;
    }
  }
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.registro.mdatos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mostrarLovOperacion();

    }
  }

  /**Muestra lov de operaciones */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.mfiltros.cestatus = 'JUD';
    this.lovOperacion.mfiltros.cusuarioasignado = this.dtoServicios.mradicacion.cusuario;
    this.lovOperacion.showDialog();
    this.lovOperacion.consultar();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccobranza = reg.registro.ccobranza;
      this.registro.coperacion = reg.registro.coperacion;
      this.mcampos.ntipoprod = reg.registro.coperacion + ' - ' + reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { 'ccatalogo': 801 };
    const consultaProd = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('ETAPAS', consultaProd, this.letapa, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  retornoBuzon(): void {
    this.cargarPagina();
  }

  public cargarPagina() {
    const opciones = {};
    const tran = 20;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Bandeja';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'false';
    opciones['del'] = 'false';
    opciones['upd'] = 'false';

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
        band: JSON.stringify({})
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

}
