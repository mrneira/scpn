import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonprestacionesRoutingModule } from './buzonprestaciones.routing';

import { BuzonprestacionesComponent } from './componentes/buzonprestaciones.component';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
@NgModule({
  imports: [SharedModule, BuzonprestacionesRoutingModule,SplitButtonModule ],
  declarations: [BuzonprestacionesComponent]
})
export class BuzonprestacionesModule { }
