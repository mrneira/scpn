import { NgModule } from '@angular/core';
import {SpinnerModule} from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrelacionProductoRoutingModule } from './prelacionProducto.routing';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { PrelacionProductoComponent } from './componentes/prelacionProducto.component';


@NgModule({
  imports: [SharedModule, PrelacionProductoRoutingModule,SpinnerModule,TipoProductoModule,ProductoModule,TipoProductoModule ],
  declarations: [PrelacionProductoComponent]
})
export class PrelacionProductoModule { }
