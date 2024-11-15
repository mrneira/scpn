import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RendimientorentaFijaRoutingModule } from './rendimientorentafija.routing';
import { RendimientorentaFijaComponent } from './componentes/rendimientorentafija.component';
import {MultiSelectModule} from 'primeng/primeng';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, RendimientorentaFijaRoutingModule, JasperModule, ProductoModule, TipoProductoModule, MultiSelectModule],
  declarations: [RendimientorentaFijaComponent]

})
export class RendimientorentaFijaModule { }
