import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrecioscierreRoutingModule } from './precioscierre.routing';
import { PrecioscierreComponent } from './componentes/precioscierre.component';
import {MultiSelectModule} from 'primeng/primeng';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, PrecioscierreRoutingModule, JasperModule, ProductoModule, TipoProductoModule, MultiSelectModule],
  declarations: [PrecioscierreComponent]

})
export class PrecioscierreModule { }
