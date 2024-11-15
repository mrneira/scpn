import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LibromayorNCuentasRoutingModule } from './libromayorNCuentas.routing';

import { LibromayorNCuentasComponent } from './componentes/libromayorNCuentas.component';
import {MultiSelectModule} from 'primeng/primeng';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, LibromayorNCuentasRoutingModule, MultiSelectModule, JasperModule  ],
  declarations: [LibromayorNCuentasComponent]
})
export class LibromayorNCuentasModule { }
