import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProductoIngresoRoutingModule } from './productoIngreso.routing';

import { ProductoIngresoComponent } from './componentes/productoIngreso.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { ProductosModule } from './submodulos/productos/_productos.module';
import { RequisitosModule } from './submodulos/requisitos/_requisitos.module';

import { BaseCalculoModule } from '../../../generales/basecalculo/baseCalculo.module';
import { FrecuenciasModule } from '../../../generales/frecuencias/frecuencias.module';
import { TipoCreditoModule } from '../../../generales/tipocredito/tipoCredito.module';
import { SegmentosModule } from '../../parametros/segmentos/segmentos.module';
import { DocumentoModule } from './submodulos/documento/_documento.module';
import { ProductosPermitidosModule } from './submodulos/productospermitidos/_productospermitidos.module';

@NgModule({
  imports: [SharedModule, ProductoIngresoRoutingModule, BaseCalculoModule, FrecuenciasModule,
    ProductosModule, ProductoModule, TipoProductoModule, TipoCreditoModule, SegmentosModule,
    RequisitosModule, DocumentoModule, ProductosPermitidosModule],
  declarations: [ProductoIngresoComponent]
})
export class ProductoIngresoModule { }
