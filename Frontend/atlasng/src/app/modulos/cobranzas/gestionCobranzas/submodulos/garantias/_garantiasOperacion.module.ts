import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { GarantiasOperacionRoutingModule } from './_garantiasOperacion.routing';

import { GarantiasOperacionComponent } from './componentes/_garantiasOperacion.component';
import { GarantiasPersonalesComponent } from './componentes/_garantiasPersonales.component';

@NgModule({
  imports: [SharedModule, GarantiasOperacionRoutingModule],
  declarations: [GarantiasOperacionComponent, GarantiasPersonalesComponent],
  exports: [GarantiasOperacionComponent, GarantiasPersonalesComponent]

})
export class GarantiasOperacionModule { }
