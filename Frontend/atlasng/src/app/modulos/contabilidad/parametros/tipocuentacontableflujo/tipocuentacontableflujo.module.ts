import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoCuentaContableFlujoRoutingModule } from './tipocuentacontableflujo.routing';

import { TipoCuentaContableFlujoComponent } from './componentes/tipocuentacontableflujo.component';


@NgModule({
  imports: [SharedModule,TipoCuentaContableFlujoRoutingModule ],
  declarations: [TipoCuentaContableFlujoComponent]
})
export class TipoCuentaContableFlujoModule { }
