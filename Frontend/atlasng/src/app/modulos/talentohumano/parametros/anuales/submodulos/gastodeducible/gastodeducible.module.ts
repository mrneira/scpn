import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { GastodeducibleRoutingModule } from './gastodeducible.routing';

import { GastodeducibleComponent } from './componentes/gastodeducible.component';


@NgModule({
  imports: [SharedModule, GastodeducibleRoutingModule ],
  declarations: [GastodeducibleComponent],
  exports: [GastodeducibleComponent]
})
export class GastoDeducibleModule { }
