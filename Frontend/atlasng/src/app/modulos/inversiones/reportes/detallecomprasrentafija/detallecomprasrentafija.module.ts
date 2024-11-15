import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DetallecomprasrentafijaComponent } from './componentes/detallecomprasrentafija.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { DetallecomprasrentafijaRoutingModule } from './detallecomprasrentafija.routing';

@NgModule({
  imports: [SharedModule, DetallecomprasrentafijaRoutingModule, JasperModule, SpinnerModule ],
  declarations: [DetallecomprasrentafijaComponent]
})
export class DetallecomprasrentafijaModule { }
