import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ContactosRoutingModule } from './_contactos.routing';

import { ContactosComponent } from './componentes/_contactos.component';

@NgModule({
  imports: [SharedModule, ContactosRoutingModule],
  declarations: [ContactosComponent],
  exports: [ContactosComponent]
})
export class ContactosModule { }
