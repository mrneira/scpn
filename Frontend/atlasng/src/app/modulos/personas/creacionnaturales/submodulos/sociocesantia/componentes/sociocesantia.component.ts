import {ViewChild} from '@angular/core';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovUbicacionesComponent} from '../../../../../socios/lov/ubicaciones/componentes/lov.ubicaciones.component';
import {TipoGradoComponent} from '../../../../../socios/parametros/tipogrado/componentes/tipoGrado.component';

@Component({
  selector: "app-socio-cesantia",
  templateUrl: "sociocesantia.html"
})
export class SocioCesantiaComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  // @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovUbicacionesComponent)
  private lovUbicaciones: LovUbicacionesComponent;

  private tipoGradoComponent: TipoGradoComponent;
  public habilitarJerarquia: boolean;
  public lestado: SelectItem[] = [{label: "...", value: null}];
  public ltipobaja: SelectItem[] = [{label: "...", value: null}];
  public ljerarquia: SelectItem[] = [{label: "...", value: null}];
  public lgrado: SelectItem[] = [{label: "...", value: null}];
  public ltipopolicia: SelectItem[] = [{label: "...", value: null}];
  public lcargo: SelectItem[] = [{label: "...", value: null}];
  public lubicacion: SelectItem[] = [{label: "...", value: null}];

  public lgradototal: any = [];
  public ljerarquiatotal: any = [];
  public lestadototal: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TsocCesantia", "SOCIO", true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    //this.llenarEstado();
  }

  ngAfterViewInit() {
    // this.formvalidado = true;
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.optlock = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.ccatalogotipocargo = 2702;
    this.registro.ccdetalletipoestado = 'ACT';
    this.registro.ccatalogotipoestado = 2703;

  }

  actualizar() {
    if (this.registro.mdatos.fproceso > this.registro.mdatos.fordengen) {
      this.editable = true;
      this.mostrarMensajeError('FECHA DE ESTADO ACTUAL : ' + this.calendarToFechaString(this.registro.mdatos.fproceso) + ' NO PUEDE SER MAYOR A FECHA DE ORDEN : ' + this.calendarToFechaString(this.registro.mdatos.fordengen));
      return;
    }

    super.actualizar();
    //this.rqMantenimiento.mdatos.cgradoactual = this.mcampos.cgradoactual;
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, "N", "t.cpersona", this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsocCesantiahistorico', 'cestadosocio', 'cestadosocio', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.secuenciahistorico = i.secuencia and i.verreg = 0 ');
    consulta.addSubquery('tsocubicacion', 'nombre', 'nubicacion', 'i.cubicacion = t.cubicacion');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tnombre', 't.ccatalogotipoestado = i.ccatalogo and t.ccdetalletipoestado = i.cdetalle');
    consulta.addSubquery('TsocCesantiahistorico', 'cgradoactual', 'cgradoactual', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.secuenciahistorico = i.secuencia and i.verreg = 0 ');
    consulta.addSubquery('TsocCesantiahistorico', 'ordengen', 'ordengen', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.secuenciahistorico = i.secuencia and i.verreg = 0  ');
    consulta.addSubquery('TsocCesantiahistorico', 'festado', 'festado', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.secuenciahistorico = i.secuencia and i.verreg = 0  ');
    consulta.addSubquery('TsocCesantiahistorico', 'fordengen', 'fordengen', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and t.secuenciahistorico = i.secuencia and i.verreg = 0 ');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    // this.registro.mdatos.nubicacion = 'PAIS: ' + this.registro.mdatos.npais + ' - PROVINCIA ' + this.registro.mdatos.nprovincia + ' - CANTON ' + this.registro.mdatos.ncanton + ' - CIUDAD ' + this.registro.mdatos.nciudad + ' - SECTOR: ' + this.registro.mdatos.sector;
    this.registro.mdatos.nubicacion =
      "UBICACIÓN " +
      resp.SOCIO.cubicacion +
      " - : " +
      resp.SOCIO.mdatos.nubicacion;

    this.calcularTiempoServicio();
    this.mcampos.cgradoactual = resp.SOCIO.mdatos.cgradoactual;
    this.registro.mdatos.ordengen = resp.SOCIO.mdatos.ordengen;
    this.registro.mdatos.festado = new Date(resp.SOCIO.mdatos.festado);
    this.registro.mdatos.fordengen = new Date(resp.SOCIO.mdatos.fordengen);
    this.fijarListaJerarquias(this.mcampos.cgradoactual);
    this.llenarEstado(resp);
    this.enproceso = false;
    this.consultaDatos();
  }

  consultaDatos() {
    this.rqConsulta = [];
    this.fijarFiltrosConsulta();
    this.rqConsulta.cmodulo = 27;
    this.rqConsulta.ctransaccion = 201;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSSOCIO';
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod === 'OK') {
          this.manejaRespuestaDatosSocio(resp);
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  manejaRespuestaDatosSocio(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      const msocio = resp.DATOSSOCIO[0];
      this.registro.mdatos.ntiemposervicio = msocio.tiemposervico;
      this.registro.mdatos.naportaciones = msocio.totalaportes;
      //this.registro.mdatos.festadoactual = msocio.festadoactual;
    }
    this.lconsulta = [];
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

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [SOCIO CESANTIA]');
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  /**Muestra lov de ubicaciones */
  mostrarLovUbicaciones(): void {
    this.lovUbicaciones.showDialog();
  }
  /**Muestra lov de ubicaciones */

  fijarLovTipoBajaSelec(reg: any): void {
    this.registro.ctipobaja = reg.ctipobaja;
  }

  /**Retorno de lov de ubicaciones. */
  fijarLovUbicacionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      // this.registro.mdatos.nubicacion = 'PAIS: ' + reg.registro.mdatos.npais + ' - PROVINCIA ' + reg.registro.mdatos.nprovincia + ' - CANTON: ' + reg.registro.mdatos.ncanton + ' - CIUDAD: ' + reg.registro.mdatos.nciudad + ' - SECTOR: ' + reg.registro.sector;
      this.registro.mdatos.nubicacion =
        "UBICACIÓN " +
        reg.registro.cubicacion +
        " - : " +
        reg.registro.nombre;
      this.registro.cubicacion = reg.registro.cubicacion;
    }
  }


  public mostrar(event: any) {
    this.fijarListaJerarquias(event.value);
  }
  public mostrarJerarquias(event: any) {
    this.fijarListaJerarquias(event.value);
  }

  fijarListaJerarquias(grado: any) {
    //if (this.registro.esnuevo === true) {
    this.ljerarquia = [];
    this.mcampos.cgradoactual = grado;
    for (const i in this.lgradototal) {
      if (this.lgradototal.hasOwnProperty(i)) {
        const reg: any = this.lgradototal[i];
        if (reg !== undefined && reg.value !== null && reg.cgrado === grado) {
          for (const j in this.ljerarquiatotal) {
            if (this.ljerarquiatotal.hasOwnProperty(j)) {
              const reg2: any = this.ljerarquiatotal[j];
              if (
                reg2 !== undefined &&
                reg2.value !== null &&
                reg2.cdetalle === reg.cdetallejerarquia
              ) {
                this.ljerarquia.push({
                  label: reg2.nombre,
                  value: reg2.cdetalle
                });
                this.registro.mdatos.cjerarquia = reg2.cdetalle;
              }
            }
          }
        }
      }
    }
  }

  calcularTiempoServicio(): void {
    if (this.registro.fechaalta != null) {
      var fechaI = new Date(this.registro.fechaalta);
      if (this.registro.fechabaja != null) {
        var fechaF = new Date(this.registro.fechabaja);
      } else {
        var fechaF = new Date();
      }

      var diff = Math.abs(fechaI.getTime() - fechaF.getTime());
      var dia = 1000 * 60 * 60 * 24; //86400000
      var dias = Math.floor(diff / dia);

      var anos = Math.floor(dias / 365);
      var anosr = dias % 365;
      var meses = Math.floor(anosr / 30);
      var dias = anosr % 30;

      this.registro.mdatos.ntiemposervicio =
        anos + " años " + meses + " meses y " + dias + " días";
    }
  }

  llenarEstado(resp: any = null): void {

    this.lestado = [];
    this.lestado.push({label: '...', value: null});
    for (const i in this.lestadototal) {
      if (this.lestadototal.hasOwnProperty(i)) {
        const reg: any = this.lestadototal[i];
        this.lestado.push({label: reg.nombre, value: reg.cestadosocio});
      }
    }
    if (resp !== undefined && resp !== null) {
      this.registro.mdatos.cestadosocio = resp.SOCIO.mdatos.cestadosocio;
    } else {
      this.registro.mdatos.cestadosocio = 1;
    }
    this.registro.mdatos.estadoSocio = this.registro.mdatos.tnombre
    // this.fijarEstado(this.registro.mdatos.cestadosocio);
  }

  fijarEstado(cestadosocio: any): void {
    for (const i in this.lestadototal) {
      if (this.lestadototal.hasOwnProperty(i)) {
        const reg: any = this.lestadototal[i];
        if (reg !== undefined && reg.value !== null && reg.cestadosocio === Number(cestadosocio)) {
          this.registro.mdatos.estadoSocio = reg.mdatos.nnombre;
        }
      }
    }
  }
}
