import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-datos-generales',
  templateUrl: '_datosGenerales.html'
})
export class DatosGeneralesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formularioSolicitud') formularioSolicitud: NgForm;

  @Output() eventoSimulacion = new EventEmitter();

  public ivaporcentaje = 0;
  public lproductoseguro: any = [];
  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public ltiposegurototal: any = [];
  public ltiposegurodetalle: any = [];
  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductototal: any = [];
  public lrubros: any = [];
  public lrubrostotal: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'DATOSGENERALES', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
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
    // No existe para el padre
  }

  public selectRegistro(registro: any) {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    // No existe para el padre
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }
  // Fin MANTENIMIENTO *********************

  limpiar() {
    this.mcampos.ctipoproducto = null;
    this.mcampos.ctiposeguro = null;
    this.mcampos.valor = 0;
    this.mcampos.tasa = 0;
    this.mcampos.primaanual = 0;
    this.mcampos.primaprorrata = 0;
    this.ltipoproducto = [];
    this.ltipoproducto.push({ label: '...', value: null });
    this.ltiposeguro = [];
    this.ltiposeguro.push({ label: '...', value: null });
  }

  public llenarSeguroProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    let cproducto = null;

    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];

        if (reg !== undefined && reg.value !== null) {
          if (reg.cproducto !== Number(cproducto)) {
            cproducto = reg.cproducto;
            this.componentehijo.datosGeneralesComponent.lproducto.push({ label: reg.mdatos.nproducto, value: reg.cproducto });
          }

          this.componentehijo.datosGeneralesComponent.ltipoproductototal.push(reg);
          this.componentehijo.datosGeneralesComponent.ltiposegurototal.push(reg);
        }

      }

    }
  }

  public llenarTipoSeguroDetalle(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.datosGeneralesComponent.ltiposegurodetalle = pListaResp;
  }

  public llenarRubrosSeguro(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.datosGeneralesComponent.lrubrostotal = pListaResp;
  }

  public llenarPorcentajeIva(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.datosGeneralesComponent.ivaporcentaje = pListaResp.numero;
  }

  public cambiarProducto(event: any): any {
    if (this.estaVacio(this.mcampos.cproducto)) {
      this.limpiar();
      return;
    };
    this.fijarListaTipoProducto(Number(event.value));
  }

  fijarListaTipoProducto(cproducto: any) {
    super.limpiaLista(this.ltipoproducto);
    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.mdatos.ntipoproducto, value: reg.ctipoproducto });
        }
      }
    }

    if (this.ltipoproducto.length <= 0) {
      this.ltipoproducto.push({ label: '...', value: null });
    } else {
      this.mcampos.ctipoproducto = this.ltipoproducto[0].value;
      this.cambiarTipoProducto(this.ltipoproducto[0]);
    }
  }

  public cambiarTipoProducto(event: any): any {
    if (this.estaVacio(this.mcampos.ctipoproducto)) {
      return;
    };
    this.fijarListaTipoSeguro(Number(event.value));
  }

  fijarListaTipoSeguro(ctipoproducto: any) {
    super.limpiaLista(this.ltiposeguro);
    for (const i in this.ltiposegurototal) {
      if (this.ltiposegurototal.hasOwnProperty(i)) {
        const reg: any = this.ltiposegurototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(this.mcampos.cproducto) && reg.ctipoproducto === Number(ctipoproducto)) {
          this.ltiposeguro.push({ label: reg.mdatos.ntiposeguro, value: reg.ctiposeguro });
        }
      }
    }

    if (this.ltiposeguro.length <= 0) {
      this.ltiposeguro.push({ label: '...', value: null });
      this.mcampos.tasa = 0;
    } else {
      this.mcampos.ctiposeguro = this.ltiposeguro[0].value;
      this.cambiarTipoSeguro(this.ltiposeguro[0]);
    }
  }

  public cambiarTipoSeguro(event: any): any {
    if (this.estaVacio(this.mcampos.ctiposeguro)) {
      return;
    };
    this.fijarListaRubrosSeguro(Number(event.value));
  }

  fijarListaRubrosSeguro(ctiposeguro: any) {
    super.limpiaLista(this.lrubros);
    for (const i in this.lrubrostotal) {
      if (this.lrubrostotal.hasOwnProperty(i)) {
        const reg: any = this.lrubrostotal[i];
        if (reg !== undefined && reg.value !== null && reg.ctiposeguro === Number(this.mcampos.ctiposeguro)) {
          this.lrubros.push(reg);
        }
      }
    }

    if (this.lrubros.length <= 0) {
      this.lrubros = [];
    } else {
      this.mcampos.ctiposeguro = this.ltiposeguro[0].value;
    }

    this.calcularPrima();
  }

  calcularPrima() {
    let totalrubros = 0;

    // Calcula primas
    this.mcampos.tasa = this.ltiposegurodetalle.find(x => x.ctiposeguro === this.mcampos.ctiposeguro).tasa;
    this.mcampos.primaanual = (this.mcampos.tasa * this.mcampos.valor) / 100;
    this.mcampos.primaprorrata = this.mcampos.primaanual;

    // Calcula rubros
    for (const i in this.lrubros) {
      if (this.lrubros.hasOwnProperty(i)) {
        const reg: any = this.lrubros[i];
        if (reg !== undefined && reg.value !== null) {
          if (reg.esporcentaje) {
            reg.mdatos.valorrubro = (reg.porcentaje * this.mcampos.primaprorrata) / 100;
          }
          if (reg.esvalor) {
            reg.mdatos.valorrubro = (reg.valor * this.mcampos.primaprorrata);
          }
          totalrubros = totalrubros + reg.mdatos.valorrubro;
        }
      }
    }

    // Calcula emision
    if (this.mcampos.primaprorrata <= 0) {
      this.mcampos.emision = 0;
    } else if (this.mcampos.primaprorrata <= 250) {
      this.mcampos.emision = 0.5;
    } else if (this.mcampos.primaprorrata <= 500) {
      this.mcampos.emision = 1;
    } else if (this.mcampos.primaprorrata <= 1000) {
      this.mcampos.emision = 3;
    } else if (this.mcampos.primaprorrata <= 2000) {
      this.mcampos.emision = 5;
    } else if (this.mcampos.primaprorrata <= 4000) {
      this.mcampos.emision = 7;
    } else if (this.mcampos.primaprorrata > 4000) {
      this.mcampos.emision = 9;
    }

    // Calcula subtotal
    this.mcampos.subtotal = this.mcampos.primaprorrata + totalrubros + this.mcampos.emision;

    // Calcula IVA
    this.mcampos.iva = this.mcampos.subtotal * (this.ivaporcentaje / 100);

    // Calcula TOTAL
    this.mcampos.total = this.mcampos.subtotal + this.mcampos.iva;
  }


  recargarSimulacion() {
    this.eventoSimulacion.emit();
  }
}
