import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresoRoutingModule } from './ingreso.routing';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { IngresoComponent } from './componentes/ingreso.component';


@NgModule({
  imports: [SharedModule, IngresoRoutingModule,JasperModule ],
  declarations: [IngresoComponent]
})
export class IngresoModule { }
