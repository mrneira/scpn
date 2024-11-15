import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { AppService } from 'app/util/servicios/app.service';
import { SolicitudEtapaComponent } from './_solicitudEtapas.component';
import { SolicitudDesembolsoComponent } from './_solicitudDesembolso.component';

@Component({
  selector: 'app-buzon-aprobacion',
  templateUrl: 'solicitudBuzonAprobacion.html'
})
export class SolicitudBuzonAprobacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(SolicitudEtapaComponent)
  solicitudEtapaComponent: SolicitudEtapaComponent;

  @ViewChild(SolicitudDesembolsoComponent)
  solicitudDesembolsoComponent: SolicitudDesembolsoComponent;

  selectedRegistros;
  lselected: any = [];
  mostrarDialogoConfirmacion = false;
  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];
  private tranpagina;
  private opcionespagina = 'false';

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'TcarSolicitud', 'BUZONAPROBACION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
    super.encerarMensajes();
    super.cancelar();
    this.solicitudDesembolsoComponent.mostrarDialogoDesembolso = false;
    this.mostrarDialogoConfirmacion = false;
  }

  public selectRegistro(registro: any) {
    if (this.estaVacio(registro.csolicitud)) {
      return;
    }
    super.selectRegistro(registro);

    this.solicitudEtapaComponent.lregistros = [];
    this.solicitudEtapaComponent.fijarFiltrosConsulta(registro.csolicitud);
    this.solicitudEtapaComponent.consultar();
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
    consulta.addSubquery('TcarProducto', 'consolidado', 'esconsolidado', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.verreg = 0');
    consulta.addSubquery('TcarProducto', 'convenio', 'esconvenio', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.verreg = 0');
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('TcarEstadoOperacion', 'nombre', 'nestadooperacion', 'i.cestadooperacion = t.cestadooperacion');
    consulta.addSubquery('TcarProducto', 'aprobarsupervisor', 'aprobarsupervisor', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.verreg = 0');
    consulta.addSubqueryPorSentencia('select count(1) from TcarSolicitudDesembolso i where i.csolicitud = t.csolicitud', 'numdes');
    consulta.addSubqueryPorSentencia('select count(1) from TcarSolicitudDesembolso i where i.csolicitud = t.csolicitud and i.fregistro != ' + this.dtoServicios.mradicacion.fcontable, 'numreg');
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.opcionespagina = 'false';
    this.mfiltros.cestatussolicitud = 'PAP';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      const buzon: any = []
      const transaccion = Number(sessionStorage.getItem('t'));
      const solicitudes = resp.BUZONAPROBACION;

      for (const i in solicitudes) {
        if (solicitudes.hasOwnProperty(i)) {
          const reg: any = solicitudes[i];
          if (transaccion === 112 && reg.mdatos.esconsolidado) {
            buzon.push(reg);
          } else {
            if (transaccion === 113 && !reg.mdatos.esconsolidado && reg.mdatos.esconvenio) {
              buzon.push(reg);
            } else {
              if (transaccion === 110 && !reg.mdatos.esconsolidado && !reg.mdatos.esconvenio) {
                if (!reg.mdatos.aprobarsupervisor && reg.cusuarioingreso === this.dtoServicios.mradicacion.cusuario) {
                  buzon.push(reg);
                }
              }
              if (transaccion === 111 && !reg.mdatos.esconsolidado && !reg.mdatos.esconvenio) {
                if (reg.mdatos.aprobarsupervisor) {
                  buzon.push(reg);
                }
              }
            }
          }
        }
      }
      resp.BUZONAPROBACION = buzon;
      super.postQueryEntityBean(resp);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.encerarMensajes();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.APROBACIONMASIVA = this.lselected;
    super.grabar();
  }

  grabarDesembolso(): void {
    this.solicitudDesembolsoComponent.rqMantenimiento.mdatos.APROBACIONMASIVA = undefined;
    this.solicitudDesembolsoComponent.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  aprobarEtapa(): void {
    super.encerarMensajes();
    if (this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("NO HA SELECCIONADO SOLICITUD PARA APROBAR");
      return;
    }
    if (!this.validaRegistros()) {
      super.mostrarMensajeError("EXISTEN SOLICITUDES SELECCIONADAS SIN VALIDACIÓN DE DESEMBOLSO");
      return;
    }
    this.lselected = [];
    this.lselected.push(this.selectedRegistros);
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogoConfirmacion = true;
    this.mcampos.msg = "Está seguro que desea aprobar las solicitudes seleccionadas. ?";
    /*if(this.selectedRegistros["cestadooperacion"] != "N" && this.selectedRegistros["cestadooperacion"] != "V"){
      const opciones = {};
      const tran = 51;
      this.tranpagina = sessionStorage.getItem('t');
      opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
      opciones['tit'] = "7-51 APROBAR NEGOCIACIÓN DE PAGOS";
      opciones['mod'] = sessionStorage.getItem('m');
      opciones['tran'] = tran;
      opciones['ac'] = this.opcionespagina;
      opciones['ins'] = this.opcionespagina;
      opciones['del'] = this.opcionespagina;
      opciones['upd'] = this.opcionespagina;
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
            mfiltros: this.mfiltros, cpersona: this.selectedRegistros.cpersona, identificacion: this.selectedRegistros.mdatos.identificacion, npersona: this.selectedRegistros.mdatos.npersona, csolicitud: this.selectedRegistros.csolicitud,
            nsolicitud: this.selectedRegistros.mdatos.nproducto + ' - ' + this.selectedRegistros.mdatos.ntipoproducto, tran: this.tranpagina, tit: this.titulo, apr: true
          })
        }
      });
      this.appService.titulopagina = opciones['tit'];
    }else{
      this.lselected = [];
      this.lselected.push(this.selectedRegistros);
      this.rqMantenimiento.comentario = null;
      this.mostrarDialogoConfirmacion = true;
      this.mcampos.msg = "Está seguro que desea aprobar las solicitudes seleccionadas. ?";
    }*/
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.mostrarDialogoConfirmacion = false;

    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { 'cmodulo': 7 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.ltipoproductototal, this.llenaTipoProducto, null, this.componentehijo);

    const mfiltrosBanc: any = { 'ccatalogo': this.solicitudDesembolsoComponent.codCatalogoInstitucion };
    const consultaBanc = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosBanc, {});
    consultaBanc.cantidad = 1000;
    this.addConsultaCatalogos('BANCOS', consultaBanc, this.solicitudDesembolsoComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTcta: any = { 'ccatalogo': this.solicitudDesembolsoComponent.codCatalogoTipoCuenta };
    const consultaTcta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosTcta, {});
    this.addConsultaCatalogos('TIPOCUENTA', consultaTcta, this.solicitudDesembolsoComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTIPOIDENTIF: any = { 'ccatalogo': this.solicitudDesembolsoComponent.codCatalogoTipoIdentificacion };
    const consultaTIPOIDENTIF = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroTIPOIDENTIF, {});
    this.addConsultaCatalogos('TIPOIDENTIFICACION', consultaTIPOIDENTIF, this.solicitudDesembolsoComponent.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  public llenaTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null, campoetiqueta = null): any {
    componentehijo.ltipoproductototal = pListaResp;
  }

  cambiarTipoProducto(event: any): any {
    if (this.estaVacio(this.mfiltros.cproducto)) {
      this.mfiltros.cproducto = null;
      this.mfiltros.ctipoproducto = null;
      return;
    };
    this.fijarListaTipoProducto(event.value);
  }

  fijarListaTipoProducto(cproducto: any) {
    this.ltipoproducto = [];
    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg.cproducto === cproducto) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }
    this.mfiltros.ctipoproducto = null;
    if (this.ltipoproducto.length <= 0) {
      this.ltipoproducto.push({ label: '...', value: null });
    } else {
      this.mfiltros.ctipoproducto = this.ltipoproducto[0].value;
    }
    this.consultar();
  }

  public mostrarDesembolso(registro: any) {
    super.encerarMensajes();
    this.solicitudDesembolsoComponent.lregistros = [];
    this.solicitudDesembolsoComponent.mostrarDialogoDesembolso = true;
    this.solicitudDesembolsoComponent.mcampos.tipoidentificacion = 'C';
    this.solicitudDesembolsoComponent.mcampos.identificacion = registro.mdatos.identificacion;
    this.solicitudDesembolsoComponent.mcampos.npersona = registro.mdatos.npersona;
    this.solicitudDesembolsoComponent.mfiltros.csolicitud = registro.csolicitud;
    this.solicitudDesembolsoComponent.consultar();
  }

  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 100;
    this.tranpagina = sessionStorage.getItem('t');
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = this.titulo;
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = this.opcionespagina;
    opciones['ins'] = this.opcionespagina;
    opciones['del'] = this.opcionespagina;
    opciones['upd'] = this.opcionespagina;

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
          mfiltros: this.mfiltros, cpersona: reg.cpersona, identificacion: reg.mdatos.identificacion, npersona: reg.mdatos.npersona, csolicitud: reg.csolicitud,
          nsolicitud: reg.mdatos.nproducto + ' - ' + reg.mdatos.ntipoproducto, tran: this.tranpagina, tit: this.titulo, apr: true
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

  validaRegistros(): boolean {
    const reg: any = this.selectedRegistros;
    if (reg.cestadooperacion === 'N' || reg.cestadooperacion === 'V') {
      if (reg.mdatos.numreg !== 0 || reg.mdatos.numdes === 0) {
        return false;
      }
    }
    return true;
  }
}