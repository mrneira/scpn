import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-pago-descuentos',
  templateUrl: 'pagoDescuentos.html'
})

export class PagoDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lparticion: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarDescuentosArchivo', 'PAGODESCUENTOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
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

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.archivoinstituciondetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'narchivo', 'i.ccatalogo = t.archivoinstitucioncodigo and i.cdetalle = t.archivoinstituciondetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nestado', 'i.ccatalogo = t.ccatalogoestado and i.cdetalle = t.cdetalleestado');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.particion)) {
      super.mostrarMensajeError("FECHA ES REQUERIDO")
      return false;
    }
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
    super.encerarMensajes();

    // Valida estado de archivos
    if (!this.validarArchivos()) {
      super.mostrarMensajeError("SE REQUIERE REALIZAR LA CARGA DE RESPUESTA DE TODOS LOS ARCHIVOS");
      return;
    }

    this.rqMantenimiento.particion = this.mfiltros.particion;
    //this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  validarArchivos(): boolean {
    let validaestado = true;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.cdetalleestado !== 'RES') {
          validaestado = false;
          break;
        }
      }
    }
    return validaestado;
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const filtrosPar = { 'pagoaplicado': false }
    const consultaPar = new Consulta('TcarDescuentos', 'Y', 't.particion', filtrosPar, {});
    consultaPar.cantidad = 500;
    this.addConsultaCatalogos("TIPOPRODUCTO", consultaPar, null, this.llenarParticion, null, this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarParticion(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];
        const anio = reg.particion.toString().substring(0, 4);
        const inimes = reg.particion.toString().substring(4, 5);
        let mes = '';
        if (inimes === "0") {
          mes = this.componentehijo.lmeses.find(x => x.value === reg.particion.toString().substring(5, 6)).label;
        } else {
          mes = this.componentehijo.lmeses.find(x => x.value === reg.particion.toString().substring(4, 6)).label;
        }
        const nombre: string = anio + ' - ' + mes;
        componentehijo.lparticion.push({ label: nombre, value: reg.particion });
      }
    }
  }

}
