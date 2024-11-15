import { NgModule } from '@angular/core';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';
import { SharedModule } from './../../../util/shared/shared.module';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { ActivacionRoutingModule } from './activacion.routing';

import { ActivacionComponent } from './componentes/activacion.component';


@NgModule({
  imports: [SharedModule, ActivacionRoutingModule, JasperModule, LovPersonasModule],
  declarations: [ActivacionComponent]
})
export class ActivacionModule { }
