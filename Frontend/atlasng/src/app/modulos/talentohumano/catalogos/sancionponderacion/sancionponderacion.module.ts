import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {SancionRoutingModule  } from './sancionponderacion.routing';

import { SancionponderacionComponent } from './componentes/sancionponderacion.component';


@NgModule({
  imports: [SharedModule, SancionRoutingModule ],
  declarations: [SancionponderacionComponent]
})
export class SancionPonderacionModule { }
