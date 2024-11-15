import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProductosComponent} from '../../../lov/productos/componentes/lov.productos.component';

import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-reporte-inventarioportipo',
  templateUrl: 'inventarioPorTipo.html'
})
export class InventarioPorTipoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;
 
  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacftipoproducto', 'TACFTIPOPRODUCTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mfiltros.finicio =  finicio;
    this.mfiltros.ffin = this.fechaactual;   
    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const conTipoProducto = new Consulta('tacftipoproducto', 'Y', 't.nombre', {}, {});
    conTipoProducto.cantidad = 10;
    this.addConsultaCatalogos('TIPOPRODUCTO', conTipoProducto, this.ltipoproducto, this.llenaListaCatalogo, 'ctipoproducto', null);
    this.ejecutarConsultaCatalogos();
  }


  consultar(): any {
   
    }

    mostrarlovcuentasContables(): void {
      this.lovcuentasContables.mfiltros.activa = true;
      this.lovcuentasContables.showDialog(true);
    }
    
    /**Retorno de lov de cuentas contables. */
    fijarLovCuentasContablesSelec(reg: any): void {
      if (reg.registro !== undefined) {
        this.registro.mdatos.tipoplancdetalle = reg.registro.tipoplancdetalle;
        this.registro.mdatos.ncuenta = reg.registro.nombre;
        this.registro.ccuenta = reg.registro.ccuenta;
        this.registro.cmoneda = reg.registro.cmoneda;
      }
    }

    mostrarlovproductos(): void {
      this.lovproductos.mfiltros.movimiento = true;
      
      this.lovproductos.showDialog();
    }
  
    /**Retorno de lov de productos. */
  fijarLovProductosSelec(reg: any): void {
    if (reg.registro !== undefined) {
   
      this.registro.mdatos.nproducto = reg.registro.nombre;
      this.mfiltros.cproducto = reg.registro.cproducto;
      this.mfiltros.codigo = reg.registro.codigo;
      
    }
  }

  descargarReporte(): void {

    this.jasper.nombreArchivo = 'ReporteExistencias';
    
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }

    if(this.mfiltros.ctipoproducto === undefined ||this.mfiltros.ctipoproducto === null) 
    {
      this.mfiltros.ctipoproducto = -1;
    }   
    if(this.mfiltros.codigo === undefined ||this.mfiltros.codigo === null) 
    {
      this.mfiltros.codigo ='';
    }
   
    if (this.registro.ccuenta === undefined || this.registro.ccuenta === null)
    {
      this.registro.ccuenta = '';
    }
    if(this.mfiltros.stock === undefined ||this.mfiltros.stock === false) 
    {
      this.mfiltros.stock = -1;
    }else{
      this.mfiltros.stock = 1;
    }
    if(this.mfiltros.mes == undefined || this.mfiltros.mes == ''){
      // Agregar parametros
    delete this.jasper.parametros['@i_mes']; // CCA cambios
    delete this.jasper.parametros['@i_anio']; // CCA cambios
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['@i_ctipoproducto'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_cproducto'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_cpronombre'] = "";
    //this.jasper.parametros['@i_cuenta'] = this.registro.ccuenta;
    //this.jasper.parametros['@i_stock'] = this.mfiltros.stock;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfExistencias';
    }else{
      delete this.jasper.parametros['@i_finicio']; // CCA cambios
      delete this.jasper.parametros['@i_ffin']; // CCA cambios
      delete this.jasper.parametros['@i_ctipoproducto']; // CCA cambios 
      delete this.jasper.parametros['@i_cproducto']; // CCA cambios
      delete this.jasper.parametros['@i_cpronombre']; // CCA cambios
      
      this.jasper.parametros['@i_mes'] = this.mfiltros.mes;
      this.jasper.parametros['@i_anio'] = this.mfiltros.anioreporte;
      this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptSuministros';
    }
    
    this.jasper.generaReporteCore();
  }


}
