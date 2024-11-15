import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldosSegurosRoutingModule } from './saldosSeguros.routing';

import { SaldosSegurosComponent } from './componentes/saldosSeguros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, SaldosSegurosRoutingModule, JasperModule, ProductoModule, TipoProductoModule],
  declarations: [SaldosSegurosComponent]

})
export class SaldosSegurosModule { }
