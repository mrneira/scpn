import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCertificacionRoutingModule } from './lov.certificacion.routing';

import { LovCertificacionComponent } from './componentes/lov.certificacion.component';


@NgModule({
  imports: [SharedModule, LovCertificacionRoutingModule],
  declarations: [LovCertificacionComponent],
  exports: [LovCertificacionComponent]
})
export class LovCertificacionModule { }

