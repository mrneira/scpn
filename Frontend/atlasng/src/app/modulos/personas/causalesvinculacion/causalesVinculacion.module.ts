import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CausalesVinculacionRoutingModule } from './causalesVinculacion.routing';

import { CausalesVinculacionComponent } from './componentes/causalesVinculacion.component';


@NgModule({
  imports: [SharedModule, CausalesVinculacionRoutingModule ],
  declarations: [CausalesVinculacionComponent]
})
export class CausalesVinculacionModule { }
