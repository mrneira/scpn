import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RendimientorentavariableRoutingModule } from './rendimientorentavariable.routing';
import { RendimientorentavariableComponent } from './componentes/rendimientorentavariable.component';
import {MultiSelectModule} from 'primeng/primeng';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, RendimientorentavariableRoutingModule, JasperModule, ProductoModule, TipoProductoModule, MultiSelectModule],
  declarations: [RendimientorentavariableComponent]

})
export class RendimientorentaVariableModule { }
