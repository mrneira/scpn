
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { SocioCesantiaRoutingModule } from './sociocesantia.routing';
import { LovUbicacionesModule } from '../../../../socios/lov/ubicaciones/lov.ubicaciones.module';

import { SocioCesantiaComponent } from './componentes/sociocesantia.component';


@NgModule({
  imports: [SharedModule, SocioCesantiaRoutingModule, LovUbicacionesModule],
  declarations: [SocioCesantiaComponent],
  exports: [SocioCesantiaComponent]
})
export class SocioCesantiaModule { }
