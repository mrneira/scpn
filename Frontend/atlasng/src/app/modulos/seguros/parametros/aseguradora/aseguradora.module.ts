import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AseguradoraRoutingModule } from './aseguradora.routing';

import { AseguradoraComponent } from './componentes/aseguradora.component';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';
@NgModule({
  imports: [SharedModule, AseguradoraRoutingModule,GestorDocumentalModule],
  declarations: [AseguradoraComponent]
})
export class AseguradoraModule { }
