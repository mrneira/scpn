import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AnticipoRoutingModule } from './anticipo.routing';

import { AnticipoComponent } from './componentes/anticipo.component';

@NgModule({
  imports: [SharedModule, AnticipoRoutingModule ],
  declarations: [AnticipoComponent],
  exports: [AnticipoComponent]
})
export class AnticipoModule { }
