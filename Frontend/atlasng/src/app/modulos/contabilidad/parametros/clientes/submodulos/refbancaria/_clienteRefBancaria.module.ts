import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ClienteRefBancariaRoutingModule } from './_clienteRefBancaria.routing';
import { ClienteRefBancariaComponent } from './componentes/_clienteRefBancaria.component';

@NgModule({
  imports: [SharedModule, ClienteRefBancariaRoutingModule ],
  declarations: [ClienteRefBancariaComponent],
  exports: [ClienteRefBancariaComponent]
})
export class ClienteRefBancariaModule { }
