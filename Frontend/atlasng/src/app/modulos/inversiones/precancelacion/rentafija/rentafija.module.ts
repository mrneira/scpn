import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RentafijaRoutingModule } from './rentafija.routing';

import { RentafijaComponent } from './componentes/rentafija.component';

import { LovInversionesModule } from 'app/modulos/inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [SharedModule, RentafijaRoutingModule, LovInversionesModule ],
  declarations: [RentafijaComponent],
  exports: [RentafijaComponent]
})
export class RentafijaModule { }
