import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilizacionModulosRoutingModule } from './contabilizacionModulos.routing';

import { ContabilizacionModulosComponent } from './componentes/contabilizacionModulos.component';

@NgModule({
  imports: [SharedModule, ContabilizacionModulosRoutingModule],
  declarations: [ContabilizacionModulosComponent]
})
export class ContabilizacionModulosModule { }
