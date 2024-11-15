import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaCalificacionReporteRoutingModule } from './consultaCalificacion.routing';

import { ConsultaCalificacionReporteComponent } from './componentes/consultaCalificacion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { ProductosModule }  from "./../../productos/productoingreso/submodulos/productos/_productos.module";
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, ConsultaCalificacionReporteRoutingModule, LovPersonasModule,JasperModule, ProductosModule, ProductoModule, TipoProductoModule ],
  declarations: [ConsultaCalificacionReporteComponent]

})
export class ConsultaCalificacionReporteModule { }
