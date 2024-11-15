import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { JasperComponent } from "../../../../../../../util/componentes/jasper/componentes/jasper.component";
import { ConfirmationService } from "primeng/primeng";
import { last } from "rxjs/operator/last";

@Component({
  selector: "app-reporte-aprobarocp",
  templateUrl: "aprobarocp.html"
})
export class AprobarOcpComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros")
  formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: "...", value: null }];
  comportamiento: boolean = false;
  public lempresa: SelectItem[] = [{ label: "...", value: null }];
  selectedRegistros;
  selectedRegistrosApr;
  public lhistoricocobros: any[];
  public ldetallecobros: any[];
  graba: boolean = false;
  public laprobados: any = [];
  aprobar: boolean = false;
  public mostrarDialogoGenericoDetalle = false;

  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(router, dtoServicios, "ttestransaccion", "APROBARCOBROS", false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {}

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    // this.crearDtoConsulta();
    // super.consultar();
    this.consultarComprobantes();
  }
  
  consultarComprobantes() {
      this.rqConsulta.CODIGOCONSULTA = 'TES_APROBAROCP';
      this.rqConsulta.storeprocedure = "sp_TesConAprobarCobros";
      this.msgs = [];
      this.rqConsulta.parametro_modulo = this.mfiltros.cmodulo;
      this.rqConsulta.parametro_fechaini = this.fechaToInteger(this.mcampos.fechaini);
      this.rqConsulta.parametro_fechafin = this.fechaToInteger(this.mcampos.fechafin);

      this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
          .subscribe(
              resp => {
                  this.manejaRespuestaTransacciones(resp);
              },
              error => {
                  this.dtoServicios.manejoError(error);
              });
  }

  private manejaRespuestaTransacciones(resp: any) {
      this.lregistros = resp.TES_APROBAROCP;
      //this.calcularTotales(this.lregistros);
  }
  

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(
      this.entityBean,
      "Y",
      "t.fingreso",
      this.mfiltros,
      this.mfiltrosesp
    );
    consulta.addSubquery(
      "tgenmodulo",
      "nombre",
      "modulo",
      "i.cmodulo = t.cmodulo"
    );
    consulta.addSubquery(
      "tgencatalogodetalle",
      "nombre",
      "institucion",
      "i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle "
    );
    consulta.addSubquery(
      "tgencatalogodetalle",
      "nombre",
      "tipocuenta",
      "i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle "
    );
    consulta.cantidad = 100000;
    this.addConsulta(consulta);

    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = "1";
    this.mfiltros.tipotransaccion = "C";
    if (
      !this.estaVacio(this.mcampos.finicio) &&
      !this.estaVacio(this.mcampos.ffin)
    ) {
      this.mfiltrosesp.fcontable =
        "between " +
        super.fechaToInteger(this.mcampos.finicio) +
        " and " +
        super.fechaToInteger(this.mcampos.ffin) +
        "";
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta(
      "tgenmodulo",
      "Y",
      "t.nombre",
      mfiltrosMod,
      {}
    );
    conModulo.cantidad = 100;
    this.addConsultaCatalogos(
      "MODULOS",
      conModulo,
      this.lmodulos,
      super.llenaListaCatalogo,
      "cmodulo"
    );
    var x = location.hostname;
    this.ejecutarConsultaCatalogos();
  }

  Historico(registro: any) {
    this.obtnerhistorialcobros(registro);
    this.mostrarDialogoGenerico = true;
  }

  obtnerhistorialcobros(registro) {
    this.rqConsulta.CODIGOCONSULTA = "HISTORICOPAGO";
    this.rqConsulta.storeprocedure = "sp_TesConObtenerHistorialPagos";
    this.rqConsulta.parametro_ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.parametro_verreg = -1;
    this.rqConsulta.parametro_tipotransaccion = "C";
    this.msgs = [];

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.manejaRespuestaHistorial(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  private manejaRespuestaHistorial(resp: any) {
    this.lhistoricocobros = [];
    if (resp.cod === "OK") {
      this.lhistoricocobros = resp.HISTORICOPAGO;
      this.rqConsulta = { mdatos: {} };
    }
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.APROBARCOBROS = this.laprobados;
    this.rqMantenimiento.mdatos.aprobar = true;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.selectedRegistros = [];
      this.laprobados = [];
      //this.getTotalApr();
      //this.getTotal();
      this.enproceso = false;
      //this.consultar();
    }
  }

  tomarRegistrosReenviar(): boolean {
    this.graba = false;
    for (const i in this.laprobados) {
      if (this.laprobados.hasOwnProperty(i)) {
        const reg: any = this.laprobados[i];
        reg.mdatos.aprobar = true;
        this.graba = true;
      }
    }
    if (this.laprobados === undefined || this.laprobados.length === 0) {
      this.graba = false;
    }
    return this.graba;
  }

  AprobarCobro() {
    if (!this.tomarRegistrosReenviar()) {
      this.mostrarMensajeError("DEBE SELECCIONAR REGISTROS A APROBAR");
    } else {
      this.confirmationService.confirm({
        message:
          "Está seguro de generar el cobro por el valor de: " +
          this.getTotalApr() +
          " ?",
        header: "Confirmación",
        accept: () => {
          this.grabar();
        }
      });
    }
  }

  getTotal(): Number {
    let total = 0;

    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        total = super.redondear(total + reg.valorpago, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }

  getTotalApr(): Number {
    let total = 0;

    for (const i in this.laprobados) {
      if (this.laprobados.hasOwnProperty(i)) {
        const reg: any = this.laprobados[i];
        total = super.redondear(total + reg.valorpago, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }

  Revisar(): void {
    if (this.selectedRegistros.length === 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS A REVISAR");
      return;
    }
    //this.getTotalApr();
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[0];
        this.laprobados.push(this.selectedRegistros[i]);
        this.lregistros.splice(this.lregistros.indexOf(reg), 1);
      }
    }
    this.selectedRegistros = [];
  }

  Buscar(): void {
    this.selectedRegistros = [];
    this.laprobados = [];
    //this.getTotalApr();
    //this.getTotal();
    this.consultar();
  }

  eliminarCobro(registro: any) {
    //this.getTotalApr();
    this.laprobados.splice(this.laprobados.indexOf(registro), 1);
    this.lregistros.push(registro);
  }

  Detalle(registro: any) {
    this.obtnerdetallecobros(registro);
    this.mostrarDialogoGenericoDetalle = true;
  }

  obtnerdetallecobros(registro) {
    this.rqConsulta.CODIGOCONSULTA = "HISTORICOPAGO";
    this.rqConsulta.storeprocedure = "sp_TesConObtenerHistorialPagos";
    this.rqConsulta.parametro_ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.parametro_verreg = 0;
    this.rqConsulta.parametro_tipotransaccion = "C";
    this.msgs = [];

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.manejaRespuestaDetalle(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  private manejaRespuestaDetalle(resp: any) {
    this.ldetallecobros = [];
    if (resp.cod === "OK") {
      this.ldetallecobros = resp.HISTORICOPAGO;
      this.rqConsulta = { mdatos: {} };
    }
  }
}
