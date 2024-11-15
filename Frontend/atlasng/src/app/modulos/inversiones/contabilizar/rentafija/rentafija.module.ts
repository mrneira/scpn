import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RentafijaRoutingModule } from './rentafija.routing';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

import { RentafijaComponent } from './componentes/rentafija.component';
import { InstrumentoModule } from './submodulos/instrumento/instrumento.module';
import { TablamortizacionModule } from './submodulos/tablamortizacion/tablamortizacion.module';
import { RubrosModule } from './submodulos/rubros/rubros.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, RentafijaRoutingModule, LovInversionesModule, JasperModule,
    TablamortizacionModule,RubrosModule,
            InstrumentoModule ],
  declarations: [RentafijaComponent],
  exports: []
})
export class RentafijaModule { }
