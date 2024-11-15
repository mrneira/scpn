import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DetallevencimientosrentafijaComponent } from './componentes/detallevencimientosrentafija.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { DetallevencimientosrentafijaRoutingModule } from './detallevencimientosrentafija.routing';

@NgModule({
  imports: [SharedModule, DetallevencimientosrentafijaRoutingModule, JasperModule, SpinnerModule ],
  declarations: [DetallevencimientosrentafijaComponent]
})
export class DetallevencimientosrentafijaModule { }
