import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagosrvRoutingModule } from './pagosrv.routing';

import { PagosrvComponent } from './componentes/pagosrv.component';

import { LovInversionesrvModule } from 'app/modulos/inversiones/lov/inversionesrv/lov.inversionesrv.module';

@NgModule({
  imports: [SharedModule, PagosrvRoutingModule, LovInversionesrvModule ],
  declarations: [PagosrvComponent],
  exports: [PagosrvComponent]
})
export class PagosrvModule { }
