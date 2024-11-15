import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { DescuentosArchivoComponent } from './_descuentosArchivo.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cargar-descuentos',
  templateUrl: 'cargarDescuentos.html'
})

export class CargarDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(DescuentosArchivoComponent)
  archivoComponent: DescuentosArchivoComponent;

  public lparticion: SelectItem[] = [{ label: "...", value: null }];
  public ltipoarchivo: SelectItem[] = [{ label: "...", value: null }];
  public ltotales: any = [];
  public displayEvent: any;
  public mdatosarchivosngstr = {};

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcardescuentosdetalle', 'CARGADESCUENTOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.archivoComponent = new DescuentosArchivoComponent(this.router, this.dtoServicios);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  clickButton(model: any) {
    this.displayEvent = model;
  }

  eventClick(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        allDay: model.event.allDay
        // other params
      },
      duration: {}
    }
    this.displayEvent = model;
  }

  updateEvent(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title
        // other params
      },
      duration: {
        _data: model.duration._data
      }
    }
    this.displayEvent = model;
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
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    //this.validaRegistros();
    this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    this.archivoComponent.registro.cdetalleestado = 'RES';
    this.archivoComponent.registro.frespuesta = this.dtoServicios.mradicacion.fcontable;
    this.archivoComponent.registro.registrosrespuesta = this.mcampos.registrosrespuesta;
    this.archivoComponent.registro.montorespuesta = this.mcampos.montorespuesta;
    this.archivoComponent.registro.cusuariorespuesta = this.dtoServicios.mradicacion.cusuario;
    this.archivoComponent.selectRegistro(this.archivoComponent.registro);
    this.archivoComponent.actualizar();

    super.addMantenimientoPorAlias(this.alias, super.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.archivoComponent.alias, this.archivoComponent.getMantenimiento(2));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  selectFile(): boolean {
    if (this.estaVacio(this.mfiltros.particion)) {
      super.mostrarMensajeError('SELECCIONE LA FECHA DE GENERACIÓN DE ARCHIVOS');
      return false;
    }
    if (this.estaVacio(this.mcampos.cinstitucion)) {
      super.mostrarMensajeError('SELECCIONE LA INSTITUCIÓN');
      return false;
    }
    return true;
  }

  onSelectArchivo(event) {
    super.encerarMensajes();
    if (!this.selectFile()) {
      return;
    }

    const file = event.files[0];
    this.mcampos.narchivo = file.name;
    this.mcampos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.mcampos.tipo = file.type;
    this.mcampos.tamanio = file.size / 1000; // bytes/1000
    this.mcampos.cusuarioing = this.dtoServicios.mradicacion.cusuario;

    // Valida tipo de archivo
    if (this.mcampos.extension !== "xls" && this.mcampos.extension !== "xlsx") {
      this.mostrarMensajeError("SE REQUIERE ARCHIVO TIPO EXCEL");
      return;
    }

    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivo);
    fReader.readAsDataURL(file);
  }

  cancelarSubir() {
    this.lregistros = [];
    this.ltotales = [];
  }

  actualizaArchivo = (event) => {
    this.mcampos.archivo = event.srcElement.result.split('base64,')[1];
    this.obtnerdatos();
  }

  obtnerdatos() {
    this.rqConsulta.CODIGOCONSULTA = 'DESCUENTOSCARGA';
    this.rqConsulta.mdatos = this.mcampos;
    this.rqConsulta.mdatos.particion = this.mfiltros.particion;
    this.rqConsulta.mdatos.tipoarchivo = this.mcampos.cinstitucion.archivo;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          this.ltotales = [];
          if (resp.cod === 'OK') {
            this.postQuery(resp);

            // Totalizador de datos
            this.ltotales = resp.TOTALESCARGA;
            this.mcampos.montorespuesta = resp.TOTALESCARGA[0].monto;
            this.mcampos.registrosrespuesta = resp.TOTALESCARGA[0].registros;
          } else {
            super.mostrarMensajeError(resp.msgusu);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosPar: any = { 'pagoaplicado': false };
    const consultaPar = new Consulta('TcarDescuentos', 'Y', 't.particion', mfiltrosPar, {});
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

  cambiarFecha(): any {
    if (this.estaVacio(this.mfiltros.particion)) {
      return;
    }
    this.fijarArchivo();
  }

  fijarArchivo() {
    const mfiltrosCons = { 'particion': this.mfiltros.particion, 'cdetalleestado': 'GEN' };
    const consulta = new Consulta('TcarDescuentosArchivo', 'Y', 't.archivoinstituciondetalle', mfiltrosCons, {});
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'narchivo', 'i.ccatalogo = t.archivoinstitucioncodigo and i.cdetalle = t.archivoinstituciondetalle');
    this.addConsultaPorAlias('ARCHIVOSDESCUENTOS', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false, true);
          this.ltipoarchivo = [];
          if (resp.cod !== 'OK') {
            return;
          }
          this.ltipoarchivo.push({ label: '...', value: null });
          for (const i in resp.ARCHIVOSDESCUENTOS) {
            if (resp.ARCHIVOSDESCUENTOS.hasOwnProperty(i)) {
              const reg = resp.ARCHIVOSDESCUENTOS[i];
              this.ltipoarchivo.push({ label: reg.mdatos.narchivo, value: { archivo: reg.archivoinstituciondetalle, estado: reg.cdetalleestado } });
            }
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  cambiarDescuento(): any {
    if (this.estaVacio(this.mfiltros.particion) || this.estaVacio(this.mcampos.cinstitucion)) {
      return;
    }
    this.archivoComponent.mfiltros.particion = this.mfiltros.particion;
    this.archivoComponent.mfiltros.archivoinstituciondetalle = this.mcampos.cinstitucion.archivo;
    this.archivoComponent.consultar();
  }

  validaRegistros() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.actualizar = true;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }
    if (this.lregistros != null && this.lregistros.length > 0) {
      return true;
    }

  }
}
