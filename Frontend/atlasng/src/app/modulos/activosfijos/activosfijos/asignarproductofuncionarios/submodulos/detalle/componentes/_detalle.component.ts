import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { registerModuleFactory } from '@angular/core/src/linker/ng_module_factory_loader';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;
  public cbarras = '';
  public indice: number;
  public lcusuariorecibe: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfegresodetalle', 'DETALLE', false);
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto ');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto ');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    let j = 0;
    let k = 0;
    let lista = resp.DETALLE;
    let listaResp = [];
    resp.DETALLE = undefined;
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg = lista[i];
        for (j = 0; j < reg.cantidad; j++) {
          listaResp.push({
            actualizar: false,
            cantidad: 0,
            cegreso: reg.cegreso,
            cproducto: reg.cproducto,
            esnuevo: false,
            idreg: k,
            mdatos: {
              codigo: reg.mdatos.codigo,
              nproducto: reg.mdatos.nproducto,
              cbarras:'',
              estado: ''
            },
            optlock: reg.optlock,
            secuencia: reg.secuencia
          });
          k++;
        }

      }
    }

    resp.DETALLE = listaResp;

    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  cambiarColor(rowData, rowIndex): string {
    return rowData + '{ background-color: red; }';
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }


  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  consultarCatalogos(): void {
  }

  codigoFocus(reg: any, index: number) {
    this.indice = index;
    this.cbarras = reg.mdatos.cbarras;
  }

  codigoBlur(reg: any, index: number) {

    if (reg.mdatos.cbarras === '') {
      return;
    }

    if (reg.mdatos.cbarras === this.cbarras) {
      return; 
    }

    if (!this.validaCbarrasDuplicado(reg, index)){
      super.mostrarMensajeError("CODIGO DE BARRAS YA INGRESADO");
      this.lregistros[index].mdatos.cbarras = undefined;
      return;
    }


    const consulta = new Consulta('tacfproductocodificado', 'N', '', { 'cproducto': reg.cproducto, 'cbarras': reg.mdatos.cbarras, 'estado': reg.mdatos.estado}, {});
    this.addConsultaPorAlias('AF_VALIDACBARRAS', consulta);


    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp, index);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any, index: number) {
    if (resp.AF_VALIDACBARRAS !== null && resp.AF_VALIDACBARRAS !== undefined ) {  
      if(resp.AF_VALIDACBARRAS.estado !== 1 ){     
        super.mostrarMensajeError('PRODUCTO YA SE ENCUENTRA ASIGNADO O DADO DE BAJA');
        this.lregistros[index].mdatos.cbarras = undefined;
        this.lregistros[index].mdatos.serial = undefined;
        return;
      }                  
        this.lregistros[index].mdatos.serial = resp.AF_VALIDACBARRAS.serial;
    }
    else {
      this.lregistros[index].mdatos.cbarras = undefined;
      super.mostrarMensajeError('PRODUCTO NO EXISTE');
    }    
  }

  validaCbarrasDuplicado(reg: any, index: number): boolean {
      const regduplicado = this.lregistros.find(x => x.mdatos.cbarras === reg.mdatos.cbarras && x.idreg !== reg.idreg);
      if (regduplicado !== undefined ) {       
        return false;
      }
      return true;
    }

  
}
