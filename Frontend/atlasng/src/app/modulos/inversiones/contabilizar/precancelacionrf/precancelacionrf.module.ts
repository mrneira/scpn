import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrecancelacionrfRoutingModule } from './precancelacionrf.routing';
import { PrecancelacionrfComponent } from './componentes/precancelacionrf.component';

@NgModule({
  imports: [
    SharedModule, 
    PrecancelacionrfRoutingModule
   ],
  declarations: [PrecancelacionrfComponent],
  exports: [PrecancelacionrfComponent]
})
export class PrecancelacionrfModule { }
