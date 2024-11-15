import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SocioCesantiaRoutingModule } from './sociocesantia.routing';
import { LovSociosModule } from '../../lov/socios/lov.socios.module';
import { LovUbicacionesModule } from '../../lov/ubicaciones/lov.ubicaciones.module';

import { SocioCesantiaComponent } from './componentes/sociocesantia.component';


@NgModule({
  imports: [SharedModule, SocioCesantiaRoutingModule, LovSociosModule, LovUbicacionesModule],
  declarations: [SocioCesantiaComponent],
  exports: []
})
export class SocioCesantiaModule { }
