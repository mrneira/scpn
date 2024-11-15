import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { VinculacionesFamiliaresRoutingModule } from './vinculacionesFamiliares.routing';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { VinculacionesFamiliaresComponent } from './componentes/vinculacionesFamiliares.component';

import { SelectButtonModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, VinculacionesFamiliaresRoutingModule, LovPersonasModule, SelectButtonModule ],
  declarations: [VinculacionesFamiliaresComponent]
})
export class VinculacionesFamiliaresModule { }
