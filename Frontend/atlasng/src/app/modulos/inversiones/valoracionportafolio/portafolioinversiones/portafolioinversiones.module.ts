import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafolioinversionesComponent } from './componentes/portafolioinversiones.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { PortafolioinversionesRoutingModule } from './portafolioinversiones.routing';

@NgModule({
  imports: [SharedModule, PortafolioinversionesRoutingModule, JasperModule, SpinnerModule ],
  declarations: [PortafolioinversionesComponent]
})
export class PortafolioinversionesModule { }
