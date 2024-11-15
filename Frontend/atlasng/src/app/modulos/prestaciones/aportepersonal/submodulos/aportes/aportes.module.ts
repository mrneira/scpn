import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AportesRoutingModule } from './aportes.routing';
import { AportesComponent } from './componentes/aportes.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, AportesRoutingModule, JasperModule],
  declarations: [AportesComponent],
  exports: [AportesComponent]
}) 
export class AportesModule { }  