import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagosSegurosRoutingModule } from './pagosSeguros.routing';

import { PagosSegurosComponent } from './componentes/pagosSeguros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, PagosSegurosRoutingModule, JasperModule, ProductoModule, TipoProductoModule],
  declarations: [PagosSegurosComponent]

})
export class PagosSegurosModule { }
