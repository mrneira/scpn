import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CuentapatrimonioRoutingModule } from './cuentapatrimonio.routing';

import { CuentapatrimonioComponent } from './componentes/cuentapatrimonio.component';


@NgModule({
  imports: [SharedModule, CuentapatrimonioRoutingModule ],
  declarations: [CuentapatrimonioComponent]
})
export class CuentapatrimonioModule { }
