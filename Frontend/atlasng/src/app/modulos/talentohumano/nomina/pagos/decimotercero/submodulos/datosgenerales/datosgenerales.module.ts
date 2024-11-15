import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { DatosgeneralesRoutingModule } from './datosgenerales.routing';

import { DatosgeneralesComponent } from './componentes/datosgenerales.component';



import{ParametroAnualModule} from '../../../../../lov/parametroanual/lov.parametroanual.module';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, DatosgeneralesRoutingModule, ParametroAnualModule,SplitButtonModule],
  declarations: [DatosgeneralesComponent],
  exports: [DatosgeneralesComponent]
})
export class DatosgeneralesModule { }
