import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { LimpiarCacheRoutingModule } from './limpiarCache.routing';

import { LimpiarCacheComponent } from './componentes/limpiarCache.component';


@NgModule({
  imports: [SharedModule, LimpiarCacheRoutingModule ],
  declarations: [LimpiarCacheComponent]
})
export class LimpiarCacheModule { }
