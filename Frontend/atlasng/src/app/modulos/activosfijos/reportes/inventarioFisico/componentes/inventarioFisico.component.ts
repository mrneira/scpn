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

@Component({
  selector: 'app-reporte-inventarioFisico',
  templateUrl: 'inventarioFisico.html'
})
export class InventarioFisicoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;
 
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacftipoproducto', 'TACFTIPOPRODUCTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    
    const conTipoProducto = new Consulta('tacftipoproducto', 'Y', 't.nombre',{}, this.mfiltrosesp);
    conTipoProducto.cantidad = 10;
    this.addConsultaCatalogos('TIPOPRODUCTO', conTipoProducto, this.ltipoproducto, this.llenaListaCatalogo, 'ctipoproducto', null);
    this.ejecutarConsultaCatalogos();
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

    this.jasper.nombreArchivo = 'ReporteInventarioFisico';

    if(this.mfiltros.ctipoproducto === undefined ||this.mfiltros.ctipoproducto === null) 
    {
      this.mfiltros.ctipoproducto = -1;
    }
    if(this.mfiltros.codigo === undefined ||this.mfiltros.codigo === null) 
    {
      this.mfiltros.codigo ='';
    }
    if(this.mfiltros.nombre === undefined ||this.mfiltros.nombre === null) 
    {
      this.mfiltros.nombre = '';
    }
    if(this.mfiltros.stock === undefined ||this.mfiltros.stock === false) 
    {
      this.mfiltros.stock = -1;
    }else{
      this.mfiltros.stock = 1;
    }
    
    // Agregar parametros
    this.jasper.parametros['@i_tipo'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_codigo'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_nombre'] = this.mfiltros.nombre;
    this.jasper.parametros['@i_stock']= this.mfiltros.stock;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfInventarioFisico';
    this.jasper.generaReporteCore();
  }


}
