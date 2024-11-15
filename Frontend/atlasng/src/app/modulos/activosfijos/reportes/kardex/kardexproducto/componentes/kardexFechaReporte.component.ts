import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProductosComponent} from '../../../../lov/productos/componentes/lov.productos.component';
import { LovCuentasContablesComponent } from '../../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-reporte-kardex',
  templateUrl: 'kardexFechaReporte.html'
})
export class KardexFechaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProductosComponent)
  lovproductos: LovProductosComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TacfKardex', 'TACFKARDEX', false);
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

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
     
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  
  // Inicia CONSULTA *********************
  consultar() {
 
      if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
        this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
        return;
      }
      if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
        this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
        return;
      }
      this.consultarKardex();
  }
  
  consultarKardex() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_KARDEXPRODUCTO';
    this.rqConsulta.storeprocedure = "sp_AcfConKardexPorProducto";

    this.rqConsulta.parametro_cproducto = this.mfiltros.codigo === undefined ? "" : this.mfiltros.codigo;
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    this.msgs = [];
    
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaKardex(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaKardex(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_KARDEXPRODUCTO;
    }
  }

  public crearDtoConsulta() {
      this.fijarFiltrosConsulta();
      const consulta = new Consulta(this.entityBean, 'Y', 't.ckardex', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('Tacfproducto', 'codigo', 'nombre', 'i.cproducto = t.cproducto');
          
      this.addConsulta(consulta);
      return consulta;
  }
  private fijarFiltrosConsulta() {
    
  }
  descargarReporte(reg: any): void {

 
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
    if (this.registro.ccuenta === undefined || this.registro.ccuenta === null)
    {
      this.registro.ccuenta = '';
    }
    this.jasper.formatoexportar=reg;
    this.jasper.nombreArchivo = 'ReporteKardexPorProducto';
    // Agregar parametros
    if(this.mfiltros.codigo===undefined)
      this.mfiltros.codigo = "";
    
    this.jasper.parametros['@i_cproducto'] = this.mfiltros.codigo;
    this.jasper.parametros['@i_ctipo'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['@i_cuenta'] = this.registro.ccuenta;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;
        
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfKardexPorProducto';
    this.jasper.generaReporteCore();
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


  consultarCatalogos(): any {
    // this.msgs = [];
    // this.lconsulta = []; 
    this.encerarConsultaCatalogos();
    const conTipoProducto = new Consulta('tacftipoproducto', 'Y', 't.nombre',{}, this.mfiltrosesp);
    conTipoProducto.cantidad = 10;
    this.addConsultaCatalogos('TIPOPRODUCTO', conTipoProducto, this.ltipoproducto, this.llenaListaCatalogo, 'ctipoproducto', null);
    this.ejecutarConsultaCatalogos();

  
}

cbarrasBlur() {
  this.rqConsulta.CODIGOCONSULTA = null;
  if (this.mfiltros.codigo === '' || this.mfiltros.codigo === undefined) {
    this.mfiltros.codigo = undefined;
    return;
  }

  const consulta = new Consulta('tacfproducto', 'N', '',{codigo:this.mfiltros.codigo},{});
  consulta.addSubquery('tacfproducto','nombre','nproducto','t.cproducto=i.cproducto');
  this.addConsultaPorAlias('PRODUCTO', consulta);     

  this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    .subscribe(
    resp => {
      this.manejaRespuesta(resp);
    },
    error => {
      this.dtoServicios.manejoError(error);
    });
}
private manejaRespuesta(resp: any) {
  if (resp.PRODUCTO !== null && resp.PRODUCTO !== undefined ) {                  
    this.mcampos.nproducto = resp.PRODUCTO.mdatos.nproducto;
    this.registro.mdatos.nproducto = resp.PRODUCTO.mdatos.nproducto

    return;
  }
  else {
    this.mcampos.nproducto= undefined;
    this.mfiltros.cbarras=undefined;
    super.mostrarMensajeError('PRODUCTO NO EXISTE');
  }    
  this.rqConsulta.CODIGOCONSULTA = null;
}
    
}
