import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovSolicitudesComponent } from '../../../lov/solicitudes/componentes/lov.solicitudes.component';
import { DatosComponent } from '../submodulos/datosgenerales/componentes/_datos.component';
import { DescuentosComponent } from '../submodulos/descuentos/componentes/_descuentos.component';
import { GarantiasCarComponent } from '../submodulos/garantias/componentes/_garantiasCar.component';
import { TablaAmortizacionComponent } from '../submodulos/tablaamortizacion/componentes/_tablaAmortizacion.component';
import { PersonasRelacionComponent } from '../submodulos/personasrelacion/componentes/_personasRelacion.component';
import { RequisitosComponent } from '../submodulos/requisitos/componentes/_requisitos.component';
import { ReportesComponent } from '../submodulos/reportes/componentes/_reportes.component';
import { DesembolsoComponent } from '../submodulos/desembolso/componentes/_desembolso.component';
import { MenuItem } from 'primeng/components/common/menuitem';
import { AppService } from '../../../../../util/servicios/app.service';

@Component({
  selector: 'app-solicitud-ingreso',
  templateUrl: 'solicitudIngreso.html'
})
export class SolicitudIngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovSolicitudesComponent)
  private lovSolicitudes: LovSolicitudesComponent;

  @ViewChild(DatosComponent)
  datosComponent: DatosComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  @ViewChild(DescuentosComponent)
  descuentosComponent: DescuentosComponent;

  @ViewChild(PersonasRelacionComponent)
  personasRelacionComponent: PersonasRelacionComponent;

  @ViewChild(RequisitosComponent)
  requisitosComponent: RequisitosComponent;

  @ViewChild(ReportesComponent)
  reportesComponent: ReportesComponent;

  @ViewChild(GarantiasCarComponent)
  garantias: GarantiasCarComponent;

  @ViewChild(DesembolsoComponent)
  desembolsoComponent: DesembolsoComponent;

  private csolicitud = 0;
  private habilitagrabar = false;
  private habilitaanular = false;
  private anular = false;
  private aprobar = false;
  public idpaso;
  public siguienteestatus = "";
  public anteriorestatus = "";
  public itemsPasos: MenuItem[];
  public lflujo: any = [];
  public lflujoquirografario: any = [];
  public lflujohipotecario: any = [];
  public lflujoprendario: any = [];

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.sol) {
        const sol = JSON.parse(p.sol);
        this.registro.cpersona = sol.cpersona;
        this.mcampos.cpersona = sol.cpersona;
        this.mcampos.identificacion = sol.identificacion;
        this.mcampos.nombre = sol.npersona;
        this.personasRelacionComponent.deudor = sol.cpersona;
        this.garantias.mcampos.cpersona = sol.cpersona;
        this.desembolsoComponent.mcampos.tipoidentificacion = 'C';
        this.desembolsoComponent.mcampos.identificacion = sol.identificacion;
        this.desembolsoComponent.mcampos.npersona = sol.npersona;
        this.mcampos.csolicitud = sol.csolicitud;
        this.mcampos.nsolicitud = sol.nsolicitud;
        this.csolicitud = sol.csolicitud;
        this.mcampos.tranorigen = sol.tran;
        this.mcampos.titorigen = sol.tit;
        this.mcampos.aprobacion = this.estaVacio(sol.apr) ? false : sol.apr;
      }
    });
    if (this.mcampos.aprobacion) {
      this.itemsEtapa[0].disabled = true;
    }
    this.consultarCatalogos();
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    super.cancelar();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
    this.consultarSueldo();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conDatos = this.datosComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.datosComponent.alias, conDatos);
    this.descuentosComponent.mcampos.csolicitud = this.csolicitud;
    const conDescuentos = this.descuentosComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.descuentosComponent.alias, conDescuentos);
    this.personasRelacionComponent.mcampos.csolicitud = this.csolicitud;
    const conPerRelacion = this.personasRelacionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personasRelacionComponent.alias, conPerRelacion);
    this.garantias.mcampos.csolicitud = this.csolicitud;
    const conGar = this.garantias.crearDtoConsulta();
    this.addConsultaPorAlias(this.garantias.alias, conGar);
    this.requisitosComponent.mcampos.csolicitud = this.csolicitud;
    const conRequisitos = this.requisitosComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.requisitosComponent.alias, conRequisitos);
    this.reportesComponent.mcampos.csolicitud = this.csolicitud;
    const conReportes = this.reportesComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.reportesComponent.alias, conReportes);
    this.desembolsoComponent.mcampos.csolicitud = this.csolicitud;
    const conDesembolso = this.desembolsoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.desembolsoComponent.alias, conDesembolso);
    // consultar Tabla amortizacion
    this.tablaAmortizacionComponent.mcampos.csolicitud = this.csolicitud;
    this.tablaAmortizacionComponent.consultar();
  }

  private fijarFiltrosConsulta() {
    this.datosComponent.mfiltros.csolicitud = this.csolicitud;
    this.datosComponent.mfiltros.cpersona = this.registro.cpersona;
    this.datosComponent.fijarFiltrosConsulta();

    this.descuentosComponent.mfiltros.csolicitud = this.csolicitud;
    this.descuentosComponent.fijarFiltrosConsulta();

    this.personasRelacionComponent.mfiltros.csolicitud = this.csolicitud;
    this.personasRelacionComponent.fijarFiltrosConsulta();

    this.garantias.mfiltros.csolicitud = this.csolicitud;
    this.garantias.fijarFiltrosConsulta();

    this.desembolsoComponent.mfiltros.csolicitud = this.csolicitud;
    this.desembolsoComponent.fijarFiltrosConsulta();

    this.requisitosComponent.mfiltros.csolicitud = this.csolicitud;
    this.requisitosComponent.fijarFiltrosConsulta();

    this.reportesComponent.mfiltros.csolicitud = this.csolicitud;
    this.reportesComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.datosComponent.validaFiltrosRequeridos()
      && this.personasRelacionComponent.validaFiltrosRequeridos()
      && this.garantias.validaFiltrosRequeridos()
      && this.desembolsoComponent.validaFiltrosRequeridos()
      && this.descuentosComponent.validaFiltrosRequeridos()
      && this.requisitosComponent.validaFiltrosRequeridos()
      && this.reportesComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public async postQuery(resp: any) {
    if(
      resp &&
      resp instanceof Object &&
      resp['TCARSOLICITUD'] &&
      resp['TCARSOLICITUD'] instanceof Object &&
      resp['TCARSOLICITUD']['cestadooperacion'] &&
      resp['TCARSOLICITUD']['cestadooperacion'] != "N"
    ){
      this.desembolsoComponent.arreglopago = true;
    }else{
      this.desembolsoComponent.arreglopago = false;
    }
    this.datosComponent.postQuery(resp);
    this.descuentosComponent.postQuery(resp);
    this.personasRelacionComponent.postQuery(resp);
    this.garantias.postQuery(resp);
    this.desembolsoComponent.postQuery(resp);
    this.requisitosComponent.postQuery(resp);
    this.reportesComponent.postQuery(resp);
    if (this.csolicitud !== 0) {
      this.editable = false;
      this.habilitagrabar = false;
      this.habilitaanular = false;
    }
    this.habilitagrabar = true;
    this.habilitaanular = true;
    this.cargarFlujo(this.datosComponent.cflujo);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // Valida desembolso
    if (!this.desembolsoComponent.validaGrabar()) {
      return;
    }
    this.anular = false;
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.csolicitud = this.mcampos.csolicitud;
    this.rqMantenimiento.mdatos.aprobar = undefined;
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = sessionStorage.getItem('m');
    this.rqMantenimiento['ctransaccion'] = sessionStorage.getItem('t');
    this.datosComponent.registro.cpersona = this.registro.cpersona;
    this.datosComponent.registro.cestatussolicitud = 'ING';
    this.datosComponent.selectRegistro(this.datosComponent.registro);
    this.datosComponent.actualizar();
    super.addMantenimientoPorAlias(this.datosComponent.alias, this.datosComponent.getMantenimiento(1));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    this.personasRelacionComponent.registro.csolicitud = this.mcampos.csolicitud;
    super.addMantenimientoPorAlias(this.personasRelacionComponent.alias, this.personasRelacionComponent.getMantenimiento(2));
    this.descuentosComponent.registro.csolicitud = this.mcampos.csolicitud;
    super.addMantenimientoPorAlias(this.descuentosComponent.alias, this.descuentosComponent.getMantenimiento(3));
    this.requisitosComponent.registro.csolicitud = this.mcampos.csolicitud;
    super.addMantenimientoPorAlias(this.requisitosComponent.alias, this.requisitosComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.garantias.alias, this.garantias.getMantenimiento(5));
    this.desembolsoComponent.registro.csolicitud = this.mcampos.csolicitud;
    super.addMantenimientoPorAlias(this.desembolsoComponent.alias, this.desembolsoComponent.getMantenimiento(5));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  aprobarEtapa(): void {
    super.encerarMensajes();
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogoGenerico = true;
    this.mcampos.msg = "Está seguro que desea aprobar la solicitud. ?";
    this.aprobar = true;
    // Ejecuta transaccion interna
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 120;
  }

  rechazarEtapa(): void {
    super.encerarMensajes();
    if (this.estaVacio(this.anteriorestatus)) {
      super.mostrarMensajeError("NO EXISTE ETAPA ANTERIOR");
      return;
    }
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogoGenerico = true;
    this.mcampos.msg = "Está seguro que desea rechazar la solicitud. ?";
    this.aprobar = false;
    // Ejecuta transaccion interna
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 121;
  }

  anularSolicitud(): void {
    super.encerarMensajes();
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogoGenerico = true;
    this.mcampos.msg = "Está seguro que desea anular la solicitud. ?";
    this.anular = true;
    this.aprobar = true;
    // Ejecuta transaccion interna
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 122;
  }

  confirmarEtapa() {
    if (this.anular) {
      this.datosComponent.registro.cestatussolicitud = 'ANU';
      this.datosComponent.registro.cusuarioaprobacion = this.dtoServicios.mradicacion.cusuario;
      this.datosComponent.registro.fcancelacion = this.dtoServicios.mradicacion.fcontable;
    } else {
      if (this.aprobar) {
        this.datosComponent.registro.cestatussolicitud = this.siguienteestatus;
      } else {
        this.datosComponent.registro.cestatussolicitud = this.anteriorestatus;
      }
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.aprobar = this.aprobar;
    this.datosComponent.selectRegistro(this.datosComponent.registro);
    this.datosComponent.actualizar();
    this.descuentosComponent.formvalidado = true;
    super.addMantenimientoPorAlias(this.datosComponent.alias, this.datosComponent.getMantenimiento(1));
    super.grabar();
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.mostrarDialogoGenerico = false;
      this.datosComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.datosComponent.alias));
      this.mcampos.csolicitud = resp.csolicitud;
      this.csolicitud = resp.csolicitud;
      this.personasRelacionComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personasRelacionComponent.alias));
      this.requisitosComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.requisitosComponent.alias));
      this.garantias.postCommitEntityBean(resp, this.getDtoMantenimiento(this.garantias.alias));
      if (!this.estaVacio(this.rqMantenimiento.mdatos.aprobar)) {
        this.retornoBuzon();
      }
    } else {
      this.mostrarDialogoGenerico = false;
    }
  }
  // Fin MANTENIMIENTO *********************

  async consultarCatalogos() {
    this.encerarConsultaCatalogos();
    const mfiltrosFlujoQuirografario: any = { 'ccatalogo': 700 };
    const consultaFlujoQuirografario = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoQuirografario, {});
    consultaFlujoQuirografario.cantidad = 100;
    this.addConsultaCatalogos('FLUJOQUIROGRAFARIO', consultaFlujoQuirografario, null, this.llenarFlujo, 'quirografario', this.componentehijo);
    const mfiltrosFlujoHipotecario: any = { 'ccatalogo': 701 };
    const consultaFlujoHipotecario = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoHipotecario, {});
    consultaFlujoHipotecario.cantidad = 100;
    this.addConsultaCatalogos('FLUJOHIPOTECARIO', consultaFlujoHipotecario, null, this.llenarFlujo, 'hipotecario', this.componentehijo);
    const mfiltrosFlujoPrendario: any = { 'ccatalogo': 706 };
    const consultaFlujoPrendario = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoPrendario, {});
    consultaFlujoPrendario.cantidad = 100;
    this.addConsultaCatalogos('FLUJOPRENDARIO', consultaFlujoPrendario, null, this.llenarFlujo, 'prendario', this.componentehijo);
    const consultaPersonaRelacion = new Consulta('TcarRelacionPersona', 'Y', 't.nombre', {}, {});
    consultaPersonaRelacion.cantidad = 50;
    this.addConsultaCatalogos('PERSONASRELACION', consultaPersonaRelacion, this.personasRelacionComponent.lrelacion, super.llenaListaCatalogo, 'crelacion');
    const mfiltrosBanc: any = { 'ccatalogo': this.desembolsoComponent.codCatalogoInstitucion };
    const consultaBanc = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosBanc, {});
    consultaBanc.cantidad = 1000;
    this.addConsultaCatalogos('BANCOS', consultaBanc, this.desembolsoComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    const mfiltrosTcta: any = { 'ccatalogo': this.desembolsoComponent.codCatalogoTipoCuenta };
    const consultaTcta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosTcta, {});
    this.addConsultaCatalogos('TIPOCUENTA', consultaTcta, this.desembolsoComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    const mfiltroTIPOIDENTIF: any = { 'ccatalogo': this.desembolsoComponent.codCatalogoTipoIdentificacion };
    const consultaTIPOIDENTIF = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroTIPOIDENTIF, {});
    this.addConsultaCatalogos('TIPOIDENTIFICACION', consultaTIPOIDENTIF, this.desembolsoComponent.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  public llenarFlujo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    
    switch (campopk) {
      case "quirografario":
        for (const i in pListaResp) {
          if (pListaResp.hasOwnProperty(i)) {
            const reg: any = pListaResp[i];
            this.componentehijo.lflujoquirografario.push({ label: reg.nombre, value: { paso: Number(reg.cdetalle), estado: reg.clegal } });
          }
        }
        break;
      case "hipotecario":
        for (const i in pListaResp) {
          if (pListaResp.hasOwnProperty(i)) {
            const reg: any = pListaResp[i];
            this.componentehijo.lflujohipotecario.push({ label: reg.nombre, value: { paso: Number(reg.cdetalle), estado: reg.clegal } });
          }
        }
        break;
      case "prendario":
        for (const i in pListaResp) {
          if (pListaResp.hasOwnProperty(i)) {
            const reg: any = pListaResp[i];
            this.componentehijo.lflujoprendario.push({ label: reg.nombre, value: { paso: Number(reg.cdetalle), estado: reg.clegal } });
          }
        }
        break;
    }

    this.componentehijo.consultar();
  }

  /**Carga el flujo de la solicitud. */
  cargarFlujo(cflujo: any): any {
    switch (cflujo) {
      case 700:
        this.itemsPasos = this.lflujoquirografario;
        this.lflujo = this.lflujoquirografario;
        break;
      case 701:
        this.itemsPasos = this.lflujohipotecario;
        this.lflujo = this.lflujohipotecario;
        break;
      case 706:
        this.itemsPasos = this.lflujoprendario;
        this.lflujo = this.lflujoprendario;
        break;
    }

    if (!this.estaVacio(this.lflujo)) {
      this.idpaso = this.lflujo.find(x => x.value.estado === this.datosComponent.registro.cestatussolicitud).value.paso;
      this.siguienteestatus = this.lflujo.find(x => Number(x.value.paso) === Number(this.idpaso) + 1).value.estado;
      this.idpaso = this.idpaso - 1;
      if (Number(this.idpaso) > 0) {
        this.anteriorestatus = this.lflujo.find(x => Number(x.value.paso) === Number(this.idpaso)).value.estado;
      }
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Muestra lov de Solicitudes */
  mostrarLovSolicitud(): void {
    if (this.registro.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovSolicitudes.rqConsulta.mdatos.cestatussolicitud = 'ING';
    if (sessionStorage.getItem('t') === '100') {
      // completar estatus solicitud por transaccion.
    }
    this.lovSolicitudes.rqConsulta.mdatos.cpersona = this.registro.cpersona;
    this.lovSolicitudes.showDialog();
    this.lovSolicitudes.consultar();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.indentificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.personasRelacionComponent.deudor = reg.registro.cpersona;
      this.garantias.mcampos.cpersona = reg.registro.cpersona;
      this.desembolsoComponent.mcampos.tipoidentificacion = reg.registro.indentificacdetalle;
      this.desembolsoComponent.mcampos.identificacion = reg.registro.indentificacion;
      this.desembolsoComponent.mcampos.npersona = reg.registro.nombre;
      this.csolicitud = 0;
      this.mcampos.csolicitud = null;
      this.mostrarLovSolicitud()
    }
  }

  /**Retorno de lov de solicitudes. */
  fijarLovSolicitudSelec(reg: any): void {
    this.msgs = [];
    this.mcampos.csolicitud = reg.registro.mdatos.csolicitud;
    this.csolicitud = reg.registro.mdatos.csolicitud;
    this.consultar();
  }

  validaGrabar() {
    return this.datosComponent.validaGrabar() && this.descuentosComponent.validaGrabar();
  }

  consultarSueldo(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.descuentosComponent.lsueldo = [];
    const mfiltrosSueldo: any = { 'cpersona': this.registro.cpersona, 'verreg': 0 ,'cuentaprincipal' : true};
    const consultaSueldo = new Consulta('TperReferenciaBancaria', 'Y', 't.cpersona', mfiltrosSueldo, {});
    consultaSueldo.addSubquery('TgenCatalogoDetalle', 'nombre', 'ninstitucion', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consultaSueldo.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    this.addConsultaPorAlias("SUELDO", consultaSueldo);
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.descuentosComponent.lsueldo = resp.SUELDO;
        this.desembolsoComponent.lsueldo = resp.SUELDO;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  /**Retorno al listado de solicitudes. */
  retornoBuzon() {
    const opciones = {};
    const tran = this.mcampos.tranorigen;
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.mcampos.titorigen;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'true';
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
        buz: JSON.stringify({})
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
}