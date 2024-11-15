import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CuentasporcobrarRoutingModule } from './cuentasporcobrar.routing';

import { CuentasporcobrarComponent } from './componentes/cuentasporcobrar.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';


@NgModule({
  imports: [SharedModule, CuentasporcobrarRoutingModule, JasperModule, LovClientesModule ],
  declarations: [CuentasporcobrarComponent]
})
export class CuentasporcobrarModule { }
