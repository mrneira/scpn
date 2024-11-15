import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SancionPonderacionRoutingModule } from './sancionPonderacion.routing';

import { SancionPonderacionComponent } from './componentes/sancionPonderacion.component';


@NgModule({
  imports: [SharedModule, SancionPonderacionRoutingModule ],
  declarations: [SancionPonderacionComponent]
})
export class SancionPonderacionModule { }
