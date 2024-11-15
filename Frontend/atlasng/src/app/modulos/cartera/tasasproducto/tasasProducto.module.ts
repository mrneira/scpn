import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TasasProductoRoutingModule } from './tasasProducto.routing';

import { TasasProductoComponent } from './componentes/tasasProducto.component';
import { LovProductoModule } from '../../generales/lov/producto/lov.producto.module';
import { LovTipoProductoModule } from '../../generales/lov/tipoproducto/lov.tipoProducto.module';
import { LovSaldoModule } from '../../monetario/lov/saldo/lov.saldo.module';

@NgModule({
  imports: [SharedModule, TasasProductoRoutingModule, LovProductoModule, LovTipoProductoModule, LovSaldoModule],
  declarations: [TasasProductoComponent]
})
export class TasasProductoModule { }
