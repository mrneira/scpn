import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InversionesXestadoRoutingModule } from './inversionesXestado.routing';
import { InversionesXestadoComponent } from './componentes/inversionesXestado.component';
import {MultiSelectModule} from 'primeng/primeng';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, InversionesXestadoRoutingModule, JasperModule, ProductoModule, TipoProductoModule, MultiSelectModule],
  declarations: [InversionesXestadoComponent]

})
export class InversionesXestadoModule { }
