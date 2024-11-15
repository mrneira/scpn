import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientodocumentoRoutingModule } from './mantenimientodocumento.routing';

import {MantenimientodocumentoComponent } from './componentes/mantenimientodocumento.component';


@NgModule({
  imports: [SharedModule, MantenimientodocumentoRoutingModule ],
  declarations: [MantenimientodocumentoComponent]
})
export class MantenimientodocumentoModule { }
