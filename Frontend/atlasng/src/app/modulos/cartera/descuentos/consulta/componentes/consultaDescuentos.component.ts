import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-consulta-descuentos',
  templateUrl: 'consultaDescuentos.html'
})

export class ConsultaDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild('vistadescuentos')
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  public lparticion: SelectItem[] = [{ label: "...", value: null }];
  public lrubros: any = [];
  public codigogarante = 0;
  public total = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcardescuentosdetalle', 'CONSULTADESCUENTOS', false, false);
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
    if (this.estaVacio(this.mcampos.particiondesde) || this.estaVacio(this.mcampos.particionhasta)) {
      super.mostrarMensajeError("FECHAS DE GENERACIÓN ES REQUERIDO");
      return;
    }

    if (this.estaVacio(this.mcampos.coperacion)) {
      super.mostrarMensajeError("NÚMERO DE OPERACIÓN ES REQUERIDO");
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.particion, t.archivoinstituciondetalle, t.crelacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperPersonaDetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('TperPersonaDetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('TcarRelacionPersona', 'nombre', 'nrelacion', 'i.crelacion = t.crelacion');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'narchivo', 'i.ccatalogo = t.archivoinstitucioncodigo and i.cdetalle = t.archivoinstituciondetalle');
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.coperacion = this.mcampos.coperacion;
    this.mfiltrosesp.particion = 'between ' + this.mcampos.particiondesde + ' and ' + this.mcampos.particionhasta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }


  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaPar = new Consulta('TcarDescuentos', 'Y', 't.particion', {}, {});
    consultaPar.cantidad = 500;
    this.addConsultaCatalogos("TIPOPRODUCTO", consultaPar, null, this.llenarParticion, null, this.componentehijo);

    const mfiltosGarante = { 'codigo': 'CODIGO-GARANTE' };
    const consultaGarante = new Consulta('TcarParametros', 'N', 't.codigo', mfiltosGarante, {});
    consultaGarante.cantidad = 100;
    this.addConsultaCatalogos("CODIGOGARANTE", consultaGarante, null, this.llenarParametro, null, this.componentehijo);

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

  public llenarParametro(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.codigogarante = pListaResp.numero;
  }

  public fijarParticion(particion: any) {
    const anio = particion.toString().substring(0, 4);
    const inimes = particion.toString().substring(4, 5);
    let mes = '';
    if (inimes === "0") {
      mes = this.componentehijo.lmeses.find(x => x.value === particion.toString().substring(5, 6)).label;
    } else {
      mes = this.componentehijo.lmeses.find(x => x.value === particion.toString().substring(4, 6)).label;
    }
    return anio + ' - ' + mes;
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\')';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovOperacion();
      this.lovOperacion.consultar();
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultar();
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(reg: any): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = reg.cpersona;
    this.lovPersonaVista.mcampos.identificacion = reg.mdatos.identificacion;
    this.lovPersonaVista.mcampos.nombre = reg.mdatos.npersona;
    this.lovPersonaVista.consultar();
  }

  mostrarDialogoRubros(registro: any) {
    this.mcampos.total = registro.monto;
    this.consultarDescuentosRubros(registro.particion, registro.coperacion, registro.crelacion);
    this.mostrarDialogoGenerico = true;
  }

  public consultarDescuentosRubros(particion: string, coperacion: string, tipopersona: number) {
    // Filtros
    const mfiltrosRubros: any = {};
    mfiltrosRubros.particion = particion;
    mfiltrosRubros.coperacion = coperacion;
    if (tipopersona === this.codigogarante) {
      mfiltrosRubros.vencido = true;
    }
    this.lrubros = [];
    const consultaRubros = new Consulta('TcarDescuentosRubros', 'Y', 'numcuota, csaldo', mfiltrosRubros, {});
    consultaRubros.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.csaldo = t.csaldo');
    consultaRubros.addSubquery('TcarOperacionCuota', 'fvencimiento', 'fvencimiento', 'i.coperacion = t.coperacion and i.numcuota = t.numcuota');
    consultaRubros.cantidad = 100;
    this.addConsultaPorAlias('DESCUENTOSRUBROS', consultaRubros);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C')).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.lrubros = resp.DESCUENTOSRUBROS;
          this.total = 0;
          for (const k in this.lrubros) {
            if (this.lrubros.hasOwnProperty(k)) {
              const item = this.lrubros[k];
              this.total += item.monto;
            }
          }
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  cerrarDialogoRubros() {
    this.mostrarDialogoGenerico = false;
  }

}
