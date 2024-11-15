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
  selector: 'app-reporte-kardexTotal',
  templateUrl: 'kardexTotal.html'
})
export class KardexTotalComponent extends BaseComponent implements OnInit, AfterViewInit {

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
    let fIngreso = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mcampos.fIngreso = fIngreso;
    this.mcampos.fFinIngreso = this.fechaactual;
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


  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteKardexTotal';
    if ((this.mcampos.fIngreso != null && this.mcampos.fFinIngreso == null) || (this.mcampos.fIngreso == null && this.mcampos.fFinIngreso != null) || (this.mcampos.fIngreso > this.mcampos.fFinIngreso)) {
    this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
  } else {
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
    
    // Agregar parametros
    this.jasper.parametros['@i_finicio'] = this.mcampos.fIngreso;
    this.jasper.parametros['@i_ffin'] = this.mcampos.fFinIngreso;
    this.jasper.parametros['@i_ctipoproducto'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_cproducto'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_cpronombre'] = this.mfiltros.nombre;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfKardexPorProductoTotal';
    this.jasper.generaReporteCore();
  }
  }


}
