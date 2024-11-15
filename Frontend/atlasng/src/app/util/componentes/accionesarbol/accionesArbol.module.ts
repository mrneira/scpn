import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AccionesArbolRoutingModule } from './accionesArbol.routing';

import { AccionesArbolComponent } from './componentes/accionesArbol.component';

@NgModule({
  imports: [SharedModule, AccionesArbolRoutingModule],
  declarations: [AccionesArbolComponent],
  exports: [AccionesArbolComponent],
})
export class AccionesArbolModule { }

