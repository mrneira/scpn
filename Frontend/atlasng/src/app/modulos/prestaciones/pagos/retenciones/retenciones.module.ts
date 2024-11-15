import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagosRetencionesRoutingModule } from './retenciones.routing';

import { LovPersonasModule } from './../../../personas/lov/personas/lov.personas.module';
import { PagoRetencionesComponent } from './componentes/retenciones.component';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, PagosRetencionesRoutingModule,LovPersonasModule,SplitButtonModule ],
  declarations: [PagoRetencionesComponent]
})
export class PagoRetencionesModule { }
