import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AccionCobranzasRoutingModule } from './accionCobranzas.routing';

import { AccionCobranzasComponent } from './componentes/accionCobranzas.component';
import {CheckboxModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AccionCobranzasRoutingModule,CheckboxModule],
  declarations: [AccionCobranzasComponent]
})
export class AccionCobranzasModule { }
