import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AportesRoutingModule } from './aportes.routing';
import { AportesComponent } from './componentes/aportes.component';

@NgModule({
  imports: [SharedModule, AportesRoutingModule],
  declarations: [AportesComponent],
  exports: [AportesComponent]
}) 
export class AportesModule { }  