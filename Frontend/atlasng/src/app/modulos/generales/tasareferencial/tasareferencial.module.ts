import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TasaReferencialRoutingModule } from './tasareferencial.routing';

import { TasaReferencialComponent } from './componentes/tasareferencial.component';


@NgModule({
  imports: [SharedModule, TasaReferencialRoutingModule ],
  declarations: [TasaReferencialComponent]
})
export class TasaReferencialModule { }
