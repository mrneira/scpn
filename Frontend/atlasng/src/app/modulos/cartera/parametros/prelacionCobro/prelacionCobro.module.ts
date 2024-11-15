import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrelacionCobroRoutingModule } from './prelacionCobro.routing';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { PrelacionCobroComponent } from './componentes/prelacionCobro.component';
import { LovSaldoModule } from '../../../monetario/lov/saldo/lov.saldo.module';

@NgModule({
  imports: [SharedModule, PrelacionCobroRoutingModule, SpinnerModule, TipoProductoModule, ProductoModule, TipoProductoModule, LovSaldoModule],
  declarations: [PrelacionCobroComponent]
})
export class PrelacionCobroModule { }
