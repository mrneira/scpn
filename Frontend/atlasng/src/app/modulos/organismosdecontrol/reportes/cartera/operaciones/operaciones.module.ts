import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { OperacionesRoutingModule } from './operaciones.routing';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { OperacionesComponent } from './componentes/operaciones.component';

@NgModule({
  imports: [SharedModule, OperacionesRoutingModule, JasperModule ],
  declarations: [OperacionesComponent]
})
export class OperacionesModule { }
