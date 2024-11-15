import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from "primeng/primeng";

@Component({
  selector: "app-consulta-transferencia",
  templateUrl: "consultaTransferencia.html"
})
export class ConsultaTransferenciaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltransferencias: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TcarTransferenciaPersona", "CONSULTATRANSFERENCIA", false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() { }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, "Y", "t.ctransferencia", this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ctransferencia = this.mcampos.ctransferencia;
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.ctransferencia)) {
      super.mostrarMensajeError("FECHA ES REQUERIDO");
      return false;
    }
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaTran = new Consulta("TcarTransferencia", "Y", "t.ctransferencia", {}, {});
    consultaTran.cantidad = 500;
    this.addConsultaCatalogos("TRANSFERENCIAS", consultaTran, null, this.llenarLista, null, this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarLista(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];

        componentehijo.ltransferencias.push({ label: componentehijo.integerToFormatoFecha(reg.ftransferencia), value: { registry: reg } });
      }
    }
  }

  selectLista(evento: any) {
    this.mcampos = evento.value.registry;
    this.consultar();
  }

  public imprimir(): void {
    this.jasper.nombreArchivo = 'ISSPOL_' + this.mcampos.ftransferencia;

    // Agregar parametros
    this.jasper.parametros['@i_fcontable'] = this.mcampos.ftransferencia;
    this.jasper.parametros['@i_ctransferencia'] = this.mcampos.ctransferencia;
    this.jasper.parametros['@i_ccomprobantedevolucion'] = this.mcampos.ccomprobantedevolucion;
    this.jasper.parametros['@i_referencia'] = this.mcampos.referencia;
    this.jasper.parametros['@i_montotransferencia'] = this.mcampos.monto;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaTransferenciasISSPOL';
    this.jasper.formatoexportar = 'xls';
    this.jasper.generaReporteCore();
  }

}
